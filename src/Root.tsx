import React from "react";
import { AbsoluteFill, Audio, Composition, Sequence, continueRender, delayRender, interpolate, staticFile, useCurrentFrame } from "remotion";
import { BottomBand, Subtitles } from "./components/ui";
import { Plazi, GestureCue } from "./components/Plazi";
import { fontsReady } from "./fonts";
import { C, FPS } from "./theme";
import { SCENE_BOUNDS, TOTAL_FRAMES, at } from "./timing";
import { Scene1Sol } from "./scenes/Scene1Sol";
import { Scene2Diagnostico } from "./scenes/Scene2Diagnostico";
import { Scene3Mercado } from "./scenes/Scene3Mercado";
import { Scene4Decisiones } from "./scenes/Scene4Decisiones";
import { Scene5Impacto } from "./scenes/Scene5Impacto";
import { Scene6Cierre } from "./scenes/Scene6Cierre";

const SCENES: React.FC<{ from: number }>[] = [Scene1Sol, Scene2Diagnostico, Scene3Mercado, Scene4Decisiones, Scene5Impacto, Scene6Cierre];
const XFADE = 12; // frames de fundido entre escenas

// Gesto de Plazi al empezar cada escena
const GESTURES: GestureCue[] = [
  { t: 0.15, type: "wave", dur: 2.4 },
  { t: SCENE_BOUNDS[1].start + 0.3, type: "point" },
  { t: SCENE_BOUNDS[2].start + 0.3, type: "point" },
  { t: SCENE_BOUNDS[3].start + 0.3, type: "thumbs" },
  { t: SCENE_BOUNDS[4].start + 0.3, type: "point" },
  { t: SCENE_BOUNDS[5].start + 0.3, type: "thumbs", dur: 2.2 },
  { t: at(5, "¿Empezamos") - 0.3, type: "wave", dur: 4.2 },
];

const SceneFrame: React.FC<{ children: React.ReactNode; durationInFrames: number; first: boolean }> = ({ children, durationInFrames, first }) => {
  const f = useCurrentFrame();
  const opacity = interpolate(f, [0, XFADE, durationInFrames - XFADE, durationInFrames], [first ? 1 : 0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const Video: React.FC = () => {
  const [handle] = React.useState(() => delayRender("fuentes"));
  React.useEffect(() => {
    fontsReady.then(() => continueRender(handle));
  }, [handle]);

  return (
    <AbsoluteFill style={{ background: C.crema }}>
      <Audio src={staticFile("narracion.mp3")} />
      {SCENES.map((Scene, i) => {
        const from = Math.round(SCENE_BOUNDS[i].start * FPS);
        const last = i === SCENES.length - 1;
        const to = last ? TOTAL_FRAMES : Math.round(SCENE_BOUNDS[i].end * FPS) + XFADE / 2;
        const start = i === 0 ? 0 : from - XFADE / 2;
        return (
          <Sequence key={i} from={start} durationInFrames={to - start} premountFor={30}>
            <SceneFrame durationInFrames={last ? to - start + XFADE : to - start} first={i === 0}>
              <Scene from={start} />
            </SceneFrame>
          </Sequence>
        );
      })}
      <BottomBand />
      <Plazi gestures={GESTURES} />
      <Subtitles />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => (
  <Composition id="LaPlazuela" component={Video} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} />
);
