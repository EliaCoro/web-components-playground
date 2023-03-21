export interface QaqSettings {
  translations?: Record<string, string>;
  yiicsrftoken?: string;
  surveyid?: number;
  // [key: string]: any;
};

export const QaqDefaultSettings: Partial<QaqSettings> = {};