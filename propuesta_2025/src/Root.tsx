import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { FADE, SCENES, TOTAL } from "./content";
import { SCENE_COMPONENTS } from "./scenes";
import { C, FPS } from "./ui";

const fonts = Promise.all(
  ["400", "500", "600", "700", "800"].map((w) =>
    loadFont({ family: "Inter", url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w, format: "woff2" }),
  ),
);

const SceneWrap: React.FC<{ index: number; dur: number }> = ({ index, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  // fundido: 0,25 s de salida + 0,25 s de entrada = 0,5 s de transición
  const opacity = interpolate(t, [0, FADE, dur - FADE, dur], [index === 0 ? 1 : 0, 1, 1, index === SCENES.length - 1 ? 1 : 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const Scene = SCENE_COMPONENTS[index];
  return (
    <AbsoluteFill style={{ opacity }}>
      <Scene t={t} />
    </AbsoluteFill>
  );
};

export const Video: React.FC<{ music: boolean }> = ({ music }) => {
  const [h] = React.useState(() => delayRender("fuentes"));
  React.useEffect(() => {
    fonts.then(() => continueRender(h));
  }, [h]);
  const { fps } = useVideoConfig();
  let from = 0;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {music && <Audio src={staticFile("musica.wav")} />}
      {SCENES.map((s, i) => {
        const start = from;
        from += s.dur;
        return (
          <Sequence key={i} from={Math.round(start * fps)} durationInFrames={Math.round(s.dur * fps)}>
            <SceneWrap index={i} dur={s.dur} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Propuesta" component={Video} defaultProps={{ music: true }} durationInFrames={Math.round(TOTAL * FPS)} fps={FPS} width={1920} height={1080} />
  </>
);
