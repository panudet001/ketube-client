import type { Artist } from "~/interfaces/responses/video/Artist";

export interface Video {
  id: string;
  name: string;
  slug: string;
  imagePath: string;
  album: any;
  artists: Artist[];
  view: number;
}
export interface Queue {
  id: string;
  video: Video;
}
export interface Room {
  roomNumber: string;
  queues: Queue[];
}

export interface QueueId {
  id: string;
}

export interface QueueRoom {
  ids: string[];
}
