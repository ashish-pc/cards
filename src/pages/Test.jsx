import React, { useState, useEffect } from 'react';

function Test() {
  const [currentMonthDays, setCurrentMonthDays] = useState([]);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysArray = [];
    for (let i = firstDay.getDate(); i <= lastDay.getDate(); i++) {
      daysArray.push(i);
    }

    setCurrentMonthDays(daysArray);
  }, []);

  return (
    <div>
      <h1>Days of the Current Month</h1>
      <ul>
        {currentMonthDays.map((day) => (
          <li key={day}>{day}</li>
        ))}
      </ul>
    </div>
  );
}

export default Test;
