import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import type { Karaoke } from "~/interfaces/responses/pages/karaoke/Karaoke";
import { transformError } from "~/utils/transformError";
import type {
  QueueId,
  QueueRoom,
} from "~/interfaces/responses/pages/karaoke/Room";

export const karaokePageService = {
  async get(): Promise<Karaoke> {
    return await fetch
      .get(`/page/karaoke`)
      .then((value) => {
        return value._data;
      })
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },

  async addQueueToRoom(videoId: string): Promise<QueueId> {
    return await fetch
      .post(`/queues`, {
        body: {
          videoId,
        },
      })
      .then((value) => {
        return value._data;
      })
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
  async updateQueue(videoIds: any): Promise<QueueRoom> {
    return await fetch
      .put(`/queues`, {
        body: {
          videoIds,
        },
      })
      .then((value) => {
        return value._data;
      })
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
  async deleteQueue(id: string): Promise<void> {
    return await fetch
      .del(`/queues/` + id)
      .then((_) => {})
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },

  async deleteQueueAll(): Promise<void> {
    return await fetch
      .del(`/queues`)
      .then((_) => {})
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },

  async postView(id: string, token: string): Promise<void> {
    return await fetch
      .post(`/ads-videos/view`, {
        body: {
          id,
          token,
        },
      })
      .then((_) => {})
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
  async postClick(id: string, token: string): Promise<void> {
    return await fetch
      .post(`/ads-videos/click`, {
        body: {
          id,
          token,
        },
      })
      .then((_) => {})
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
  async postViewVideo(slug: string, token: string): Promise<void> {
    return await fetch
      .post(`/videos/original-full`, {
        body: {
          slug,
          token,
        },
      })
      .then((_) => {})
      .catch((reason) => {
        const ketubeError: KetubeError = {
          status: reason.data.status,
          exception: reason.data.message,
          message: transformError(reason.data.message),
        };
        throw ketubeError;
      });
  },
};
