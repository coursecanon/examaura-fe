import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { QuizCard } from '../components/QuizCard';
import { categories } from '../data/mockData';
import { ArrowRight, Clock, Trophy, LogIn } from 'lucide-react';
import { useQuizzes } from '../context/QuizContext';
import { useUser } from '../context/UserContext';

export function Dashboard() {
  const { quizzes, userHistory } = useQuizzes();
  const { isLoggedIn } = useUser();

  const featuredQuizzes = quizzes.slice(0, 6);
  const azureQuizzes = quizzes.filter(q => q.category === 'azure').slice(0, 3);
  const awsQuizzes = quizzes.filter(q => q.category === 'aws').slice(0, 3);

  // Top 5 most recent attempts
  const recentAttempts = userHistory.slice(0, 5);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#10b981]';
    if (score >= 60) return 'text-amber-500';
    return 'text-[#dc2626]';
  };

  const getScoreBadgeVariant = (score: number): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Examaura</h1>
        <p className="text-xl text-slate-600">
          Master your certification exams with our comprehensive practice tests
        </p>
      </div>

      {/* Recent Attempts — auth-gated */}
      {isLoggedIn && recentAttempts.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-[#1e40af]" />
            <h2 className="text-2xl font-semibold">Recent Attempts</h2>
          </div>
          <Card className="overflow-hidden border border-border">
            <div className="divide-y divide-border">
              {recentAttempts.map((entry, idx) => (
                <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 truncate">{entry.quizName}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 capitalize">{entry.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {entry.date}
                      </span>
                    </div>
                  </div>
                  <Badge
                    variant={getScoreBadgeVariant(entry.score)}
                    className={`text-sm font-bold px-3 py-1 ${entry.score >= 80 ? 'bg-[#10b981] text-white' : ''}`}
                  >
                    {entry.score}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </section>
      )}

      {/* Sign-in prompt for guests */}
      {!isLoggedIn && (
        <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-[#1e40af]/20 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800">Track your progress</p>
            <p className="text-sm text-slate-500 mt-1">Sign in to see your attempt history and scores</p>
          </div>
          <Button variant="outline" className="border-[#1e40af] text-[#1e40af] gap-2" onClick={() => {
            // Trigger sign-in modal via custom event (Navbar listens)
            window.dispatchEvent(new CustomEvent('open-signin'));
          }}>
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </div>
      )}

      {/* Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Certification Paths</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/category/${category.id}`}>
              <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-border rounded-xl h-full">
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-slate-600">{category.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Quizzes Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Featured Quizzes</h2>
          <Link to="/quizzes">
            <Button variant="outline" className="gap-2">
              View All Quizzes
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      </section>

      {/* Latest in Azure Section */}
      {azureQuizzes.length > 0 && (
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Latest in Azure</h2>
            <Link to="/category/azure">
              <Button variant="outline" className="gap-2">
                View All Azure
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {azureQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </section>
      )}

      {/* Latest in AWS Section */}
      {awsQuizzes.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Latest in AWS</h2>
            <Link to="/category/aws">
              <Button variant="outline" className="gap-2">
                View All AWS
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
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
