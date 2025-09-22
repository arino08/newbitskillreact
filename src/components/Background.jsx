import React from 'react';
import './Background.css';

export default function Background() {
  return (
    <div className="bg-scene" aria-hidden>
      <div className="bg-gradient" />
      <div className="bg-noise" />
      <div className="bg-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>
      <div className="grid-overlay" />
      <div className="particles" />
    </div>
  );
}
