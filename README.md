# 理系再建ラボ 運営OS

このディレクトリは、`理系再建ラボ｜医学につながる理系` を運用するための作業台です。チャンネルの約束は、`理系でつまずく人を、医学で使える理解まで連れていく` ことです。主対象は `医学部志望〜医学生前半` で、顔出しなしのまま YouTube 長尺資産を中心に、登録者 1000 人以上へ伸びうる一貫テーマと運営OSを固めます。X・Instagram・TikTok は YouTube からの再利用を基本とし、個別相談は残しつつも二次目的として扱います。

## ディレクトリ構成

- `01_strategy/strategy_hub.md`
  - ブランド定義、対象読者、チャネル役割、CTA、禁止領域、KPI をまとめた中枢ファイル
- `01_strategy/implementation_roadmap.md`
  - 大規模実装へ進むための批判的評価、batch 計画、品質 gate
- `02_content_os/content_os.md`
  - コンテンツ柱、12週間ロードマップ、再利用ルール、制作チェックリスト
- `02_content_os/package_template.md`
  - 週次パッケージを量産するための正本テンプレート
- `02_content_os/packages/week_01_subject_allocation.md`
  - `高校理系ブリッジ` の初週長尺として使える実戦パッケージ
- `02_content_os/packages/week_02_math_bias.md`
  - Week 01 から回遊させる数学偏重修正パッケージ
- `02_content_os/packages/week_03_study_os_before_memorization.md`
  - Week 02 から回遊させる医学学習OSの初回パッケージ
- `02_content_os/series_connection_map.md`
  - Week 01-05 の長尺回遊設計
- `03_analytics_os/post_log.csv`
  - 投稿・登録・CTR・回遊・相談の補助指標を追うためのログ
- `03_analytics_os/experiment_backlog.md`
  - 週ごとの仮説、主要指標、採用可否を管理するログ
- `03_analytics_os/weekly_review.md`
  - 週末レビューのテンプレート
- `04_codex_os/codex_playbook.md`
  - Codex チャットで毎週どう回すかの運用手順
- `04_codex_os/codex_prompts.md`
  - 週初企画、長尺台本、再利用、週末レビューの固定プロンプト集
- `04_codex_os/content_guardrail_checklist.md`
  - 医療境界、AI補助線、CTA過多、3レイヤー逸脱を出荷前に確認する gate
- `04_codex_os/external_review_loop.md`
  - GitHub と Atlas を使って、外部レビューを週次運用に組み込む手順
- `03_analytics_os/advice_log.md`
  - Codex / Atlas / GitHub で出た改善案を、採用可否つきで残すログ
- `.github/pull_request_template.md`
  - GitHub で週次パッケージをレビューするための PR テンプレート
- `05_video_os/`
  - Remotion で長尺と短尺を生成する動画制作基盤
  - `visual_qa_checklist.md` で still 確認の合否基準を管理する
  - `video-packages.manifest.json` で still / render / validation の対象 composition を管理する

## 運用の基本単位

- 毎週 `核テーマ1本` を決める
- 先に `YouTube長尺1本` を作る
- 長尺から `短尺4本` を切り出す
- その週の主張を `Instagramカルーセル1本` に整理する
- 長尺と短尺から `X投稿10-14本` を派生させる
- すべての投稿は `YouTube長尺の資産化` を最優先で設計し、必要な場合のみ二次 CTA を添える

## 週次の回し方

1. `01_strategy/strategy_hub.md` を確認して、今週もズレずに発信できる状態にする
2. 大きく進める週は `01_strategy/implementation_roadmap.md` で今回の batch を決める
3. `02_content_os/package_template.md` か既存 package を使って、今週の核テーマを正本化する
4. `04_codex_os/codex_prompts.md` の「長尺台本生成」と「再利用生成」で制作を進める
5. 公開後の数値を `03_analytics_os/post_log.csv` に、仮説の採否を `03_analytics_os/experiment_backlog.md` に記録する
6. 週末に `03_analytics_os/weekly_review.md` と `04_codex_os/codex_prompts.md` のレビュー用プロンプトを使って改善点を決める

## 最初の60分でやること

1. `01_strategy/strategy_hub.md` のプロフィール文と CTA 方針を見て、各アカウントの説明文を整える
2. `02_content_os/packages/week_01_subject_allocation.md` か `02_content_os/packages/week_02_math_bias.md` を見て、`高校理系ブリッジ` の長尺と短尺4本を収録する
3. `03_analytics_os/post_log.csv` に今週分の行をコピーして、記録の土台を作る
4. まず YouTube 長尺の視聴導線を整え、そのうえで必要なら二次 CTA を 1 つに絞る

## 動画制作

- `05_video_os/` で Remotion Studio を起動し、長尺と短尺の静止画確認と mp4 レンダリングを行う
- Studio の schema 付き props を使って、その場で文言や scene data を微調整できる
- 企画の正本は `02_content_os/packages/` に置き、`05_video_os/` は preview と書き出し層として使う
- まず静止画でレイアウトを確認し、その後に mp4 を書き出す
- 外部生成が必要な素材だけを Runway などに切り出し、長尺の主張自体は repo 側で固定する

## GitHub / Atlas 連携

- このディレクトリはローカル Git リポジトリとして初期化済み
- GitHub 連携の基本は、`週次パッケージ単位でブランチを切る → PR でレビューする → main に戻す`
- Atlas は「もう1人の上位レビュー担当」として使い、以下の場面で意見を取りにいく
  - 新しいコンテンツ柱を始める前
  - 長尺構成や二次 CTA を変える前
  - 2週以上伸びが鈍い時
  - 価格やオファーを変える前
- 受けた助言は `03_analytics_os/advice_log.md` に残し、採用するかを明示する
- 詳細手順は `04_codex_os/external_review_loop.md` を参照する

## 運用原則

- 1テーマ1パッケージを崩さない
- 医療助言や診断に見える表現は避け、理系理解・学習OS・AI補助線に限定する
- 顔出しの代わりに、`声の一貫性` `テーマの固定` `情報整理の精度` で信頼を作る
- 各媒体で別企画を作らず、長尺起点で再利用する
- 初期は平台内収益よりも、`YouTube長尺の一貫性` `登録される理由` `再訪される構造` を最重要指標にする
- Codex と Atlas の助言は両方残し、最終判断は `長尺テーマの強さ` と `継続可能か` で決める
