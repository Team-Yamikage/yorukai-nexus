import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { StubPage } from "@/components/StubPage";
export const Route = createFileRoute("/watch/$id")({
  head: () => ({ meta: [{ title: "Watch — YORUKAI.TV" }] }),
  component: () => <AppShell><StubPage kicker="Cinematic player" title="Watch" gradient="cyber" copy="HLS.js, 4K, subs, quality, skip intro, ambient lighting — landing next pass." /></AppShell>,
});
