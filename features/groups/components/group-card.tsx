"use client";

import { useState } from "react";
import { groupService } from "../services/group.service";
import type { Group } from "@/shared/types/group.types";

interface GroupCardProps {
  group: Group;
  onEnrolled?: (groupId: number) => void;
}

export function GroupCard({ group, onEnrolled }: GroupCardProps) {
  const [enrolling, setEnrolling] = useState(false);

  async function handleEnroll() {
    setEnrolling(true);
    try {
      await groupService.enrollToGroup(group.id);
      alert(`Successfully enrolled to "${group.name}"!`);
      if (onEnrolled) {
        onEnrolled(group.id);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to enroll");
    } finally {
      setEnrolling(false);
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
          onClick={handleEnroll}
          disabled={enrolling}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {enrolling ? "Enrolling..." : "Join Group"}
        </button>
      </div>
    </div>
  );
}
