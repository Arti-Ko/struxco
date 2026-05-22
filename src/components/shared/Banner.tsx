import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import type { Banner as BannerData, BannerTone } from "@/store/useAppStore";

interface ToneConfig {
  bg: string;
  border: string;
  text: string;
  icon: typeof Info;
}

const TONE: Record<BannerTone, ToneConfig> = {
  info: {
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.20)",
    text: "#ededed",
    icon: Info,
  },
  success: {
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.20)",
    text: "#34d399",
    icon: CheckCircle2,
  },
  warning: {
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.20)",
    text: "#fbbf24",
    icon: TriangleAlert,
  },
};

interface BannerProps {
  banner: BannerData;
  onDismiss: () => void;
}

export function Banner({ banner, onDismiss }: BannerProps) {
  const tone = TONE[banner.tone];
  const Icon = tone.icon;

  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium"
      style={{
        background: tone.bg,
        border: `1px solid ${tone.border}`,
        color: tone.text,
      }}
    >
      <Icon className="size-5 shrink-0" />
      <p className="flex-1" style={{ color: tone.text }}>
        {banner.text}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Скрыть уведомление"
        className="shrink-0 rounded-md p-1 transition-opacity"
        style={{ color: tone.text, opacity: 0.5 }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.5"; }}
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
