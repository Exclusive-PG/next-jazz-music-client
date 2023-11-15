"use client";
import Link from "next/link";
import WrapperComponent from "~/hoc/WrapperComponent";
import Image from "next/image";
import { CustomizedButtons } from "./UI/CustomButton";
import githubIcon from "../assets/github.png";

function About() {
  return (
    <div className="min-h-screen px-[15px] py-[30px]">
      <h1 className="xs:text-[50px] mt-2 text-[40px] font-black text-white sm:text-[60px] lg:text-[80px] lg:leading-[98px]">
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
      <p className="text-secondary my-4 max-w-5xl text-[17px] leading-[30px] text-white">
        Jazz Music App - це веб-додаток, завдяки його зручному інтерфейсу
        користувачі можуть легко створювати та управляти своїми обліковими
        записами, використовуючи реєстраційну систему. Основна функціональність
        додатка включає у себе потужний пошук за виконавцями, що дозволяє
        користувачам знаходити улюблених артистів у світі джазу. Після вибору
        виконавця користувачі можуть насолоджуватися безліччю треків, додавати
        їх до списку улюблених.
      </p>
      <Link href="https://github.com/Exclusive-PG/next-jazz-music-client">
        <CustomizedButtons textBtn="Github" image={githubIcon} />
      </Link>
    </div>
  );
}

export default WrapperComponent(About);
