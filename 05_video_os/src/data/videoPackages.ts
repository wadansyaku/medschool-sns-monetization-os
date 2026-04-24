import { z } from "zod";

const accentSchema = z.enum(["vermilion", "teal", "blue"]);
const layerSchema = z.enum(["高校理系ブリッジ", "医学学習OS", "AI実務"]);
const uiText = (max: number) => z.string().max(max);

const chipSchema = z.object({
  label: uiText(12),
  value: uiText(12),
});

const promiseStepSchema = z.object({
  step: uiText(4),
  text: uiText(32),
});

const thumbnailSchema = z.object({
  headline: uiText(16),
  subhead: uiText(30),
  chips: z.array(uiText(10)).min(1).max(3),
  reasons: z.array(uiText(18)).min(1).max(3),
});

export const LongformSceneSchema = z.object({
  headline: uiText(34),
  eyebrow: uiText(16),
  bullets: z.array(uiText(34)).min(1).max(3),
  metric: uiText(24),
  role: uiText(40),
  accent: accentSchema,
});

export const LongformVideoSchema = z.object({
  id: z.string(),
  weekNumber: z.number(),
  weekLabel: uiText(8),
  layer: layerSchema,
  sourcePath: z.string(),
  title: uiText(24),
  subtitle: uiText(36),
  kicker: uiText(24),
  promise: uiText(28),
  cta: uiText(42),
  nextVideoLabel: uiText(32),
  focusChips: z.array(chipSchema).min(1).max(3),
  promiseSteps: z.array(promiseStepSchema).min(1).max(3),
  thumbnail: thumbnailSchema,
  scenes: z.array(LongformSceneSchema).min(1).max(8),
});

export const ShortScriptSchema = z.object({
  id: z.string(),
  weekLabel: uiText(8),
  layer: layerSchema,
  sourcePath: z.string(),
  parentLongformId: z.string(),
  label: uiText(10),
  hook: uiText(36),
  points: z.array(uiText(32)).min(1).max(2),
  close: uiText(38),
  role: uiText(32),
  takeaway: uiText(28),
  contextChips: z.array(uiText(10)).min(1).max(3),
  conclusionChips: z.array(uiText(12)).min(1).max(3),
  sequenceSteps: z.array(uiText(14)).min(1).max(3),
  accent: accentSchema,
});

const compositionIdsSchema = z.object({
  longform: z.string(),
  thumbnail: z.string(),
  shorts: z.array(z.string()).length(4),
});

export const VideoPackageSchema = z.object({
  slug: z.string(),
  sourcePath: z.string(),
  compositionIds: compositionIdsSchema,
  longform: LongformVideoSchema,
  shorts: z.array(ShortScriptSchema).length(4),
});

export type Accent = z.infer<typeof accentSchema>;
export type ContentLayer = z.infer<typeof layerSchema>;
export type LongformScene = z.infer<typeof LongformSceneSchema>;
export type LongformVideo = z.infer<typeof LongformVideoSchema>;
export type ShortScript = z.infer<typeof ShortScriptSchema>;
export type VideoPackage = z.infer<typeof VideoPackageSchema>;

export const LONGFORM_FPS = 30;
export const LONGFORM_INTRO_FRAMES = 300;
export const LONGFORM_SCENE_FRAMES = 360;
export const LONGFORM_OUTRO_FRAMES = 150;
export const SHORT_FPS = 30;
export const SHORT_DURATION = 12 * SHORT_FPS;

export const getLongformDuration = (video: LongformVideo) => {
  return (
    LONGFORM_INTRO_FRAMES +
    video.scenes.length * LONGFORM_SCENE_FRAMES +
    LONGFORM_OUTRO_FRAMES
  );
};

const week01Source = "02_content_os/packages/week_01_subject_allocation.md";
const week02Source = "02_content_os/packages/week_02_math_bias.md";
const week03Source =
  "02_content_os/packages/week_03_study_os_before_memorization.md";

