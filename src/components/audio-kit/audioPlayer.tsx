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
    currentTime,
    togglePlay,
    changeVolume,
    changeCurrentTime,
    updateAudioSrc,
    previewCurrentTime,
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

  const onAudioTimeChangeCommitted: SliderOwnProps["onChangeCommitted"] = (
    event,
    value,
  ) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    if (newValue === undefined) {
      return;
    }
    try {
      audio?.play();
      changeCurrentTime(newValue);
    } catch (err) {}
  };

  const onAudioTimeChange: SliderOwnProps["onChange"] = (event, value) => {
    audio?.pause();
    const newValue = Array.isArray(value) ? value[0] : value;
    if (newValue === undefined) {
      return;
    }
    try {
      previewCurrentTime(newValue);
    } catch (err) {}
  };

  const onAudioVolumeChange: SliderOwnProps["onChange"] = (event, value) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    if (newValue === undefined) {
      return;
    }

    changeVolume(newValue);
  };

  return (
    <div className="fixed bottom-0 left-0  h-20 w-full bg-darkPrimary">
      <div className="flex items-center p-3 max-xl:justify-center max-xl:gap-10">
        <div className="flex w-full max-w-xs justify-between pl-1 max-xl:max-w-[200px]">
          <Button
            className="text-white hover:text-mainRed max-sm:hidden"
            onClick={prevTrack}
          >
            <SkipPreviousIcon className="text-5xl" />
          </Button>

          <Button
            className="text-white hover:text-mainRed"
            onClick={togglePlay}
          >
            {!audio?.paused ? (
              <PauseCircleIcon className="text-5xl hover:text-mainRed" />
            ) : (
              <PlayCircleIcon className="text-5xl hover:text-mainRed" />
            )}
          </Button>
          <Button
            className="text-white hover:text-mainRed max-sm:hidden"
            onClick={nextTrack}
          >
            <SkipNextIcon className="text-5xl hover:text-mainRed" />
          </Button>
        </div>
        <div className="pl-10 max-lg:hidden max-lg:p-0">
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
        <div className="pl-20 max-2xl:pl-5">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-center text-white max-2xl:w-52">
            {name} ● {singer}
          </div>
          <div className="flex items-center gap-5 text-white">
            <span className="w-10">
              {UtilsDate.normalizeDuration(currentTime)}
            </span>
            <Box className="w-[600px] max-2xl:w-[400px] max-xl:w-[200px] max-lg:w-[100px]">
              <Slider
                defaultValue={50}
                min={0}
                max={duration}
                value={currentTime}
                aria-label="progress-song"
                valueLabelDisplay="auto"
                valueLabelFormat={UtilsDate.normalizeDuration(currentTime)}
                className="text-mainRed"
                onChange={onAudioTimeChange}
                onChangeCommitted={onAudioTimeChangeCommitted}
              />
            </Box>
            <span className="w-10 text-white">
              {UtilsDate.normalizeDuration(duration)}
            </span>
          </div>
        </div>
        <div className="flex items-center pl-20 max-lg:pl-0 max-sm:hidden">
          <Box className="w-36 max-lg:w-24 max-md:w-20">
            <Stack
              spacing={2}
              direction="row"
              sx={{ mb: 1 }}
              alignItems="center"
            >
              <VolumeUp className="text-white" />
              <Slider
                defaultValue={0.8}
                className="text-mainRed"
                min={0}
                max={1}
                step={0.01}
                onChange={onAudioVolumeChange}
              />
            </Stack>
          </Box>
        </div>
      </div>
    </div>
  );
};
export default AudioPlayer;
