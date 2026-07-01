import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const PartyInput = z.object({ partyId: z.string().uuid() });
const EventInput = z.object({
  partyId: z.string().uuid(),
  eventType: z.enum(["play", "pause", "seek", "sync", "heartbeat"]),
  eventPayload: z.record(z.unknown()).default({}),
});

export const authorizeWatchPartyChannel = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => PartyInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: allowed, error } = await context.supabase.rpc("can_access_watch_party", {
      _party_id: data.partyId,
      _user_id: context.userId,
    });
    if (error) throw error;
    return { allowed: allowed === true };
  });

export const sendWatchPartyEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => EventInput.parse(d))
  .handler(async ({ data, context }) => {
    const { data: allowed, error: authError } = await context.supabase.rpc("can_access_watch_party", {
      _party_id: data.partyId,
      _user_id: context.userId,
    });
    if (authError) throw authError;
    if (allowed !== true) throw new Error("Forbidden");

    const { error } = await context.supabase.from("watch_party_events" as never).insert({
      party_id: data.partyId,
      user_id: context.userId,
      event_type: data.eventType,
      event_payload: data.eventPayload,
    } as never);
    if (error) throw error;
    return { ok: true };
  });
