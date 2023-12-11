"use client";
import { type Track } from "@prisma/client";
import { useMemo, useState } from "react";

import AudioPlayer from "~/components/audio-kit/audioPlayer";

import { AudioContext, defaultTrackData } from "./init";

type Props = React.PropsWithChildren;
//ERROR
//app-index.js:32 Warning: Cannot update a component (`AudioProvider`) while rendering a different component (`UploadView`).
// To locate the bad setState() call inside `UploadView`, follow the stack trace as described in

// const AudioPlayerDynamic = dynamic(
//   () => import("~/components/audio-kit/audioPlayer"),
//   {
//     ssr:false,
//     loading: () => <p>Loading...</p>,
//   },
// );

export function AudioProvider({ children }: Props) {
  const [currentTrack, setCurrentTrack] = useState<Track>(defaultTrackData);
  const [playlist, setPlaylist] = useState<Track[]>([]);

  const value = useMemo(
    () => ({ currentTrack, setCurrentTrack, playlist, setPlaylist }),
    [currentTrack, setCurrentTrack, playlist, setPlaylist],
  );

  return (
    <AudioContext.Provider value={value}>
      {children}
      {!!currentTrack && !!playlist ? (
        <AudioPlayer
          currentTrack={currentTrack}
          playlist={playlist}
          onChangeCurrentTrack={setCurrentTrack}
        />
      ) : null}
    </AudioContext.Provider>
  );
}
