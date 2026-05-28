import { useParams, useNavigate, Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { QuizCard } from '../components/QuizCard';
import { categories } from '../data/mockData';
import { ArrowLeft, Trophy, Clock, LogIn } from 'lucide-react';
import { useQuizzes } from '../context/QuizContext';
import { useUser } from '../context/UserContext';

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { getQuizzesByCategory, userHistory } = useQuizzes();
  const { isLoggedIn } = useUser();

  const category = categories.find(c => c.id === categoryId);
  const categoryQuizzes = categoryId ? getQuizzesByCategory(categoryId) : [];

  // Filter history by category (match by categoryId string, top 5)
  const categoryAttempts = userHistory
    .filter(h => h.category === categoryId || h.category.toLowerCase().includes(categoryId || ''))
    .slice(0, 5);

  const avgScore = categoryAttempts.length > 0
    ? Math.round(categoryAttempts.reduce((sum, a) => sum + a.score, 0) / categoryAttempts.length)
    : 0;

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return 'bg-[#10b981] text-white';
    if (score >= 60) return 'bg-amber-500 text-white';
    return 'bg-[#dc2626] text-white';
  };

  if (!category) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button + Breadcrumb */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-sm text-slate-600 mb-2">
          <Link to="/" className="hover:text-[#1e40af]">Home</Link>
          <span className="mx-2">/</span>
          <span>{category.name}</span>
        </div>
      </div>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-5xl">{category.icon}</div>
          <div>
            <h1 className="text-3xl font-bold">{category.name}</h1>
            <p className="text-slate-600 mt-1">{category.description}</p>
          </div>
        </div>
      </div>

      {/* My History Widget — auth-gated */}
      {isLoggedIn && categoryAttempts.length > 0 && (
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-[#1e40af]/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#1e40af]" />
              My History
            </h2>
            <div className="text-right">
              <p className="text-xs text-slate-500">Average score</p>
              <p className={`text-2xl font-bold ${avgScore >= 80 ? 'text-[#10b981]' : avgScore >= 60 ? 'text-amber-500' : 'text-[#dc2626]'}`}>
                {avgScore}%
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {categoryAttempts.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-white/80">
                <div>
                  <p className="font-medium text-sm text-slate-800 truncate max-w-[280px]">{entry.quizName}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    {entry.date}
                  </p>
                </div>
                <Badge className={`text-sm font-bold px-3 py-1 ${getScoreBadgeClass(entry.score)}`}>
                  {entry.score}%
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Guest prompt */}
      {!isLoggedIn && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-[#1e40af]/20 flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-800">See your {category.name} history</p>
            <p className="text-sm text-slate-500 mt-0.5">Sign in to track your scores and progress</p>
          </div>
          <Button
            variant="outline"
            className="border-[#1e40af] text-[#1e40af] gap-2"
            onClick={() => window.dispatchEvent(new CustomEvent('open-signin'))}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </Button>
        </div>
      )}

      {/* Available Practice Tests */}
      <div>
        <h2 className="text-2xl font-semibold mb-6">Available Practice Tests</h2>
        {categoryQuizzes.length === 0 ? (
          <Card className="p-8 text-center text-slate-500">
            <p>No quizzes available for this category yet.</p>
            <Link to="/create-quiz">
              <Button className="mt-4 bg-[#1e40af] text-white">Create a Quiz</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {categoryQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
