'use client';

import { useData } from "../contexts/DataContext";

export default function Jobs() {
  const { recentJobs } = useData();
  return (
    <div>
      <h1 className="text-2xl font-bold">Jobs</h1>
      {/* Render content */}
    </div>
  );
}