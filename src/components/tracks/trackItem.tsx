import { Button } from "@mui/material";
import { Track } from "@prisma/client";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Image from "next/image";
import { Utils } from "~/services/utils";

type Props = {
  track: Track;
  currentTrackId: string | undefined;
  index?: number;
  updateFile?: (file: File, ref: string, id: string) => void;
  deleteFile?: (id: string, ref: string) => void;
  handleTrack?: (track: Track) => void;
};

export const TrackItem: React.FC<Props> = ({
  track,
  currentTrackId,
  index,
  deleteFile,
  updateFile,
  handleTrack,
}) => {
  const { id, ref, url, name, duration, singer } = track;
  const showPlayingTrack = () => {
    if (id === currentTrackId) {
      return `bg-darkPrimary text-textRed`;
    } else {
      return `hover:bg-darkPrimary hover:text-textRed`;
    }
  };
  return (
    <div
      key={id}
      className={`flex flex-nowrap items-center gap-2 rounded-md  p-2 text-textSecondary transition duration-200 ease-in-out hover:cursor-pointer ${showPlayingTrack()} max-w-full`}
    >
      <span>{index}</span>
      <Image
        src="/background.jpg"
        alt="poster"
        width={60}
        height={60}
        objectFit="contain"
        className="ml-2 rounded-md"
        quality={100}
      />
      <span
        onClick={() => handleTrack?.(track)}
        className="w-2/4 overflow-hidden text-ellipsis whitespace-nowrap xl:w-3/6"
      >
        {name}
      </span>
      <span className="pl-5 lg:hidden">{singer}</span>
      <span className="pl-5">{Utils.normalizeDuration(duration)}</span>
      <Button className="relative m-0 w-5 text-textSecondary hover:text-textRed">
        <CloudUploadIcon className="m-0 hover:text-textRed" />
        <input
          onChange={(event) => {
            const sellectFile =
              event.target.files !== null &&
              event.target.files !== undefined &&
              event.target.files[0];
            if (sellectFile) {
              updateFile?.(sellectFile, ref, id);
            }
          }}
          type="file"
          className="absolute bottom-0 left-0 w-full overflow-hidden opacity-0"
        />
      </Button>
      <Button
        onClick={() => deleteFile?.(id, ref)}
        className="relative m-0 w-5 text-textSecondary hover:text-textRed "
      >
        <DeleteIcon className="hover:text-textRed " />
      </Button>
    </div>
  );
};
