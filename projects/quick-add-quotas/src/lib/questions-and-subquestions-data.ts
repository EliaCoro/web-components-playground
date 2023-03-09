import { LangData } from "./lang-data";
import { Question } from "./question";
import { Survey } from "./survey";

export interface QuestionsAndSubquestionsData {
  surveyid?: any;
  survey?: Survey;
  questionsList?: Question[];
  additional_languages?: string;
  lang_data?: LangData[];
  tooManyQuotasText?: string;
  noMoreQuestions?: string;
  noQuestionsAvaliable?: string;
}