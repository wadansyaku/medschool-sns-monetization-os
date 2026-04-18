import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from "remotion";
import { Badge, Card, VideoShell, accentColor, palette } from "../components/VideoShell";
import type { ShortScript } from "../data/week01";

export const BridgeShort: React.FC<ShortScript> = ({
  label,
  hook,
  points,
  close,
  accent,
}) => {
  const frame = useCurrentFrame();
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
          gap: 28,
        }}
      >
        <Badge text={`Week 01 / ${label}`} accent={accent} />
        <Card accent={accent}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
              height: "100%",
            }}
          >
            <div
              style={{
                fontSize: 92,
                lineHeight: 0.96,
                fontWeight: 950,
                letterSpacing: "-0.08em",
                opacity: leadIn,
                transform: `translateY(${interpolate(leadIn, [0, 1], [42, 0])}px)`,
              }}
            >
              {hook}
            </div>
            <div
              style={{
                display: "grid",
                gap: 20,
              }}
            >
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
                      fontSize: 40,
                      lineHeight: 1.28,
                      color: palette.mutedInk,
                      fontWeight: 700,
                      opacity: pointIn,
                      transform: `translateX(${interpolate(pointIn, [0, 1], [30, 0])}px)`,
                    }}
                  >
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        marginTop: 18,
                        borderRadius: 999,
                        backgroundColor: accentColor(accent),
                        flexShrink: 0,
                      }}
                    />
                    {point}
                  </div>
                );
              })}
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
