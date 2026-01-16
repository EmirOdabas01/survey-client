export interface Survey {
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
