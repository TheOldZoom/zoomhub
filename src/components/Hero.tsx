"use client";

export function Hero() {
  return (
    <section className="pt-24 pb-16">
      <div className="max-w-md">
        <p className="text-xs tracking-[0.3em] uppercase text-muted">About</p>

        <p className="mt-6 text-sm text-muted leading-relaxed">
          I am Xavier Zoom Boulanger, a 16-years-old French Canadian and a
          developer who codes for fun. I build open source projects, automation
          tools, and websites like this.
        </p>

        <p className="mt-4 text-sm text-muted leading-relaxed">
          I am self-taught and have been coding for about{" "}
          {new Date().getFullYear() - 2019} years. I have experience in
          Typescript & Golang.
        </p>

        <p className="mt-4 text-sm text-muted leading-relaxed">
          Outside of coding, I am also a photographer and I enjoy listening to
          music, especially Kanye West. My favorite album is Donda.
        </p>

        <p className="mt-4 text-sm text-muted leading-relaxed">
          My family and I moved to Costa Rica in 2021. I’ve met some great
          people here, and it has become a place I genuinely appreciate.
        </p>

        <p className="mt-4 text-sm text-muted leading-relaxed">
          To the people I have met: I love you more than I usually show. You all
          mean something to me.
        </p>
      </div>
    </section>
  );
}
