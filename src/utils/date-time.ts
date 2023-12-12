import { addSeconds, format } from "date-fns";

export class UtilsDate {
  public static normalizeDuration(seconds: number) {
    try {
      const helperDate = addSeconds(new Date(0), seconds);
      return format(helperDate, "mm:ss");
    } catch (e) {}
  }
  public static async getDuration(src: string): Promise<number> {
    return await new Promise(function (resolve) {
      const audio = new Audio(src);
      audio.addEventListener("loadedmetadata", function () {
        resolve(audio.duration);
      });
    });
  }
}
