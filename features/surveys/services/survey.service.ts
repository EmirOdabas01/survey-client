import { apiClient } from "@/shared/api/api-client";
import type {
  SurveyListResponse,
  SurveyImage,
  Survey,
  GroupSurveyListResponse,
  SurveyDetail,
  SubmitAnswersRequest,
  SurveyQuestionsResponse,
  StartSurveyResponse,
  CreateSurveyRequest,
  UserSurveyListResponse,
  UpdateSurveyRequest,
  SuccessResponse,
} from "@/shared/types/survey.types";

class SurveyService {
  async getPublicSurveys(): Promise<SurveyListResponse> {
    try {
      const response = await apiClient.get<SurveyListResponse>(
        "/Survey/GetAllSurveyPublic",
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch surveys",
      );
    }
  }

  async getSurveyById(surveyId: string): Promise<SurveyDetail | null> {
    try {
      const response = await apiClient.get<SurveyDetail>(
        `/Survey/GetSurveyById/${surveyId}`,
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
        `/Survey/GetSurveyImage?SurveyId=${surveyId}`,
      );
      return response;
    } catch (error) {
      console.log(`No image found for survey ${surveyId}`);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch survey details",
      );
    }
  }

  async getPrivateSurveys(): Promise<SurveyListResponse> {
    try {
      const response = await apiClient.get<SurveyListResponse>(
        "/Survey/GetAllSurveyPrivate",
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch private surveys",
      );
    }
  }

  async getGroupSurveys(): Promise<SurveyListResponse> {
    try {
      const response = await apiClient.get<GroupSurveyListResponse>(
        "/Survey/GetAllSurveysForGroups",
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
        error instanceof Error
          ? error.message
          : "Failed to fetch group surveys",
      );
    }
  }

  async getSurveyQuestions(surveyId: string): Promise<SurveyQuestionsResponse> {
    try {
      const response = await apiClient.get<SurveyQuestionsResponse>(
        `/Question/GetSurveyQuestions/${surveyId}`,
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch survey questions",
      );
    }
  }

  async startSurvey(surveyId: string): Promise<StartSurveyResponse> {
    try {
      const response = await apiClient.post<StartSurveyResponse>(
        `/SurveyState/StartSurvey/${surveyId}`,
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to start survey",
      );
    }
  }

  async submitAnswers(data: SubmitAnswersRequest): Promise<void> {
    try {
      await apiClient.post("/SurveyState/SubmitAnswers", data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to submit answers",
      );
    }
  }

  async createSurvey(data: CreateSurveyRequest): Promise<void> {
    try {
      await apiClient.post("/Survey/CreateSurvey", data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create survey",
      );
    }
  }

  async getUserSurveys(): Promise<UserSurveyListResponse> {
    try {
      const response = await apiClient.get<UserSurveyListResponse>(
        "/Survey/GetUserSurveys",
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user surveys",
      );
    }
  }
  async publishSurvey(surveyId: string): Promise<SuccessResponse> {
    try {
      const response = await apiClient.put<SuccessResponse>(
        `/Survey/PublishSurvey/${surveyId}`,
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to publish survey",
      );
    }
  }

  async closeSurvey(surveyId: string): Promise<SuccessResponse> {
    try {
      const response = await apiClient.put<SuccessResponse>(
        `/Survey/CloseSurvey/${surveyId}`,
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to close survey",
      );
    }
  }

  async updateSurvey(data: UpdateSurveyRequest): Promise<void> {
    try {
      await apiClient.put("/Survey/UpdateSurvey", data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to update survey",
      );
    }
  }

  async deleteSurvey(surveyId: string): Promise<void> {
    try {
      await apiClient.delete(`/Survey/RemoveSurvey/${surveyId}`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to delete survey",
      );
    }
  }
  async uploadSurveyImage(surveyId: string, file: File): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const accessToken = (
        await import("@/shared/lib/cookies.client")
      ).getAccessToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/Survey/UploadSurveyImage?Id=${surveyId}`,
        {
          method: "POST",
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    }
  }

  async removeSurveyImage(surveyId: string): Promise<void> {
    try {
      await apiClient.delete(`/Survey/RemoveSurveyImage?Id=${surveyId}`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to remove image",
      );
    }
  }
}

export const surveyService = new SurveyService();
