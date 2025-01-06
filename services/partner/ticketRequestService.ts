import type {
  TicketPagination,
  Ticket,
} from "~/interfaces/responses/partner/ticket-request/Ticket";
import fetch from "~/http/fetch";

import type { KetubeError } from "~/interfaces/KetubeError";
import { transformError } from "~/utils/transformError";
export const ticketRequestService = {
  async get(
    page = 0,
    size = 10,
    sort = "updatedAt",
    order = "desc",
    keyword = "",
    roleId = "",
    status = "",
    startDate = "",
    endDate = "",
    keyNameCreated = "",
    keyNameUpdated = "",
  ): Promise<TicketPagination> {
    return await fetch
      .get(`/partner/tickets`, {
        params: {
          page,
          size,
          sort,
          order,
          keyword,
          roleId,
          status,
          startDate,
          endDate,
          keyNameCreated,
          keyNameUpdated,
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
  async createTicket(formData: FormData): Promise<void> {
    return await fetch
      .post("/partner/tickets", { body: formData })
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
  async getById(val: string): Promise<Ticket> {
    return await fetch
      .get(`/partner/tickets/${val}`)
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
  async updateTicket(formData: FormData): Promise<void> {
    return await fetch
      .put("/partner/tickets", { body: formData })
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
  async deleteTicket(val: string): Promise<void> {
    return await fetch
      .del(`/partner/tickets/${val}`)
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
};