export const week01Longform: LongformVideo = {
  id: "W01BridgeLong",
  weekNumber: 1,
  weekLabel: "Week 01",
  layer: "高校理系ブリッジ",
  sourcePath: week01Source,
  title: "理系再建は配分から始まる",
  subtitle: "数学・物理・化学をつなぎ直す最初の1週間",
  kicker: "高校理系ブリッジ / Week 01",
  promise: "努力不足ではなく設計不足を見せる",
  cta: "まずは長尺で理解をつなぎ、次の長尺へ進める状態を作る。",
  nextVideoLabel: "次回: 数学だけやると理系が崩れる理由",
  focusChips: [
    { label: "整理軸", value: "配分" },
    { label: "見直すもの", value: "接続" },
    { label: "次に残すもの", value: "回遊" },
  ],
  promiseSteps: [
    { step: "01", text: "数学・物理・化学の接続を回復する" },
    { step: "02", text: "登録理由になる導入テーマを作る" },
    { step: "03", text: "次の長尺へ回遊させる" },
  ],
  thumbnail: {
    headline: "崩れる原因は配分",
    subhead: "努力不足じゃない。最初の1週間で立て直す。",
    chips: ["配分", "接続", "回遊"],
    reasons: [
      "理系でつまずく人向け",
      "最初の1週間で立て直す",
      "次の長尺までつながる",
    ],
  },
  scenes: [
    {
      eyebrow: "Problem",
      headline: "勉強量があっても理系がつながらない理由",
      bullets: [
        "原因はやる気不足より全体最適の欠如",
        "得意科目の快感で時間配分が歪みやすい",
        "配分が崩れると理解の接続も切れやすい",
      ],
      metric: "Focus 01 / 全体最適",
      role: "努力量ではなく配分の崩れを見せる",
      accent: "vermilion",
    },
    {
      eyebrow: "Bridge",
      headline: "最初に点検すべきは科目ごとの役割とつながり",
      bullets: [
        "数学・物理・化学を別科目ではなく連動した理解で見る",
        "どこで詰まるかを科目別に切り分ける",
        "週単位で役割を分けると崩れにくい",
      ],
      metric: "Focus 02 / 接続点",
      role: "科目を分断せず、つながりで見直す",
      accent: "teal",
    },
    {
      eyebrow: "Trap",
      headline: "数学だけやる人が失速する",
      bullets: [
        "安心感のある得意科目に時間が逃げる",
        "理科の回収コストが後半で一気に重くなる",
        "均等配分より止血する順番の設計が先",
      ],
      metric: "Focus 03 / 数学偏重",
      role: "Week 02 へ回遊する失速パターンを残す",
      accent: "blue",
    },
    {
      eyebrow: "Template",
      headline: "最初の1週間は目的で時間を切る",
      bullets: [
        "弱点回収 / 得点源維持 / 復盤の3役割に分ける",
        "平日は理解の再接続、休日は補正に使う",
        "参考書追加や反省だけで終わる週を避ける",
      ],
      metric: "Focus 04 / 週間設計",
      role: "今週の行動へ落ちる配分テンプレを出す",
      accent: "vermilion",
    },
    {
      eyebrow: "Next",
      headline: "医学につながる理解へ進む次の一歩",
      bullets: [
        "全部を均等にやるより順番を決める",
        "理解をつなぐ長尺を軸に次の動画へ回遊させる",
        "個別整理は二次導線としてのみ置く",
      ],
      metric: "Focus 05 / Next Step",
      role: "長尺回遊を主目的にして締める",
      accent: "teal",
    },
  ],
};

