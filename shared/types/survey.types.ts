export interface Survey {
  id: string;
  name: string;
  description: string;
}
export interface SurveyDetail {
  id: string;
  name: string;
  description: string;
}
export interface SurveyListResponse {
  count: number;
  surveys: Survey[];
}
export interface SurveyImage {
  id: string;
  path: string;
}
export interface GroupSurvey {
  surveyId: string;
  name: string;
  description: string;
  createdBy: string;
}

export interface GroupSurveyListResponse {
  count: number;
  groupSurveys: GroupSurvey[];
}

export enum QuestionType {
  Open = 1,
  Dropdown = 2,
  MultipleChoice = 3,
  Logical = 4,
}

// Question option
export interface QuestionOption {
  id: number;
  order: number;
  value: string;
}

export interface Question {
  id: number;
  order: number;
  type: QuestionType;
  questionText: string;
  isMandatory: boolean;
  questionOptions: QuestionOption[];
}

export interface SurveyQuestionsResponse {
  surveyId: string;
  questions: Question[];
}

export interface StartSurveyResponse {
  responseId: number;
}

export interface QuestionAnswer {
  questionId: number;
  questionAnswer: string | null;
  questionOptionsIds: number[] | null;
}

export interface SubmitAnswersRequest {
  responseId: number;
  answers: QuestionAnswer[];
}

export enum SurveyVisibility {
  Public = 1,
  Group = 2,
  Private = 3,
}

export interface CreateSurveyRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  minResponse: number;
  maxResponse: number;
  visibility: SurveyVisibility;
}

export enum SurveyState {
  Planned = "Planned",
  Open = "Open",
  Closed = "Closed",
}

export interface UserSurvey {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string | null;
  minResponse: number;
  maxResponse: number;
  visibility: string;
  state: string;
  path: string | null;
}

export interface UserSurveyListResponse {
  count: number;
  surveys: UserSurvey[];
}

export interface UpdateSurveyRequest {
  id: string;
  name: string;
  description: string;
  visibility: SurveyVisibility;
  startDate: string;
  endDate: string | null;
  minResponse: number;
  maxResponse: number;
}

export interface SuccessResponse {
  success: boolean;
}

export interface CreateQuestionOptionRequest {
  order: number;
  value: string;
}

export interface CreateQuestionRequest {
  order: number;
  questionText: string;
  isMandatory: boolean;
  questionType: QuestionType;
  questionOptions: CreateQuestionOptionRequest[];
}

export interface CreateSurveyQuestionsRequest {
  surveyId: string;
  questions: CreateQuestionRequest[];
}
