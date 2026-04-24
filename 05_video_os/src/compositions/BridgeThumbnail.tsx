import React from "react";
import { AbsoluteFill } from "remotion";
import {
  Badge,
  VideoShell,
  accentColor,
  palette,
} from "../components/VideoShell";
import type { LongformVideo } from "../data/videoPackages";

const getTitleFontSize = (text: string) => {
  if (text.length >= 20) {
    return 96;
  }

  if (text.length >= 14) {
    return 110;
  }

  return 122;
};

const getSubtitleFontSize = (text: string) => {
  if (text.length >= 24) {
    return 29;
  }

  return 34;
};

const getPromiseFontSize = (text: string) => {
  if (text.length >= 18) {
    return 42;
  }

  if (text.length >= 14) {
    return 48;
  }

  return 54;
};

export const BridgeThumbnail: React.FC<LongformVideo> = ({
  kicker,
  layer,
  promise,
  thumbnail,
  scenes,
}) => {
  const accent = scenes[0]?.accent ?? "vermilion";
  const titleFontSize = getTitleFontSize(thumbnail.headline);
  const subtitleFontSize = getSubtitleFontSize(thumbnail.subhead);
  const promiseFontSize = getPromiseFontSize(promise);

  return (
    <VideoShell accent={accent}>
      <AbsoluteFill
        style={{
          padding: "44px 52px",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 24,
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: 42,
            padding: "34px 34px 30px",
            backgroundColor: "rgba(255, 253, 248, 0.8)",
            border: `2px solid ${accentColor(accent)}30`,
            boxShadow: "0 28px 56px rgba(18, 23, 35, 0.16)",
            display: "flex",
            flexDirection: "column",
            gap: 22,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -46,
              top: -56,
              width: 240,
              height: 240,
              borderRadius: 999,
              background: `radial-gradient(circle, ${accentColor(accent)}26 0%, transparent 68%)`,
            }}
          />
          <div
            style={{
              display: "grid",
              gap: 14,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Badge text={kicker} accent={accent} />
            <div
              style={{
                fontSize: 24,
                letterSpacing: "0.06em",
                color: palette.mutedInk,
                fontWeight: 700,
              }}
            >
              理系再建ラボ｜医学につながる理系
            </div>
            <div
              style={{
                fontSize: titleFontSize,
                lineHeight: 0.9,
                letterSpacing: "-0.07em",
                fontWeight: 950,
                color: palette.ink,
                textWrap: "balance",
              }}
            >
              {thumbnail.headline}
            </div>
            <div
              style={{
                padding: "18px 22px",
                borderRadius: 24,
                backgroundColor: "rgba(255, 253, 248, 0.78)",
                border: "2px solid rgba(18, 23, 35, 0.08)",
                fontSize: subtitleFontSize,
                lineHeight: 1.2,
                fontWeight: 820,
                color: palette.mutedInk,
                maxWidth: 700,
              }}
            >
              {thumbnail.subhead}
            </div>
          </div>
          <div
            style={{
              marginTop: "auto",
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              position: "relative",
              zIndex: 1,
            }}
          >
            {thumbnail.chips.map((item, index) => (
              <div
                key={item}
                style={{
                  padding: "14px 18px",
                  borderRadius: 999,
                  backgroundColor:
                    index === 0
                      ? `${accentColor(accent)}18`
                      : "rgba(255, 253, 248, 0.84)",
                  border: `2px solid ${
                    index === 0
                      ? `${accentColor(accent)}24`
                      : "rgba(18, 23, 35, 0.08)"
                  }`,
                  fontSize: 24,
                  fontWeight: 900,
                  color: index === 0 ? accentColor(accent) : palette.mutedInk,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <div
            style={{
              borderRadius: 42,
              padding: "30px 30px 26px",
              backgroundColor: "rgba(255, 253, 248, 0.84)",
              border: `2px solid ${accentColor("teal")}28`,
              boxShadow: "0 24px 44px rgba(18, 23, 35, 0.12)",
              display: "grid",
              gap: 18,
            }}
          >
            <div
              style={{
                fontSize: 22,
                letterSpacing: "0.08em",
                color: accentColor("teal"),
                fontWeight: 900,
              }}
            >
              見るべき理由
            </div>
            <div
              style={{
                fontSize: promiseFontSize,
                lineHeight: 1.1,
                letterSpacing: "-0.04em",
                fontWeight: 950,
                color: palette.ink,
              }}
            >
              {promise}
            </div>
          </div>

          <div
            style={{
              borderRadius: 42,
              padding: "28px 30px",
              backgroundColor: `${accentColor("teal")}14`,
              border: `2px solid ${accentColor("teal")}22`,
              display: "grid",
              gap: 16,
            }}
          >
            <div
              style={{
                fontSize: 22,
                letterSpacing: "0.08em",
                color: accentColor("teal"),
                fontWeight: 900,
              }}
            >
              {layer}
            </div>
            {thumbnail.reasons.map((item, index) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  gap: 14,
                  alignItems: "center",
                  fontSize: 27,
                  lineHeight: 1.18,
                  fontWeight: 800,
                  color: palette.ink,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    display: "grid",
                    placeItems: "center",
                    backgroundColor:
                      index === 0 ? accentColor("teal") : `${accentColor("teal")}18`,
                    color: index === 0 ? palette.white : accentColor("teal"),
                    fontSize: 22,
                    fontWeight: 900,
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </VideoShell>
  );
};
