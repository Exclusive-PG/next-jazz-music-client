"use client";

import { useEffect, useRef, useState } from "react";

export const useAudio = (initialSrc?: string) => {
  const DEFAULT_VOLUME = 0.8;
  const DEFAULT_PLAYBACK_RATE = 1;

  const [src, setSrc] = useState(initialSrc);
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(true);

  const subscribeToAudioEvents = (audio: HTMLAudioElement) => {
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio?.removeEventListener("timeupdate", onTimeUpdate);
    };
  };

  useEffect(() => {
    const audio = new Audio();
    audio.volume = DEFAULT_VOLUME;
    audio.playbackRate = DEFAULT_PLAYBACK_RATE;

    setAudio(audio);

    return () => {
      audio.remove();
    };
  }, []);

  useEffect(() => {
    if (!audio) {
      return;
    }

    const unsubscribe = subscribeToAudioEvents(audio);
    return unsubscribe;
  }, [audio]);

  useEffect(() => {
    if (!audio || !src || audio.src === src) {
      return;
    }

    audio.pause();
    audio.src = src;

    audio.load();
    audio.play();
  }, [audio, src]);

  const togglePlay = () => {
    if (!audio) {
      return;
    }

    audio.paused ? audio.play() : audio.pause();
    setPlaying(!audio.paused);
  };

  const changeVolume = (newValue: number): void => {
    if (!audio) {
      return;
    }

    const MIN_VOLUME = 0;
    const MAX_VOLUME = 1;

    const value = Math.min(Math.max(newValue, MIN_VOLUME), MAX_VOLUME);
    audio.volume = value;
  };

  const changeCurrentTime = (newValue: number) => {
    if (!audio) {
      return;
    }

    const value = Math.min(Math.max(newValue, 0), audio.duration);

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const updateAudioSrc = (src: string) => {
    setSrc(src);
  };

  return {
    audio,
    playing,
    currentTime,
    togglePlay,
    changeVolume,
    changeCurrentTime,
    updateAudioSrc,
  } as const;
};
