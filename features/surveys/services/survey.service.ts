import { apiClient } from "@/shared/api/api-client";
import type {
  SurveyListResponse,
  SurveyImage,
  Survey,
  GroupSurveyListResponse,
  SurveyDetail,
} from "@/shared/types/survey.types";

class SurveyService {
  async getPublicSurveys(): Promise<SurveyListResponse> {
    try {
      const response = await apiClient.get<SurveyListResponse>(
        "/Survey/GetAllSurveyPublic"
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch surveys"
      );
    }
  }

  async getSurveyById(surveyId: string): Promise<SurveyDetail | null> {
    try {
      const response = await apiClient.get<SurveyDetail>(
        `/Survey/GetSurveyById/${surveyId}`
      );
      return response;
    } catch (error) {
      console.log("failed to get survey by ıd");
      return null;
    }
  }

  async getSurveyImage(surveyId: string): Promise<SurveyImage | null> {
    try {
      const response = await apiClient.get<SurveyImage>(
        `/Survey/GetSurveyImage?SurveyId=${surveyId}`
      );
      return response;
    } catch (error) {
      console.log(`No image found for survey ${surveyId}`);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch survey details"
      );
    }
  }

  async getPrivateSurveys(): Promise<SurveyListResponse> {
    try {
      const response = await apiClient.get<SurveyListResponse>(
        "/Survey/GetAllSurveyPrivate"
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch private surveys"
      );
    }
  }

  async getGroupSurveys(): Promise<SurveyListResponse> {
    try {
      const response = await apiClient.get<GroupSurveyListResponse>(
        "/Survey/GetAllSurveysForGroups"
      );

      const transformedSurveys: Survey[] = response.groupSurveys.map((gs) => ({
        id: gs.surveyId,
        name: gs.name,
        description: gs.description,
      }));

      return {
        count: response.count,
        surveys: transformedSurveys,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch group surveys"
      );
    }
  }
}

export const surveyService = new SurveyService();
