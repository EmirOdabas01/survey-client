export interface Group {
  id: number;
  name: string;
  description: string;
}

export interface GroupListResponse {
  count: number;
  groups: Group[];
}

export interface CreateGroupRequest {
  name: string;
  description: string;
}
