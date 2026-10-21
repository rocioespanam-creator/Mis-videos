import React from "react";
import { AbsoluteFill, Composition, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/fonts";
import { FADE } from "./content";
import { SCENE_COMPONENTS } from "./scenes";
import { DURACION_VIDEO, ESCENAS } from "./timing";
import { C, FPS } from "./ui";

// La imagen se renderiza aquí; el audio (voz + música opcional) lo monta scripts/render.mjs con ffmpeg.
const fonts = Promise.all(
  ["400", "500", "600", "700", "800"].map((w) =>
    loadFont({ family: "Inter", url: staticFile(`fonts/inter-latin-${w}-normal.woff2`), weight: w, format: "woff2" }),
  ),
);

const SceneWrap: React.FC<{ index: number; dur: number }> = ({ index, dur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = f / fps;
  // fundido de 0,5 s entre escenas: 0,25 s de salida + 0,25 s de entrada
  const opacity = interpolate(t, [0, FADE, dur - FADE, dur], [index === 0 ? 1 : 0, 1, 1, index === ESCENAS.length - 1 ? 1 : 0], {
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

export const Video: React.FC = () => {
  const [h] = React.useState(() => delayRender("fuentes"));
  React.useEffect(() => {
    fonts.then(() => continueRender(h));
  }, [h]);
  const { fps, durationInFrames } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      {ESCENAS.map((e, i) => {
        const from = Math.round(e.inicio * fps);
        const to = i === ESCENAS.length - 1 ? durationInFrames : Math.round(e.fin * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <SceneWrap index={i} dur={(to - from) / fps} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition id="Propuesta" component={Video} durationInFrames={Math.round(DURACION_VIDEO * FPS)} fps={FPS} width={1920} height={1080} />
);
