import { useState, useEffect } from 'react';

export interface Submission {
  id: string;
  date: number;
  fullName: string;
  email: string;
  phone: string;
  website: string;
  stockNumbers: string;
  adDescription: string;
}

const SUBMISSIONS_KEY = 'adPortalSubmissions';

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    const submissionsData = localStorage.getItem(SUBMISSIONS_KEY);
    if (submissionsData) {
      setSubmissions(JSON.parse(submissionsData));
    }
  };

  const addSubmission = (submission: Omit<Submission, 'id' | 'date'>) => {
    const newSubmission: Submission = {
      ...submission,
      id: crypto.randomUUID(),
      date: Date.now()
    };

    const updatedSubmissions = [newSubmission, ...submissions];
    setSubmissions(updatedSubmissions);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
  };

  const deleteSubmission = (id: string) => {
    const updatedSubmissions = submissions.filter(s => s.id !== id);
    setSubmissions(updatedSubmissions);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
  };

  return {
    submissions,
    addSubmission,
    deleteSubmission
  };
}