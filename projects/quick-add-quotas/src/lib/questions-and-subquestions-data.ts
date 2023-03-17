import { LangData } from "./lang-data";
import { Question } from "./question";
import { Survey } from "./survey";

export interface QuestionsAndSubquestionsData {
  surveyid?: any;
  i18n: {
    noMoreQuestions: string;
    tooManyQuotas: string;
    quota_messages: {
      lang: string;
      language_name: string;
      message: string;
    }[];
  };
  questions?: Question[];
}