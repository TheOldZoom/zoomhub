import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Releases } from "@/components/Releases";
import { Github } from "@/components/Github";
import { Footer } from "@/components/Footer";
import { LastFm } from "@/components/LastFm";
import { ChessCom } from "@/components/ChessCom";

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-6 bg-background text-foreground min-h-screen">
      <Nav />
      <Hero />
      <Github />
      <LastFm />
      <Releases />
      <ChessCom />
      <Footer />
    </main>
  );
}
