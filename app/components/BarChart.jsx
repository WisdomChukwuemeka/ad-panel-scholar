'use client';

import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function BarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <ReBarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="applications" fill="var(--primary-color)" />
      </ReBarChart>
    </ResponsiveContainer>
  );
}