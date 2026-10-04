"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toBlob, toPng } from "html-to-image";

import { LeetCodeProfile } from "@/types/leetcode";

// Types
type Counts = Record<"total" | "easy" | "medium" | "hard", number>;

export interface CardStats {
  solved: Counts;
  available: Counts;
}

interface CardProps {
  profile: LeetCodeProfile;
  stats?: CardStats;
}

// Constants

const CARD_WIDTH = 880; // the card is always laid out at this width, so the PNG is identical on every device
const MAX_BADGES = 14; // 2 rows of 7; if there are more, the last slot becomes a "+N" tile
const MAX_LANGUAGES = 4;

const RING_RADIUS = 58;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const DIFFICULTIES = [
  { key: "easy", label: "Easy", color: "#00b8a3" },
  { key: "medium", label: "Medium", color: "#ffc01e" },
  { key: "hard", label: "Hard", color: "#ef4743" },
] as const;

const CARD_BACKGROUND = [
  "radial-gradient(520px 320px at 100% 0%, rgba(239,146,66,.22), transparent 70%)",
  "radial-gradient(420px 260px at 0% 100%, rgba(0,184,163,.10), transparent 70%)",
  "linear-gradient(150deg, #242424, #151515)",
].join(", ");

const fmt = (n: number) => n.toLocaleString("en-US");
const pct = (value: number, max: number) =>
  max > 0 ? Math.min(100, (value / max) * 100) : 0;

