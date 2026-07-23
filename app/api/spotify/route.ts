import { NextResponse } from 'next/server';

export async function GET() {
  const topTracks = [
    {
      title: "Midnight City",
      artist: "M83",
      albumImageUrl: "https://i.scdn.co/image/ab67616d0000b273b5f7e7f7b3c2e171cb2a013a",
      songUrl: "https://open.spotify.com/track/1aF1v1660H6YnIuN0tWn2q"
    },
    {
      title: "Blinding Lights",
      artist: "The Weeknd",
      albumImageUrl: "https://i.scdn.co/image/ab67616d0000b2738863bc11d2aa12b54f5aeb36",
      songUrl: "https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b"
    },
    {
      title: "As It Was",
      artist: "Harry Styles",
      albumImageUrl: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14",
      songUrl: "https://open.spotify.com/track/4LRPz4R5pB9KAlX8zQ1B3p"
    }
  ];

  const randomTrack = topTracks[Math.floor(Math.random() * topTracks.length)];

  return NextResponse.json({
    albumImageUrl: randomTrack.albumImageUrl,
    artist: randomTrack.artist,
    isPlaying: true,
    songUrl: randomTrack.songUrl,
    title: randomTrack.title,
  }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
    }
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
    }
  });
}