export const week01Shorts: ShortScript[] = [
  {
    id: "W01BridgeShort01",
    weekLabel: "Week 01",
    layer: "高校理系ブリッジ",
    sourcePath: week01Source,
    parentLongformId: "W01BridgeLong",
    label: "Short 01",
    hook: "理系が崩れる人が最初に間違えるのは、参考書選びではなく順番です",
    points: [
      "最初に決めるべきは今週どの科目を立て直すか",
      "全科目を均等に回すと弱点が放置される",
    ],
    close: "配分を見直したい人は保存。全体像は長尺へ。",
    role: "長尺へ入る前に、論点を1つだけ鮮明にする",
    takeaway: "保存して、長尺で全体像へ進む",
    contextChips: ["高校理系ブリッジ", "長尺入口", "保存向き"],
    conclusionChips: ["配分を先に決める", "均等配分しない", "長尺で全体像へ"],
    sequenceSteps: ["1. 配分を決める", "2. 弱点を放置しない", "3. 長尺で接続する"],
    accent: "vermilion",
  },
  {
    id: "W01BridgeShort02",
    weekLabel: "Week 01",
    layer: "高校理系ブリッジ",
    sourcePath: week01Source,
    parentLongformId: "W01BridgeLong",
    label: "Short 02",
    hook: "数学だけやると、理系はむしろ崩れます",
    points: [
      "得意科目の安心感で理科の立て直しが遅れる",
      "全体最適を見ない勉強は後半で失速する",
    ],
    close: "同じ失敗を避けたい人は長尺も見てください。",
    role: "Week 02 に続く失敗パターンを切り出す",
    takeaway: "数学偏重を疑い、長尺で全体配分へ戻る",
    contextChips: ["高校理系ブリッジ", "失敗例", "長尺入口"],
    conclusionChips: ["数学だけに逃げない", "理科を止めない", "全体最適へ戻る"],
    sequenceSteps: ["1. 安心感を疑う", "2. 理科の停止を見る", "3. 長尺で配分へ戻る"],
    accent: "blue",
  },
  {
    id: "W01BridgeShort03",
    weekLabel: "Week 01",
    layer: "高校理系ブリッジ",
    sourcePath: week01Source,
    parentLongformId: "W01BridgeLong",
    label: "Short 03",
    hook: "1日3時間しかないなら、全部触るよりつなぎ方を決めてください",
    points: [
      "制約が強いほど目的別に時間を切る",
      "弱点回収と得点源維持を同時に管理する",
    ],
    close: "時間が足りない人は保存。続きは長尺へ。",
    role: "時間制約がある人に配分の必要性を見せる",
    takeaway: "全部触るより、目的別に時間を切る",
    contextChips: ["高校理系ブリッジ", "時間制約", "保存向き"],
    conclusionChips: ["目的で切る", "弱点を回収する", "得点源を維持する"],
    sequenceSteps: ["1. 使える時間を見る", "2. 目的を分ける", "3. 長尺で設計する"],
    accent: "teal",
  },
  {
    id: "W01BridgeShort04",
    weekLabel: "Week 01",
    layer: "高校理系ブリッジ",
    sourcePath: week01Source,
    parentLongformId: "W01BridgeLong",
    label: "Short 04",
    hook: "理系再建は全部やるより、落とさないを先に作った人が進みます",
    points: [
      "失点の多い単元を止血する方が先",
      "努力量の追加より穴を埋める順番が重要",
    ],
    close: "失点パターンを整理したい人は保存。",
    role: "行動変化として、穴を埋める順番を残す",
    takeaway: "落とさない単元を先に作る",
    contextChips: ["高校理系ブリッジ", "行動変化", "保存向き"],
    conclusionChips: ["止血を先に置く", "穴を順番に埋める", "長尺で設計する"],
    sequenceSteps: ["1. 失点を見る", "2. 止血する", "3. 配分へ戻す"],
    accent: "vermilion",
  },
];

