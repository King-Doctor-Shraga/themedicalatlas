import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF8] text-[#1A1A1A] antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              404
            </h1>
            <p className="text-xl text-[#5C5C5C] mb-8">
              Page not found
            </p>
            <Link
              href="/ar"
              className="inline-block px-6 py-3 rounded-full bg-[#0066CC] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