// Components
export default function Card({ profile, stats }: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [stageHeight, setStageHeight] = useState<number>();
  const [busy, setBusy] = useState<"download" | "copy" | null>(null);
  const [failedBadges, setFailedBadges] = useState<Set<string>>(new Set());

  /* ---------- toast ---------- */
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const flash = useCallback((message: string) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  /* ---------- scale the fixed-width card to fit small screens ---------- */
  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    if (!stage || !card) return;

    const update = () => {
      const s = Math.min(1, stage.clientWidth / CARD_WIDTH);
      setScale(s);
      setStageHeight(card.offsetHeight * s);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(stage);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  /* ---------- derived data ---------- */
  const displayName = profile.profile?.realName || profile.username;
  const showHandle = displayName !== profile.username;

  const languages = profile.languageProblemCount
    ? [...profile.languageProblemCount]
        .sort((a, b) => b.problemsSolved - a.problemsSolved)
        .slice(0, MAX_LANGUAGES)
    : [];
  const maxLanguage = Math.max(...languages.map((l) => l.problemsSolved), 1);

  const allBadges = (profile.badges ?? []).filter(
    (b) => !failedBadges.has(String(b.id)),
  );
  const overflow = allBadges.length > MAX_BADGES;
  const badges = overflow ? allBadges.slice(0, MAX_BADGES - 1) : allBadges;
  const extraBadges = overflow ? allBadges.length - badges.length : 0;

  const monthYear = new Date().toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  /* ---------- export ---------- */
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setBusy("download");
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2 });
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `leetinsight-${profile.username}.png`;
      link.click();
      flash("Card downloaded");
    } catch (err) {
      console.error(err);
      flash("Couldn't export the card");
    } finally {
      setBusy(null);
    }
  };

  const handleCopy = async () => {
    if (!cardRef.current) return;
    setBusy("copy");
    try {
      const blob = await toBlob(cardRef.current, { pixelRatio: 2 });
      if (!blob) throw new Error("No image produced");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      flash("Image copied to clipboard");
    } catch (err) {
      console.error(err);
      flash("Copy isn't supported here – use Download");
    } finally {
      setBusy(null);
    }
  };

  const handleBadgeError = (id: string) => {
    setFailedBadges((prev) => {
      if (prev.has(id)) return prev;
      if (prev.size === 0) flash("Some badges failed to load");
      return new Set(prev).add(id);
    });
  };

  /* ---------- ring math ---------- */
  const solvedPct = stats ? pct(stats.solved.total, stats.available.total) : 0;
  const ringOffset = RING_CIRCUMFERENCE * (1 - solvedPct / 100);

  return (
    <section className="mx-auto w-full max-w-220" aria-label="Your profile card">
      {/* ============ Stage: scales the card down on small screens ============ */}
      <div
        ref={stageRef}
        className="w-full overflow-hidden"
        style={{ height: stageHeight }}
      >
        <div
          style={{
            width: CARD_WIDTH,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* ======================= THE CARD (exported) ======================= */}
          {/* Avoid backdrop-blur / mix-blend here: they don't survive PNG export */}
          <div
            ref={cardRef}
            className="relative overflow-hidden rounded-[28px] border border-[#3a3a3a] p-9 text-white"
            style={{ width: CARD_WIDTH, background: CARD_BACKGROUND }}
          >
            {/* ---- Top: user + brand ---- */}
            <div className="flex items-center justify-between gap-5">
              <div className="flex min-w-0 items-center gap-5">
                <div className="h-23 w-23 flex-none rounded-full bg-linear-to-br from-[#ef9242] to-[#ffd29e] p-1">
                  {profile.profile?.userAvatar ? (
                    <Image
                      src={profile.profile.userAvatar}
                      alt={`${displayName} avatar`}
                      width={88}
                      height={88}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center rounded-full bg-[#222] text-4xl font-extrabold text-[#ef9242]">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="wrap-break-words text-3xl font-extrabold leading-tight tracking-tight">
                    {displayName}
                  </h2>
                  {showHandle && (
                    <p className="mt-1 font-mono text-base text-neutral-400">
                      @{profile.username}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start whitespace-nowrap text-base font-extrabold text-[#ef9242]">
                <svg
                  viewBox="0 0 48 48"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M24 7a11 11 0 0 0-6.5 19.9c1.2.9 1.8 2 1.8 3.4V32h9.4v-1.7c0-1.4.6-2.5 1.8-3.4A11 11 0 0 0 24 7Z" />
                  <path d="M19.5 36.5h9M21 41h6" />
                </svg>
                LeetInsight
              </div>
            </div>

            {/* ---- Middle: solved, then languages + badges side by side ---- */}
            <div className="mt-7 flex flex-col gap-4.5">
              {stats && (
                <Panel title="Problems Solved">
                  <div className="flex items-center gap-5.5">
                    <div className="relative h-34 w-34 flex-none">
                      <svg
                        viewBox="0 0 136 136"
                        className="h-full w-full -rotate-90"
                        aria-hidden="true"
                      >
                        <circle
                          cx={68}
                          cy={68}
                          r={RING_RADIUS}
                          fill="none"
                          stroke="rgba(255,255,255,.1)"
                          strokeWidth={12}
                        />
                        <circle
                          cx={68}
                          cy={68}
                          r={RING_RADIUS}
                          fill="none"
                          stroke="#ef9242"
                          strokeWidth={12}
                          strokeLinecap="round"
                          strokeDasharray={RING_CIRCUMFERENCE}
                          strokeDashoffset={ringOffset}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <strong className="text-[34px] font-extrabold leading-none tracking-tight">
                          {fmt(stats.solved.total)}
                        </strong>
                        <span className="mt-1 text-xs text-neutral-400">
                          of {fmt(stats.available.total)}
                        </span>
                      </div>
                    </div>

                    <div className="grid flex-1 gap-3.5">
                      {DIFFICULTIES.map(({ key, label, color }) => (
                        <div key={key}>
                          <div className="flex justify-between text-[13px] font-semibold">
                            <span style={{ color }}>{label}</span>
                            <span>
                              {fmt(stats.solved[key])}{" "}
                              <em className="font-medium not-italic text-neutral-400">
                                / {fmt(stats.available[key])}
                              </em>
                            </span>
                          </div>
                          <Bar
                            percent={pct(stats.solved[key], stats.available[key])}
                            background={color}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>
              )}

              <div className="flex items-stretch gap-4.5">
                <Panel title="Top Languages" className="w-70 flex-none">
                  {languages.length === 0 ? (
                    <p className="text-sm text-neutral-400">No language data yet.</p>
                  ) : (
                    <div className="grid gap-3.5">
                      {languages.map((lang) => (
                        <div key={lang.languageName}>
                          <div className="flex justify-between text-sm font-semibold">
                            <span>{lang.languageName}</span>
                            <span className="font-medium text-neutral-400">
                              {fmt(lang.problemsSolved)} solved
                            </span>
                          </div>
                          <Bar
                            percent={pct(lang.problemsSolved, maxLanguage)}
                            background="linear-gradient(90deg, #ef9242, #ffc58a)"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel
                  title={`Badges · ${allBadges.length}`}
                  className="min-w-0 flex-1"
                >
                  {badges.length === 0 ? (
                    <p className="text-sm text-neutral-400">No badges earned yet.</p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      {badges.map((badge) => (
                        <Image
                          key={badge.id}
                          src={badge.icon}
                          alt={badge.name}
                          width={56}
                          height={56}
                          className="h-14 w-14"
                          onError={() => handleBadgeError(String(badge.id))}
                        />
                      ))}
                      {extraBadges > 0 && (
                        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-dashed border-[#ef9242]/50 bg-white/6 font-extrabold text-[#ef9242]">
                          +{extraBadges}
                        </div>
                      )}
                    </div>
                  )}
                </Panel>
              </div>
            </div>

            {/* ---- Footer ---- */}
            <div className="mt-5.5 flex justify-between text-xs text-neutral-500">
              <span>Generated with LeetInsight</span>
              <span>{monthYear}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============ Actions (outside the exported node) ============ */}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy !== null}
          className="inline-flex h-12 items-center gap-2 rounded-[14px] bg-[#ef9242] px-6 font-bold text-[#111] transition hover:bg-[#f7a355] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4.5 w-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
          </svg>
          {busy === "download" ? "Preparing…" : "Download PNG"}
        </button>

        <button
          type="button"
          onClick={handleCopy}
          disabled={busy !== null}
          className="inline-flex h-12 items-center gap-2 rounded-[14px] border-[1.5px] border-[#333] px-6 font-bold text-white transition hover:border-[#ef9242] hover:text-[#ef9242] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4.5 w-4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15V5a2 2 0 0 1 2-2h10" />
          </svg>
          {busy === "copy" ? "Copying…" : "Copy image"}
        </button>
      </div>

      {/* Toast – bottom-centre so it never collides with the bottom-right privacy button */}
      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-7 left-1/2 z-60 -translate-x-1/2 rounded-full bg-white px-4.5 py-2.5 text-sm font-semibold text-[#111] transition-all duration-200 ${
          toast ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        {toast}
      </div>
    </section>
  );
}

// Helpers

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[20px] border border-white/8 bg-white/4.5 p-5.5 ${className}`}
    >
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-neutral-400">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Bar({ percent, background }: { percent: number; background: string }) {
  return (
    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full"
        style={{ width: `${percent}%`, background }}
      />
    </div>
  );
}