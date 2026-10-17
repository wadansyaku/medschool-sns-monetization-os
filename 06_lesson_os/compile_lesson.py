#!/usr/bin/env python3
"""Compile a reviewed lesson JSON into local delivery drafts, without network access."""
from __future__ import annotations

import argparse
import ast
from datetime import datetime, timezone
from decimal import Decimal, InvalidOperation, localcontext
import hashlib
import html
import json
import os
from pathlib import Path
import re
import shutil
import tempfile
from urllib.parse import urlsplit

VERSION = "1.0.0"
BRAND = "理系再建ラボ｜医学につながる理系"
LAYERS = {"高校理系ブリッジ", "医学学習OS", "AI実務"}
IDENTIFIER = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$")
MAX_INPUT_BYTES = 2_000_000


class ValidationError(ValueError):
    pass


def need(condition, message):
    if not condition:
        raise ValidationError(message)


def string(value, name, maximum=12000, allow_empty=False):
    need(isinstance(value, str), f"{name}: a string is required")
    need((allow_empty or value.strip()) and len(value) <= maximum,
         f"{name}: empty or too long")
    need(not any(ord(ch) < 32 and ch not in "\n\t" for ch in value),
         f"{name}: control characters are not allowed")
    return value


def number(value, name):
    need(type(value) in (int, float), f"{name}: a JSON number is required")
    try:
        result = Decimal(str(value))
    except InvalidOperation as exc:
        raise ValidationError(f"{name}: invalid number") from exc
    need(result.is_finite() and abs(result) <= Decimal("1e18"),
         f"{name}: number is not finite or exceeds 1e18")
    return result


def evaluate_check(check, question_id):
    """Only bounded arithmetic AST nodes; never eval, imports, calls or attributes."""
    need(isinstance(check, dict), f"{question_id}.check: an object is required")
    expression = string(check.get("expression"), f"{question_id}.expression", 200)
    values = check.get("values")
    need(isinstance(values, dict) and len(values) <= 24,
         f"{question_id}.values: an object with at most 24 variables is required")
    variables = {}
    for key, value in values.items():
        need(re.fullmatch(r"[A-Za-z][A-Za-z0-9_]{0,30}", key) is not None,
             f"{question_id}: invalid variable name")
        variables[key] = number(value, f"{question_id}.{key}")
    expected = number(check.get("expected"), f"{question_id}.expected")
    tolerance = number(check.get("tolerance", 0.000001), f"{question_id}.tolerance")
    need(Decimal(0) <= tolerance <= Decimal("0.01"),
         f"{question_id}: tolerance must be between 0 and 0.01")
    string(check.get("unit", ""), f"{question_id}.unit", 40, allow_empty=True)
    try:
        tree = ast.parse(expression, mode="eval")
    except (SyntaxError, RecursionError) as exc:
        raise ValidationError(f"{question_id}: invalid arithmetic expression") from exc
    need(sum(1 for _ in ast.walk(tree)) <= 80, f"{question_id}: expression too complex")
    used = set()

    def visit(node, depth=0):
        need(depth < 20, f"{question_id}: expression too deep")
        if isinstance(node, ast.Expression):
            return visit(node.body, depth + 1)
        if isinstance(node, ast.Constant):
            return number(node.value, question_id)
        if isinstance(node, ast.Name):
            need(node.id in variables, f"{question_id}: unknown variable {node.id}")
            used.add(node.id)
            return variables[node.id]
        if isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.USub, ast.UAdd)):
            value = visit(node.operand, depth + 1)
            return -value if isinstance(node.op, ast.USub) else value
        if isinstance(node, ast.BinOp) and isinstance(node.op, (ast.Add, ast.Sub, ast.Mult, ast.Div)):
            left, right = visit(node.left, depth + 1), visit(node.right, depth + 1)
            if isinstance(node.op, ast.Add):
                result = left + right
            elif isinstance(node.op, ast.Sub):
                result = left - right
            elif isinstance(node.op, ast.Mult):
                result = left * right
            else:
                need(right != 0, f"{question_id}: division by zero")
                result = left / right
            need(result.is_finite() and abs(result) <= Decimal("1e30"),
                 f"{question_id}: arithmetic exceeds safe limits")
            return result
        raise ValidationError(f"{question_id}: only +, -, *, /, parentheses and variables are allowed")

    with localcontext() as context:
        context.prec = 40
        calculated = visit(tree)
        need(used == set(variables), f"{question_id}: unused check variables")
        need(abs(calculated - expected) <= tolerance,
             f"{question_id}: check mismatch: calculated {calculated}, expected {expected}")
    return {"question_id": question_id, "expression": expression,
            "calculated": str(calculated), "expected": str(expected),
            "unit": check.get("unit", ""), "absolute_tolerance": str(tolerance), "passed": True}