export const week02Longform: LongformVideo = {
  id: "W02BridgeLong",
  weekNumber: 2,
  weekLabel: "Week 02",
  layer: "高校理系ブリッジ",
  sourcePath: week02Source,
  title: "数学だけやると理系は崩れる",
  subtitle: "得意科目の安心感から、物理・化学を止めない1週間へ",
  kicker: "高校理系ブリッジ / Week 02",
  promise: "数学を削るのではなく、役割を変える",
  cta: "まずは長尺で、数学偏重がどこで理科の遅れに変わるかを整理してください。",
  nextVideoLabel: "次回: 暗記の前に学習OSを作る",
  focusChips: [
    { label: "疑うもの", value: "安心感" },
    { label: "止めないもの", value: "理科" },
    { label: "変えるもの", value: "役割" },
  ],
  promiseSteps: [
    { step: "01", text: "数学偏重が生む後半失速を見える化する" },
    { step: "02", text: "物理・化学を完全停止させない設計に変える" },
    { step: "03", text: "次の学習OS回へ自然に接続する" },
  ],
  thumbnail: {
    headline: "数学だけは危険",
    subhead: "得意科目に逃げると、理科が止まる。",
    chips: ["数学偏重", "理科停止", "接続"],
    reasons: [
      "数学に逃げる人向け",
      "物理・化学を止めない",
      "次の学習OSへつながる",
    ],
  },
  scenes: [
    {
      eyebrow: "Problem",
      headline: "数学をやっているのに理系全体が伸びない理由",
      bullets: [
        "数学の演習量だけでは理科の未処理は消えない",
        "科目単体の達成感と理系全体の安定は別物",
        "止まっている科目を見る方が立て直しは早い",
      ],
      metric: "Focus 01 / 数学偏重",
      role: "努力しているのに崩れる構造を示す",
      accent: "blue",
    },
    {
      eyebrow: "Trap",
      headline: "得意科目の安心感が時間配分を歪める",
      bullets: [
        "得意科目は勉強した感覚を作りやすい",
        "安心感が強いほど弱点科目の停止に気づきにくい",
        "数学の快感で物理・化学の遅れが見えなくなる",
      ],
      metric: "Focus 02 / 安心感",
      role: "数学を逃げ場にしない視点へ切り替える",
      accent: "vermilion",
    },
    {
      eyebrow: "Bridge",
      headline: "物理・化学を後回しにすると回収コストが重くなる",
      bullets: [
        "理科は理解と記憶の両方を回収する必要がある",
        "週末だけの回収では接続が切れやすい",
        "停止時間には後からコストがつく",
      ],
      metric: "Focus 03 / 理科停止",
      role: "理科をゼロにしない理由を長尺で補強する",
      accent: "teal",
    },
    {
      eyebrow: "Template",
      headline: "数学の役割を演習量から接続へ変える",
      bullets: [
        "数学は物理・化学で使う見方を支える道具にする",
        "難問量より、理科へ接続する基礎の確認を残す",
        "得意科目の快感ではなく、全体最適で扱う",
      ],
      metric: "Focus 04 / 役割変更",
      role: "数学を削らず、役割を再定義する",
      accent: "blue",
    },
    {
      eyebrow: "Template",
      headline: "1週間の中で数学・物理・化学を止めない配分",
      bullets: [
        "平日も理科の確認枠を短く残す",
        "週末は遅れの回収ではなく補正日にする",
        "数学は得意分野だけでなく接続論点に使う",
      ],
      metric: "Focus 05 / 週間配分",
      role: "今週すぐ試せる配分へ落とす",
      accent: "vermilion",
    },
    {
      eyebrow: "Trap",
      headline: "やってはいけない数学偏重パターン",
      bullets: [
        "難問数学だけに時間を吸われる",
        "得意分野だけで勉強した気になる",
        "理科を週末だけに押し込む",
      ],
      metric: "Focus 06 / 禁止パターン",
      role: "視聴者が自分の配分を点検できる形にする",
      accent: "teal",
    },
    {
      eyebrow: "Next",
      headline: "次は暗記の前に学習OSを作る",
      bullets: [
        "科目配分を直したら、復習と記録の型が必要になる",
        "暗記量を増やす前に、戻る場所を作る",
        "次の長尺で医学学習OSへ橋をかける",
      ],
      metric: "Focus 07 / Next Step",
      role: "高校理系ブリッジから医学学習OSへ回遊させる",
      accent: "blue",
    },
  ],
};

