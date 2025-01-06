import type { PartnerMember } from "~/interfaces/responses/partner/team-management/Partner";
import type { Pagination } from "~/interfaces/Pagination";

export interface MemberPagination {
  countInvite: number;
  countInviteSuccess: number;
  partnerMember: PartnerMember[];
  pagination: Pagination;
}

export interface MemberRequest {
  name: string;
  gender: string;
  dateOfBirth: string;
  profileImage: File;
}
