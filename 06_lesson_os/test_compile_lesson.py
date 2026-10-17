import copy
import hashlib
import json
from pathlib import Path
import tempfile
import unittest

from compile_lesson import ValidationError, compile_lesson, validate, load_input


class CompilerSafetyTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = Path(self.temp.name)
        self.data = json.loads(Path(__file__).with_name("example.json").read_text(encoding="utf-8"))
        self.input = self.root / "lesson.json"
        self.output = self.root / "release"

    def tearDown(self):
        self.temp.cleanup()

    def write(self):
        self.input.write_text(json.dumps(self.data, ensure_ascii=False), encoding="utf-8")

    def test_free_artifact_contains_no_paid_question_or_answer(self):
        self.data["questions"][1]["stem"] = "PAID_STEM_SECRET"
        self.data["questions"][1]["answer"] = "PAID_ANSWER_SECRET"
        self.write()
        report = compile_lesson(self.input, self.output)
        sample = (self.output / "sample.html").read_text()
        full = (self.output / "lesson.html").read_text()
        self.assertNotIn("PAID_STEM_SECRET", sample)
        self.assertNotIn("PAID_ANSWER_SECRET", sample)
        self.assertIn("PAID_STEM_SECRET", full)
        self.assertIn("PAID_ANSWER_SECRET", full)
        self.assertEqual(report["free_question_count"], 1)
        for filename, metadata in report["artifacts"].items():
            self.assertEqual(metadata["sha256"], hashlib.sha256((self.output / filename).read_bytes()).hexdigest())

    def test_incorrect_arithmetic_refuses_all_outputs(self):
        self.data["questions"][0]["check"]["expected"] = 19
        self.write()
        with self.assertRaisesRegex(ValidationError, "check mismatch"):
            compile_lesson(self.input, self.output)
        self.assertFalse(self.output.exists())

    def test_malicious_arithmetic_and_non_numeric_values_are_rejected(self):
        cases = [
            {"expression": "__import__('os').system('id')", "values": {}, "expected": 0},
            {"expression": "x ** 999999", "values": {"x": 3}, "expected": 1},
            {"expression": "x / 0", "values": {"x": 3}, "expected": 1},
            {"expression": "x", "values": {"x": True}, "expected": 1},
        ]
        for check in cases:
            with self.subTest(check=check):
                data = copy.deepcopy(self.data)
                data["questions"][0]["check"] = check
                with self.assertRaises(ValidationError):
                    validate(data)

    def test_html_payload_is_escaped_in_visible_content(self):
        self.data["title"] = '<script>alert("x")</script>'
        self.data["questions"][0]["stem"] = '<img src=x onerror="alert(1)">'
        self.write()
        compile_lesson(self.input, self.output)
        full = (self.output / "lesson.html").read_text()
        self.assertNotIn("<script>", full)
        self.assertNotIn("<img src=x", full)
        self.assertIn("&lt;script&gt;", full)
        self.assertIn("&lt;img", full)

    def test_path_traversal_and_active_source_urls_are_rejected(self):
        for bad_id in ("../../escape", "/tmp/file", "a/b", "a\\b"):
            with self.subTest(bad_id=bad_id):
                data = copy.deepcopy(self.data)
                data["id"] = bad_id
                with self.assertRaises(ValidationError):
                    validate(data)
        self.data["sources"][0]["url"] = "javascript:alert(1)"
        with self.assertRaises(ValidationError):
            validate(self.data)

    def test_existing_output_is_never_overwritten(self):
        self.output.mkdir()
        marker = self.output / "keep.txt"
        marker.write_text("keep this exact content")
        self.write()
        with self.assertRaisesRegex(ValidationError, "already exists"):
            compile_lesson(self.input, self.output)
        self.assertEqual(marker.read_text(), "keep this exact content")
        self.assertEqual(list(self.output.iterdir()), [marker])

    def test_calculation_requires_check_and_ids_are_unique(self):
        malformed = copy.deepcopy(self.data)
        malformed["questions"][0]["kind"] = []
        with self.assertRaisesRegex(ValidationError, "kind must be"):
            validate(malformed)
        del self.data["questions"][0]["check"]
        with self.assertRaisesRegex(ValidationError, "require check"):
            validate(self.data)
        self.data["questions"][0]["kind"] = "concept"
        self.data["questions"][1]["id"] = self.data["questions"][0]["id"]
        with self.assertRaisesRegex(ValidationError, "unique"):
            validate(self.data)

    def test_duplicate_json_keys_do_not_silently_override_values(self):
        self.input.write_text('{"schema_version":1,"schema_version":2}')
        with self.assertRaisesRegex(ValidationError, "duplicate JSON key"):
            load_input(self.input)


if __name__ == "__main__":
    unittest.main()
