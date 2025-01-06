import type { KetubeError } from "~/interfaces/KetubeError";
import type {
  Ticket,
  TicketPagination,
} from "~/interfaces/responses/partner/ticket-request/Ticket";
import { ticketRequestService } from "~/services/partner/ticketRequestService";

interface State {
  ticket: Ticket | null;
  ticketList: TicketPagination | null;
  error: KetubeError | null;
  isLoading: boolean;
}

export const useTicketRequestStore = defineStore("useTicketRequestStore", {
  state: (): State => {
    return {
      ticket: null,
      ticketList: null,
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async get(
      page: number = 0,
      size: number = 30,
      sort: string = "updatedAt",
      order: string = "desc",
      keyword?: string,
    ) {
      this.isLoading = true;
      await ticketRequestService
        .get(page, size, sort, order, keyword)
        .then((value) => {
          this.ticketList = value;
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async createTicket(formData: FormData) {
      this.isLoading = true;
      await ticketRequestService
        .createTicket(formData)
        .then((_) => {
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async getById(id: string) {
      this.isLoading = true;
      await ticketRequestService
        .getById(id)
        .then((value: Ticket) => {
          this.ticket = value;
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async updateTicket(formData: FormData) {
      this.isLoading = true;
      await ticketRequestService
        .updateTicket(formData)
        .then((_) => {
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async deleteTicket(id: string) {
      this.isLoading = true;
      await ticketRequestService
        .deleteTicket(id)
        .then((_) => {
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
});
