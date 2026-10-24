'use client';

import React from 'react';

export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src="/websiteImage/vedio2.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay so text/content stays readable over the video */}
      <div className="absolute inset-0 bg-[#080914]/80" />
    </div>
  );
}