export enum QuotaType {
  Quota = 'quota',
  Screenout = 'screenout',
  Cheater = 'cheater',
  Refused = 'refused',
  Partial = 'partial',
}

export const defaultQuotaType: QuotaType = QuotaType.Quota;

export const QuotaTypes: QuotaType[] = [
  QuotaType.Quota,
  QuotaType.Screenout,
  QuotaType.Cheater,
  QuotaType.Refused,
  QuotaType.Partial,
];