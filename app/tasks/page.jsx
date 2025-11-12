'use client';

import { useData } from '../contexts/DataContext';
import TaskList from '../components/TaskList';

export default function Tasks() {
  const { tasks } = useData();

  return (
    <div>
      <h1 className="text-2xl font-bold">Tasks</h1>
      <div className="chart-container">
        <h2 className="text-lg font-semibold mb-4">Tasks</h2>
        <TaskList tasks={tasks} />
      </div>
    </div>
  );
}