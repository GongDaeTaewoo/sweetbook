import { useState, useEffect } from "react";
import { getDiaries, getWeeklyReview, getMonthlyReview } from "../api/diaryApi";

export function useDiaryList({ year, month }) {
  const [diaries, setDiaries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchDiaries = async () => {
      setLoading(true);
      try {
        const response = await getDiaries({ year, month });
        if (!cancelled) setDiaries(response.data ?? []);
      } catch {
        if (!cancelled) setDiaries([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDiaries();
    return () => {
      cancelled = true;
    };
  }, [year, month]);

  return { diaries, loading };
}

export function useWeeklyReview() {
  const [review, setReview] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchReview = async () => {
      try {
        const response = await getWeeklyReview();
        if (!cancelled) setReview(response.data);
      } catch {
        if (!cancelled) setReview(null);
      }
    };
    fetchReview();
    return () => { cancelled = true; };
  }, []);

  return review;
}

export function useMonthlyReview() {
  const [review, setReview] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const fetchReview = async () => {
      try {
        const response = await getMonthlyReview();
        if (!cancelled) setReview(response.data);
      } catch {
        if (!cancelled) setReview(null);
      }
    };
    fetchReview();
    return () => { cancelled = true; };
  }, []);

  return review;
}
