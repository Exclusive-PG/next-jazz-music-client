"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { NextPage } from "next/types";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, LinearProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadService } from "~/services/upload";
import { api } from "~/trpc/react";
import LogoutIcon from "@mui/icons-material/Logout";
import { Sidebar } from "~/components/sidebar";
import { Track } from "@prisma/client";
import { TrackItem } from "~/components/tracks/trackItem";
import { Wrapper } from "~/components/wrapper";
import { FileDropzone } from "~/components/ui/dropzone";
import { AudioPlayer } from "~/components/audio-kit/audioPlayer";
import { Utils } from "~/services/utils";
import { redirect } from "next/navigation";

//MAYBE
// const defaultTrackData: Track = {
//   id: "11111",
//   albumn: null,
//   duration: 300,
//   name: "Gimme the Night",
//   posterUrl: null,
//   ref: "",
//   singer: "George Benson",
//   url: "",
//   userId: "",
// };

//TO DO
//ADD FULL RESPONSIVE PAGE
type Props = {
  session: Session | null;
};
export const UploadView: NextPage<Props> = ({ session }) => {
  const [musicUpload, setMusicUpload] = useState<File>();
  const onDrop = useCallback((acceptedFile: any) => {
    setMusicUpload(acceptedFile[0]);
    console.log(acceptedFile);
  }, []);

  const [progress, setProgress] = useState<number>(0);
  const [currentTrack, setCurrentTrack] = useState<Track>();
  const queryUtils = api.useUtils();
  useEffect(() => {
    getTracks();
  }, []);

  const {
    data: loadedTracks,
    refetch: getTracks,
    isFetched,
  } = api.tracks.getFiles.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  const uploadTracks = api.tracks.addFile.useMutation({
    onSuccess: () => {
      queryUtils.tracks.getFiles.invalidate();
    },
  });
  const deleteTracks = api.tracks.deleteFile.useMutation({
    onSuccess: () => {
      queryUtils.tracks.getFiles.invalidate();
    },
  });
  const updateTracks = api.tracks.updateFile.useMutation({
    onSuccess: () => {
      queryUtils.tracks.getFiles.invalidate();
    },
  });

  async function uploadFile() {
    const uploadAction = await uploadService.uploadFile(
      session?.user.id!,
      musicUpload!,
      setProgress,
    );

    if (!uploadAction.status) return;

    const duration: number = await Utils.getDuration(uploadAction.url!);

    await uploadTracks.mutateAsync({
      singer: "Unknown",
      name: musicUpload!.name.replace(/.mp3/gi, "")!,
      ref: uploadAction.ref!,
      url: uploadAction.url!,
      duration,
    });
    getTracks();
    setProgress(0);
  }
  async function deleteFile(trackId: string, trackRef: string) {
    const deleteAction = await uploadService.deleteFile(trackRef);
    if (!deleteAction.status) return;
    await deleteTracks.mutateAsync({ trackId });
    getTracks();
  }
  async function updateFile(file: File, trackRef: string, trackId: string) {
    const updateAction = await uploadService.updateFile(
      trackRef,
      file,
      setProgress,
    );
    if (!updateAction.status) return;
    await updateTracks.mutateAsync({ trackId, url: updateAction.url! });
    getTracks();
    setProgress(0);
  }

  return (
    <main className="bg-darkSecondary text-white">
      <Wrapper>
        <div className="relative flex h-screen ">
          <Sidebar />
          <div className="w-full p-4 xl:w-3/4">
            <h3 className="my-2 text-base text-white sm:text-base lg:text-xl lg:leading-10 xl:text-2xl ">
              Drop Zone
            </h3>
            <div className="mx-auto h-1/4 md:w-4/5 lg:mx-auto lg:w-2/4 xl:w-2/3">
              <FileDropzone onDrop={onDrop} />
            </div>
            <div className="pb-5">
              {progress !== 0 && (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress
                    variant="determinate"
                    value={progress}
                    className="bg-mainRed text-textRed"
                  />
                </Box>
              )}
            </div>
            <div className="flex justify-center gap-10">
              <Button
                onClick={uploadFile}
                className="gap-1 border-textSecondary text-textSecondary hover:border-mainRed hover:bg-mainRed hover:text-white"
                variant="outlined"
              >
                <CloudUploadIcon />
                <span className="normal-case">Upload</span>
              </Button>
            </div>
            <div className="absolute right-0">
              {session ? (
                <Button
                  onClick={() => signOut()}
                  startIcon={<LogoutIcon />}
                  className="normal-case text-textSecondary"
                >
                  Sign Out
                </Button>
              ) : (
                redirect("/login")
              )}
            </div>

            <h3 className="mt-2 text-base text-white sm:text-base lg:text-xl lg:leading-10 xl:w-3/4 xl:text-2xl">
              Your Tracks
            </h3>

            <div className="scrollbar flex h-2/4 flex-col gap-5 overflow-y-scroll py-6">
              {isFetched &&
                loadedTracks!.map((item: Track, index: number) => (
                  <TrackItem
                    currentTrackId={currentTrack?.id}
                    key={item.id}
                    track={item}
                    deleteFile={deleteFile}
                    updateFile={updateFile}
                    handleTrack={setCurrentTrack}
                    index={index + 1}
                  />
                ))}
            </div>
            {/* <audio controls src={src} className="absolute left-0 top-0"/> */}

            {currentTrack !== undefined && loadedTracks !== undefined && (
              <AudioPlayer
                currentTrack={currentTrack}
                playlist={loadedTracks}
                onChangeCurrentTrack={setCurrentTrack}
              />
            )}
          </div>
        </div>
      </Wrapper>
    </main>
  );
};
