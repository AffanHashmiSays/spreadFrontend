'use client';

import React, { useState, useEffect } from 'react';

interface FormattedDateProps {
  dateString: string;
}

const FormattedDate: React.FC<FormattedDateProps> = ({ dateString }) => {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Formatting the date on the client-side to avoid hydration mismatch.
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    setFormattedDate(new Intl.DateTimeFormat('en-US', options).format(date));
  }, [dateString]);

  // Render the formatted date once it's available.
  // During SSR and initial client render, this will be empty, ensuring no mismatch.
  return <>{formattedDate}</>;
};

export default FormattedDate;
