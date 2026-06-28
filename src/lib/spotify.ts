let cachedToken: { token: string; expires: number } | null = null;

async function getAccessToken() {
  try {
    if (cachedToken && cachedToken.expires > Date.now()) {
      return cachedToken.token;
    }

    if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new Error("No spotify env");
    }

    const authHeader =
      "Basic " +
      Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString("base64");

    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    const text = await res.text();

    if (!res.ok) {
      throw new Error("Failed to get Spotify token");
    }

    const data = JSON.parse(text);

    cachedToken = {
      token: data.access_token,
      expires: Date.now() + data.expires_in * 1000,
    };

    return cachedToken.token;
  } catch (err) {
    throw err;
  }
}

export async function spotifyFetch(url: string) {
  const token = await getAccessToken();

  const res = await fetch(`https://api.spotify.com/v1/${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {
      revalidate: 3600,
    },
  });

  if (res.status === 429) {
    const retryAfter = res.headers.get("retry-after");

    const waitTime = retryAfter ? parseInt(retryAfter, 10) : 1;

    await new Promise((r) => setTimeout(r, waitTime * 1000));

    return spotifyFetch(url);
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Spotify API error: ${res.status} ${text}`);
  }

  return res.json();
}
