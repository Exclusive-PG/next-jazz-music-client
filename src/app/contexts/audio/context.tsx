"use client";
import { useContext } from "react";

import { AudioContext } from "./init";

export function useAudioContext() {
  return useContext(AudioContext);
}
