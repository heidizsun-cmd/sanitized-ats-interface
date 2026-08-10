from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from http import cookies
import html
import json
import os
import re
import secrets
import shutil
import socket
import subprocess
import tempfile
from urllib.parse import parse_qs, urlparse
import zipfile
import zlib


ROOT = Path(__file__).parent
HOST = "127.0.0.1"
DEFAULT_PORT = 4174
SESSION_COOKIE = "signal_ats_demo_session"
SESSION_TOKEN = secrets.token_urlsafe(32)
ADMIN_PATHS = {"/index.html"}


def resolve_admin_credentials(environ=None):
    """Use configured credentials or create a fresh pair for this local run."""
    environ = os.environ if environ is None else environ
    username = environ.get("ATS_DEMO_ADMIN_USERNAME") or f"demo-{secrets.token_hex(3)}"
    password = environ.get("ATS_DEMO_ADMIN_PASSWORD") or secrets.token_urlsafe(12)
    return username, password


ADMIN_USERNAME, ADMIN_PASSWORD = resolve_admin_credentials()
USING_GENERATED_ADMIN_CREDENTIALS = not (
    os.environ.get("ATS_DEMO_ADMIN_USERNAME") and os.environ.get("ATS_DEMO_ADMIN_PASSWORD")
)


class ATSHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        requested_path = urlparse(self.path).path
        if requested_path == "/":
            self.redirect("/careers.html")
            return
        if requested_path == "/dashboard":
            self.redirect("/index.html")
            return
        if requested_path == "/admin":
            self.redirect("/admin.html")
            return
        if requested_path in ADMIN_PATHS and not self.is_admin_authenticated():
            self.redirect("/admin.html")
            return
        super().do_GET()

    def do_POST(self):
        requested_path = urlparse(self.path).path
        if requested_path == "/api/admin-login":
            self.handle_admin_login()
            return
        if requested_path == "/api/admin-logout":
            self.handle_admin_logout()
            return
        if requested_path != "/api/parse-resume":
            self.send_error(404, "Not found")
            return
        if not self.is_admin_authenticated():
            self.send_json({"ok": False, "error": "Admin login required."}, status=401)
            return

        try:
            upload = read_multipart_file(self)
            if not upload:
                self.send_json({"ok": False, "error": "No resume file was uploaded."}, status=400)
                return

            filename, data = upload
            with tempfile.TemporaryDirectory() as temp_dir:
                path = Path(temp_dir) / safe_filename(filename)
                path.write_bytes(data)
                text, method = extract_resume_text(path)

            if not text.strip():
                self.send_json(
                    {
                        "ok": False,
                        "error": "I could not extract text from this resume. If it is a scanned PDF, OCR is needed.",
                    },
                    status=422,
                )
                return

            self.send_json({"ok": True, "filename": filename, "text": text, "method": method})
        except Exception as exc:
            self.send_json({"ok": False, "error": str(exc)}, status=500)

    def send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def handle_admin_login(self):
        content_length = int(self.headers.get("Content-Length", "0"))
        body = self.rfile.read(content_length).decode("utf-8", errors="ignore")
        params = parse_qs(body)
        username = params.get("username", [""])[0]
        password = params.get("password", [""])[0]
        username_ok = secrets.compare_digest(username, ADMIN_USERNAME)
        password_ok = secrets.compare_digest(password, ADMIN_PASSWORD)
        if not username_ok or not password_ok:
            self.send_json({"ok": False, "error": "Invalid admin username or password."}, status=401)
            return

        payload = json.dumps({"ok": True, "redirect": "/index.html"}).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Set-Cookie", f"{SESSION_COOKIE}={SESSION_TOKEN}; Path=/; HttpOnly; SameSite=Strict")
        self.end_headers()
        self.wfile.write(payload)

    def handle_admin_logout(self):
        self.send_response(204)
        self.send_header("Set-Cookie", f"{SESSION_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict")
        self.end_headers()

    def is_admin_authenticated(self):
        header = self.headers.get("Cookie", "")
        jar = cookies.SimpleCookie()
        jar.load(header)
        session = jar.get(SESSION_COOKIE)
        return bool(session and secrets.compare_digest(session.value, SESSION_TOKEN))

    def redirect(self, location):
        self.send_response(302)
        self.send_header("Location", location)
        self.end_headers()


def read_multipart_file(handler):
    content_type = handler.headers.get("Content-Type", "")
    match = re.search(r"boundary=(.+)", content_type)
    if not match:
        return None

    boundary = match.group(1).strip().strip('"').encode()
    content_length = int(handler.headers.get("Content-Length", "0"))
    body = handler.rfile.read(content_length)

    for part in body.split(b"--" + boundary):
        if b"Content-Disposition:" not in part or b"filename=" not in part:
            continue
        header_blob, _, content = part.partition(b"\r\n\r\n")
        headers = header_blob.decode("utf-8", errors="ignore")
        filename_match = re.search(r'filename="([^"]*)"', headers)
        filename = filename_match.group(1) if filename_match else "resume"
        return filename, content.rstrip(b"\r\n-")
    return None


def safe_filename(filename):
    cleaned = re.sub(r"[^A-Za-z0-9._-]+", "_", filename or "resume").strip("._")
    return cleaned or "resume"


