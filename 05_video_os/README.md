# Video OS

`05_video_os/` は、`理系再建ラボ｜医学につながる理系` の動画制作基盤です。
現在は `week_01_subject_allocation.md` を source of truth にして、長尺 preview 1 本と短尺 4 本を Remotion で生成できる状態にしています。

## Compositions

- `W01BridgeLong`
  - 1280x720 の横長 preview cut
- `W01BridgeShort01`
- `W01BridgeShort02`
- `W01BridgeShort03`
- `W01BridgeShort04`
  - 1080x1920 の縦長短尺

## Commands

```bash
npm install
npm run dev
```

Studio では props schema を通して、長尺や短尺の文言をサイドバーから一時調整できます。
ただし、企画の正本は `02_content_os/packages/` 側に置き、`05_video_os/` は視覚 QA と書き出し層として扱います。

静止画で確認:

```bash
npm run still:long:cover
npm run still:long:scene
npm run still:short01
```

動画を書き出す:

```bash
npm run render:short01
npm run render:long:draft
```

## 方針

- 長尺を主戦場にし、短尺は長尺への入口として作る
- 長尺 preview は本編尺の代替ではなく、構図と情報密度の確認に使う
- 企画レイヤーを崩さない
- AI は主役ではなく補助線として扱う
- 相談導線は二次目的としてのみ添える
- mp4 の前に静止画を見て、最低1回は自己修正する
