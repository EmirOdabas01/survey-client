"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/dashboard/surveys"
          className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Surveys</h2>
          <p className="text-gray-600">Create, edit, and delete surveys</p>
        </Link>

        <Link
          href="/dashboard/groups"
          className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Groups</h2>
          <p className="text-gray-600">
            View your groups, create new ones, or leave
          </p>
        </Link>

        <Link
          href="/dashboard/users"
          className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2">Manage Users</h2>
          <p className="text-gray-600">View and manage users</p>
        </Link>
      </div>
    </div>
  );
}
