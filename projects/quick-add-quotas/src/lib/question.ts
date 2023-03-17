import { Answer } from "./answer";

export interface Question {
  gid: number;
  qid: number;
  question: string;
  question_order: number;
  mandatory: "Y" | "N";
  relevance: "1" | "0" | string;
  title: string;
  type: "L" | string;
  answers?: Answer[];
}