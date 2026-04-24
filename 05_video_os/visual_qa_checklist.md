# Visual QA Checklist

Remotion の still を見たあと、mp4 書き出し前に確認する。

## 1. サムネ

- 1280x720 で、左側の主見出しが 2 秒で読める
- 右側の `見るべき理由` が折り返しで潰れていない
- `レイヤー` と `次の長尺につながる理由` が見える
- サムネコピーが長尺タイトルの丸写しではない

## 2. 長尺 preview

- cover still で `対象 / 論点 / 結論` のうち 2 つ以上が見える
- core scene で 1 画面 1 主張になっている
- 章ごとの `この章の役割` が正本 package と合っている
- outro で次に見る長尺が明確に出ている
- active layer が週の企画レイヤーと一致している

## 3. Short

- バッジが正しい Week と Short 番号になっている
- context chips がその short 固有の役割を表している
- hook が画面上部だけで完結していない
- 結論チップが Week 01 固定文言のまま残っていない
- 下部 CTA が相談導線ではなく、保存または長尺回遊になっている

## 4. 出力前コマンド

```bash
npm run lint
npm run validate:packages
npm run still:all
```

Week を追加したら `src/data/videoPackages.ts` と `video-packages.manifest.json` を更新し、`npm run list:packages` で composition ID を確認する。
