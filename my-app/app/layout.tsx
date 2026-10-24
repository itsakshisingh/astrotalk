import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'jyotara - Cosmic Astrology',
  description: 'Connect with expert astrologers for personalized cosmic guidance',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-transparent">
      <body>
        {/* Fixed Background Video */}
        <div className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/websiteImage/vedio2.mp4" type="video/mp4" />
          </video>
          {/* Dark overlay so text/content stays readable over the video */}
          <div className="absolute inset-0 bg-[#080914]/30" />
        </div>

        {/* Page Content - above the video */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}