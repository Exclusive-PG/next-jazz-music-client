"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { NextPage } from "next/types";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadService } from "~/services/upload";
import { api } from "~/trpc/react";
import { redirect, useRouter } from "next/navigation";
import { Track } from "@prisma/client";
import LogoutIcon from "@mui/icons-material/Logout";
import { useQuery } from "@tanstack/react-query";

type Props = {
  session: Session | null;
};
export const UploadView: NextPage<Props> = ({ session }) => {
  const [musicUpload, setMusicUpload] = useState<File>();
  const [progress, setProgress] = useState<number>(0);
  const [src, setSrc] = useState<string>("");
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
    await uploadTracks.mutateAsync({
      singer: "Unknown",
      name: musicUpload!.name.replace(/.mp3/gi, "")!,
      ref: uploadAction.ref!,
      url: uploadAction.url!,
    });
    getTracks();
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
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept=".mp3"
        name=""
        id=""
        onChange={(event) => {
          const sellectFile =
            event.target.files !== null &&
            event.target.files !== undefined &&
            event.target.files[0];
          if (sellectFile) {
            setMusicUpload(sellectFile);
          }
        }}
      />
      <div className="flex gap-10">
        <Button onClick={uploadFile} variant="contained" color="success">
          Upload File
        </Button>
      </div>
      <div className="absolute right-0">
        {session ? (
          <Button onClick={() => signOut()} startIcon={<LogoutIcon />}>
            Sign Out
          </Button>
        ) : (
          <div>You didn't sign in</div>
        )}
      </div>
      <div>{progress !== 0 && `Processing file:${progress} %`}</div>
      {/* TO DO */}
      {/* Create a <Track> component for rendering */}
      <div className="flex flex-col flex-wrap gap-5">
        {isFetched &&
          loadedTracks!.map((item: any) => (
            <div key={item.id} className=" flex flex-wrap gap-2">
              <span
                onClick={() => setSrc(item.url)}
                className="w-2/6 overflow-hidden text-ellipsis whitespace-nowrap text-black"
              >
                {item.name}
              </span>
              <Button
                className="relative m-0 w-5"
                component="label"
                variant="contained"
              >
                <CloudUploadIcon className="m-0" />
                <input
                  onChange={(event) => {
                    const sellectFile =
                      event.target.files !== null &&
                      event.target.files !== undefined &&
                      event.target.files[0];
                    if (sellectFile) {
                      updateFile(sellectFile, item.ref, item.id);
                    }
                  }}
                  type="file"
                  className="absolute bottom-0 left-0 w-full overflow-hidden opacity-0"
                />
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => deleteFile(item.id, item.ref)}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
      </div>
      <audio controls src={src} />
    </div>
  );
};

// TO DO
// input file with React-Dropzone

// const baseStyle = {
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   padding: "20px",
//   borderWidth: 2,
//   borderRadius: 2,
//   borderColor: "#eeeeee",
//   borderStyle: "dashed",
//   backgroundColor: "#fafafa",
//   color: "#bdbdbd",
//   outline: "none",
//   transition: "border .24s ease-in-out",
// };

// const focusedStyle = {
//   borderColor: "#2196f3",
// };

// const acceptStyle = {
//   borderColor: "#00e676",
// };

// const rejectStyle = {
//   borderColor: "#ff1744",
// };

// function StyledDropzone(props: any) {
//   const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
//     useDropzone({ accept: { "audio/*": [".mp3"] } });

//   const style: any = useMemo(
//     () => ({
//       ...baseStyle,
//       ...(isFocused ? focusedStyle : {}),
//       ...(isDragAccept ? acceptStyle : {}),
//       ...(isDragReject ? rejectStyle : {}),
//     }),
//     [isFocused, isDragAccept, isDragReject],
//   );

//   return (
//     <div className="container">
//       <div {...getRootProps({ style })}>
//         <input {...getInputProps()} />
//         <p>Drag 'n' drop some files here, or click to select files</p>
//       </div>
//     </div>
//   );
// }
