import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Clock, FileQuestion, Target, AlertCircle, CheckCircle } from 'lucide-react';
import api from '../api/axiosConfig';

export function QuizInstructions() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        // Calls GET /quizzes/{id} from your QuizController
        const response = await api.get(`/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (err) {
        console.error("Failed to load quiz metadata", err);
        setError('Failed to load quiz details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (quizId) fetchQuizDetails();
  }, [quizId]);

  if (loading) return <div className="p-8 text-center">Loading quiz instructions...</div>;
  if (error || !quiz) return <div className="p-8 text-center text-red-500">{error || 'Quiz not found'}</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-slate-600 capitalize">{quiz.category?.name || 'General'}</p>
        </div>
        
        {/* Quiz Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <FileQuestion className="w-8 h-8 text-[#1e40af] mx-auto mb-2" />
            <p className="text-sm text-slate-600">Questions</p>
            <p className="text-2xl font-bold">{quiz.totalQuestions}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="w-8 h-8 text-[#1e40af] mx-auto mb-2" />
            <p className="text-sm text-slate-600">Duration</p>
            <p className="text-2xl font-bold">{quiz.durationMinutes} min</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target className="w-8 h-8 text-[#1e40af] mx-auto mb-2" />
            <p className="text-sm text-slate-600">Passing Score</p>
            <p className="text-2xl font-bold">{quiz.passingPercentage}%</p>
          </div>
        </div>
        
        {/* Instructions & Mode Selection (unchanged visually) */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          {/* ... Keep your existing instruction UI here ... */}
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => navigate(`/quiz/${quizId}/attempt?mode=exam`)}
              className="flex-1 bg-[#1e40af] hover:bg-[#1e3a8a] text-white text-lg py-6 font-semibold"
            >
              Start As Real
            </Button>
            <Button
              onClick={() => navigate(`/quiz/${quizId}/attempt?mode=practice`)}
              variant="outline"
              className="flex-1 border-[#1e40af] text-[#1e40af] hover:bg-[#1e40af] hover:text-white text-lg py-6 font-semibold"
            >
              Start As Practice
            </Button>
          </div>
          <Button variant="ghost" onClick={() => navigate(-1)} className="w-full">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}