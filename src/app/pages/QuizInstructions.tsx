import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Clock, FileQuestion, Target, AlertCircle, CheckCircle } from 'lucide-react';
import { useQuizzes } from '../context/QuizContext';

export function QuizInstructions() {
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getQuizById } = useQuizzes();
  
  const quiz = quizId ? getQuizById(quizId) : undefined;
  
  if (!quiz) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Quiz not found</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-slate-600 capitalize">{quiz.category}</p>
        </div>
        
        {/* Quiz Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <FileQuestion className="w-8 h-8 text-[#1e40af] mx-auto mb-2" />
            <p className="text-sm text-slate-600">Questions</p>
            <p className="text-2xl font-bold">{quiz.questionCount}</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Clock className="w-8 h-8 text-[#1e40af] mx-auto mb-2" />
            <p className="text-sm text-slate-600">Duration</p>
            <p className="text-2xl font-bold">{quiz.duration} min</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Target className="w-8 h-8 text-[#1e40af] mx-auto mb-2" />
            <p className="text-sm text-slate-600">Passing Score</p>
            <p className="text-2xl font-bold">{quiz.passingScore || 70}%</p>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
              <p className="text-slate-700">
                This quiz contains {quiz.questionCount} questions of various types
              </p>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
              <p className="text-slate-700">
                You have {quiz.duration} minutes to complete the quiz
              </p>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
              <p className="text-slate-700">
                You need to score at least {quiz.passingScore || 70}% to pass
              </p>
            </div>
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5" />
              <p className="text-slate-700">
                Once you start, the timer will begin and cannot be paused
              </p>
            </div>
          </div>
          
          {/* Mode Descriptions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border-2 border-[#1e40af] rounded-lg bg-blue-50">
              <h3 className="font-semibold mb-2 text-[#1e40af]">Exam Mode (Real)</h3>
              <p className="text-sm text-slate-700">
                Experience the actual exam conditions with no instant feedback. Results shown only after submission.
              </p>
            </div>
            <div className="p-4 border-2 border-[#10b981] rounded-lg bg-green-50">
              <h3 className="font-semibold mb-2 text-[#10b981]">Practice Mode</h3>
              <p className="text-sm text-slate-700">
                Learn as you go with immediate color-coded feedback on each answer for better learning.
              </p>
            </div>
          </div>
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
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}