import { cn } from "@/lib/utils";

interface LogoProps {
  onDark?: boolean;
  className?: string;
}

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <circle cx="10" cy="10" r="2.75" stroke="currentColor" strokeWidth="1.3" />
      <line x1="10" y1="1.5" x2="10" y2="6.75" stroke="currentColor" strokeWidth="1.3" />
      <line x1="10" y1="13.25" x2="10" y2="18.5" stroke="currentColor" strokeWidth="1.3" />
      <line x1="1.5" y1="10" x2="6.75" y2="10" stroke="currentColor" strokeWidth="1.3" />
      <line x1="13.25" y1="10" x2="18.5" y2="10" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function Logo({ onDark = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid size-9 place-items-center rounded-lg ring-1",
          onDark
            ? "bg-white/8 text-[#a1a1aa] ring-white/15"
            : "bg-[#fafafa]/10 text-[#fafafa] ring-[#fafafa]/25",
        )}
      >
        <BrandMark className="size-5" />
      </span>
      <span className="leading-none">
        <span
          className={cn(
            "block text-[17px] font-semibold tracking-tight",
            onDark ? "text-white" : "text-foreground",
          )}
        >
          Struxco
        </span>
        <span
          className={cn(
            "block text-[10px] font-medium tracking-widest uppercase",
            onDark ? "text-white/35" : "text-muted-foreground",
          )}
        >
          стройпроекты
        </span>
      </span>
    </span>
  );
}
