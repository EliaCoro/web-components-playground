import { QuotaAction } from "./quota-action";
import { QuotaType } from "./quota-type";

export type FinalFormattedData = {
  quota: {
    sid: number,
    qlimit: number,
    name: string,
    autoload_url: 0 | 1,
    active: 0 | 1,
    action: QuotaAction,
    quota_type?: QuotaType
  },
  quota_members: {
    sid: number,
    qid: number,
    code: string
  }[],
  language_settings: {
    quotals_language: string,
    quotals_message: string,
    quotals_name: string,
    quotals_url: string,
    quotals_urldescrip: string,
  }[];
}