export const week02Shorts: ShortScript[] = [
  {
    id: "W02BridgeShort01",
    weekLabel: "Week 02",
    layer: "高校理系ブリッジ",
    sourcePath: week02Source,
    parentLongformId: "W02BridgeLong",
    label: "Short 01",
    hook: "数学だけ増やしても、理系は安定しません",
    points: [
      "数学の達成感だけでは理科の穴は埋まらない",
      "勉強量より、止めている科目を見た方が早い",
    ],
    close: "数学偏重に心当たりがある人は、長尺で全体像を確認してください。",
    role: "数学偏重の危険を長尺入口として見せる",
    takeaway: "止めている科目を先に見る",
    contextChips: ["高校理系ブリッジ", "数学偏重", "長尺入口"],
    conclusionChips: ["数学だけにしない", "理科の穴を見る", "長尺で修正する"],
    sequenceSteps: ["1. 達成感を疑う", "2. 停止科目を見る", "3. 長尺で組み直す"],
    accent: "blue",
  },
  {
    id: "W02BridgeShort02",
    weekLabel: "Week 02",
    layer: "高校理系ブリッジ",
    sourcePath: week02Source,
    parentLongformId: "W02BridgeLong",
    label: "Short 02",
    hook: "得意科目を逃げ場にすると、理科の回収が重くなります",
    points: [
      "得意科目は勉強した感覚を作りやすい",
      "弱点科目の停止時間は後半で利息のように重くなる",
    ],
    close: "安心感ではなく、理系全体の接続で配分を見直してください。",
    role: "得意科目の安心感という失敗例を切り出す",
    takeaway: "安心感より接続を見る",
    contextChips: ["高校理系ブリッジ", "失敗例", "保存向き"],
    conclusionChips: ["逃げ場にしない", "理科を止めない", "接続で見る"],
    sequenceSteps: ["1. 安心感を分ける", "2. 停止時間を見る", "3. 配分へ戻る"],
    accent: "vermilion",
  },
  {
    id: "W02BridgeShort03",
    weekLabel: "Week 02",
    layer: "高校理系ブリッジ",
    sourcePath: week02Source,
    parentLongformId: "W02BridgeLong",
    label: "Short 03",
    hook: "時間が少ない週ほど、物理・化学をゼロにしないでください",
    points: [
      "短くても確認枠を残すと接続が切れにくい",
      "週末だけ理科を回収する設計は崩れやすい",
    ],
    close: "今週の配分を作る前に、止めない科目を決めてください。",
    role: "時間制約の中でも理科停止を防ぐ",
    takeaway: "短くても確認枠を残す",
    contextChips: ["高校理系ブリッジ", "時間制約", "理科停止防止"],
    conclusionChips: ["理科をゼロにしない", "確認枠を残す", "週末頼みにしない"],
    sequenceSteps: ["1. ゼロにしない", "2. 確認枠を残す", "3. 週末で補正する"],
    accent: "teal",
  },
  {
    id: "W02BridgeShort04",
    weekLabel: "Week 02",
    layer: "高校理系ブリッジ",
    sourcePath: week02Source,
    parentLongformId: "W02BridgeLong",
    label: "Short 04",
    hook: "数学を減らす話ではなく、数学の役割を変える話です",
    points: [
      "数学は理科を支える見方として残す",
      "得意科目の快感より、弱点との接続を優先する",
    ],
    close: "続きは長尺で、1週間の組み方まで整理します。",
    role: "行動変化として、数学の使い方を変える",
    takeaway: "数学を接続の道具に変える",
    contextChips: ["高校理系ブリッジ", "行動変化", "長尺入口"],
    conclusionChips: ["数学を削らない", "役割を変える", "理科へ接続する"],
    sequenceSteps: ["1. 減らす話にしない", "2. 役割を変える", "3. 長尺で配分する"],
    accent: "blue",
  },
];

