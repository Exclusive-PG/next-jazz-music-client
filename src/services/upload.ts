import { storage } from "~/firebase/init";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  FirebaseStorage,
  listAll,
  StorageReference,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { Dispatch } from "react";

type UploadFilePath = {
  userId: string;
  file: File;
};
type UpdateFile = {
  filePath: string;
  file: File;
};

class UploadService {
  public readonly rootFolder: string = "jazzapp/music/";

  public async uploadFile(
    fPath: UploadFilePath,
    setProgress?: Dispatch<{ percents: number; operation: string }>,
  ): Promise<{ status: boolean; url?: string }> {
    if (!fPath.file) return Promise.resolve({ status: false });

    const subMusicRef = `/${fPath.userId}/${fPath.file.name}`;
    const fullMusicRef = ref(storage, `${this.rootFolder}${subMusicRef}`);
    const uploadTask = uploadBytesResumable(fullMusicRef, fPath.file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        if (setProgress) {
          setProgress({ percents: progress, operation: "Upload" });
        }
      },
      (error) => {
        console.error(error);
        Promise.reject({ status: false });
      },
    );
    await uploadTask;

    const url = await getDownloadURL(fullMusicRef);

    return Promise.resolve({ status: true, url });
  }
  public deleteFile(filePath: string): Promise<{ status: boolean }> {
    const deleteRef = ref(storage, `${this.rootFolder}${filePath}`);
    deleteObject(deleteRef)
      .then(() => {
        console.log(`File deleted: ${deleteRef}`);
      })
      .catch((error) => {
        console.error(deleteRef.fullPath);
        console.error(error);
        return Promise.resolve({ status: false });
      });
    return Promise.resolve({ status: true });
  }
  public async updateFile(
    fPath: UpdateFile,
    setProgress?: Dispatch<{ percents: number; operation: string }>,
  ): Promise<{ status: boolean; reason?: string; url?: string }> {
    if (!fPath.file)
      return Promise.reject({ status: false, reason: "File Not Found!" });

    const updateRef = ref(storage, `${this.rootFolder}${fPath.filePath}`);

    const fileIsExists = (await this.checkIfFileExists(updateRef)).status;

    if (!fileIsExists)
      return Promise.reject({ status: false, reason: "File Doesn't Exists!" });
    const uploadTask = uploadBytesResumable(updateRef, fPath.file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        if (setProgress) {
          setProgress({ percents: progress, operation: "Update" });
        }
        console.log(`Updated File: ${progress} %`);
      },
      (error) => {
        console.error(error);
      },
    );
    await uploadTask;
    const url = await getDownloadURL(updateRef);
    return Promise.resolve({ status: true, url });
  }
  public checkIfFileExists(
    StorageFile: StorageReference,
  ): Promise<{ status: boolean; url: string }> {
    return getDownloadURL(StorageFile)
      .then((url) => {
        console.log("File Exists!");
        return Promise.resolve({ status: true, url });
      })
      .catch((error) => {
        if (error.code === "storage/object-not-found") {
          console.log("File Doesn't Exists!");
          return Promise.resolve({
            status: false,
            url: "storage/object-not-found",
          });
        } else {
          return Promise.reject(error);
        }
      });
  }
}
export const uploadService = new UploadService();

