import io
import tempfile
import unittest
import zipfile
from pathlib import Path

import server


class CredentialTests(unittest.TestCase):
    def test_configured_credentials_are_preserved(self):
        username, password = server.resolve_admin_credentials(
            {"ATS_DEMO_ADMIN_USERNAME": "recruiter", "ATS_DEMO_ADMIN_PASSWORD": "test-secret"}
        )

        self.assertEqual(username, "recruiter")
        self.assertEqual(password, "test-secret")

    def test_missing_credentials_are_generated(self):
        first = server.resolve_admin_credentials({})
        second = server.resolve_admin_credentials({})

        self.assertTrue(first[0].startswith("demo-"))
        self.assertGreaterEqual(len(first[1]), 16)
        self.assertNotEqual(first, second)


class ResumeParsingTests(unittest.TestCase):
    def test_safe_filename_removes_path_characters(self):
        self.assertEqual(server.safe_filename("../Avery Lee Resume.pdf"), "Avery_Lee_Resume.pdf")

    def test_extracts_text_from_docx(self):
        xml = b'<w:document xmlns:w="urn:test"><w:body><w:p><w:r><w:t>Product Engineer</w:t></w:r></w:p></w:body></w:document>'
        with tempfile.TemporaryDirectory() as temp_dir:
            path = Path(temp_dir) / "resume.docx"
            with zipfile.ZipFile(path, "w") as archive:
                archive.writestr("word/document.xml", io.BytesIO(xml).getvalue())

            text, method = server.extract_resume_text(path)

        self.assertEqual(method, "docx")
        self.assertIn("Product Engineer", text)


if __name__ == "__main__":
    unittest.main()
