import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const palette = {
  paper: "#f4efe3",
  paperShadow: "#e7dfcf",
  ink: "#121723",
  mutedInk: "#4c5567",
  vermilion: "#db5c44",
  teal: "#0f7071",
  blue: "#2f5fd4",
  warmLine: "rgba(18, 23, 35, 0.12)",
  white: "#fffdf8",
};

export const accentColor = (accent: "vermilion" | "teal" | "blue") => {
  return palette[accent];
};

export const VideoShell: React.FC<{
  accent: "vermilion" | "teal" | "blue";
  children: React.ReactNode;
}> = ({ accent, children }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const pulse = interpolate(
    Math.sin(frame / 20),
    [-1, 1],
    [0.82, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.paper,
        color: palette.ink,
        fontFamily:
          '"Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif',
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: [
            `radial-gradient(circle at 15% 20%, ${accentColor(accent)}22 0%, transparent 28%)`,
            `radial-gradient(circle at 85% 18%, ${palette.blue}18 0%, transparent 24%)`,
            `linear-gradient(135deg, ${palette.paper} 0%, ${palette.paperShadow} 100%)`,
          ].join(", "),
        }}
      />
      <AbsoluteFill
        style={{
          opacity: 0.55,
          backgroundImage: [
            `linear-gradient(${palette.warmLine} 1px, transparent 1px)`,
            `linear-gradient(90deg, ${palette.warmLine} 1px, transparent 1px)`,
          ].join(", "),
          backgroundSize: "64px 64px",
          transform: `translate(${frame * -0.8}px, ${frame * -0.45}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: Math.max(width, height) * -0.08,
          background: `radial-gradient(circle, ${accentColor(accent)} 0%, transparent 60%)`,
          opacity: 0.1 * pulse,
          filter: "blur(80px)",
          transform: `translate(${Math.sin(frame / 18) * 32}px, ${Math.cos(frame / 23) * 28}px)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const Badge: React.FC<{
  text: string;
  accent: "vermilion" | "teal" | "blue";
}> = ({ text, accent }) => {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 20px",
        borderRadius: 999,
        fontSize: 24,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        backgroundColor: accentColor(accent),
        color: palette.white,
        boxShadow: "0 14px 30px rgba(18, 23, 35, 0.14)",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 999,
          backgroundColor: palette.white,
        }}
      />
      {text}
    </div>
  );
};

export const Card: React.FC<{
  accent: "vermilion" | "teal" | "blue";
  children: React.ReactNode;
}> = ({ accent, children }) => {
  const frame = useCurrentFrame();
  const entrance = spring({
    fps: 30,
    frame,
    config: {
      damping: 200,
      stiffness: 120,
      mass: 0.7,
    },
  });

  return (
    <div
      style={{
        flex: 1,
        minHeight: 0,
        borderRadius: 36,
        padding: 44,
        backgroundColor: "rgba(255, 253, 248, 0.74)",
        border: `2px solid ${accentColor(accent)}35`,
        boxShadow: "0 28px 60px rgba(18, 23, 35, 0.12)",
        transform: `translateY(${interpolate(entrance, [0, 1], [36, 0])}px) scale(${interpolate(entrance, [0, 1], [0.97, 1])})`,
        opacity: entrance,
        backdropFilter: "blur(14px)",
      }}
    >
      {children}
    </div>
  );
};

export const ProgressRail: React.FC<{
  progress: number;
  accent: "vermilion" | "teal" | "blue";
}> = ({ progress, accent }) => {
  return (
    <div
      style={{
        width: "100%",
        height: 10,
        borderRadius: 999,
        backgroundColor: "rgba(18, 23, 35, 0.08)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${progress * 100}%`,
          height: "100%",
          borderRadius: 999,
          backgroundColor: accentColor(accent),
          transformOrigin: "left center",
        }}
      />
    </div>
  );
};

export const AnimatedTextBlock: React.FC<{
  eyebrow: string;
  headline: string;
  bullets: string[];
  accent: "vermilion" | "teal" | "blue";
}> = ({ eyebrow, headline, bullets, accent }) => {
  const frame = useCurrentFrame();
  const rise = spring({
    fps: 30,
    frame,
    config: {
      damping: 150,
      stiffness: 110,
      mass: 0.8,
    },
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        transform: `translateY(${interpolate(rise, [0, 1], [28, 0], {
          easing: Easing.out(Easing.cubic),
        })}px)`,
        opacity: rise,
      }}
    >
      <div
        style={{
          fontSize: 22,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: accentColor(accent),
          fontWeight: 800,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: 60,
          lineHeight: 1.05,
          fontWeight: 900,
          letterSpacing: "-0.05em",
        }}
      >
        {headline}
      </div>
      <div
        style={{
          display: "grid",
          gap: 18,
        }}
      >
        {bullets.map((bullet, index) => {
          const bulletFrame = Math.max(frame - index * 7, 0);
          const bulletIn = spring({
            fps: 30,
            frame: bulletFrame,
            config: {
              damping: 180,
              stiffness: 120,
              mass: 0.75,
            },
          });

          return (
            <div
              key={bullet}
              style={{
                display: "flex",
                gap: 18,
                alignItems: "flex-start",
                opacity: bulletIn,
                transform: `translateX(${interpolate(bulletIn, [0, 1], [24, 0])}px)`,
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  marginTop: 14,
                  borderRadius: 999,
                  backgroundColor: accentColor(accent),
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontSize: 31,
                  lineHeight: 1.45,
                  color: palette.mutedInk,
                  fontWeight: 600,
                }}
              >
                {bullet}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
