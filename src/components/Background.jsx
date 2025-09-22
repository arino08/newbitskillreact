import React from 'react';
import './Background.css';

export default function Background() {
  return (
    <div className="bg-scene" aria-hidden>
      {/* Clean gradient overlay */}
      <div className="bg-gradient" />
      
      {/* Subtle grid pattern */}
      <div className="grid-pattern" />
      
      {/* Simple floating particles */}
      <div className="particles">
        <div className="particle particle-1" />
        <div className="particle particle-2" />
        <div className="particle particle-3" />
        <div className="particle particle-4" />
        <div className="particle particle-5" />
      </div>
      
      {/* Subtle accent lines */}
      <div className="accent-lines">
        <div className="accent-line accent-line-1" />
        <div className="accent-line accent-line-2" />
      </div>
    </div>
  );
}
