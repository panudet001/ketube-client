import fetch from "~/http/fetch";
import type { KetubeError } from "~/interfaces/KetubeError";
import { transformError } from "~/utils/transformError";
import type {
  MemberPagination,
  MemberRequest,
} from "~/interfaces/responses/partner/team-management/Member";
import type { Permission } from "~/interfaces/responses/partner/team-management/Permission";

export const teamManagementService = {
  async createMember(formData: FormData): Promise<void> {
    return await fetch
      .post("/partners/invite", { body: formData })
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
  async updateMember(body: MemberRequest): Promise<void> {
    return await fetch
      .put("/partners/member", { body })
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
  async deleteMember(val: string): Promise<void> {
    return await fetch
      .del(`/partners/${val}`)
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
  async getById(val: string): Promise<MemberPagination> {
    return await fetch
      .get(`/partners/member/${val}`)
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
  async get(
    page = 0,
    size = 10,
    sort = "updatedAt",
    order = "desc",
    keyword = "",
    startDate = "",
    endDate = "",
    keyNameCreated = "",
    keyNameUpdated = "",
  ): Promise<MemberPagination> {
    return await fetch
      .get(`/partners`, {
        params: {
          page,
          size,
          sort,
          order,
          keyword,
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
  async updatePermission(body: Permission): Promise<void> {
    return await fetch
      .put("/partners/owner-permission", { body })
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
