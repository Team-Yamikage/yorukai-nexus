import { defineMcp } from "@lovable.dev/mcp-js";
import searchContent from "./tools/search-content";
import getContentDetails from "./tools/get-content-details";
import listGenres from "./tools/list-genres";

export default defineMcp({
  name: "yorukai-tv-mcp",
  title: "YORUKAI.TV MCP",
  version: "0.1.0",
  instructions:
    "Tools for the YORUKAI.TV streaming catalog. Use `search_content` to find anime, movies, and series by title, `get_content_details` to fetch a title's info and episode list, and `list_genres` to browse available genres.",
  tools: [searchContent, getContentDetails, listGenres],
});
