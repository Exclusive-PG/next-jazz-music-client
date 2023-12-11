"use client";

import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import VolumeUp from "@mui/icons-material/VolumeUp";
import { Box, Button, Slider, type SliderOwnProps, Stack } from "@mui/material";
import { type Track } from "@prisma/client";
import Image from "next/image";
import { useCallback, useEffect } from "react";

import { useAudio } from "~/hooks/useAudio";
import { UtilsDate } from "~/utils/date-time";

type Props = {
  onChangeCurrentTrack: (track: Track) => void;
  currentTrack: Track;
  playlist: Array<Track>;
};

const AudioPlayer: React.FC<Props> = ({
  currentTrack,
  playlist,
  onChangeCurrentTrack,
}) => {
  const { name, singer, duration, url } = currentTrack;

  const {
    audio,
    playing,
    currentTime,
    togglePlay,
    changeVolume,
    changeCurrentTime,
    updateAudioSrc,
  } = useAudio(url);

  const nextTrack = useCallback(() => {
    if (!playlist?.length && !currentTrack) {
      return;
    }

    let index = playlist.findIndex((item) => item.id === currentTrack.id) + 1;
    if (index === playlist.length) {
      index = 0;
    }

    updateAudioSrc(playlist[index]!.url);
    onChangeCurrentTrack?.(playlist[index]!);
  }, [currentTrack, onChangeCurrentTrack, playlist, updateAudioSrc]);

  const prevTrack = useCallback(() => {
    if (!playlist?.length && !currentTrack) {
      return;
    }

    let index = playlist.findIndex((item) => item.id === currentTrack.id) - 1;
    if (index < 0) {
      index = playlist.length - 1;
    }

    updateAudioSrc(playlist[index]!.url);
    onChangeCurrentTrack?.(playlist[index]!);
  }, [currentTrack, onChangeCurrentTrack, playlist, updateAudioSrc]);

  useEffect(() => {
    if (currentTrack && audio?.src !== currentTrack.url) {
      updateAudioSrc(currentTrack.url);
    }
  }, [audio?.src, currentTrack, updateAudioSrc]);

  useEffect(() => {
    if (!audio) {
      return;
    }

    audio.addEventListener("ended", nextTrack);
    return () => {
      audio.removeEventListener("ended", nextTrack);
    };
  }, [audio, nextTrack]);

  const onAudioTimeChange: SliderOwnProps["onChangeCommitted"] = (
    event,
    value,
  ) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    if (newValue === undefined) {
      return;
    }

    changeCurrentTime(newValue);
  };

  const onAudioVolumeChange: SliderOwnProps["onChangeCommitted"] = (
    event,
    value,
  ) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    if (newValue === undefined) {
      return;
    }

    changeVolume(newValue);
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
                onChangeCommitted={onAudioTimeChange}
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
                onChangeCommitted={onAudioVolumeChange}
              />
            </Stack>
          </Box>
        </div>
      </div>
    </div>
  );
};
export default AudioPlayer;
