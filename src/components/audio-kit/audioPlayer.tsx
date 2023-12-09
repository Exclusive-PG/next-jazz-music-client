"use client";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import Image from "next/image";
import { Button, Box, Slider, Stack } from "@mui/material";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { Track } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { Utils } from "~/utils/date-time";

type AudioParam = {
  src: string;
  options: {
    volume?: number;
    playbackRate?: number;
  };
};
type Props = {
  onChangeCurrentTrack: (track: Track) => void;
  currentTrack: Track;
  playlist: Array<Track>;
};

const useAudio = ({ src, options }: AudioParam) => {
  const { volume, playbackRate } = options;
  const DEFAULT_VOLUME = 0.8;
  const DEFAULT_PLAYBACKRATE = 1;
  const [audio,setAudio] = useState(new Audio(src));
  return audio;
};

export const AudioPlayer: React.FC<Props> = ({
  currentTrack,
  playlist,
  onChangeCurrentTrack,
}) => {
  const { name, singer, duration, url } = currentTrack;
  const audio = useAudio({ src: url, options: {} });
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    audio.addEventListener("timeupdate", () => {
      const percent = audio.currentTime / audio.duration;
      setCurrentTime(audio.currentTime);
    });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      audio.src = url;
      audio.play();
      setPlaying(!audio.paused);
    }, 1);

    audio.addEventListener("ended", () => {
      nextTrack();
    });
  }, [currentTrack]);

  const nextTrack = () => {
    if (!playlist && !currentTrack) return;
    let index = playlist.findIndex((item) => item.id === currentTrack.id);
    ++index;
    let currentIndexTrack = index === playlist.length ? (index = 0) : index;
    audio.src = playlist[currentIndexTrack]!.url;
    onChangeCurrentTrack?.(playlist[currentIndexTrack]!);
  };
  const prevTrack = () => {
    if (!playlist && !currentTrack) return;
    let index = playlist.findIndex((item) => item.id === currentTrack.id);
    index--;
    let currentIndexTrack = index < 0 ? playlist.length - 1 : index;
    audio.src = playlist[currentIndexTrack]!.url;
    onChangeCurrentTrack?.(playlist[currentIndexTrack]!);
  };

  const toggle = () => {
    audio.paused ? audio.play() : audio.pause();
    setPlaying(!audio.paused);
  };

  const changeVolume = (event: Event, newValue: number | number[]) => {
    const DEFAULT_LOW_VOLUME = 0;
    const DEFAULT_HIGH_VOLUME = 1;
    if (newValue < DEFAULT_LOW_VOLUME || newValue > DEFAULT_HIGH_VOLUME) return;
    const value: number = Array.isArray(newValue) ? newValue[0]! : newValue;
    audio.volume = value;
  };
  
  const changeCurrentTime = (event: Event, newValue: number | number[]) => {
    if (newValue < 0 || newValue > duration) return;
    const value: number = Array.isArray(newValue) ? newValue[0]! : newValue;
    setCurrentTime(value);
    audio.currentTime = value;
  };
  return (
    <div className="fixed bottom-0 left-0  h-20 w-full bg-darkPrimary">
      <div className="flex items-center p-3">
        <div className="flex w-full max-w-xs justify-between pl-1">
          <Button className="text-white hover:text-mainRed" onClick={prevTrack}>
            <SkipPreviousIcon className=" text-5xl" />
          </Button>

          <Button className="text-white hover:text-mainRed" onClick={toggle}>
            {playing ? (
              <PauseCircleIcon className="text-5xl hover:text-mainRed" />
            ) : (
              <PlayCircleIcon className="text-5xl hover:text-mainRed" />
            )}
          </Button>
          <Button className="text-white hover:text-mainRed" onClick={nextTrack}>
            <SkipNextIcon className="text-5xl hover:text-mainRed" />
          </Button>
        </div>
        <div className="pl-10">
          <Image
            src="/song.png"
            alt="poster"
            width={80}
            height={60}
            objectFit="cover"
            className="ml-2 rounded-md"
            quality={100}
          />
        </div>
        <div className="pl-20">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-center xl:w-2/4">
            {name} ● {singer}
          </div>
          <div className="flex items-center gap-5">
            <span className="w-10">{Utils.normalizeDuration(currentTime)}</span>
            <Box sx={{ width: 600 }} className="">
              <Slider
                defaultValue={50}
                min={0}
                max={duration}
                value={currentTime}
                aria-label="progress-song"
                valueLabelDisplay="auto"
                valueLabelFormat={Utils.normalizeDuration(currentTime)}
                className="text-mainRed"
                onChange={changeCurrentTime}
              />
            </Box>
            <span className="w-10">{Utils.normalizeDuration(duration)}</span>
          </div>
        </div>
        <div className="flex items-center pl-20">
          <Box sx={{ width: 150 }}>
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1 }}
              alignItems="center"
            >
              <VolumeUp />
              <Slider
                defaultValue={0.8}
                className="text-mainRed"
                min={0}
                max={1}
                step={0.01}
                onChange={changeVolume}
              />
            </Stack>
          </Box>
        </div>
      </div>
    </div>
  );
};