def validate(data):
    need(isinstance(data, dict), "lesson: an object is required")
    need(type(data.get("schema_version")) is int and data["schema_version"] == 1,
         "schema_version must be integer 1")
    need(isinstance(data.get("id"), str) and IDENTIFIER.fullmatch(data["id"]),
         "id must contain only ASCII letters, digits, underscore or hyphen")
    for key in ("title", "subtitle", "audience", "layer", "brand"):
        string(data.get(key), key, 400)
    need(data["brand"] == BRAND, f"brand must be {BRAND}")
    need(data["layer"] in LAYERS, "layer must be one of the three existing content layers")
    price = data.get("price_candidate_jpy")
    need(type(price) is int and 0 <= price <= 1_000_000,
         "price_candidate_jpy must be a nonnegative integer, at most 1000000")
    if "longform" in data:
        need(isinstance(data["longform"], dict), "longform must be an object")
        for key in ("title", "reason"):
            string(data["longform"].get(key), f"longform.{key}", 3000)
    sections = data.get("sections")
    need(isinstance(sections, list) and 1 <= len(sections) <= 20,
         "sections must contain 1 to 20 sections")
    for index, section in enumerate(sections):
        need(isinstance(section, dict), f"section {index}: an object is required")
        string(section.get("title"), f"section {index}.title", 200)
        paragraphs = section.get("paragraphs")
        need(isinstance(paragraphs, list) and 1 <= len(paragraphs) <= 30,
             f"section {index}.paragraphs: 1 to 30 paragraphs required")
        for paragraph in paragraphs:
            string(paragraph, f"section {index}.paragraph", 6000)
    sources = data.get("sources")
    need(isinstance(sources, list) and 1 <= len(sources) <= 40,
         "sources must contain 1 to 40 sources")
    source_ids = set()
    for source in sources:
        need(isinstance(source, dict), "source: an object is required")
        source_id = string(source.get("id"), "source.id", 80)
        need(IDENTIFIER.fullmatch(source_id) and source_id not in source_ids,
             "source.id must be unique and contain only safe identifier characters")
        source_ids.add(source_id)
        string(source.get("title"), "source.title", 1000)
        url = string(source.get("url"), "source.url", 2000)
        try:
            parsed = urlsplit(url)
        except ValueError as exc:
            raise ValidationError("source.url is malformed") from exc
        need(parsed.scheme in {"http", "https"} and parsed.netloc and
             not parsed.username and not parsed.password and
             not any(character.isspace() for character in url),
             "source.url must be a public HTTP(S) URL, without credentials")
        accessed = string(source.get("accessed"), "source.accessed", 50)
        need(re.fullmatch(r"\d{4}-\d{2}-\d{2}(?:[T ].+)?", accessed),
             "source.accessed must begin with YYYY-MM-DD")
    questions = data.get("questions")
    need(isinstance(questions, list) and 1 <= len(questions) <= 100,
         "questions must contain 1 to 100 questions")
    question_ids, checks = set(), []
    for question in questions:
        need(isinstance(question, dict), "question: an object is required")
        question_id = string(question.get("id"), "question.id", 80)
        need(IDENTIFIER.fullmatch(question_id) and question_id not in question_ids,
             "question.id must be unique and contain only safe identifier characters")
        question_ids.add(question_id)
        need(isinstance(question.get("kind"), str) and question["kind"] in {"calculation", "concept"},
             f"{question_id}.kind must be calculation or concept")
        need(type(question.get("is_free")) is bool, f"{question_id}.is_free must be a boolean")
        for key in ("stem", "answer", "explanation", "common_error"):
            string(question.get(key), f"{question_id}.{key}", 6000)
        refs = question.get("source_ids", [])
        need(isinstance(refs, list) and all(isinstance(ref, str) and ref in source_ids for ref in refs),
             f"{question_id}.source_ids contains an unknown source")
        if question["kind"] == "calculation":
            need("check" in question, f"{question_id}: calculation questions require check")
        if "check" in question:
            checks.append(evaluate_check(question["check"], question_id))
    need(any(question["is_free"] for question in questions), "at least one free question is required")
    sales = data.get("sales")
    need(isinstance(sales, dict), "sales must be an object")
    string(sales.get("description"), "sales.description", 16000)
    includes = sales.get("includes")
    need(isinstance(includes, list) and 1 <= len(includes) <= 30, "sales.includes must be a nonempty list")
    for item in includes:
        string(item, "sales.includes item", 2000)
    posts = sales.get("posts", [])
    need(isinstance(posts, list) and len(posts) <= 20, "sales.posts must be a list")
    for post in posts:
        string(post, "sales.posts item", 5000)
    return checks


