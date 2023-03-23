export enum QuotaAction {
  Terminate = 1,
  AllowChange = 2,
}

export const defaultQuotaAction: QuotaAction = QuotaAction.Terminate;

export const QuotaActions: QuotaAction[] = [
  QuotaAction.AllowChange, QuotaAction.Terminate
];
