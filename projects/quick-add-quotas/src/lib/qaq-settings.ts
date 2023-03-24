export interface QaqSettings {
  translations?: Record<string, string>;
  yiicsrftoken?: string;
  surveyid?: number;
  errormessages?: Record<string, string>;
  // [key: string]: any;
};

export const QaqDefaultSettings: Partial<QaqSettings> = {};