def no_duplicate_keys(pairs):
    result = {}
    for key, value in pairs:
        need(key not in result, f"duplicate JSON key: {key}")
        result[key] = value
    return result


def load_input(path):
    need(path.is_file() and path.suffix.lower() == ".json", "input must be an existing JSON file")
    need(path.stat().st_size <= MAX_INPUT_BYTES, "input exceeds 2 MB")
    raw = path.read_bytes()
    need(len(raw) <= MAX_INPUT_BYTES, "input exceeds 2 MB")
    try:
        data = json.loads(raw.decode("utf-8-sig"), object_pairs_hook=no_duplicate_keys,
                          parse_constant=lambda value: (_ for _ in ()).throw(ValidationError(f"invalid number: {value}")))
    except (UnicodeDecodeError, json.JSONDecodeError, RecursionError) as exc:
        raise ValidationError(f"invalid UTF-8 JSON: {exc}") from exc
    return data, raw


def esc(value):
    return html.escape(str(value), quote=True)


def para(value):
    return "<p>" + esc(value).replace("\n", "<br>") + "</p>"


CSS = """
:root{color-scheme:light;--ink:#19313c;--muted:#51616a;--accent:#007d76;--line:#d8e5e5}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:#f3f6f6;color:var(--ink);font:16px/1.9 system-ui,-apple-system,'Noto Sans JP',sans-serif}
main{max-width:860px;margin:auto;padding:42px 24px 70px}.brand{font-size:13px;letter-spacing:.07em;font-weight:700;color:var(--accent)}
header{margin-bottom:30px;border-bottom:3px solid var(--accent);padding-bottom:24px}h1{font-size:clamp(27px,5vw,38px);line-height:1.45;margin:14px 0}h2{font-size:23px;line-height:1.5;margin:0 0 16px}h3{font-size:18px;line-height:1.6;margin:0 0 12px}p{margin:10px 0;overflow-wrap:anywhere}
.sub,.meta{color:var(--muted)}.meta{font-size:13px}.badge{display:inline-block;background:#dcefee;border-radius:6px;padding:2px 10px;font-size:13px;margin:10px 6px 0 0}
section,.question{background:white;border:1px solid var(--line);border-radius:14px;padding:26px;margin:22px 0}.question{scroll-margin-top:16px}.question-head{display:flex;gap:12px;align-items:baseline;flex-wrap:wrap}.question-id{font-weight:800;color:var(--accent)}
nav{display:flex;gap:9px;flex-wrap:wrap;margin:22px 0}a{color:#006961;text-underline-offset:3px;overflow-wrap:anywhere}nav a{padding:4px 10px;border:1px solid var(--line);border-radius:5px;background:white}
details{border-top:1px solid var(--line);margin-top:24px;padding-top:15px}summary{cursor:pointer;font-weight:700;padding:5px 0}summary:focus-visible,a:focus-visible{outline:3px solid #e8a638;outline-offset:4px}.answer{background:#eff8f7;padding:15px 19px;margin-top:16px;border-radius:8px}.error{border-left:3px solid #b7862c;padding:2px 14px;margin-top:16px}.label{font-size:13px;font-weight:700;color:var(--muted)}
.refs{font-size:13px}.refs li{margin:14px 0}footer{font-size:12px;color:var(--muted);margin-top:32px}ul{padding-left:24px}
@media(max-width:520px){main{padding:25px 15px 45px}section,.question{padding:21px 18px}body{font-size:15px}}
@media print{body{background:white;font-size:11pt}main{max-width:none;padding:0}nav{display:none}section,.question{border:0;border-bottom:1px solid #aaa;border-radius:0;padding:12px 0;break-inside:avoid}a{color:inherit}header{break-after:avoid}}
"""


