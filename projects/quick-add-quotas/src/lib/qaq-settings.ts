export interface QaqSettings {
  translations?: Record<string, string>;
  yiicsrftoken?: string;
  //surveyid?: number;
  errormessages?: Record<string, string>;
  lang?: string;
  load_data_url?: string;
  save_quota_surl?: string;
  // [key: string]: any;
};

export const QaqDefaultSettings: Partial<QaqSettings> = {};