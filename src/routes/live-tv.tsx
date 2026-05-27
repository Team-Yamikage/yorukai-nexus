import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/live-tv")({
  head: () => ({ meta: [{ title: "Live TV — YORUKAI.TV" }] }),
  component: () => <AppShell><StubPage kicker="放送中 · On air" title="Live TV" gradient="fire" copy="200+ channels — Tokyo MX, AT-X, BS11, ANIPLEX — wired to your iptv_channels schema." /></AppShell>,
});
