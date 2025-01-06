import type { Artist } from "~/interfaces/responses/video/Artist";

export interface Group {
  name: string;
  artists: Artist[];
}
