import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { QuizCard } from '../components/QuizCard';
import { categories } from '../data/mockData';
import { ArrowRight, LogIn } from 'lucide-react';
import { useUser } from '../context/UserContext';
import api from '../api/axiosConfig';
import type { Quiz } from '../types/quiz';

export function Dashboard() {
  const { isLoggedIn } = useUser();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await api.get(
          '/quizzes?page=0&size=20&sort=createdAt&order=ASC'
        );

        const quizList = response.data.data ?? [];

        setQuizzes(Array.isArray(quizList) ? quizList : []);
      } catch (err) {
        console.error('Failed to load quizzes', err);
        setError('Failed to load quizzes from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const featuredQuizzes = quizzes
    .filter((quiz) => quiz.isFeatured)
    .slice(0, 6);

  const displayFeatured =
    featuredQuizzes.length > 0
      ? featuredQuizzes
      : quizzes.slice(0, 6);

  const azureQuizzes = quizzes
    .filter((quiz) =>
      quiz.category?.name?.toLowerCase().includes('azure')
    )
    .slice(0, 3);

  const awsQuizzes = quizzes
    .filter((quiz) =>
      quiz.category?.name?.toLowerCase().includes('aws')
    )
    .slice(0, 3);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e40af]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Examaura
        </h1>
        <p className="text-xl text-slate-600">
          Master your certification exams with our comprehensive practice tests
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {!isLoggedIn && (
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-[#1e40af]/20 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800">
              Track your progress
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Sign in to save your attempt history and scores
            </p>
          </div>

          <Button
            variant="outline"
            className="border-[#1e40af] text-[#1e40af] gap-2"
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent('open-signin')
              );
            }}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </div>
      )}

      {/* Categories */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">
          Certification Paths
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-border rounded-xl h-full">
                <div className="text-4xl mb-3">
                  {category.icon}
                </div>

                <h3 className="font-semibold text-lg mb-2">
                  {category.name}
                </h3>

                <p className="text-sm text-slate-600">
                  {category.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Quizzes */}
      {displayFeatured.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              Featured Quizzes
            </h2>

            <Link to="/quizzes">
              <Button variant="outline" className="gap-2">
                View All Quizzes
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFeatured.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </section>
      )}

      {/* Azure */}
      {azureQuizzes.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              Latest in Azure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {azureQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </section>
      )}

      {/* AWS */}
      {awsQuizzes.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">
              Latest in AWS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awsQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}