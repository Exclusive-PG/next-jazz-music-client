import { useMemo } from "react";
import { useDropzone } from "react-dropzone";

const baseStyle = {
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

type Props = {
  onDrop:(file:any) => any
};
export const FileDropzone: React.FC<Props> = ({onDrop}) => {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ accept: { "audio/*": [".mp3"] },maxFiles:1,onDrop });

     const files = acceptedFiles.map((file) => (
       <li key={file.name}>
         {file.name} - {(file.size/1024/1024).toFixed(2)} mb
       </li>
     ));
  const style: any = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  return (
    <div className="text-textSecondary h-full w-full">
      <div {...getRootProps({ style })} className="h-3/4">
        <input {...getInputProps()}/>
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {files}
    </div>
  );
};
