"use client";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { Box, Button, Slider, Stack } from "@mui/material";
import { type Track } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAudio } from "~/hooks/useAudio";
import { UtilsDate } from "~/utils/date-time";

type PropsAudioPlayer = {
  onChangeCurrentTrack: (track: Track) => void;
  currentTrack: Track;
  playlist: Array<Track>;
};

 const AudioPlayer: React.FC<PropsAudioPlayer> = ({
  currentTrack,
  playlist,
  onChangeCurrentTrack,
}) => {
  const { name, singer, duration, url } = currentTrack;
  const [
    audio,
    playing,
    currentTime,
    togglePlay,
    changeVolume,
    changeCurrentTime,
    setSourceAndPlay,
  ] = useAudio(url);

  useEffect(() => {
    setSourceAndPlay(duration, url);
    audio.addEventListener("ended", () => {
      nextTrack();
    });
  }, [currentTrack]);

  const nextTrack = () => {
    if (!playlist && !currentTrack) {
      return;
    }
    let index = playlist.findIndex((item) => item.id === currentTrack.id);
    ++index;
    const currentIndexTrack = index === playlist.length ? (index = 0) : index;
    audio.src = playlist[currentIndexTrack]!.url;
    onChangeCurrentTrack?.(playlist[currentIndexTrack]!);
  };
  const prevTrack = () => {
    if (!playlist && !currentTrack) {
      return;
    }
    let index = playlist.findIndex((item) => item.id === currentTrack.id);
    index--;
    const currentIndexTrack = index < 0 ? playlist.length - 1 : index;
    audio.src = playlist[currentIndexTrack]!.url;
    onChangeCurrentTrack?.(playlist[currentIndexTrack]!);
  };


  return (
    <div className="fixed bottom-0 left-0  h-20 w-full bg-darkPrimary">
      <div className="flex items-center p-3">
        <div className="flex w-full max-w-xs justify-between pl-1">
          <Button className="text-white hover:text-mainRed" onClick={prevTrack}>
            <SkipPreviousIcon className=" text-5xl" />
          </Button>

          <Button
            className="text-white hover:text-mainRed"
            onClick={togglePlay}
          >
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
            <span className="w-10">
              {UtilsDate.normalizeDuration(currentTime)}
            </span>
            <Box sx={{ width: 600 }} className="">
              <Slider
                defaultValue={50}
                min={0}
                max={duration}
                value={currentTime}
                aria-label="progress-song"
                valueLabelDisplay="auto"
                valueLabelFormat={UtilsDate.normalizeDuration(currentTime)}
                className="text-mainRed"
                onChange={changeCurrentTime}
              />
            </Box>
            <span className="w-10">
              {UtilsDate.normalizeDuration(duration)}
            </span>
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
export default AudioPlayer;