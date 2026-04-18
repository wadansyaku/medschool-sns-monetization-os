import "./index.css";
import { Composition } from "remotion";
import { BridgeLongform } from "./compositions/BridgeLongform";
import { BridgeShort } from "./compositions/BridgeShort";
import {
  LONGFORM_DURATION,
  LONGFORM_FPS,
  SHORT_DURATION,
  SHORT_FPS,
  week01Shorts,
} from "./data/week01";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="W01BridgeLong"
        component={BridgeLongform}
        durationInFrames={LONGFORM_DURATION}
        fps={LONGFORM_FPS}
        width={1280}
        height={720}
      />
      {week01Shorts.map((short) => (
        <Composition
          key={short.id}
          id={short.id}
          component={BridgeShort}
          durationInFrames={SHORT_DURATION}
          fps={SHORT_FPS}
          width={1080}
          height={1920}
          defaultProps={short}
        />
      ))}
    </>
  );
};
