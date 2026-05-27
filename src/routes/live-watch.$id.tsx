import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/live-watch/$id")({
  head: () => ({ meta: [{ title: "Live — YORUKAI.TV" }] }),
  component: () => <AppShell><StubPage kicker="Live player" title="On Air" gradient="cyber" copy="HLS live stream, EPG ticker, channel switcher." /></AppShell>,
});
