"use client";

import { useState } from "react";

// Miniaturka z przyciskiem; odtwarzacz YouTube (tryb nocookie) ładuje się dopiero po kliknięciu.
export default function VideoEmbed({ id, title, thumb, playLabel, duration }: { id: string; title: string; thumb: string; playLabel: string; duration?: string }) {
  const [on, setOn] = useState(false);
  if (on) {
    return (
      <div className="nod-player">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <button type="button" className="nod-player nod-player-facade" onClick={() => setOn(true)} aria-label={`${playLabel}: ${title}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={thumb} alt="" width={1280} height={720} loading="lazy" decoding="async" />
      <span className="btn btn-primary nod-play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
        <span><span className="nod-play-label">{playLabel}{duration ? " · " : ""}</span>{duration}</span>
      </span>
    </button>
  );
}
