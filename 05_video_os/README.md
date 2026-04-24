# Video OS

`05_video_os/` は、`理系再建ラボ｜医学につながる理系` の動画制作基盤です。
現在は `02_content_os/packages/` を source of truth にして、Week 01-03 の長尺 preview、サムネ、短尺 4 本を Remotion で生成できる状態にしています。

## Compositions

- `W01BridgeThumbnail`
  - 1280x720 の長尺サムネ専用 still
- `W01BridgeLong`
  - 1280x720 の横長 preview cut
- `W01BridgeShort01`
- `W01BridgeShort02`
- `W01BridgeShort03`
- `W01BridgeShort04`
  - 1080x1920 の縦長短尺
- `W02BridgeThumbnail`
- `W02BridgeLong`
- `W02BridgeShort01` - `W02BridgeShort04`
  - Week 02 `数学偏重の修正` パッケージ
- `W03StudyThumbnail`
- `W03StudyLong`
- `W03StudyShort01` - `W03StudyShort04`
  - Week 03 `暗記の前に学習OS` パッケージ

## Commands

```bash
npm install
npm run dev
```

Studio では props schema を通して、長尺や短尺の文言をサイドバーから一時調整できます。
ただし、企画の正本は `02_content_os/packages/` 側に置き、`05_video_os/` は視覚 QA と書き出し層として扱います。

静止画で確認:

```bash
npm run still:thumbnail
npm run still:long:cover
npm run still:long:scene
npm run still:short01
npm run still:week01
npm run still:week02
npm run still:week03
npm run still:all
```

動画を書き出す:

```bash
npm run render:short01
npm run render:long:draft
npm run render:week01
npm run render:week02
npm run render:week03
```

企画と動画 props の最低限の整合性を確認:

```bash
npm run validate:packages
npm run list:packages
```

## 方針

- 長尺を主戦場にし、短尺は長尺への入口として作る
- 長尺 preview は本編尺の代替ではなく、構図と情報密度の確認に使う
- 企画レイヤーを崩さない
- AI は主役ではなく補助線として扱う
- 相談導線は二次目的としてのみ添える
- mp4 の前に静止画を見て、最低1回は自己修正する
- `src/data/videoPackages.ts` の registry から composition を生成し、Week 固定文言を component 側へ直書きしない
- `video-packages.manifest.json` を still / render / validation の manifest として使い、script 側で Week 情報を二重管理しない
- `BridgeShort` のバッジ、結論チップ、順番チップは各 short の props から出す
- `BridgeThumbnail` は package 側のサムネコピーを使い、長尺タイトルをそのまま流し込まない

## 競合ベンチマーク

- 冒頭 3 秒で `対象 / 論点 / 結論` のどれか 2 つ以上が見えること
- 顔出しをしない分、`太いタイポグラフィ` `チップ` `番号付き要点` で視線を止めること
- 画面の下半分を空けすぎず、`この short の役割` や `次に見る長尺` を置いて文脈を残すこと
- 長尺 cover still で、単発知識ではなく `シリーズ導線` が見えること
- 1 画面 1 主張を守り、競合のように訴求を詰め込みすぎないこと

## Visual QA

- still 書き出し後は `visual_qa_checklist.md` を使って、サムネ、長尺 preview、short の順に確認する
- Week 固定文言の混入、文字詰まり、CTA 過多を見つけたら、mp4 の前に props か component を直す
