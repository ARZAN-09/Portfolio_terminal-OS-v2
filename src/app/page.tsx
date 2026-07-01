"use client";

import dynamic from "next/dynamic";

// Load the terminal client-side only (it relies on browser APIs + zustand).
const Terminal = dynamic(
  () => import("@/components/terminal/Terminal").then((m) => m.Terminal),
  { ssr: false }
);

export default function Home() {
  return <Terminal />;
}
