# SNS収益化戦略

このディレクトリは、`医学生として医学部受験生向けに理系学習設計を発信する匿名メディア` を運用するための作業台です。目的は、X・Instagram・YouTube・TikTok を同時運用しつつ、初期90日で `個別相談・コーチング受注の検証` まで持っていくことです。

## ディレクトリ構成

- `01_strategy/strategy_hub.md`
  - ブランド定義、対象読者、チャネル役割、CTA、禁止領域、KPI をまとめた中枢ファイル
- `02_content_os/content_os.md`
  - コンテンツ柱、12週間ロードマップ、再利用ルール、制作チェックリスト
- `02_content_os/packages/week_01_subject_allocation.md`
  - 初週の核テーマをそのまま制作に使える実戦パッケージ
- `03_analytics_os/post_log.csv`
  - 投稿・相談導線・成約まで追うためのログ
- `03_analytics_os/weekly_review.md`
  - 週末レビューのテンプレート
- `04_codex_os/codex_playbook.md`
  - Codex チャットで毎週どう回すかの運用手順
- `04_codex_os/codex_prompts.md`
  - 週初企画、長尺台本、再利用、週末レビューの固定プロンプト集
- `04_codex_os/external_review_loop.md`
  - GitHub と Atlas を使って、外部レビューを週次運用に組み込む手順
- `03_analytics_os/advice_log.md`
  - Codex / Atlas / GitHub で出た改善案を、採用可否つきで残すログ
- `.github/pull_request_template.md`
  - GitHub で週次パッケージをレビューするための PR テンプレート

## 運用の基本単位

- 毎週 `核テーマ1本` を決める
- 先に `YouTube長尺1本` を作る
- 長尺から `短尺4本` を切り出す
- その週の主張を `Instagramカルーセル1本` に整理する
- 長尺と短尺から `X投稿10-14本` を派生させる
- すべての投稿は `Instagramプロフィール導線` または `申込フォーム` に集約する

## 週次の回し方

1. `01_strategy/strategy_hub.md` を確認して、今週もズレずに発信できる状態にする
2. `04_codex_os/codex_prompts.md` の「週初企画」を使って今週の核テーマを確定する
3. `04_codex_os/codex_prompts.md` の「長尺台本生成」と「再利用生成」で制作を進める
4. 公開後の数値を `03_analytics_os/post_log.csv` に記録する
5. 週末に `03_analytics_os/weekly_review.md` と `04_codex_os/codex_prompts.md` のレビュー用プロンプトを使って改善点を決める

## 最初の60分でやること

1. `01_strategy/strategy_hub.md` のプロフィール文と CTA 方針を見て、各アカウントの説明文を整える
2. `02_content_os/packages/week_01_subject_allocation.md` を見て、初週の長尺企画と短尺4本を収録する
3. `03_analytics_os/post_log.csv` に今週分の行をコピーして、記録の土台を作る
4. 初回相談の受付先を 1 つに絞り、全媒体で同じ導線にする

## GitHub / Atlas 連携

- このディレクトリはローカル Git リポジトリとして初期化済み
- GitHub 連携の基本は、`週次パッケージ単位でブランチを切る → PR でレビューする → main に戻す`
- Atlas は「もう1人の上位レビュー担当」として使い、以下の場面で意見を取りにいく
  - 新しいコンテンツ柱を始める前
  - 相談導線や CTA を変える前
  - 2週以上伸びが鈍い時
  - 価格やオファーを変える前
- 受けた助言は `03_analytics_os/advice_log.md` に残し、採用するかを明示する
- 詳細手順は `04_codex_os/external_review_loop.md` を参照する

## 運用原則

- 1テーマ1パッケージを崩さない
- 医療助言や診断に見える表現は避け、受験戦略と学習設計に限定する
- 顔出しの代わりに、`声の一貫性` `テーマの固定` `情報整理の精度` で信頼を作る
- 各媒体で別企画を作らず、長尺起点で再利用する
- 初期90日は平台内収益よりも、`相談申込数` と `見込み客の悩みデータ` を最重要指標にする
- Codex と Atlas の助言は両方残し、最終判断は `相談導線に効くか` と `継続可能か` で決める