export const week03Longform: LongformVideo = {
  id: "W03StudyLong",
  weekNumber: 3,
  weekLabel: "Week 03",
  layer: "医学学習OS",
  sourcePath: week03Source,
  title: "暗記の前に学習OSを作る",
  subtitle: "覚える量を増やす前に、戻る場所と復習の型を整える",
  kicker: "医学学習OS / Week 03",
  promise: "暗記量ではなく、戻る場所を設計する",
  cta: "まずは長尺で、暗記量を増やす前に戻る場所と復習の型を作ってください。",
  nextVideoLabel: "次回: 物理が苦手な人の理解停止ポイント",
  focusChips: [
    { label: "先に作るもの", value: "OS" },
    { label: "戻る場所", value: "復習" },
    { label: "分けるもの", value: "間違い" },
  ],
  promiseSteps: [
    { step: "01", text: "暗記量で押し切る前に崩れる構造を見せる" },
    { step: "02", text: "間違いを分類し、戻る場所を作る" },
    { step: "03", text: "次の具体科目へ学習OSを接続する" },
  ],
  thumbnail: {
    headline: "暗記の前にOS",
    subhead: "覚える量より、戻る場所を作る。",
    chips: ["学習OS", "復習", "分類"],
    reasons: [
      "復習が積み残る人向け",
      "戻る場所を作る",
      "次の具体科目へつながる",
    ],
  },
  scenes: [
    {
      eyebrow: "Problem",
      headline: "暗記量を増やしても崩れる理由",
      bullets: [
        "覚える量を増やしても、戻る場所がないと積み残る",
        "忘れた時に戻れないと、毎回最初からやり直しになる",
        "原因を全部暗記不足にすると復習が重くなる",
      ],
      metric: "Focus 01 / 暗記偏重",
      role: "記憶力ではなく設計不足として問題を見せる",
      accent: "teal",
    },
    {
      eyebrow: "Bridge",
      headline: "学習OSとは戻る場所を決めること",
      bullets: [
        "きれいな予定表より、崩れた時に戻れる場所が必要",
        "戻るページ、戻る問題、戻る論点を先に決める",
        "忘れても再接続できる状態を作る",
      ],
      metric: "Focus 02 / 戻る場所",
      role: "学習OSを抽象論ではなく運用の型へ落とす",
      accent: "blue",
    },
    {
      eyebrow: "Template",
      headline: "間違いを3種類に分ける",
      bullets: [
        "知識不足は覚える対象を絞る",
        "理解の切断は前の単元や例題へ戻る",
        "運用ミスは次に使う場面を設計する",
      ],
      metric: "Focus 03 / 分類",
      role: "全部を暗記不足にしない復習判断を作る",
      accent: "vermilion",
    },
    {
      eyebrow: "Template",
      headline: "復習を予定ではなく戻る場所として設計する",
      bullets: [
        "復習日はカレンダーだけで決めない",
        "戻る場所が決まると積み残りの正体が見える",
        "短い復習でも、何へ戻るかが明確なら機能する",
      ],
      metric: "Focus 04 / 復習設計",
      role: "時間がない週でも使える復習の入口を作る",
      accent: "teal",
    },
    {
      eyebrow: "Bridge",
      headline: "覚えた知識を次の問題で使える形へ変える",
      bullets: [
        "覚えた直後の安心感と使える状態は別物",
        "次にどの問題で使うかまで決める",
        "医学につながる理解は、使う場面で残りやすい",
      ],
      metric: "Focus 05 / 運用",
      role: "暗記から理解の運用へつなげる",
      accent: "blue",
    },
    {
      eyebrow: "Trap",
      headline: "やってはいけない暗記偏重パターン",
      bullets: [
        "ノートを増やしすぎて戻る場所が散らばる",
        "丸暗記で理解の切断を隠してしまう",
        "復習先送りで忘れた時の回収コストを増やす",
      ],
      metric: "Focus 06 / 禁止パターン",
      role: "復習が重くなる行動を先に切る",
      accent: "vermilion",
    },
    {
      eyebrow: "Next",
      headline: "次は物理の理解停止ポイントへ進む",
      bullets: [
        "学習OSを作ったら、具体科目で止まる場所を見る",
        "物理は公式暗記だけでは接続が切れやすい",
        "次の長尺で理解停止を具体化する",
      ],
      metric: "Focus 07 / Next Step",
      role: "医学学習OSから高校理系ブリッジへ回遊させる",
      accent: "teal",
    },
  ],
};

