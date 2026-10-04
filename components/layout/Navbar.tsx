"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import NavLogo from "@/public/insight.png";
import { FaGithub, FaStar, FaXTwitter } from "react-icons/fa6";

const SCROLL_THRESHOLD = 8;

export default function Navbar() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLSpanElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      setScrolled(y > SCROLL_THRESHOLD);

      // Updated directly on the element so scrolling doesn't re-render the component
      if (progressRef.current) {
        const progress = max > 0 ? Math.min(1, y / max) : 0;
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update); // at most one update per frame
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // On the home page, clicking the logo scrolls smoothly to the top
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const pillBase =
    "inline-flex h-[38px] items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.06] text-sm font-semibold text-white transition duration-200 hover:-translate-y-px hover:border-[#fc8a23] hover:bg-[#fc8a23] hover:text-[#111] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc8a23] motion-reduce:transition-none";

  return (
    // Fixed wrapper: centres the pill and lets clicks pass through the empty sides
    <header
      className={`pointer-events-none fixed inset-x-0 z-50 flex justify-center px-3.5 transition-[top] duration-300 motion-reduce:transition-none ${
        scrolled ? "top-2" : "top-3.5"
      }`}
    >
      <nav
        aria-label="Main"
        className={`pointer-events-auto relative flex w-full max-w-270 items-center justify-between overflow-hidden rounded-full border px-2 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 motion-reduce:transition-none sm:px-3 ${
          scrolled
            ? "h-13 border-[#fc8a23]/30 bg-[#141414]/80 shadow-[0_12px_40px_rgba(0,0,0,0.55),0_0_40px_rgba(252,138,35,0.08)] sm:h-14"
            : "h-14 border-white/[0.07] bg-[#181818]/45 sm:h-16"
        }`}
      >
        {/* faint highlight along the top edge */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[12%] top-0 h-px bg-linear-to-r from-transparent via-white/30 to-transparent"
        />

        {/* ---------------- Brand ---------------- */}
        <Link
          href="/"
          onClick={handleLogoClick}
          aria-label="LeetInsight – back to top"
          className="group flex items-center gap-2.5 rounded-full p-1 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc8a23]"
        >
          {/* Orange tile keeps the (dark) logo visible on the dark glass background */}
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-[#f9b06a] to-[#e07c1f] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.25),0_6px_18px_rgba(252,138,35,0.38)] transition duration-300 group-hover:-rotate-6 group-hover:scale-105 group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3),0_8px_26px_rgba(252,138,35,0.6)] motion-reduce:transition-none sm:h-10 sm:w-10 sm:rounded-[13px]">
            <Image
              src={NavLogo}
              alt="LeetInsight logo"
              className="h-6 w-6 sm:h-7 sm:w-7"
            />
          </span>

          <span className="text-lg font-extrabold tracking-tight text-white sm:text-[21px]">
            Leet
            <span className="bg-linear-to-r from-[#fc8a23] to-[#ffc58a] bg-clip-text text-transparent">
              Insight
            </span>
          </span>
        </Link>

        {/* ---------------- Actions ---------------- */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/AritraC1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Star LeetInsight on GitHub"
            className={`group ${pillBase} w-9.5 sm:w-auto sm:px-3.5`}
          >
            <FaGithub className="text-lg" />
            <span className="hidden sm:inline">Star on GitHub</span>
            <FaStar className="hidden text-[13px] transition-transform duration-300 group-hover:rotate-72 group-hover:scale-110 motion-reduce:transition-none sm:block" />
          </a>

          <a
            href="https://x.com/Aritra_C1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Follow on X (Twitter)"
            className={`${pillBase} w-9.5`}
          >
            <FaXTwitter className="text-lg" />
          </a>
        </div>
      </nav>
    </header>
  );
}