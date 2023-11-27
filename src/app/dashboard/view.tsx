"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { NextPage } from "next/types";
import { useState } from "react";
import { ref, uploadBytes,getDownloadURL, FirebaseStorage } from "firebase/storage";

import { Button } from "@mui/material";
import { storage } from "~/firebase/init";

type Props = {
  session: Session | null;
 // storage: FirebaseStorage
};
export const DashView: NextPage<Props> = ({ session}) => {
  const [musicUpload, setMusicUpload] = useState<File | null>();
  
  const uploadFile = () => {
    if (!musicUpload) return;

    const musicRef = ref(storage, `jazzapp/music/${musicUpload.name}`);
    uploadBytes(musicRef, musicUpload).then((snapshot)=>{
      getDownloadURL(snapshot.ref)
        .then((url) => {
          // `url` is the download URL for 'images/stars.jpg'

          // This can be downloaded directly:
          const xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = (event) => {
            const blob = xhr.response;
          };
          xhr.open("GET", url);
          xhr.send();
          console.log(url)
        })
        .catch((error) => {
          // Handle any errors
        });
    })
  };
  return (
    <div>
      <audio src="https://firebasestorage.googleapis.com/v0/b/jazz-app-406408.appspot.com/o/jazzapp%2Fmusic%2FMeduza_Becky_Hill_GOODBOYS_-_Lose_Control_66925984.mp3?alt=media&token=63d25c71-7e15-4ba9-a09c-946ffbaa61ae" controls/>
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
      <Button onClick={uploadFile}>Upload File</Button>
      {session ? (
        <button onClick={() => signOut()}>Sign Out</button>
      ) : (
        <div>You didn't sign in</div>
      )}
    </div>
  );
};
