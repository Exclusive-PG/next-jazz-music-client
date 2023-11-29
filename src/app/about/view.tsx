"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@mui/material";

export const AboutView: React.FC = () => {
  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="mt-2 text-6xl font-black text-white sm:text-5xl lg:text-7xl lg:leading-10 xl:text-5xl">
        Jazz Music App
      </h1>

      <Image
        src="/background.jpg"
        alt="background"
        sizes="100%"
        layout="fill"
        objectFit="cover"
        className="absolute left-0 top-0 z-[-1] blur-sm"
      />
      <p className="text-secondary my-4 max-w-5xl text-lg leading-8 text-white">
        Jazz Music App - це веб-додаток, завдяки його зручному інтерфейсу
        користувачі можуть легко створювати та управляти своїми обліковими
        записами, використовуючи реєстраційну систему. Основна функціональність
        додатка включає у себе потужний пошук за виконавцями, що дозволяє
        користувачам знаходити улюблених артистів у світі джазу. Після вибору
        виконавця користувачі можуть насолоджуватися безліччю треків, додавати
        їх до списку улюблених.
      </p>
      <Link href="https://github.com/Exclusive-PG/next-jazz-music-client">
        <Button variant="contained">Github</Button>
      </Link>
    </div>
  );
};
