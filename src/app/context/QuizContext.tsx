import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Quiz } from '../data/mockData';
import { sampleQuizzes } from '../data/sampleQuizzes';

export interface HistoryEntry {
  quizId: string;
  quizName: string;
  category: string;
  score: number;
  date: string;
}

interface QuizContextType {
  quizzes: Quiz[];
  userHistory: HistoryEntry[];
  addQuiz: (quiz: Omit<Quiz, 'id' | 'questionCount' | 'difficulty'>) => void;
  updateQuiz: (id: string, quiz: Omit<Quiz, 'id' | 'questionCount' | 'difficulty'>) => void;
  addAttempt: (entry: HistoryEntry) => void;
  getQuizById: (id: string) => Quiz | undefined;
  getQuizzesByCategory: (categoryId: string) => Quiz[];
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const stored = localStorage.getItem('quizzes');
    if (stored) {
      try { return JSON.parse(stored); } catch { return sampleQuizzes; }
    }
    return sampleQuizzes;
  });

  const [userHistory, setUserHistory] = useState<HistoryEntry[]>(() => {
    const stored = localStorage.getItem('quiz_history');
    if (stored) {
      try { return JSON.parse(stored); } catch { return []; }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('quiz_history', JSON.stringify(userHistory));
  }, [userHistory]);

  const addQuiz = (quizData: Omit<Quiz, 'id' | 'questionCount' | 'difficulty'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
      questionCount: quizData.questions.length,
      difficulty: 'intermediate' as const
    };
    setQuizzes(prev => [...prev, newQuiz]);
  };

  const updateQuiz = (id: string, quizData: Omit<Quiz, 'id' | 'questionCount' | 'difficulty'>) => {
    setQuizzes(prev => prev.map(quiz => {
      if (quiz.id === id) {
        return {
          ...quizData,
          id,
          questionCount: quizData.questions.length,
          difficulty: 'intermediate' as const
        };
      }
      return quiz;
    }));
  };

  const addAttempt = (entry: HistoryEntry) => {
    setUserHistory(prev => [entry, ...prev]);
  };

  const getQuizById = (id: string) => quizzes.find(q => q.id === id);

  const getQuizzesByCategory = (categoryId: string) =>
    quizzes.filter(q => q.category === categoryId);

  return (
    <QuizContext.Provider value={{ quizzes, userHistory, addQuiz, updateQuiz, addAttempt, getQuizById, getQuizzesByCategory }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuizzes() {
  const context = useContext(QuizContext);
  if (!context) throw new Error('useQuizzes must be used within a QuizProvider');
  return context;
}
