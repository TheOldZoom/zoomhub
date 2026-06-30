import { Hero } from "@/components/Hero";
import { Releases } from "@/components/Releases";
import { Github } from "@/components/Github";
import { LastFm } from "@/components/LastFm";
import { ChessCom } from "@/components/ChessCom";

export default function Home() {
  return (
    <div>
      <Hero />
      <Github />
      <LastFm />
      <Releases />
      <ChessCom />
    </div>
  );
}
