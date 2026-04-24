import "./index.css";
import { type FC } from "react";
import { Composition, Folder } from "remotion";
import { BridgeLongform } from "./compositions/BridgeLongform";
import { BridgeShort } from "./compositions/BridgeShort";
import { BridgeThumbnail } from "./compositions/BridgeThumbnail";
import {
  LONGFORM_FPS,
  LongformVideoSchema,
  SHORT_DURATION,
  SHORT_FPS,
  ShortScriptSchema,
  getLongformDuration,
  videoPackages,
} from "./data/videoPackages";

export const RemotionRoot: FC = () => {
  return (
    <>
      {videoPackages.map((videoPackage) => (
        <Folder
          key={videoPackage.slug}
          name={`Week-${String(videoPackage.longform.weekNumber).padStart(2, "0")}`}
        >
          <Composition
            id={videoPackage.compositionIds.longform}
            component={BridgeLongform}
            durationInFrames={getLongformDuration(videoPackage.longform)}
            fps={LONGFORM_FPS}
            width={1280}
            height={720}
            defaultProps={videoPackage.longform}
            schema={LongformVideoSchema}
          />
          <Composition
            id={videoPackage.compositionIds.thumbnail}
            component={BridgeThumbnail}
            durationInFrames={1}
            fps={1}
            width={1280}
            height={720}
            defaultProps={videoPackage.longform}
            schema={LongformVideoSchema}
          />
          {videoPackage.shorts.map((short, index) => (
            <Composition
              key={short.id}
              id={videoPackage.compositionIds.shorts[index]}
              component={BridgeShort}
              durationInFrames={SHORT_DURATION}
              fps={SHORT_FPS}
              width={1080}
              height={1920}
              defaultProps={short}
              schema={ShortScriptSchema}
            />
          ))}
        </Folder>
      ))}
    </>
  );
};