export const week03Shorts: ShortScript[] = [
  {
    id: "W03StudyShort01",
    weekLabel: "Week 03",
    layer: "医学学習OS",
    sourcePath: week03Source,
    parentLongformId: "W03StudyLong",
    label: "Short 01",
    hook: "暗記量を増やす前に、戻る場所を作ってください",
    points: [
      "復習が積み残る原因は記憶力だけではない",
      "戻る場所がないと、忘れるたびに崩れる",
    ],
    close: "暗記で押し切る前に、長尺で学習OSを確認してください。",
    role: "暗記偏重から学習OSへ視点を切り替える",
    takeaway: "覚える前に、戻る場所を決める",
    contextChips: ["医学学習OS", "長尺入口", "保存向き"],
    conclusionChips: ["戻る場所を作る", "暗記量だけにしない", "長尺でOSへ"],
    sequenceSteps: ["1. 積み残りを見る", "2. 戻る場所を決める", "3. 長尺で設計する"],
    accent: "teal",
  },
  {
    id: "W03StudyShort02",
    weekLabel: "Week 03",
    layer: "医学学習OS",
    sourcePath: week03Source,
    parentLongformId: "W03StudyLong",
    label: "Short 02",
    hook: "全部を暗記不足にすると、復習は重くなります",
    points: [
      "間違いには知識不足、理解の切断、運用ミスがある",
      "分類しないと、全部を覚え直す作業になる",
    ],
    close: "復習が重い人は、まず間違いの種類を分けてください。",
    role: "間違い分類という実行論点を切り出す",
    takeaway: "暗記不足と理解の切断を分ける",
    contextChips: ["医学学習OS", "失敗例", "分類"],
    conclusionChips: ["全部暗記にしない", "3種類に分ける", "復習を軽くする"],
    sequenceSteps: ["1. 間違いを見る", "2. 種類を分ける", "3. 戻る場所へ"],
    accent: "vermilion",
  },
  {
    id: "W03StudyShort03",
    weekLabel: "Week 03",
    layer: "医学学習OS",
    sourcePath: week03Source,
    parentLongformId: "W03StudyLong",
    label: "Short 03",
    hook: "時間がない人ほど、復習日ではなく戻る場所を決めてください",
    points: [
      "予定表だけでは復習は積み残る",
      "戻るページ、戻る問題、戻る論点を先に決める",
    ],
    close: "今週の復習を組む前に、戻る場所を1つ作ってください。",
    role: "時間制約下で使える復習設計を見せる",
    takeaway: "予定日より、戻る場所を固定する",
    contextChips: ["医学学習OS", "時間制約", "復習設計"],
    conclusionChips: ["復習日だけにしない", "戻る場所を決める", "積み残りを減らす"],
    sequenceSteps: ["1. 予定表を見る", "2. 戻る場所を置く", "3. 短く復習する"],
    accent: "blue",
  },
  {
    id: "W03StudyShort04",
    weekLabel: "Week 03",
    layer: "医学学習OS",
    sourcePath: week03Source,
    parentLongformId: "W03StudyLong",
    label: "Short 04",
    hook: "覚えた知識は、次の問題で使えた時に残り始めます",
    points: [
      "覚えた直後の安心感だけでは定着しない",
      "次に使う場面まで設計すると理解が残りやすい",
    ],
    close: "続きは長尺で、復習OSまで整理します。",
    role: "行動変化として、使う場面まで設計する",
    takeaway: "覚えるだけでなく、次に使う",
    contextChips: ["医学学習OS", "行動変化", "長尺入口"],
    conclusionChips: ["使う場面を決める", "安心感で止めない", "復習OSへ"],
    sequenceSteps: ["1. 覚える", "2. 使う場面を決める", "3. 長尺で残す"],
    accent: "teal",
  },
];

export const videoPackages: VideoPackage[] = [
  {
    slug: "week01",
    sourcePath: week01Source,
    compositionIds: {
      longform: "W01BridgeLong",
      thumbnail: "W01BridgeThumbnail",
      shorts: [
        "W01BridgeShort01",
        "W01BridgeShort02",
        "W01BridgeShort03",
        "W01BridgeShort04",
      ],
    },
    longform: week01Longform,
    shorts: week01Shorts,
  },
  {
    slug: "week02",
    sourcePath: week02Source,
    compositionIds: {
      longform: "W02BridgeLong",
      thumbnail: "W02BridgeThumbnail",
      shorts: [
        "W02BridgeShort01",
        "W02BridgeShort02",
        "W02BridgeShort03",
        "W02BridgeShort04",
      ],
    },
    longform: week02Longform,
    shorts: week02Shorts,
  },
  {
    slug: "week03",
    sourcePath: week03Source,
    compositionIds: {
      longform: "W03StudyLong",
      thumbnail: "W03StudyThumbnail",
      shorts: [
        "W03StudyShort01",
        "W03StudyShort02",
        "W03StudyShort03",
        "W03StudyShort04",
      ],
    },
    longform: week03Longform,
    shorts: week03Shorts,
  },
];

export const videoPackagesBySlug = Object.fromEntries(
  videoPackages.map((videoPackage) => [videoPackage.slug, videoPackage]),
) as Record<string, VideoPackage>;
