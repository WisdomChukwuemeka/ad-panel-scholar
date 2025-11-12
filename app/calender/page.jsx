'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import default styles

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h1 className="text-2xl font-bold">Calendar</h1>
      <div className="chart-container">
        <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>
        <Calendar
          onChange={setDate}
          value={date}
          className="react-calendar"
        />
        <p className="mt-4">Selected date: {date.toDateString()}</p>
      </div>
    </div>
  );
}