def select_questions(data, sample=False):
    return [question for question in data["questions"] if not sample or question["is_free"]]


def render_html(data, sample=False):
    selected = select_questions(data, sample)
    label = "無料サンプル" if sample else "演習と解説"
    parts = ["<!doctype html><html lang=\"ja\"><head><meta charset=\"utf-8\">",
             '<meta name="viewport" content="width=device-width,initial-scale=1">',
             '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'; base-uri \'none\'; form-action \'none\'">',
             f"<title>{esc(data['title'])} | {label}</title><style>{CSS}</style></head><body><main>",
             f"<header><div class=\"brand\">{esc(data['brand'])}</div><h1>{esc(data['title'])}</h1>",
             f"<p class=\"sub\">{esc(data['subtitle'])}</p><span class=\"badge\">{esc(data['layer'])}</span>",
             f"<span class=\"badge\">{label} · {len(selected)}問</span>",
             f"<p class=\"meta\">対象：{esc(data['audience'])}</p></header>",
             '<nav aria-label="ページ内移動"><a href="#guide">学び方</a><a href="#exercises">演習</a><a href="#sources">出典</a></nav>',
             '<div id="guide">']
    for section in data["sections"]:
        parts.append(f"<section><h2>{esc(section['title'])}</h2>" +
                     "".join(para(text) for text in section["paragraphs"]) + "</section>")
    parts.extend(['</div><h2 id="exercises">演習</h2>',
                  '<p class="meta">先に自分の答えと理由を出し、その後で「答えと解説を開く」を押してください。</p>'])
    for index, question in enumerate(selected, 1):
        parts.extend([f"<article class=\"question\" id=\"q-{esc(question['id'])}\"><div class=\"question-head\">",
                      f"<span class=\"question-id\">第{index}問</span><span class=\"meta\">{esc(question['id'])}</span></div>",
                      para(question["stem"]), '<details><summary>答えと解説を開く</summary>',
                      '<div class="answer"><div class="label">答え</div>', para(question["answer"]), '</div>',
                      '<h3>考え方</h3>', para(question["explanation"]),
                      '<div class="error"><div class="label">間違えやすい点</div>', para(question["common_error"]), '</div>'])
        if question.get("source_ids"):
            parts.append('<p class="meta">参照：' + ", ".join(esc(ref) for ref in question["source_ids"]) + '</p>')
        parts.append('</details></article>')
    parts.append('<section id="sources"><h2>出典・確認資料</h2><ol class="refs">')
    for source in data["sources"]:
        parts.append(f'<li id="src-{esc(source["id"])}">[{esc(source["id"])}] <a href="{esc(source["url"])}" rel="noopener noreferrer">{esc(source["title"])}</a><br>確認日：{esc(source["accessed"])}</li>')
    parts.append('</ol></section><footer>理系の理解と学習のための教材です。医学につながる話題は理解の接続先として扱います。</footer></main></body></html>')
    return "".join(parts)


