import type { Artist } from "~/interfaces/responses/partner/playlist/Artist";

export interface Video {
  id: string;
  name: string;
  slug: string;
  description: string;
  view: number;
  duration: string;
  lyrics: string;
  status: string;
  image: string;
  releasedAt: string;
  publishedAt: string;
  expiredAt: string;
  isActive: false;
  createdAt: string;
  updatedAt: string;
  artists: Artist[];
}
