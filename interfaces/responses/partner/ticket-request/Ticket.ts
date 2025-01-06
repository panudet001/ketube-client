import type { createBy } from "~/interfaces/responses/partner/ticket-request/CreateBy";
import type { updateBy } from "~/interfaces/responses/partner/ticket-request/UpdateBy";
import type { Pagination } from "~/interfaces/Pagination";
import type { File } from "~/interfaces/responses/partner/ticket-request/File";
import type { Partner } from "~/interfaces/responses/partner/ticket-request/Partner";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  reason: string;
  file: File[];
  partner: Partner;
  createdAt: string;
  updatedAt: string;
  createdBy: createBy;
  updatedBy: updateBy;
}

export interface TicketPagination {
  tickets: Ticket[];
  pagination: Pagination;
}
