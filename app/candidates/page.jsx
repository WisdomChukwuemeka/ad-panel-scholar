'use client';

import { useData } from '../contexts/DataContext';
import ApplicationList from '../components/ApplicationList';

export default function Candidates() {
  const { applications } = useData();

  return (
    <div>
      <h1 className="text-2xl font-bold">Candidates</h1>
      <div className="chart-container">
        <h2 className="text-lg font-semibold mb-4">Applications List</h2>
        <ApplicationList applications={applications} />
      </div>
    </div>
  );
}