"use client";
import { type Track } from "@prisma/client";
import { createContext } from "react";

export const defaultTrackData: Track = {
  id: "XXXXXXX",
  albumn: null,
  duration: 300,
  name: "Gimme the Night",
  posterUrl: null,
  ref: "",
  singer: "George Benson",
  url: "",
  userId: "",
};

type AudioContextType = {
  setCurrentTrack: (track: Track) => void;
  setPlaylist: (playlist: Array<Track>) => void;
  currentTrack: Track;
  playlist: Array<Track>;
};

export const AudioContext = createContext<AudioContextType>({
  setCurrentTrack: () => undefined,
  setPlaylist: () => [],
  currentTrack: defaultTrackData,
  playlist: [],
});
