import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  AnimatedTextBlock,
  Badge,
  Card,
  ProgressRail,
  VideoShell,
  accentColor,
  palette,
} from "../components/VideoShell";
import {
  LONGFORM_INTRO_FRAMES,
  LONGFORM_OUTRO_FRAMES,
  LONGFORM_SCENE_FRAMES,
  type Accent,
  type ContentLayer,
  type LongformVideo,
} from "../data/videoPackages";

const eyebrowLabelMap: Record<string, string> = {
  Problem: "問題",
  Bridge: "接続",
  Trap: "落とし穴",
  Template: "テンプレ",
  Next: "次へ",
};

const layers: ContentLayer[] = ["高校理系ブリッジ", "医学学習OS", "AI実務"];

export const BridgeLongform: React.FC<LongformVideo> = ({
  kicker,
  title,
  subtitle,
  promise,
  cta,
  nextVideoLabel,
  scenes,
  layer,
  focusChips,
  promiseSteps,
}) => {
  const frame = useCurrentFrame();
  const accent = scenes[0]?.accent ?? "vermilion";
  const totalDuration =
    LONGFORM_INTRO_FRAMES +
    scenes.length * LONGFORM_SCENE_FRAMES +
    LONGFORM_OUTRO_FRAMES;

  return (
    <VideoShell accent={accent}>
      <AbsoluteFill
        style={{
          padding: "56px 64px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Badge text={kicker} accent={accent} />
          <div style={{ width: 360 }}>
            <ProgressRail progress={frame / totalDuration} accent={accent} />
          </div>
        </div>

        <Sequence durationInFrames={LONGFORM_INTRO_FRAMES}>
          <IntroScene
            title={title}
            subtitle={subtitle}
            promise={promise}
            focusChips={focusChips}
            promiseSteps={promiseSteps}
            accent={accent}
          />
        </Sequence>

        {scenes.map((scene, index) => {
          const from = LONGFORM_INTRO_FRAMES + index * LONGFORM_SCENE_FRAMES;
          return (
            <Sequence
              key={scene.headline}
              from={from}
              durationInFrames={LONGFORM_SCENE_FRAMES}
            >
              <ContentScene
                index={index}
                total={scenes.length}
                metric={scene.metric}
                role={scene.role}
                accent={scene.accent}
                eyebrow={scene.eyebrow}
                headline={scene.headline}
                bullets={scene.bullets}
              />
            </Sequence>
          );
        })}

        <Sequence
          from={LONGFORM_INTRO_FRAMES + scenes.length * LONGFORM_SCENE_FRAMES}
          durationInFrames={LONGFORM_OUTRO_FRAMES}
        >
          <OutroScene cta={cta} nextVideoLabel={nextVideoLabel} layer={layer} />
        </Sequence>
      </AbsoluteFill>
    </VideoShell>
  );
};

const IntroScene: React.FC<{
  title: string;
  subtitle: string;
  promise: string;
  focusChips: LongformVideo["focusChips"];
  promiseSteps: LongformVideo["promiseSteps"];
  accent: Accent;
}> = ({ title, subtitle, promise, focusChips, promiseSteps, accent }) => {
  const frame = useCurrentFrame();
  const leftShift = interpolate(frame, [0, 70], [28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const alpha = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.35fr 0.9fr",
        gap: 28,
        flex: 1,
        alignItems: "stretch",
      }}
    >
      <Card accent={accent}>
        <div
          style={{
            opacity: alpha,
            transform: `translateX(${leftShift}px)`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 28,
            height: "100%",
          }}
        >
          <div style={{ display: "grid", gap: 22 }}>
            <div
              style={{
                fontSize: 26,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: palette.mutedInk,
                fontWeight: 700,
              }}
            >
              理系再建ラボ｜医学につながる理系
            </div>
            <div
              style={{
                fontSize: 94,
                lineHeight: 0.96,
                letterSpacing: "-0.06em",
                fontWeight: 950,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 38,
                lineHeight: 1.35,
                color: palette.mutedInk,
                fontWeight: 600,
                maxWidth: 720,
              }}
            >
              {subtitle}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${focusChips.length}, minmax(0, 1fr))`,
              gap: 16,
            }}
          >
            {focusChips.map((item, index) => (
              <div
                key={item.label}
                style={{
                  padding: "20px 22px",
                  borderRadius: 24,
                  backgroundColor:
                    index === 0
                      ? `${accentColor(accent)}16`
                      : "rgba(255, 253, 248, 0.7)",
                  border: `2px solid ${
                    index === 0
                      ? `${accentColor(accent)}30`
                      : "rgba(18, 23, 35, 0.08)"
                  }`,
                  display: "grid",
                  gap: 8,
                }}
              >
                <div
                  style={{
                    fontSize: 18,
                    letterSpacing: "0.1em",
                    color: palette.mutedInk,
                    fontWeight: 800,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 34,
                    lineHeight: 1.05,
                    fontWeight: 900,
                    letterSpacing: "-0.05em",
                  }}
                >
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card accent="teal">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 20,
            height: "100%",
          }}
        >
          <div style={{ display: "grid", gap: 18 }}>
            <div
              style={{
                fontSize: 20,
                letterSpacing: "0.08em",
                color: accentColor("teal"),
                fontWeight: 900,
              }}
            >
              今回の約束
            </div>
            <div
              style={{
                fontSize: 44,
                lineHeight: 1.18,
                fontWeight: 800,
              }}
            >
              {promise}
            </div>
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            {promiseSteps.map((item) => (
              <div
                key={item.step}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "18px 20px",
                  borderRadius: 22,
                  backgroundColor: "rgba(255, 253, 248, 0.72)",
                  border: "2px solid rgba(18, 23, 35, 0.08)",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 999,
                    backgroundColor: `${accentColor("teal")}18`,
                    color: accentColor("teal"),
                    display: "grid",
                    placeItems: "center",
                    fontSize: 22,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </div>
                <div
                  style={{
                    fontSize: 25,
                    lineHeight: 1.38,
                    color: palette.mutedInk,
                    fontWeight: 700,
                  }}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              padding: "18px 20px",
              borderRadius: 22,
              backgroundColor: `${accentColor("teal")}12`,
              border: `2px solid ${accentColor("teal")}22`,
              fontSize: 21,
              lineHeight: 1.3,
              color: palette.mutedInk,
              fontWeight: 700,
            }}
          >
            この preview では、登録理由と次の長尺への流れが見えるかを
            先に確認します。
          </div>
        </div>
      </Card>
    </div>
  );
};

const ContentScene: React.FC<{
  index: number;
  total: number;
  metric: string;
  role: string;
  accent: Accent;
  eyebrow: string;
  headline: string;
  bullets: string[];
}> = ({ index, total, metric, role, accent, eyebrow, headline, bullets }) => {
  const eyebrowLabel = eyebrowLabelMap[eyebrow] ?? eyebrow;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.15fr 0.85fr",
        gap: 28,
        flex: 1,
      }}
    >
      <Card accent={accent}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            gap: 26,
          }}
        >
          <AnimatedTextBlock
            eyebrow={eyebrowLabel}
            headline={headline}
            bullets={bullets}
            accent={accent}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: 16,
            }}
          >
            <div
              style={{
                padding: "18px 20px",
                borderRadius: 22,
                backgroundColor: `${accentColor(accent)}14`,
                border: `2px solid ${accentColor(accent)}24`,
                display: "grid",
                gap: 6,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: "0.08em",
                  color: palette.mutedInk,
                  fontWeight: 800,
                }}
              >
                視点
              </div>
              <div
                style={{
                  fontSize: 28,
                  lineHeight: 1.1,
                  fontWeight: 900,
                }}
              >
                {eyebrowLabel}
              </div>
            </div>
            <div
              style={{
                padding: "18px 20px",
                borderRadius: 22,
                backgroundColor: "rgba(255, 253, 248, 0.76)",
                border: "2px solid rgba(18, 23, 35, 0.08)",
                display: "grid",
                gap: 6,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  letterSpacing: "0.08em",
                  color: palette.mutedInk,
                  fontWeight: 800,
                }}
              >
                この章の役割
              </div>
              <div
                style={{
                  fontSize: 24,
                  lineHeight: 1.18,
                  fontWeight: 800,
                }}
              >
                {role}
              </div>
            </div>
          </div>
        </div>
      </Card>
      <Card accent={accent}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div style={{ display: "grid", gap: 18 }}>
            <div
              style={{
                fontSize: 20,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: accentColor(accent),
                fontWeight: 900,
              }}
            >
              {metric}
            </div>
            <div
              style={{
                fontSize: 110,
                lineHeight: 0.9,
                fontWeight: 950,
                letterSpacing: "-0.08em",
              }}
            >
              {String(index + 1).padStart(2, "0")}
            </div>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {["削る", "残す", "次へ回す"].map((item, itemIndex) => (
              <div
                key={item}
                style={{
                  padding: "14px 18px",
                  borderRadius: 18,
                  backgroundColor:
                    itemIndex === index % 3
                      ? `${accentColor(accent)}18`
                      : "rgba(18, 23, 35, 0.05)",
                  color:
                    itemIndex === index % 3
                      ? accentColor(accent)
                      : palette.mutedInk,
                  fontSize: 24,
                  fontWeight: 800,
                  letterSpacing: "0.03em",
                }}
              >
                {item}
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gap: 16 }}>
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.35,
                color: palette.mutedInk,
                fontWeight: 700,
              }}
            >
              この章では「何を削り、何を残すか」を明確にして、
              長尺の中で理解の接続点を1つ回復させます。
            </div>
            <ProgressRail progress={(index + 1) / total} accent={accent} />
          </div>
        </div>
      </Card>
    </div>
  );
};

const OutroScene: React.FC<{
  cta: string;
  nextVideoLabel: string;
  layer: ContentLayer;
}> = ({ cta, nextVideoLabel, layer }) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 0.7fr",
        gap: 28,
        flex: 1,
      }}
    >
      <Card accent="teal">
        <div
          style={{
            opacity: fade,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 24,
            height: "100%",
          }}
        >
          <div
            style={{
              fontSize: 24,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accentColor("teal"),
              fontWeight: 900,
            }}
          >
            次に見る長尺
          </div>
          <div
            style={{
              fontSize: 58,
              lineHeight: 1.08,
              fontWeight: 950,
              letterSpacing: "-0.06em",
            }}
          >
            {nextVideoLabel}
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.4,
              color: palette.mutedInk,
              fontWeight: 600,
              maxWidth: 780,
            }}
          >
            {cta}
          </div>
        </div>
      </Card>
      <Card accent="vermilion">
        <div
          style={{
            height: "100%",
            display: "grid",
            gap: 18,
            alignContent: "center",
          }}
        >
          {layers.map((item) => {
            const isActive = item === layer;
            return (
              <div
                key={item}
                style={{
                  padding: "20px 22px",
                  borderRadius: 24,
                  backgroundColor: isActive
                    ? `${accentColor("vermilion")}18`
                    : "rgba(18, 23, 35, 0.05)",
                  fontSize: 28,
                  fontWeight: 800,
                  color: isActive ? accentColor("vermilion") : palette.mutedInk,
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
