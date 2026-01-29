"use client";

import { UserGroupList } from "@/features/groups/components/user-group-list";

export default function DashboardGroupsPage() {
  return (
    <div
      style={{
        padding: "32px 40px",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <UserGroupList />
    </div>
  );
}
