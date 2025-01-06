import type { KetubeError } from "~/interfaces/KetubeError";
import type {
  MemberPagination,
  MemberRequest,
} from "~/interfaces/responses/partner/team-management/Member";
import { Permission } from "~/interfaces/responses/partner/team-management/Permission";
import { teamManagementService } from "~/services/partner/teamManagementService";

interface State {
  memberList: MemberPagination | null;
  error: KetubeError | null;
  isLoading: boolean;
}

export const useTeamManagementStore = defineStore("useTeamManagementStore", {
  state: (): State => {
    return {
      memberList: null,
      error: null,
      isLoading: false,
    };
  },
  actions: {
    async createMember(formData: FormData) {
      this.isLoading = true;
      await teamManagementService
        .createMember(formData)
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
    async updateMember(body: MemberRequest) {
      this.isLoading = true;
      await teamManagementService
        .updateMember(body)
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
    async deleteMember(id: string) {
      this.isLoading = true;
      await teamManagementService
        .deleteMember(id)
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
      await teamManagementService
        .getById(id)
        .then((value) => {
          this.memberList = value;
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async get(
      page: number = 0,
      size: number = 10,
      sort: string = "updatedAt",
      order: string = "desc",
      keyword?: string,
    ) {
      this.isLoading = true;
      await teamManagementService
        .get(page, size, sort, order, keyword)
        .then((value) => {
          this.memberList = value;
          this.error = null;
        })
        .catch((reason) => {
          this.error = reason;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    async updatePermission(body: Permission) {
      this.isLoading = true;
      await teamManagementService
        .updatePermission(body)
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
