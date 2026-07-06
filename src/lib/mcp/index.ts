import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchContent from "./tools/search-content";
import getContentDetails from "./tools/get-content-details";
import listGenres from "./tools/list-genres";
import listEpisodes from "./tools/list-episodes";
import searchAutocomplete from "./tools/search-autocomplete";
import { createWatchParty, fetchWatchParty, joinWatchParty } from "./tools/watch-parties";
import { getContinueWatching, getFavorites } from "./tools/user-library";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "zoduthqkxhphvlldxyjr";

export default defineMcp({
  name: "yorukai-tv-mcp",
  title: "YORUKAI.TV MCP",
  version: "0.1.0",
  instructions:
    "Tools for the YORUKAI.TV streaming catalog, episode availability, watch parties, and signed-in user library. User library and watch-party tools require the caller to connect a YORUKAI.TV account.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    searchContent,
    searchAutocomplete,
    getContentDetails,
    listEpisodes,
    listGenres,
    createWatchParty,
    joinWatchParty,
    fetchWatchParty,
    getContinueWatching,
    getFavorites,
  ],
});
