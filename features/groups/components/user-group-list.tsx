"use client";

import { useState, useEffect } from "react";
import { groupService } from "../services/group.service";
import { UserGroupCard } from "./user-group-card";
import { CreateGroupForm } from "./create-group-form";
import type { Group } from "@/shared/types/group.types";

export function UserGroupList() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  async function loadGroups() {
    setLoading(true);
    setError(null);
    try {
      const response = await groupService.getUserGroups();
      setGroups(response.groups);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  function handleGroupLeft(groupId: number) {
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  }

  function handleGroupCreated() {
    loadGroups();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your groups...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">
            Failed to load groups
          </p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadGroups}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Groups</h2>
          <p className="text-gray-600 mt-1">
            {groups.length} {groups.length === 1 ? "group" : "groups"}
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <p className="text-gray-900 font-medium mb-2">No groups yet</p>
            <p className="text-gray-600 mb-4">
              Create a group or join one from the home page
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Your First Group
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 350px))",
            gap: "24px",
            justifyContent: "start",
          }}
        >
          {groups.map((group) => (
            <UserGroupCard
              key={group.id}
              group={group}
              onLeft={handleGroupLeft}
            />
          ))}
        </div>
      )}

      {showCreateForm && (
        <CreateGroupForm
          onClose={() => setShowCreateForm(false)}
          onCreated={handleGroupCreated}
        />
      )}
    </div>
  );
}
