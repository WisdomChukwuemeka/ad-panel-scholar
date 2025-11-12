'use client';

import { PieChart as RePieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function PieChart({ data }) {
  return (
    <div className="flex justify-center items-center relative">
      <ResponsiveContainer width="100%" height={200}>
        <RePieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </RePieChart>
      </ResponsiveContainer>
      <div className="absolute text-center">
        <div className="text-2xl font-bold">1,000</div>
        <div className="text-sm text-gray-500">Total Applications</div>
      </div>
    </div>
  );
}