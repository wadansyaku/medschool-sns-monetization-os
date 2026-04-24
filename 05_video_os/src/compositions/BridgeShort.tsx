import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import {
  Badge,
  Card,
  VideoShell,
  accentColor,
  palette,
} from "../components/VideoShell";
import type { ShortScript } from "../data/videoPackages";

const getHookFontSize = (text: string) => {
  if (text.length >= 30) {
    return 66;
  }

  if (text.length >= 26) {
    return 70;
  }

  if (text.length >= 22) {
    return 74;
  }

  if (text.length >= 18) {
    return 82;
  }

  return 86;
};

export const BridgeShort: React.FC<ShortScript> = ({
  weekLabel,
  label,
  hook,
  points,
  close,
  role,
  takeaway,
  contextChips,
  conclusionChips,
  sequenceSteps,
  accent,
}) => {
  const frame = useCurrentFrame();
  const hookFontSize = getHookFontSize(hook);
  const leadIn = spring({
    fps: 30,
    frame,
    config: {
      damping: 180,
      stiffness: 120,
      mass: 0.72,
    },
  });

  return (
    <VideoShell accent={accent}>
      <AbsoluteFill
        style={{
          padding: "78px 68px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div style={{ display: "grid", gap: 14 }}>
          <Badge text={`${weekLabel} / ${label}`} accent={accent} />
          <ChipRow accent={accent} items={contextChips} />
        </div>
        <Card accent={accent}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              height: "100%",
            }}
          >
            <div style={{ display: "grid", gap: 22 }}>
              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    fontSize: 18,
                    letterSpacing: "0.08em",
                    color: palette.mutedInk,
                    fontWeight: 800,
                  }}
                >
                  先に直す論点
                </div>
                <div
                  style={{
                    fontSize: hookFontSize,
                    lineHeight: 1,
                    fontWeight: 950,
                    letterSpacing: "-0.08em",
                    opacity: leadIn,
                    transform: `translateY(${interpolate(leadIn, [0, 1], [42, 0])}px)`,
                  }}
                >
                  {hook}
                </div>
              </div>
              <div style={{ display: "grid", gap: 18 }}>
                {points.map((point, index) => {
                  const pointFrame = Math.max(frame - 12 - index * 8, 0);
                  const pointIn = spring({
                    fps: 30,
                    frame: pointFrame,
                    config: {
                      damping: 200,
                      stiffness: 120,
                      mass: 0.8,
                    },
                  });

                  return (
                    <div
                      key={point}
                      style={{
                        display: "flex",
                        gap: 20,
                        padding: "20px 22px",
                        borderRadius: 24,
                        backgroundColor:
                          index === 0
                            ? `${accentColor(accent)}14`
                            : "rgba(255, 253, 248, 0.68)",
                        border: `2px solid ${
                          index === 0
                            ? `${accentColor(accent)}24`
                            : "rgba(18, 23, 35, 0.08)"
                        }`,
                        opacity: pointIn,
                        transform: `translateX(${interpolate(pointIn, [0, 1], [30, 0])}px)`,
                      }}
                    >
                      <div
                        style={{
                          width: 46,
                          height: 46,
                          borderRadius: 999,
                          backgroundColor: accentColor(accent),
                          color: palette.white,
                          display: "grid",
                          placeItems: "center",
                          fontSize: 22,
                          fontWeight: 900,
                          flexShrink: 0,
                        }}
                      >
                        {index + 1}
                      </div>
                      <div
                        style={{
                          fontSize: 38,
                          lineHeight: 1.26,
                          color: palette.mutedInk,
                          fontWeight: 750,
                        }}
                      >
                        {point}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "grid", gap: 12 }}>
                <div
                  style={{
                    fontSize: 18,
                    letterSpacing: "0.08em",
                    color: palette.mutedInk,
                    fontWeight: 800,
                  }}
                >
                  この short の結論
                </div>
                <ChipRow accent={accent} items={conclusionChips} compact />
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.1fr 0.9fr",
                gap: 16,
              }}
            >
              <InfoBox label="この short の役割" text={role} />
              <InfoBox label="見たあとに残すこと" text={takeaway} accent={accent} />
            </div>
            <div
              style={{
                marginTop: "auto",
                padding: "18px 20px",
                borderRadius: 24,
                backgroundColor: "rgba(18, 23, 35, 0.05)",
                display: "grid",
                gap: 12,
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
                この順番で見る
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${sequenceSteps.length}, minmax(0, 1fr))`,
                  gap: 12,
                }}
              >
                {sequenceSteps.map((item, index) => (
                  <div
                    key={item}
                    style={{
                      padding: "14px 12px",
                      borderRadius: 20,
                      backgroundColor:
                        index === 0
                          ? `${accentColor(accent)}16`
                          : "rgba(255, 253, 248, 0.76)",
                      border: `2px solid ${
                        index === 0
                          ? `${accentColor(accent)}24`
                          : "rgba(18, 23, 35, 0.08)"
                      }`,
                      fontSize: 22,
                      lineHeight: 1.18,
                      fontWeight: 820,
                      color: index === 0 ? accentColor(accent) : palette.mutedInk,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
        <div
          style={{
            marginTop: "auto",
            padding: "28px 34px",
            borderRadius: 28,
            backgroundColor: `${accentColor(accent)}14`,
            border: `2px solid ${accentColor(accent)}26`,
            fontSize: 34,
            lineHeight: 1.35,
            fontWeight: 800,
            color: palette.ink,
          }}
        >
          {close}
        </div>
      </AbsoluteFill>
    </VideoShell>
  );
};

const ChipRow: React.FC<{
  accent: ShortScript["accent"];
  items: string[];
  compact?: boolean;
}> = ({ accent, items, compact = false }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: compact ? 12 : 14,
        flexWrap: "wrap",
      }}
    >
      {items.map((item, index) => (
        <div
          key={item}
          style={{
            padding: compact ? "12px 16px" : "12px 18px",
            borderRadius: 999,
            backgroundColor:
              index === 0 ? `${accentColor(accent)}18` : "rgba(255, 253, 248, 0.72)",
            border: `2px solid ${
              index === 0 ? `${accentColor(accent)}28` : "rgba(18, 23, 35, 0.08)"
            }`,
            fontSize: compact ? 21 : 22,
            fontWeight: compact ? 820 : 800,
            color: index === 0 ? accentColor(accent) : palette.mutedInk,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

const InfoBox: React.FC<{
  label: string;
  text: string;
  accent?: ShortScript["accent"];
}> = ({ label, text, accent }) => {
  const isAccent = accent !== undefined;

  return (
    <div
      style={{
        padding: "18px 22px",
        borderRadius: 24,
        backgroundColor: isAccent ? `${accentColor(accent)}12` : "rgba(18, 23, 35, 0.06)",
        border: isAccent ? `2px solid ${accentColor(accent)}22` : undefined,
        display: "grid",
        gap: 8,
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
        {label}
      </div>
      <div
        style={{
          fontSize: 30,
          lineHeight: 1.16,
          fontWeight: 850,
          color: palette.ink,
        }}
      >
        {text}
      </div>
    </div>
  );
};
