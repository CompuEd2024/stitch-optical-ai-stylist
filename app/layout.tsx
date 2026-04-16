import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Stitch Optical | Scientific Luxury',
  description: 'Leveraging sub-millimeter IPD analysis and geometric facial mapping to create engineered optical frames.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="antialiased">
        {children}
      </body>
    </html>
  );
}