def md_text(value):
    # Sales copy is a plain-text draft: stop raw HTML being interpreted by previewers.
    return html.escape(value, quote=False).replace("\\", "\\\\")


def render_sales(data, pdf=False):
    free = sum(question["is_free"] for question in data["questions"])
    lines = [f"# {md_text(data['title'])}｜販売原稿の下書き", "",
             f"ブランド：{md_text(data['brand'])}", f"対象：{md_text(data['audience'])}",
             f"レイヤー：{md_text(data['layer'])}",
             f"価格候補：{data['price_candidate_jpy']:,}円（未確定）", "",
             "## 長尺動画との接続", ""]
    if data.get("longform"):
        lines += [md_text(data["longform"]["title"]), "", md_text(data["longform"]["reason"]), ""]
    else:
        lines += ["同じテーマの YouTube 長尺動画で理解を届け、その復習・演習として案内する。動画の題名と導線を公開前に記入する。", ""]
    lines += ["## 商品説明", "", md_text(data["sales"]["description"]), "", "## 含まれるもの", ""]
    lines += [f"- {md_text(item)}" for item in data["sales"]["includes"]]
    lines += ["", f"全{len(data['questions'])}問。無料サンプルは{free}問、追加分は{len(data['questions']) - free}問。", "",
              "## 配布ファイル", "", "- lesson.html：全問と開閉式の解説", "- sample.html：無料問題のみ"]
    if pdf:
        lines += ["- lesson.pdf：印刷用の全問版・解答解説", f"- sample.pdf：無料サンプル{free}問・解答解説"]
    lines += ["", "## 長尺から再利用する投稿文の下書き", ""]
    for index, post in enumerate(data["sales"].get("posts", []), 1):
        lines += [f"### 案{index}", "", md_text(post), ""]
    lines += ["## 公開前に確定する項目", "", "- 本文・解答・権利関係の確認と、HTML・PDFの目視確認", "- 実際の価格、販売先、購入後の受渡し方法、利用条件", "- 紐づく長尺動画と無料サンプルの公開URL", "", "このファイルは下書きです。決済、出品、SNS投稿、購入者への送信は行っていません。", ""]
    return "\n".join(lines)


