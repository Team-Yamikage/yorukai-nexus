import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

const AD_SCRIPT_ID = "yk-non-premium-ad-network";
const AD_HOST_RE = /(welcomingexpulsion\.com|massivesalad\.com|quge5\.com|butterygrandmother\.com)/i;

type AdScriptConfig = {
  src: string;
  attrs?: Record<string, string>;
};

const AD_SCRIPTS: AdScriptConfig[] = [
  // Quge5 / verification zone delivery.
  { src: "https://quge5.com/88/tag.min.js", attrs: { "data-zone": "255437", "data-cfasync": "false" } },
  // Existing site-wide pop/social placements.
  { src: "https://welcomingexpulsion.com/ba/d4/6e/bad46e9bfd80a6a85742d5c4532f934a.js" },
  { src: "https://welcomingexpulsion.com/c6/3c/78/c63c788d96e03882d96b82b881204b46.js" },
  // Requested MultiTag inventory.
  { src: "https://massivesalad.com/bdXXVrsHd.GDlt0HY/W_cS/LeemY9/uKZHUIlVkGPwTKcRxtOUD_ga2/NCDzEZtTNDzxEl4BO/DEYk0ANDQf" },
  { src: "https://massivesalad.com/bwXUVas.dXG/lN0VY_W/ca/qe/m/9Ru/Z/UElUkGPjTQcPxKOoD/gY2aNnT/cGtYN/zREQ4/O-D/Yj2EMZQc" },
  { src: "https://massivesalad.com/b.X/V/sJdNGolO0GY/WDcU/zemmC9TuUZmU/l/k/PJTscux/OdDNgB2pNnzWMut/Nnz/Ec4jOhDDYe3zN/wd" },
];

export function AdNetworkScripts() {
  const { loading, isPremium, user, profile } = useAuth();

  useEffect(() => {
    const removeAds = () => {
      document.querySelectorAll(`[data-ad-pack="${AD_SCRIPT_ID}"]`).forEach((node) => node.remove());
      document.querySelectorAll("iframe,script").forEach((node) => {
        const src = node.getAttribute("src") ?? "";
        if (AD_HOST_RE.test(src)) node.remove();
      });
    };

    if (isPremium || (user && !profile)) {
      removeAds();
      return;
    }
    if (loading || isPremium || (user && !profile)) return;
    if (document.querySelector(`[data-ad-pack="${AD_SCRIPT_ID}"]`)) return;

    // Run after hydration to avoid third-party scripts mutating the SSR tree and
    // causing "This page didn't load" / hydration mismatch crashes.
    const t = window.setTimeout(() => {
      for (const item of AD_SCRIPTS) {
        const s = document.createElement("script");
        s.src = item.src;
        s.async = true;
        s.referrerPolicy = "no-referrer-when-downgrade";
        s.dataset.adPack = AD_SCRIPT_ID;
        for (const [key, value] of Object.entries(item.attrs ?? {})) {
          s.setAttribute(key, value);
        }
        document.body.appendChild(s);
      }
    }, 1200);

    return () => window.clearTimeout(t);
  }, [loading, isPremium, user, profile]);

  return null;
}