def extract_resume_text(path):
    suffix = path.suffix.lower()
    if suffix in {".txt", ".md", ".csv"}:
        return path.read_text("utf-8", errors="ignore"), "text"
    if suffix == ".docx":
        return extract_docx(path), "docx"
    if suffix in {".doc", ".rtf"}:
        converted = run_textutil(path)
        if converted:
            return converted, "textutil"
    if suffix == ".pdf":
        pdf_text = extract_pdf(path)
        if pdf_text:
            return pdf_text, "pdf"
    fallback = path.read_text("utf-8", errors="ignore")
    return fallback, "fallback"


def extract_docx(path):
    chunks = []
    with zipfile.ZipFile(path) as docx:
        for name in docx.namelist():
            if name.startswith("word/") and name.endswith(".xml"):
                xml = docx.read(name).decode("utf-8", errors="ignore")
                xml = re.sub(r"<w:tab\s*/>", "\t", xml)
                xml = re.sub(r"</w:p>", "\n", xml)
                xml = re.sub(r"<[^>]+>", "", xml)
                chunks.append(html.unescape(xml))
    return clean_text("\n".join(chunks))


def run_textutil(path):
    if not shutil.which("textutil"):
        return ""
    result = subprocess.run(
        ["textutil", "-convert", "txt", "-stdout", str(path)],
        capture_output=True,
        text=True,
        timeout=20,
        check=False,
    )
    return clean_text(result.stdout)


def extract_pdf(path):
    if shutil.which("pdftotext"):
        with tempfile.NamedTemporaryFile(suffix=".txt") as output:
            subprocess.run(["pdftotext", str(path), output.name], capture_output=True, timeout=20, check=False)
            text = Path(output.name).read_text("utf-8", errors="ignore")
            if text.strip():
                return clean_text(text)

    native_text = extract_pdf_native(path)
    if native_text:
        return native_text

    metadata_text = run_mdls(path)
    if metadata_text:
        return metadata_text

    return run_strings(path)


def extract_pdf_native(path):
    data = path.read_bytes()
    chunks = []
    for match in re.finditer(rb"(<<.*?>>)\s*stream\r?\n(.*?)\r?\nendstream", data, flags=re.S):
        dictionary = match.group(1)
        stream = match.group(2)
        if b"/FlateDecode" in dictionary:
            try:
                stream = zlib.decompress(stream)
            except zlib.error:
                continue
        chunks.extend(extract_pdf_text_operators(stream))
    return clean_text("\n".join(chunks))


def extract_pdf_text_operators(stream):
    text = stream.decode("latin-1", errors="ignore")
    chunks = []
    for array_match in re.finditer(r"\[(.*?)\]\s*TJ", text, flags=re.S):
        chunks.append("".join(decode_pdf_string(item) for item in re.findall(r"\((?:\\.|[^\\)])*\)", array_match.group(1))))
    for string_match in re.finditer(r"(\((?:\\.|[^\\)])*\))\s*(?:Tj|'|\")", text, flags=re.S):
        chunks.append(decode_pdf_string(string_match.group(1)))
    return [chunk.strip() for chunk in chunks if chunk.strip()]


def decode_pdf_string(value):
    if value.startswith("(") and value.endswith(")"):
        value = value[1:-1]
    value = re.sub(r"\\([nrtbf()\\])", lambda match: {
        "n": "\n",
        "r": "\r",
        "t": "\t",
        "b": "\b",
        "f": "\f",
        "(": "(",
        ")": ")",
        "\\": "\\",
    }[match.group(1)], value)
    value = re.sub(r"\\([0-7]{1,3})", lambda match: chr(int(match.group(1), 8)), value)
    return value


def run_mdls(path):
    if not shutil.which("mdls"):
        return ""
    result = subprocess.run(
        ["mdls", "-raw", "-name", "kMDItemTextContent", str(path)],
        capture_output=True,
        text=True,
        timeout=20,
        check=False,
    )
    text = result.stdout.strip()
    if text and text != "(null)" and "could not find" not in text.lower():
        return clean_text(text)
    return ""


def run_strings(path):
    if not shutil.which("strings"):
        return ""
    result = subprocess.run(
        ["strings", "-n", "5", str(path)],
        capture_output=True,
        text=True,
        timeout=20,
        check=False,
    )
    lines = []
    skip_patterns = (" obj", " endobj", "xref", "stream", "endstream", "/Type", "/Font", "/Length")
    for line in result.stdout.splitlines():
        stripped = line.strip()
        if len(stripped) < 3 or any(pattern in stripped for pattern in skip_patterns):
            continue
        lines.append(stripped)
    return clean_text("\n".join(lines))


def clean_text(text):
    text = re.sub(r"\r", "\n", text or "")
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def find_open_port(start_port=DEFAULT_PORT, attempts=200):
    for port in range(start_port, start_port + attempts):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as probe:
            try:
                probe.bind((HOST, port))
            except OSError:
                continue
            return port
    raise OSError(f"No open local port found from {start_port} to {start_port + attempts - 1}.")


if __name__ == "__main__":
    port = find_open_port()
    server = ThreadingHTTPServer((HOST, port), ATSHandler)
    print(f"Signal ATS demo running at http://{HOST}:{port}")
    print(f"Careers page: http://{HOST}:{port}/careers.html")
    print(f"Admin login: http://{HOST}:{port}/admin.html")
    if USING_GENERATED_ADMIN_CREDENTIALS:
        print("One-time credentials for this local run:")
        print(f"  Username: {ADMIN_USERNAME}")
        print(f"  Password: {ADMIN_PASSWORD}")
    else:
        print("Using admin credentials from the environment.")
    server.serve_forever()