def render_pdf(data, output, font_path=None, bold_path=None, sample=False):
    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import ParagraphStyle
        from reportlab.lib.units import mm
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether, Flowable
    except ImportError as exc:
        raise ValidationError("PDF requires reportlab; install requirements-pdf.txt or omit --pdf") from exc
    need(font_path is not None and Path(font_path).is_file(),
         "--pdf requires --font pointing to a licensed Japanese TrueType font")
    pdfmetrics.registerFont(TTFont("LessonJP", str(font_path)))
    if bold_path:
        need(Path(bold_path).is_file(), "--bold-font file was not found")
        pdfmetrics.registerFont(TTFont("LessonJPBold", str(bold_path)))
        bold = "LessonJPBold"
    else:
        bold = "LessonJP"
    ink, accent, muted = colors.HexColor("#19313c"), colors.HexColor("#007d76"), colors.HexColor("#51616a")
    styles = {
        "body": ParagraphStyle("Body", fontName="LessonJP", fontSize=10.2, leading=17, textColor=ink, wordWrap="CJK", spaceAfter=8, splitLongWords=True),
        "small": ParagraphStyle("Small", fontName="LessonJP", fontSize=8, leading=12.5, textColor=muted, wordWrap="CJK", spaceAfter=7),
        "h1": ParagraphStyle("Title", fontName=bold, fontSize=25, leading=36, textColor=ink, wordWrap="CJK", spaceAfter=16),
        "h2": ParagraphStyle("Heading", fontName=bold, fontSize=15, leading=23, textColor=accent, wordWrap="CJK", spaceBefore=12, spaceAfter=9, keepWithNext=True),
        "h3": ParagraphStyle("Question", fontName=bold, fontSize=11, leading=17, textColor=accent, spaceBefore=10, spaceAfter=8, keepWithNext=True),
    }

    def p(value, style="body"):
        return Paragraph(esc(value).replace("\n", "<br/>"), styles[style])

    class WritingSpace(Flowable):
        def __init__(self):
            Flowable.__init__(self)
            self.height = 37 * mm
        def wrap(self, avail_width, avail_height):
            self.width = avail_width
            return self.width, self.height
        def draw(self):
            self.canv.setStrokeColor(colors.HexColor("#dce5e5"))
            self.canv.setLineWidth(0.4)
            for y in (8, 17, 26, 35):
                self.canv.line(0, y * mm, self.width, y * mm)

    selected = select_questions(data, sample)
    subtitle = f"無料サンプル・{len(selected)}問" if sample else data["subtitle"]
    scope = f"無料サンプル・{len(selected)}問" if sample else f"全{len(selected)}問"
    flow = [p(data["brand"], "small"), Spacer(1, 5 * mm), p(data["title"], "h1"),
            p(subtitle), p(f"{data['layer']} / {scope}", "small"),
            p("対象：" + data["audience"], "small"), Spacer(1, 4 * mm)]
    for section in data["sections"]:
        flow.append(p(section["title"], "h2"))
        flow.extend(p(paragraph) for paragraph in section["paragraphs"])
    flow += [PageBreak(), p("問題編", "h1"), p("途中の式や、そう考えた理由を残してください。解答解説は問題編の後にあります。", "small")]
    for index, question in enumerate(selected, 1):
        if index > 1 and index % 2 == 1:
            flow.append(PageBreak())
        flow += [p(f"第{index}問  {question['id']}", "h3"), p(question["stem"]), WritingSpace(), Spacer(1, 4 * mm)]
    flow += [PageBreak(), p("解答解説編", "h1"), p("答え合わせの後、解説を隠して理由を説明し直すと、理解が残っているかを確かめられます。", "small")]
    for index, question in enumerate(selected, 1):
        answer_block = [p(f"第{index}問  {question['id']}", "h2"), p("答え：" + question["answer"]),
                        p(question["explanation"]), p("間違えやすい点：" + question["common_error"], "small")]
        if question.get("source_ids"):
            answer_block.append(p("参照：" + ", ".join(question["source_ids"]), "small"))
        answer_block.append(Spacer(1, 3 * mm))
        flow.append(KeepTogether(answer_block))
    flow += [PageBreak(), p("出典・確認資料", "h1")]
    for source in data["sources"]:
        flow += [p(f"[{source['id']}] {source['title']}", "h3"), p(source["url"], "small"), p("確認日：" + source["accessed"], "small")]

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(colors.HexColor("#cbdada"))
        canvas.line(18 * mm, 17 * mm, A4[0] - 18 * mm, 17 * mm)
        canvas.setFillColor(muted)
        canvas.setFont("LessonJP", 7)
        canvas.drawString(18 * mm, 12 * mm, data["layer"] + (" / 無料サンプル" if sample else ""))
        canvas.drawRightString(A4[0] - 18 * mm, 12 * mm, str(doc.page))
        canvas.restoreState()

    document = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=18 * mm, leftMargin=18 * mm,
                                 topMargin=18 * mm, bottomMargin=24 * mm,
                                 title=data["title"] + (" / 無料サンプル" if sample else ""), author=data["brand"])
    document.build(flow, onFirstPage=footer, onLaterPages=footer)


