# 大規模実装ロードマップ

## 1. 現状の批判的評価

この repo は `理系再建ラボ｜医学につながる理系` の方向性を既にかなり絞れている。特に、旧テーマの `受験相談メディア` へ戻さないこと、YouTube 長尺を一次目的にすること、3 レイヤーで企画を管理すること、相談導線を二次目的に抑えることは明確になっている。

一方で、大規模実装へ進むには以下が弱い。

- Week 01 は作れているが、Week 02 以降を同じ品質で量産するための型が足りない
- `05_video_os/` が Week 01 固定の文言や構造を多く持っており、複数週運用へ拡張しにくい
- `post_log.csv` は結果記録には使えるが、週ごとの仮説と検証結果を残す場所が分離されていない
- 企画の品質判断が、人間の読み直しに依存しており、PR 前の gate が弱い
- 12週間ロードマップはあるが、各週を実装・動画化・レビューへ渡す粒度までは分解されていない

## 2. 実装方針

大規模実装では、新しいテーマを増やす前に `1テーマ1パッケージ` の生産ラインを固定する。最初に守るべき順序は次の通り。

1. 企画の正本を `02_content_os/packages/` に置く
2. 長尺の登録理由、3 レイヤー、対象読者、医療境界を明示する
3. 短尺・カルーセル・X は長尺から派生させる
4. `05_video_os/` は正本を視覚 QA と render へ変換する層に徹する
5. 公開後は `post_log.csv` と `experiment_backlog.md` に結果と学びを分けて残す

## 3. 実装 batch

### Batch 1: 量産できる企画OS

- 残すもの:
  - `01_strategy/strategy_hub.md` のブランド定義
  - `02_content_os/content_os.md` の 12週間ロードマップ
  - Week 01 の `高校理系ブリッジ` パッケージ
- 差し替えるもの:
  - 毎回ゼロから企画を書く運用
- 実装するもの:
  - 週次パッケージテンプレート
  - Week 02 の正本
  - 仮説バックログ
- 完了条件:
  - 新規パッケージの冒頭で `レイヤー` `対象` `登録理由` `YouTube長尺化の理由` が読める

### Batch 2: 複数週対応の Video OS

- 残すもの:
  - Week 01 の現行トーン、太いタイポグラフィ、顔出しなしの視覚方針
  - Remotion Studio の props schema 編集導線
- 差し替えるもの:
  - Week 01 固定の composition 登録
  - `配分` 固定のサムネ・short 補助文言
- 実装するもの:
  - 複数週の video package registry
  - Week 02 の長尺 preview、thumbnail、short 4本
  - 週別 still / render scripts
- 完了条件:
  - Week 01 と Week 02 が同じ component から別 props で描画できる

### Batch 3: 計測と意思決定

- 残すもの:
  - `post_log.csv` の YouTube 長尺中心の指標
  - `weekly_review.md` の週末レビュー構造
- 差し替えるもの:
  - 相談数だけで勝敗を見てしまう運用
- 実装するもの:
  - 仮説、主要指標、判定日、採用可否を管理する `experiment_backlog.md`
  - 週末レビューで次週に 1 つだけ改善指標を選ぶ手順
- 完了条件:
  - 次の週に何を検証するかが 1 行で分かる

### Batch 4: 外部レビュー gate

- 残すもの:
  - Atlas と GitHub PR を第三者視点として使う方針
- 差し替えるもの:
  - 完成品を丸投げしてから大きく戻す運用
- 実装するもの:
  - PR 前チェックリストの強化
  - Atlas に投げる質問を `核テーマ・レイヤー・登録理由` に限定する運用
- 完了条件:
  - レビューで見る観点が `長尺として登録理由になるか` に集中している

### Batch 5: 12週展開

- 残すもの:
  - 3 レイヤーの幅
  - YouTube 長尺起点の運用
- 差し替えるもの:
  - 週ごとに別アカウントのように見える企画
- 実装するもの:
  - Week 03 以降のパッケージ化
  - 勝ちレイヤーの深掘り回
  - 長尺間の回遊設計
- 完了条件:
  - 12本の長尺が、単発ではなく `理系再建ラボ` のシリーズとしてつながる

## 4. 今回の実装範囲

初回実装範囲は Batch 1 と Batch 2 の土台である。

- `02_content_os/package_template.md` を追加する
- `02_content_os/packages/week_02_math_bias.md` を追加する
- `03_analytics_os/experiment_backlog.md` を追加する
- `05_video_os/` を Week 01 / Week 02 の複数週対応へ寄せる
- README と Codex 運用手順へ、新しいファイルの位置づけを反映する

## 4.1 追加実装範囲

次の実装範囲は、Week 03 以降の量産事故を防ぐための hardening である。

- `02_content_os/packages/week_03_study_os_before_memorization.md` を追加する
- `02_content_os/series_connection_map.md` で Week 01-05 の回遊を固定する
- `05_video_os/video-packages.manifest.json` を追加し、still / render / validation の二重管理を減らす
- `VideoPackage` に explicit な `compositionIds` と UI 文字量 budget を持たせる
- Remotion Studio で Week ごとに composition を見つけやすいように Folder 分けする
- Week 03 の `post_log.csv` 予定行と `experiment_backlog.md` 判定条件を追加する

## 5. 品質 gate

各パッケージは、実装前に以下を満たす必要がある。

- 旧テーマ `受験相談メディア` に戻っていない
- 3 レイヤーのどれか 1 つに属している
- YouTube 長尺として登録理由がある
- 短尺は長尺への入口であり、別テーマ化していない
- 医療助言、診断、治療判断に見える表現がない
- AI が主役化していない
- 相談導線が主目的になっていない
- 次に見る長尺が 1 つ以上示されている
