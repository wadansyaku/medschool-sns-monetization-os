# Video OS

`05_video_os/` は、`理系再建ラボ｜医学につながる理系` の動画制作基盤です。
現在は `week_01_subject_allocation.md` を元に、長尺 1 本と短尺 4 本を Remotion で生成できる状態にしています。

## Compositions

- `W01BridgeLong`
  - 1280x720 の横長長尺
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

静止画で確認:

```bash
npx remotion still W01BridgeLong out/w01-long-cover.png --frame=45
npx remotion still W01BridgeShort01 out/w01-short-01.png --frame=60
```

動画を書き出す:

```bash
npx remotion render W01BridgeLong out/w01-long.mp4
npx remotion render W01BridgeShort01 out/w01-short-01.mp4
```

## 方針

- 長尺を主戦場にし、短尺は長尺への入口として作る
- 企画レイヤーを崩さない
- AI は主役ではなく補助線として扱う
- 相談導線は二次目的としてのみ添える
