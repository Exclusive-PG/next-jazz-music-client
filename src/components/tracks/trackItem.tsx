import AlbumIcon from "@mui/icons-material/Album";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import { type Track } from "@prisma/client";

import { UtilsDate } from "~/utils/date-time";

type Props = {
  track: Track;
  //The user may not select any track
  currentTrackId: string | undefined;
  index: number;
  handleTrack: (track: Track) => void;
  //ONLY FOR YOUR OWN TRACKS
  updateFile?: (file: File, ref: string, id: string) => void;
  deleteFile?: (id: string, ref: string) => void;
};

export const TrackItem: React.FC<Props> = ({
  track,
  currentTrackId,
  index,
  deleteFile,
  updateFile,
  handleTrack,
}) => {
  const { id, ref, name, duration, singer } = track;
  const playingTrackClassName =
    id === currentTrackId
      ? `bg-darkPrimary text-textRed`
      : `hover:bg-darkPrimary hover:text-textRed`;
  const playingTrackIconClassName = id === currentTrackId && "animate-ping";
  const handelFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      updateFile?.(selectedFile, ref, id);
    }
  };
  return (
    <div
      className={`flex flex-nowrap items-center gap-2 rounded-md  p-2 text-textSecondary transition duration-200 ease-in-out hover:cursor-pointer ${playingTrackClassName} max-w-full`}
    >
      <span>{index}</span>
      <div className="rounded-lg bg-darkSecondary p-4 ">
        <AlbumIcon className={`${playingTrackIconClassName}`} />
      </div>
      <span
        onClick={() => handleTrack(track)}
        className="w-2/4 overflow-hidden text-ellipsis whitespace-nowrap xl:w-3/6"
      >
        {name}
      </span>
      <span className="px-10 max-lg:hidden">{singer}</span>
      <span className="pl-10">{UtilsDate.normalizeDuration(duration)}</span>
      <Button className="relative m-0 w-5 ">
        <CloudUploadIcon className="m-0 text-textSecondary hover:text-textRed" />
        <input
          onChange={handelFileChange}
          type="file"
          className="absolute bottom-0 left-0 w-full overflow-hidden opacity-0"
        />
      </Button>
      <Button
        onClick={() => deleteFile?.(id, ref)}
        className="relative m-0 w-5 "
      >
        <DeleteIcon className="text-textSecondary hover:text-textRed" />
      </Button>
    </div>
  );
};
