"use client"

import { useState, useEffect } from "react";

export const useAudio = (src: string) => {

  const DEFAULT_VOLUME = 0.8;
  const DEFAULT_PLAYBACKRATE = 1;
  const [audio, setAudio] = useState<HTMLAudioElement>(new Audio(src));
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [duration, setDuration] = useState(0);
  const [isServer, setIsServer] = useState<boolean>(true);

  useEffect(() => {
    setIsServer(false);
  }, []);

  useEffect(() => {
    audio.volume = DEFAULT_VOLUME;
    audio.playbackRate = DEFAULT_PLAYBACKRATE;
    audio.addEventListener("timeupdate", () => {
      const percent = audio.currentTime / audio.duration;
      setCurrentTime(audio.currentTime);
    });
  }, []);

  const togglePlay = () => {
    audio.paused ? audio.play() : audio.pause();
    setPlaying(!audio.paused);
  };

  const changeVolume = (event: Event, newValue: number | number[]): void => {
    const DEFAULT_LOW_VOLUME = 0;
    const DEFAULT_HIGH_VOLUME = 1;
    if (newValue < DEFAULT_LOW_VOLUME || newValue > DEFAULT_HIGH_VOLUME) {
      return;
    }
    const value: number = Array.isArray(newValue) ? newValue[0]! : newValue;
    audio.volume = value;
  };

  const changeCurrentTime = (event: Event, newValue: number | number[]) => {
    if (newValue < 0 || newValue > duration) return;

    const value: number = Array.isArray(newValue) ? newValue[0]! : newValue;
    setCurrentTime(value);
    audio.currentTime = value;
  };
  const setSourceAndPlay = (duration: number, url: string) => {
    setDuration(duration);
    audio.src = url;
    audio.play();
    setPlaying(!audio.paused);
  };
  return [
    audio,
    playing,
    currentTime,
    togglePlay,
    changeVolume,
    changeCurrentTime,
    setSourceAndPlay,
  ] as const;
};
