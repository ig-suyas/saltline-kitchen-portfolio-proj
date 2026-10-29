/** Saltline mark: a ribbed fan shell cut from tomato paper, with the wordmark. */
export function ShellMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 44" className={className} aria-hidden="true">
      <path
        d="M21.6 41.5 3.4 17.1Q2.7 9.6 8.6 6.2 13.4 1.6 19.3 2.6 24 .4 28.7 2.6 34.6 1.6 39.4 6.2 45.3 9.6 44.6 17.1L26.4 41.5Q24 43.4 21.6 41.5Z"
        fill="var(--mark-fill, #E4402A)"
      />
      <path d="M24 39 24 5M24 39 13.5 7.5M24 39 34.5 7.5M24 39 6.5 14.5M24 39 41.5 14.5" stroke="var(--mark-line, #F6F1E7)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <ShellMark className="h-8 w-8 shrink-0" />
      <span className="font-display text-[1.375rem] leading-none font-extrabold tracking-[-0.04em]">
        Saltline<span className="font-semibold"> Kitchen</span>
      </span>
    </span>
  );
}
