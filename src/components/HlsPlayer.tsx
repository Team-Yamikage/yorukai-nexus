import { useEffect, useRef } from "react";
import Hls from "hls.js";

/** Lightweight HLS player for clean public live streams (no embeds, no ads). */
export function HlsPlayer({
  url,
  poster,
  className = "",
}: {
  url: string;
  poster?: string | null;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || !url) return;
    let hls: Hls | undefined;

    if (/\.m3u8(\?|$)/i.test(url)) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          maxBufferLength: 30,
        });
        hls.loadSource(url);
        hls.attachMedia(v);
        hls.on(Hls.Events.ERROR, (_e, data) => {
          if (!hls) return;
          if (data.fatal) {
            // Auto-reconnect on fatal errors
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad();
            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError();
          }
        });
        v.play().catch(() => {});
      } else if (v.canPlayType("application/vnd.apple.mpegurl")) {
        v.src = url;
        v.play().catch(() => {});
      }
    } else {
      v.src = url;
      v.play().catch(() => {});
    }
    return () => hls?.destroy();
  }, [url]);

  return (
    <video
      ref={ref}
      poster={poster ?? undefined}
      controls
      playsInline
      autoPlay
      className={className}
    />
  );
}
