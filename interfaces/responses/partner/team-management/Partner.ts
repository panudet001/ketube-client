import type { User } from "~/interfaces/responses/partner/team-management/User";
import type { Permission } from "~/interfaces/responses/partner/team-management/Permission";

export interface PartnerMember {
  id: string;
  invite: null;
  user: User;
  permissions: Permission[];
}
