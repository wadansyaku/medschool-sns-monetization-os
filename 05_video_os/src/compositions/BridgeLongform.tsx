import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { AnimatedTextBlock, Badge, Card, ProgressRail, VideoShell, accentColor, palette } from "../components/VideoShell";
import { LONGFORM_DURATION } from "../data/week01";
import type { LongformVideo } from "../data/week01";

const sceneDuration = 360;
const introDuration = 300;
const outroDuration = 150;

export const BridgeLongform: React.FC<LongformVideo> = ({
  kicker,
  title,
  subtitle,
  promise,
  cta,
  nextVideoLabel,
  scenes,
}) => {
  const frame = useCurrentFrame();

  return (
    <VideoShell accent="vermilion">
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
          <Badge text={kicker} accent="vermilion" />
          <div
            style={{
              width: 360,
            }}
          >
            <ProgressRail
              progress={frame / LONGFORM_DURATION}
              accent="vermilion"
            />
          </div>
        </div>

        <Sequence durationInFrames={introDuration}>
          <IntroScene title={title} subtitle={subtitle} promise={promise} />
        </Sequence>

        {scenes.map((scene, index) => {
          const from = introDuration + index * sceneDuration;
          return (
            <Sequence key={scene.headline} from={from} durationInFrames={sceneDuration}>
              <ContentScene
                index={index}
                total={scenes.length}
                metric={scene.metric}
                accent={scene.accent}
                eyebrow={scene.eyebrow}
                headline={scene.headline}
                bullets={scene.bullets}
              />
            </Sequence>
          );
        })}

        <Sequence
          from={introDuration + scenes.length * sceneDuration}
          durationInFrames={outroDuration}
        >
          <OutroScene cta={cta} nextVideoLabel={nextVideoLabel} />
        </Sequence>
      </AbsoluteFill>
    </VideoShell>
  );
};

const IntroScene: React.FC<{
  title: string;
  subtitle: string;
  promise: string;
}> = ({ title, subtitle, promise }) => {
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
      <Card accent="vermilion">
        <div
          style={{
            opacity: alpha,
            transform: `translateX(${leftShift}px)`,
            display: "flex",
            flexDirection: "column",
            gap: 22,
            height: "100%",
          }}
        >
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
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <div
              style={{
                fontSize: 20,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: accentColor("teal"),
                fontWeight: 900,
              }}
            >
              Promise
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
          <div
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            {[
              "数学・物理・化学の接続を回復する",
              "登録理由になる導入テーマを作る",
              "次の長尺へ回遊させる",
            ].map((item) => (
              <div
                key={item}
                style={{
                  fontSize: 26,
                  lineHeight: 1.4,
                  color: palette.mutedInk,
                  display: "flex",
                  gap: 14,
                }}
              >
                <span
                  style={{
                    width: 12,
                    height: 12,
                    marginTop: 12,
                    borderRadius: 999,
                    backgroundColor: accentColor("teal"),
                    flexShrink: 0,
                  }}
                />
                {item}
              </div>
            ))}
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
  accent: "vermilion" | "teal" | "blue";
  eyebrow: string;
  headline: string;
  bullets: string[];
}> = ({ index, total, metric, accent, eyebrow, headline, bullets }) => {
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
        <AnimatedTextBlock
          eyebrow={eyebrow}
          headline={headline}
          bullets={bullets}
          accent={accent}
        />
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
          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
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
          <div
            style={{
              display: "grid",
              gap: 12,
            }}
          >
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
          <div
            style={{
              display: "grid",
              gap: 16,
            }}
          >
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
            <ProgressRail
              progress={(index + 1) / total}
              accent={accent}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

const OutroScene: React.FC<{
  cta: string;
  nextVideoLabel: string;
}> = ({ cta, nextVideoLabel }) => {
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
          {[
            "高校理系ブリッジ",
            "医学学習OS",
            "AI実務",
          ].map((item, index) => (
            <div
              key={item}
              style={{
                padding: "20px 22px",
                borderRadius: 24,
                backgroundColor:
                  index === 0 ? `${accentColor("vermilion")}18` : "rgba(18, 23, 35, 0.05)",
                fontSize: 28,
                fontWeight: 800,
                color: index === 0 ? accentColor("vermilion") : palette.mutedInk,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
