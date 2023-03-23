export enum ActionToPerform {
  Message = 0,
  Redirect = 1,
  MessageAndRedirect = 2
}

export const defaultActionToPerform: ActionToPerform = ActionToPerform.Redirect;

export const ActionsToPerform: ActionToPerform[] = [
  ActionToPerform.MessageAndRedirect,
  ActionToPerform.Redirect,
  ActionToPerform.Message
];