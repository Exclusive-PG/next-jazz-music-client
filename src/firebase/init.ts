"use client";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

import { env } from "~/env.mjs";

const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FB_apiKey,
  authDomain: env.NEXT_PUBLIC_FB_authDomain,
  projectId: env.NEXT_PUBLIC_FB_projectId,
  storageBucket: env.NEXT_PUBLIC_FB_storageBucket,
  messagingSenderId: env.NEXT_PUBLIC_FB_messagingSenderId,
  appId: env.NEXT_PUBLIC_FB_appId,
  measurementId: env.NEXT_PUBLIC_FB_measurementId,
};
// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
//export const analytics = getAnalytics(firebase);
export const storage = getStorage(firebase);
