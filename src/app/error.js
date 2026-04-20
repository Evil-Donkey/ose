"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
      console.error("App error boundary caught:", error);
    }
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 pt-40 pb-20">
      <div className="max-w-xl text-center">
        <h1 className="text-4xl lg:text-5xl text-darkblue mb-4">Something went wrong</h1>
        <p className="text-base lg:text-lg mb-8">
          We hit an unexpected hiccup loading this page. Please try again — if the issue persists, head back to the homepage.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center rounded-xl bg-[#00A0CC] px-5 py-3 text-white font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-xl border border-[#00A0CC] px-5 py-3 text-[#00A0CC] font-bold hover:bg-[#00A0CC] hover:text-white transition-colors"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
