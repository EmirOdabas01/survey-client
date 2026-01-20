"use client";

import { useState } from "react";
import { groupService } from "../services/group.service";
import type { Group } from "@/shared/types/group.types";

interface UserGroupCardProps {
  group: Group;
  onLeft?: (groupId: number) => void;
}

export function UserGroupCard({ group, onLeft }: UserGroupCardProps) {
  const [leaving, setLeaving] = useState(false);

  async function handleLeave() {
    if (!confirm(`Are you sure you want to leave "${group.name}"?`)) {
      return;
    }

    setLeaving(true);
    try {
      await groupService.leaveGroup(group.id);
      alert(`Successfully left "${group.name}"`);
      if (onLeft) {
        onLeft(group.id);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to leave group");
    } finally {
      setLeaving(false);
    }
  }

  return (
    <div
      style={{ maxWidth: "350px", width: "100%" }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-gray-200"
    >
      <div className="p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {group.name}
        </h3>
        <p className="text-sm text-gray-600">{group.description}</p>
      </div>

      <div className="px-4 pb-4 text-center">
        <button
          onClick={handleLeave}
          disabled={leaving}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {leaving ? "Leaving..." : "Leave Group"}
        </button>
      </div>
    </div>
  );
}
