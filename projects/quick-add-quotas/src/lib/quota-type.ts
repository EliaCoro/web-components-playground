export enum QuotaType {
  Quota = 0,
  Screenout = 1,
  Cheater = 2,
}

export const defaultQuotaType: QuotaType = QuotaType.Quota;

export const QuotaTypes: QuotaType[] = [
  QuotaType.Quota,
  QuotaType.Screenout,
  QuotaType.Cheater,
];