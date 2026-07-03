import { useMemo } from "react";
import { useAuth } from "@/lib/auth";

/**
 * Renders an Adsterra iframe-format banner inside an isolated sandboxed iframe.
 * Each banner uses a global `atOptions` variable which collides when multiple
 * banners share a page — running each one inside its own iframe document keeps
 * the `atOptions`/invoke.js pair isolated so every slot renders correctly.
 */
export function AdBanner({
  adKey,
  width,
  height,
  className = "",
}: {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}) {
  const { loading, isPremium } = useAuth();
  const srcDoc = useMemo(
    () => `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>
<script type="text/javascript">
  atOptions = { 'key':'${adKey}', 'format':'iframe', 'height':${height}, 'width':${width}, 'params':{} };
<\/script>
<script type="text/javascript" src="https://welcomingexpulsion.com/${adKey}/invoke.js"><\/script>
</body></html>`,
    [adKey, width, height],
  );

  if (loading || isPremium) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <iframe
        title="advertisement"
        srcDoc={srcDoc}
        width={width}
        height={height}
        scrolling="no"
        style={{ border: "none", width, height, maxWidth: "100%" }}
      />
    </div>
  );
}
