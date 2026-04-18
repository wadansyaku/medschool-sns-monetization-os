export type LongformScene = {
  headline: string;
  eyebrow: string;
  bullets: string[];
  metric: string;
  accent: "vermilion" | "teal" | "blue";
};

export type ShortScript = {
  id: string;
  label: string;
  hook: string;
  points: string[];
  close: string;
  accent: "vermilion" | "teal" | "blue";
};

export const week01Longform = {
  id: "W01BridgeLong",
  title: "理系再建は配分から始まる",
  subtitle: "数学・物理・化学をつなぎ直す最初の1週間",
  kicker: "高校理系ブリッジ / Week 01",
  promise: "努力不足ではなく設計不足を見せる",
  cta: "まずは長尺で理解をつないで、必要なら次の導線へ。",
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
      accent: "teal",
    },
  ] satisfies LongformScene[],
};

export const week01Shorts: ShortScript[] = [
  {
    id: "W01BridgeShort01",
    label: "Short 01",
    hook: "理系が崩れる人が最初に間違えるのは、参考書選びではなく順番です",
    points: [
      "最初に決めるべきは今週どの科目を立て直すか",
      "全科目を均等に回すと弱点が放置される",
    ],
    close: "配分を見直したい人は保存。全体像は長尺へ。",
    accent: "vermilion",
  },
  {
    id: "W01BridgeShort02",
    label: "Short 02",
    hook: "数学だけやると、理系はむしろ崩れます",
    points: [
      "得意科目の安心感で理科の立て直しが遅れる",
      "全体最適を見ない勉強は後半で失速する",
    ],
    close: "同じ失敗を避けたい人は長尺も見てください。",
    accent: "blue",
  },
  {
    id: "W01BridgeShort03",
    label: "Short 03",
    hook: "1日3時間しかないなら、全部触るよりつなぎ方を決めてください",
    points: [
      "制約が強いほど目的別に時間を切る",
      "弱点回収と得点源維持を同時に管理する",
    ],
    close: "時間が足りない人は保存。続きは長尺へ。",
    accent: "teal",
  },
  {
    id: "W01BridgeShort04",
    label: "Short 04",
    hook: "理系再建は全部やるより、落とさないを先に作った人が進みます",
    points: [
      "失点の多い単元を止血する方が先",
      "努力量の追加より穴を埋める順番が重要",
    ],
    close: "失点パターンを整理したい人は保存。",
    accent: "vermilion",
  },
];

export const LONGFORM_FPS = 30;
export const LONGFORM_DURATION = 75 * LONGFORM_FPS;
export const SHORT_FPS = 30;
export const SHORT_DURATION = 12 * SHORT_FPS;
