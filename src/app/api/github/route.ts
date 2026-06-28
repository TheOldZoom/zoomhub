export async function GET(req: Request) {
  const user = process.env.GITHUB_USER;

  if (!user) {
    return Response.json({ error: "Missing user" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.github.com/users/${user}/repos?per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "portfolio-app",
      },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    return Response.json({ error: "GitHub request failed" }, { status: 500 });
  }

  const data = await res.json();

  const top = (data || [])
    .filter((repo: any) => !repo.fork)
    .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);

  return Response.json(top);
}
