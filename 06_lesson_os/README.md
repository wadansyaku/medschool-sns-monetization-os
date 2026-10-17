# 長尺動画に付属する教材の書き出し

レビューした1教材JSONから、同じ内容の配布ファイルを一括で生成します。ブランド、対象、3レイヤー、YouTube長尺を主軸とする方針は既存の運営OSに従います。教材は長尺の復習・演習のための二次導線です。

## 動く範囲

| 入力から自動で行うこと | 人による確認・別工程が必要なこと |
| --- | --- |
| 入力検証、計算式の再計算、無料問題の抽出、HTML生成、PDF生成、販売原稿の組版、ファイルのSHA-256記録 | AIによる新しい教材の継続生成、問題・解説の科学的妥当性、一次資料との照合、権利確認、画面と印刷の目視確認、価格決定、出品、決済、購入者への受渡し、投稿 |

このCLIはネットワークに接続せず、APIキーも不要です。架空の実績、購入リンク、学習効果の保証は生成しません。`sales_draft.md` の本文は入力の販売説明から組み立てます。

## 最短実行

Python 3.10以上を使います。HTMLとMarkdownには追加依存はありません。カレントディレクトリはrepo直下です。

```bash
python3 06_lesson_os/compile_lesson.py 06_lesson_os/example.json --out /tmp/lesson-example-01
```

出力先は**まだ存在しないディレクトリ**を指定します。親ディレクトリは先に用意してください。同じ出力先への上書きモードはありません。再生成するときは `lesson-example-02` のように新しい名前を使います。

## 全問版と無料サンプルのPDFを含める

```bash
python3 -m pip install -r 06_lesson_os/requirements-pdf.txt
python3 06_lesson_os/compile_lesson.py /absolute/private/lesson.json \
  --out /absolute/private/release-01 \
  --pdf \
  --font /absolute/fonts/NotoSansJP-Regular.ttf \
  --bold-font /absolute/fonts/NotoSansJP-Bold.ttf
```

`--font` は日本語を含む、ライセンス上埋め込み可能なTrueTypeフォントを指定します。`--bold-font` は任意です。環境変数 `LESSON_JP_FONT` / `LESSON_JP_BOLD_FONT` でも指定できます。フォントファイルはrepoに追加せず、手元の適法なものを使います。PDF依存やフォントがないときは、`--pdf` を外せばHTMLと原稿を生成できます。`--pdf` を指定したのに依存がない場合は、PDFだけ欠けた完成品として扱わず、出力一式を生成せずにエラー終了します。

## 出力

| ファイル | 内容 |
| --- | --- |
| `lesson.html` | 全問と、クリックして開く答え・解説。単独で開けるファイル |
| `sample.html` | `is_free: true` の問題・答えだけ。共通の学習説明と出典を含む |
| `lesson.pdf` | `--pdf` 指定時の印刷用全問版。問題編の後に解答解説編 |
| `sample.pdf` | `--pdf` 指定時の無料問題と解答解説。無料サンプルと問数を表紙に明記 |
| `sales_draft.md` | 価格候補、説明、内容一覧、長尺から派生した投稿文の下書き |
| `build_report.json` | 入力と出力のSHA-256、問題数、数値照合結果、自動化の範囲と限界 |

`--pdf` を指定すると6ファイル、指定しないと4ファイルを生成します。2つのPDFも `build_report.json` のハッシュ一覧に含まれます。無料HTMLと無料PDFは共通の選択処理で問題を切り出し、有料問題の本文も解答も埋め込みません。共通の学習説明と出典は両版へ含めます。全問HTMLの解答開閉は学習用であり、有料内容のアクセス制御ではありません。全問ファイルは購入者への受渡し用として扱います。問題内の個人情報、未公開原稿、販売用データは公開repo外へ置いてください。`private/` と `output/` は補助的に無視していますが、実教材をcommitしないことが基本です。

## 入力スキーマ v1

動作する最小例は `example.json` です。例は架空のカード2問で、販売用ではありません。

| フィールド | 型・要件 |
| --- | --- |
| `schema_version` | 整数 `1` |
| `id` | 英数字から始まる80字以内の英数字・`_`・`-`。出力パスには使用しない |
| `title`, `subtitle`, `audience` | 非空文字列 |
| `brand` | `理系再建ラボ｜医学につながる理系` 固定 |
| `layer` | `高校理系ブリッジ` / `医学学習OS` / `AI実務` |
| `price_candidate_jpy` | 0以上の整数。価格決定ではなく候補 |
| `longform` | 任意。`title`, `reason` の文字列で、長尺動画との接続を記す |
| `sections` | `{title, paragraphs: [文字列]}` の配列。共通の学習説明 |
| `questions` | 1〜100問。下記の形式 |
| `sources` | `{id, title, url, accessed}` の配列。URLはHTTP(S)、確認日はYYYY-MM-DDで開始 |
| `sales` | `description: 文字列`, `includes: [文字列]`, `posts: [文字列]`（postsは任意） |

各問題は `id`, `kind`（`calculation` / `concept`）, `stem`, `answer`, `explanation`, `common_error`, `is_free`（boolean）を持ちます。任意の `source_ids` には出典のIDを列挙できます。計算問題には必ず `check` を付けます。

```json
{
  "expression": "mass_g / (volume_ml / 1000)",
  "values": {"mass_g": 3, "volume_ml": 250},
  "expected": 12,
  "unit": "g/L",
  "tolerance": 0.000001
}
```

`values`, `expected`, `tolerance` はJSONの数値型を使います。文字列や真偽値は拒否します。四則演算・括弧・変数をASTで制限し、Decimalで再計算します。関数呼出し、属性アクセス、累乗、0除算、過大な値、未使用変数を拒否します。誤差は絶対誤差で、`tolerance` の既定値は `0.000001`、許容範囲は0〜0.01です。丸めた解答を期待値にするときは、その精度を明示してください。

式と期待値が一致しても、**問題文の条件が式へ正しく写されているか、単位や説明文が正しいかは保証しません**。原稿レビューでは、問題文→単位変換→式→答え→解説を確認します。

## 既存制作フローでの位置

1. `02_content_os/` でYouTube長尺の対象・主張・構成を決める。
2. その理解を自分で確かめるオリジナル演習を作り、AIの草稿を入力JSONへ整える。
3. 一次資料、医療境界、解説、引用・図版の権利を確認する。
4. このCLIを実行し、計算不一致があれば元の原稿へ戻る。
5. 無料サンプルと全問版をPC・スマートフォン・PDFの全ページで確認する。
6. 価格と販売先を決めて公開し、既存の投稿ログで反応を記録する。

## 検証

```bash
python3 -m unittest discover -s 06_lesson_os -p 'test_*.py' -v
```

テストは無料版への有料内容の混入、算術不一致、危険な数式、HTML注入、識別子のパストラバーサル、URLスキーム、出力の上書き、重複キー、計算チェック欠落を扱います。本文の教育上の妥当性と目視QAは別工程です。PDF更新時は `pdftoppm -png lesson.pdf preview` などで全ページを描画して確認してください。
