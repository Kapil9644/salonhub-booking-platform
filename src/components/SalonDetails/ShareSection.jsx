import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

export default function ShareSection({ salon }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;

  const shareTitle = salon?.name
    ? `Check out ${salon.name} on Rupiva`
    : "Check out this salon on Rupiva";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
    }

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShare = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: shareTitle,
          text: salon?.name
            ? `Check out ${salon.name} on Rupiva.`
            : "Check out this salon on Rupiva.",
          url: shareUrl,
        });

        return;
      } catch (error) {
        // User closed the share sheet.
        if (error?.name === "AbortError") {
          return;
        }

        console.error("Native share failed:", error);
      }
    }

    await copyLink();
  };

  return (
    <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:mt-7 sm:rounded-3xl sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold leading-6 text-slate-900 sm:text-xl">
            Share Salon
          </h2>

          <p className="mt-1 text-xs leading-5 text-gray-500 sm:text-sm">
            Share this salon with your friends and family.
          </p>
        </div>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 active:scale-[0.98]"
        >
          {copied ? <Check size={16} /> : <Share2 size={16} />}

          {copied ? "Link Copied" : "Share Salon"}
        </button>
      </div>
    </section>
  );
}
