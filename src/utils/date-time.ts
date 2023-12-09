export class Utils {
  private static leadingZeroFormatter: Intl.NumberFormat =
    new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2,
    });

  public static normalizeDuration(time: number) {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hour = Math.floor(time / 3600);
    if (isNaN(seconds)) return `00:00`;

    if (hour === 0) {
      return `${minutes}:${this.leadingZeroFormatter.format(seconds)}`;
    } else {
      return `${hour}:${this.leadingZeroFormatter.format(
        minutes,
      )}:${this.leadingZeroFormatter.format(seconds)}`;
    }
  }
  public static async getDuration(src: string): Promise<number> {
    return await new Promise(function (resolve) {
      let audio = new Audio(src);
      audio.addEventListener("loadedmetadata", function () {
        resolve(audio.duration);
      });
    });
  }
}
