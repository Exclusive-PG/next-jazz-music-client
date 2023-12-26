import {
  deleteObject,
  getDownloadURL,
  ref,
  type StorageReference,
  uploadBytesResumable,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

import { storage } from "~/firebase/init";

type PromiseData = {
  status: boolean;
  url?: string;
  ref?: string;
  reason?: string;
};

class UploadService {
  public static readonly rootFolder: string = "jazzapp/";
  public readonly namespace: string;

  constructor(namespace: string) {
    this.namespace = namespace;
  }
  get folderPath() {
    return `${UploadService.rootFolder}${this.namespace}/`;
  }
  public async uploadFile(
    userId: string,
    file: File,
    setProgress?: (percents: number) => void,
  ): Promise<PromiseData> {
    if (!file) {
      return Promise.resolve({ status: false });
    }

    const subMusicRef = `${userId}/${uuidv4()}`;

    const fullMusicRef = ref(storage, `${this.folderPath}${subMusicRef}`);
    const uploadTask = uploadBytesResumable(fullMusicRef, file);
    uploadTask.on("state_changed", (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
      );

      setProgress?.(progress);
    });
    await uploadTask;

    const url = await getDownloadURL(fullMusicRef);

    return Promise.resolve({ status: true, url, ref: subMusicRef });
  }
  public async deleteFile(filePath: string): Promise<PromiseData> {
    const deleteRef = ref(storage, `${this.folderPath}${filePath}`);
    try {
      await deleteObject(deleteRef);
    } catch (error) {
      return Promise.resolve({ status: true, reason: "Error delete file" });
    }

    return Promise.resolve({ status: true });
  }
  public async updateFile(
    filePath: string,
    file: File,
    setProgress?: (percents: number) => void,
  ): Promise<PromiseData> {
    if (!file) {
      return Promise.reject({ status: false, reason: "File Not Found!" });
    }

    const updateRef = ref(storage, `${this.folderPath}${filePath}`);

    const fileIsExists = (await this.checkIfFileExists(updateRef)).status;

    if (!fileIsExists) {
      return Promise.reject({ status: false, reason: "File Doesn't Exists!" });
    }
    const uploadTask = uploadBytesResumable(updateRef, file);
    uploadTask.on("state_changed", (snapshot) => {
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
      );
      setProgress?.(progress);
    });
    await uploadTask;
    const url = await getDownloadURL(updateRef);
    return Promise.resolve({ status: true, url });
  }
  public async checkIfFileExists(
    StorageFile: StorageReference,
  ): Promise<PromiseData> {
    let url;
    try {
      url = await getDownloadURL(StorageFile);
    } catch (error) {
      return Promise.reject({ status: false, reason: "File Not Found" });
    }

    return Promise.resolve({ status: true, url });
  }
}
export const uploadService = new UploadService("music");
