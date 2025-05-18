import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>Welcome to Velvet AI</title>
        <meta name="description" content="Elegant AI curtain advisor" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-b from-[#fdfaf6] to-[#f8f4ee] flex flex-col items-center justify-center text-center px-4 py-20 font-[Outfit] relative overflow-hidden">
        {/* Sparkles background */}
        <div className="absolute inset-0 bg-[url('/sparkles.svg')] bg-cover bg-center opacity-10 pointer-events-none animate-pulse" />

        {/* Floating curtain motif */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-[url('/curtain-motif.svg')] bg-no-repeat bg-contain opacity-20 animate-float pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[url('/curtain-motif.svg')] bg-no-repeat bg-contain opacity-20 animate-float pointer-events-none" />

        <h1 className="text-5xl sm:text-6xl font-bold text-[#2c2c2c] mb-4 animate-fade-in">
          Welcome to <span className="text-pink-600">Velvet AI</span> ✨
        </h1>
        <p className="text-lg text-[#666] mb-8 max-w-xl animate-fade-in delay-150">
          Your stylish assistant for expert curtain advice. Powered by voice, elegance, and experience.
        </p>
        <Link href="/askvelvet" className="text-white bg-pink-500 hover:bg-pink-600 transition px-6 py-3 rounded-xl font-medium shadow-md animate-fade-in delay-300">
          Try Velvet Now
        </Link>
      </main>
    </>
  );
}

