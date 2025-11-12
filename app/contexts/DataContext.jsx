'use client'; // Client-side for context

import { createContext, useContext } from 'react';
import {
  stats,
  departmentApplications,
  applicantSources,
  recentJobs,
  tasks,
  applications,
} from '../data/mockData';

const DataContext = createContext();

export function DataProvider({ children }) {
  return (
    <DataContext.Provider value={{
      stats,
      departmentApplications,
      applicantSources,
      recentJobs,
      tasks,
      applications,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}