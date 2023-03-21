import { QuotaAction } from "./quota-action";
import { QuotaMember } from "./quota-member";
import { QuotaType } from "./quota-type";

export interface Quota {
  members: QuotaMember[];
  sid: number;
  limit: number;
  name: string;
  autoloadUrl: boolean;
  active: boolean;
  action: QuotaAction;
  quotaType: QuotaType;
};