def compile_lesson(input_path, output_dir, *, pdf=False, font_path=None, bold_path=None):
    input_path, output_dir = Path(input_path), Path(output_dir)
    need(not output_dir.exists() and not output_dir.is_symlink(),
         "output directory already exists; choose a new directory (no overwrite mode)")
    need(output_dir.name not in {"", ".", ".."}, "invalid output directory")
    data, raw = load_input(input_path)
    checks = validate(data)
    parent = output_dir.parent.resolve(strict=True)
    need(parent.is_dir(), "output parent must already exist")
    final_dir = parent / output_dir.name
    need(not final_dir.exists() and not final_dir.is_symlink(), "output directory already exists")
    staging = Path(tempfile.mkdtemp(prefix=".lesson-build-", dir=parent))
    created_final = False
    try:
        (staging / "lesson.html").write_text(render_html(data), encoding="utf-8")
        (staging / "sample.html").write_text(render_html(data, sample=True), encoding="utf-8")
        (staging / "sales_draft.md").write_text(render_sales(data, pdf=pdf), encoding="utf-8")
        if pdf:
            render_pdf(data, staging / "lesson.pdf", font_path, bold_path)
            render_pdf(data, staging / "sample.pdf", font_path, bold_path, sample=True)
        artifacts = {path.name: {"sha256": hashlib.sha256(path.read_bytes()).hexdigest(), "bytes": path.stat().st_size}
                     for path in sorted(staging.iterdir())}
        report = {"compiler_version": VERSION, "schema_version": 1, "lesson_id": data["id"],
                  "built_at_utc": datetime.now(timezone.utc).isoformat(),
                  "input_sha256": hashlib.sha256(raw).hexdigest(),
                  "question_count": len(data["questions"]),
                  "free_question_count": sum(question["is_free"] for question in data["questions"]),
                  "numeric_checks": checks, "artifacts": artifacts,
                  "pdf_generated": pdf, "sample_pdf_generated": pdf, "status": "draft_for_human_review",
                  "automated": ["schema_validation", "numeric_recalculation", "free_sample_selection", "html_export", "sales_draft_export"] + (["pdf_export"] if pdf else []),
                  "not_automated": ["new_AI_generation", "scientific_semantic_review", "rights_verification", "visual_QA", "publishing", "payment", "customer_delivery", "SNS_posting"],
                  "limits": ["Arithmetic checks validate the supplied expression and expected number, not whether they model the question correctly or match its prose.", "Primary sources are referenced but not fetched or independently verified by this compiler.", "The input may contain private or paid content; do not commit it or the generated full package to a public repository."]}
        (staging / "build_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        # mkdir is the no-overwrite boundary; data never chooses output file names.
        final_dir.mkdir(exist_ok=False)
        created_final = True
        for path in sorted(staging.iterdir()):
            path.rename(final_dir / path.name)
        return report
    except Exception:
        if created_final:
            shutil.rmtree(final_dir)
        raise
    finally:
        shutil.rmtree(staging, ignore_errors=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("--out", required=True, type=Path, help="new directory; its parent must exist")
    parser.add_argument("--pdf", action="store_true")
    parser.add_argument("--font", type=Path, default=os.environ.get("LESSON_JP_FONT"))
    parser.add_argument("--bold-font", type=Path, default=os.environ.get("LESSON_JP_BOLD_FONT"))
    args = parser.parse_args()
    try:
        report = compile_lesson(args.input, args.out, pdf=args.pdf, font_path=args.font, bold_path=args.bold_font)
    except (ValidationError, OSError) as exc:
        parser.exit(2, f"Build refused: {exc}\n")
    print(json.dumps({"output": str(args.out.resolve()), "questions": report["question_count"],
                      "free_questions": report["free_question_count"], "checks_passed": len(report["numeric_checks"]),
                      "pdf_generated": report["pdf_generated"], "status": report["status"]}, ensure_ascii=False))


if __name__ == "__main__":
    main()
