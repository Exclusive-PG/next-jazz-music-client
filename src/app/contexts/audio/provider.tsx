"use client";
import { type Track } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import AudioPlayer from "~/components/audio-kit/audioPlayer";

import { AudioContext, defaultTrackData } from "./init";

type Props = React.PropsWithChildren;

export function AudioProvider({ children }: Props) {
  const [currentTrack, setCurrentTrack] = useState<Track>(defaultTrackData);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const value = useMemo(
    () => ({ currentTrack, setCurrentTrack, playlist, setPlaylist }),
    [currentTrack, setCurrentTrack, playlist, setPlaylist],
  );
  const path = usePathname();
  const pathsForRender = ["/upload", "/dashboard"];
  const isCorrectPath = pathsForRender.includes(path);
  return (
    <AudioContext.Provider value={value}>
      {children}
      {!!currentTrack && !!playlist && isCorrectPath ? (
        <AudioPlayer
          currentTrack={currentTrack}
          playlist={playlist}
          onChangeCurrentTrack={setCurrentTrack}
        />
      ) : null}
    </AudioContext.Provider>
  );
}
