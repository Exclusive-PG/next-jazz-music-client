export class UtilsFileSize {
  public static normalize(bytes: number) {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes == 0) return "n/a";

    const index = Math.floor(Math.log(bytes) / Math.log(1024));
    if (index == 0) return bytes + " " + sizes[index];
    return (bytes / Math.pow(1024, index)).toFixed(2) + " " + sizes[index];
  }
}
