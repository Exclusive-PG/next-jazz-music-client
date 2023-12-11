import { useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { UtilsFileSize } from "~/utils/convertSize";

import {
  acceptStyle,
  baseStyle,
  focusedStyle,
  rejectStyle,
} from "./themeDropzone";

type Props = {
  onDrop: (file: File[]) => void;
};
export const FileDropzone: React.FC<Props> = ({ onDrop }) => {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ accept: { "audio/mpeg": [".mp3"] }, maxFiles: 1, onDrop });

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {UtilsFileSize.normalize(file.size)}
    </li>
  ));
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  return (
    <div className="h-full w-full text-textSecondary">
      <div {...getRootProps({ style })} className="h-3/4">
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {files}
    </div>
  );
};
