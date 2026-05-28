import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Trophy, Clock, CheckCircle, XCircle, Home, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useQuizzes } from '../context/QuizContext';

export function QuizResults() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { getQuizById } = useQuizzes();
  const [results, setResults] = useState<any>(null);
  const [confettiTriggered, setConfettiTriggered] = useState(false);
  
  const quiz = quizId ? getQuizById(quizId) : undefined;
  
  useEffect(() => {
    const storedResults = sessionStorage.getItem('quizResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      navigate('/');
    }
  }, [navigate]);
  
  // Confetti effect - must be called before any returns
  useEffect(() => {
    if (results && quiz && !confettiTriggered) {
      const passed = results.score >= (quiz.passingScore || 70);
      if (passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setConfettiTriggered(true);
      }
    }
  }, [results, quiz, confettiTriggered]);
  
  if (!results) {
    return null;
  }
  
  if (!quiz) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Quiz not found</p>
      </div>
    );
  }
  
  const passed = results.score >= (quiz.passingScore || 70);
  const incorrectAnswers = results.totalQuestions - results.correctAnswers;
  const unanswered = results.totalQuestions - Object.keys(results.answers).length;
  
  // Check if a question is answered correctly
  const checkAnswer = (questionIndex: number) => {
    const question = quiz.questions[questionIndex];
    const userAnswer = results.answers[questionIndex];
    
    if (userAnswer === undefined) return false;
    
    switch (question.type) {
      case 'objective':
        return userAnswer === question.correctAnswer;
      case 'multiple-choice':
        const correctAnswers = question.correctAnswer as number[];
        if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswers)) return false;
        return userAnswer.length === correctAnswers.length &&
               userAnswer.every((ans: number) => correctAnswers.includes(ans));
      case 'yes-no-grid':
        return question.statements?.every(stmt =>
          userAnswer[stmt.id] === stmt.correctAnswer
        ) || false;
      case 'drag-match':
        return question.matchPairs?.every(pair =>
          userAnswer[pair.id] === pair.id
        ) || false;
      case 'drag-classify':
        return question.classifyItems?.every(item => {
          const userCategories = Object.entries(userAnswer).find(([_, items]) =>
            (items as string[]).includes(item.id)
          );
          return userCategories && userCategories[0] === item.correctCategoryId;
        }) || false;
      case 'inline-dropdown':
        return question.inlineDropdowns?.every((dropdown, idx) =>
          userAnswer[idx] === dropdown.correctAnswer
        ) || false;
      case 'matching-dropdown':
        return question.dropdownRows?.every(row =>
          userAnswer[row.id] === row.correctAnswer
        ) || false;
      default:
        return false;
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header */}
        <Card className={`p-8 mb-8 text-center ${
          passed
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-[#10b981]/20'
            : 'bg-gradient-to-r from-red-50 to-rose-50 border-[#dc2626]/20'
        }`}>
          <div className="inline-block p-4 bg-white rounded-full mb-4">
            <Trophy className={`w-16 h-16 ${passed ? 'text-[#10b981]' : 'text-[#dc2626]'}`} />
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            You scored {results.score}% on {quiz.title}
          </p>
          <div className="inline-block">
            <Badge className={`text-lg px-6 py-2 ${
              passed
                ? 'bg-[#10b981] text-white hover:bg-[#059669]'
                : 'bg-[#dc2626] text-white hover:bg-[#b91c1c]'
            }`}>
              {passed ? 'PASSED' : 'FAILED'} - {results.score}%
            </Badge>
          </div>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-[#1e40af]">{results.score}%</div>
            <p className="text-sm text-slate-600 mt-1">Final Score</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-[#10b981]">{results.correctAnswers}</div>
            <p className="text-sm text-slate-600 mt-1">Correct</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-3xl font-bold text-[#dc2626]">{incorrectAnswers}</div>
            <p className="text-sm text-slate-600 mt-1">Incorrect</p>
          </Card>
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-6 h-6 text-[#1e40af]" />
              <div className="text-3xl font-bold text-[#1e40af]">{results.timeTaken}</div>
            </div>
            <p className="text-sm text-slate-600 mt-1">Minutes</p>
          </Card>
        </div>
        
        {/* Question Review */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Question Review</h2>
          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = results.answers[index];
              const isCorrect = checkAnswer(index);
              const wasAnswered = userAnswer !== undefined;
              
              return (
                <div
                  key={question.id}
                  className={`p-6 border-2 rounded-lg ${
                    !wasAnswered
                      ? 'border-slate-300 bg-slate-50'
                      : isCorrect
                      ? 'border-[#10b981] bg-green-50'
                      : 'border-[#dc2626] bg-red-50'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {!wasAnswered ? (
                      <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs">?</span>
                      </div>
                    ) : isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-[#10b981] flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-[#dc2626] flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm text-slate-600">
                          Question {index + 1}
                        </span>
                        <Badge variant={!wasAnswered ? 'outline' : isCorrect ? 'default' : 'destructive'}>
                          {!wasAnswered ? 'Unanswered' : isCorrect ? 'Correct' : 'Incorrect'}
                        </Badge>
                      </div>
                      <p className="font-medium text-lg mb-4">{question.text}</p>
                      
                      {/* Show options for objective and multiple-choice questions */}
                      {(question.type === 'objective' || question.type === 'multiple-choice') && question.options && (
                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optionIndex) => {
                            const correctAnswers = Array.isArray(question.correctAnswer) 
                              ? question.correctAnswer 
                              : [question.correctAnswer];
                            
                            const userAnswers = Array.isArray(userAnswer) 
                              ? userAnswer 
                              : [userAnswer];
                            
                            const isUserAnswer = userAnswers.includes(optionIndex);
                            const isCorrectAnswer = correctAnswers.includes(optionIndex);
                            
                            return (
                              <div
                                key={optionIndex}
                                className={`p-3 rounded-lg border-2 ${
                                  isCorrectAnswer
                                    ? 'border-[#10b981] bg-green-100'
                                    : isUserAnswer
                                    ? 'border-[#dc2626] bg-red-100'
                                    : 'border-slate-200 bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCorrectAnswer && (
                                    <CheckCircle className="w-4 h-4 text-[#10b981]" />
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <XCircle className="w-4 h-4 text-[#dc2626]" />
                                  )}
                                  <span className={isCorrectAnswer || isUserAnswer ? 'font-medium' : ''}>
                                    {option}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Show summary for other question types */}
                      {question.type !== 'objective' && question.type !== 'multiple-choice' && wasAnswered && (
                        <div className="mb-4 p-3 rounded-lg bg-slate-100 border border-slate-300">
                          <p className="text-sm text-slate-700">
                            {question.type === 'yes-no-grid' && `Answered ${question.statements?.length || 0} statements`}
                            {question.type === 'drag-match' && `Matched ${question.matchPairs?.length || 0} pairs`}
                            {question.type === 'drag-classify' && `Classified ${question.classifyItems?.length || 0} items`}
                            {question.type === 'inline-dropdown' && `Completed ${question.inlineDropdowns?.length || 0} dropdowns`}
                            {question.type === 'matching-dropdown' && `Matched ${question.dropdownRows?.length || 0} rows`}
                          </p>
                        </div>
                      )}
                      
                      <div className="p-4 bg-blue-50 border border-[#1e40af]/20 rounded-lg">
                        <p className="font-semibold text-sm mb-1">Explanation:</p>
                        <p className="text-sm text-slate-700">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to={`/category/${quiz.category}`}>
            <Button variant="outline" className="w-full sm:w-auto">
              View More Quizzes
            </Button>
          </Link>
          <Link to={`/quiz/${quizId}/instructions?mode=${results.mode}`}>
            <Button className="w-full sm:w-auto bg-[#1e40af] hover:bg-[#1e3a8a] text-white">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
