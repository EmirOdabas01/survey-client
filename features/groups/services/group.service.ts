import { apiClient } from "@/shared/api/api-client";
import type {
  GroupListResponse,
  CreateGroupRequest,
} from "@/shared/types/group.types";

class GroupService {
  async getAllGroups(): Promise<GroupListResponse> {
    try {
      const response = await apiClient.get<GroupListResponse>(
        "/Group/GetAllGroups",
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch groups",
      );
    }
  }
  async getUserGroups(): Promise<GroupListResponse> {
    try {
      const response = await apiClient.get<GroupListResponse>(
        "/Group/GetUserGroups",
      );
      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch user groups",
      );
    }
  }
  async enrollToGroup(groupId: number): Promise<void> {
    try {
      await apiClient.put(`/Group/EnrollToGroup/${groupId}`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to enroll to group",
      );
    }
  }

  async leaveGroup(groupId: number): Promise<void> {
    try {
      await apiClient.put(`/Group/LeaveGroup/${groupId}`);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to leave group",
      );
    }
  }

  async createGroup(data: CreateGroupRequest): Promise<void> {
    try {
      await apiClient.post("/Group/CreateGroup", data);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to create group",
      );
    }
  }
}

export const groupService = new GroupService();
