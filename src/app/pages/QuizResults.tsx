import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Trophy, Clock, CheckCircle, XCircle, Home, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatDuration } from '../components/ui/utils';
import api from '../api/axiosConfig'; // 🛡️ Uses your authenticated Axios instance

export function QuizResults() {
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const attemptId = searchParams.get('attemptId');

  // Unified Loading and Data State
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<any>(null);
  const [quiz, setQuiz] = useState<any>(null);
  const [confettiTriggered, setConfettiTriggered] = useState(false);

  useEffect(() => {
    const fetchQuizResultsAndDetails = async () => {
      if (!attemptId || !quizId) {
        navigate('/');
        return;
      }

      try {
        // 1. Fetch the attempt summary grading report from backend
        const summaryRes = await api.get(`/attempts/${attemptId}/summary`);
        const summaryData = summaryRes.data;
        // 2. Fetch Quiz Details and Questions for the Review section
        const quizRes = await api.get(`/quizzes/${quizId}`);
        const questionsRes = await api.get(`/quizzes/${quizId}/questions?size=100`);
        const rawQuestions = questionsRes.data.content || questionsRes.data.data || questionsRes.data;

        // --- DATA ADAPTER: Same parsing logic used in ActiveQuiz to normalize keys ---
        const formattedQuestions = rawQuestions.map((q: any) => {
          const rawType = q.questionType || q.type || '';
          const mappedType = rawType.toLowerCase().replace(/_/g, '-');

          const parseJSON = (val: any) => {
            if (typeof val === 'string') {
              try { return JSON.parse(val); } catch (e) { return null; }
            }
            return val;
          };

          const mappedQ: any = {
            ...q,
            id: q.id,
            text: q.questionText || q.text,
            type: mappedType,
            explanation: q.explanation,
            questionImage: q.questionImageUrl,
            options: parseJSON(q.options),
            correctAnswer: parseJSON(q.correctAnswer),
          };

          if (mappedType === 'yes-no-grid') {
            mappedQ.statements = parseJSON(q.matchPairs || q.statements);
          } else if (mappedType === 'drag-match') {
            mappedQ.matchPairs = parseJSON(q.matchPairs);
          } else {
            mappedQ.statements = parseJSON(q.statements);
            mappedQ.matchPairs = parseJSON(q.matchPairs);
          }

          mappedQ.categories = parseJSON(q.categories);
          mappedQ.classifyItems = parseJSON(q.classifyItems);
          mappedQ.dropdownRows = parseJSON(q.dropdownRows);
          mappedQ.inlineDropdowns = parseJSON(q.inlineDropdowns);

          return mappedQ;
        });

        // Add adapted questions into localized quiz state
        setQuiz({ ...quizRes.data, questions: formattedQuestions });

        // 3. Map backend answer arrays to the frontend's index-based structure
        const answersMap: Record<number, any> = {};
        const backendAnswers = summaryData.answers || summaryData.submittedAnswers || [];

        formattedQuestions.forEach((question: any, index: number) => {
          const matchingAnswer = backendAnswers.find((a: any) => a.questionId === question.id);
          if (matchingAnswer) {
            let userAnsPayload = matchingAnswer.userAnswer;
            if (typeof userAnsPayload === 'string') {
              try { userAnsPayload = JSON.parse(userAnsPayload); } catch (e) {}
            }
            answersMap[index] = userAnsPayload;
          }
        });

        // 4. Construct consistent results object matching your original view properties
        setResults({
          score: summaryData.score !== undefined ? summaryData.score : summaryData.percentage,
          passedPercentage: summaryData.passedScore,
          correctAnswers: summaryData.correctAnswers !== undefined ? summaryData.correctAnswers : summaryData.scoreCount,
          totalQuestions: summaryData.totalQuestions || formattedQuestions.length,
          timeTaken: formatDuration(summaryData.timeTakenSeconds) || formatDuration(quizRes.data.durationMinutes * 60),
          mode: summaryData.mode || 'REAL',
          answers: answersMap
        });

      } catch (error) {
        console.error("Failed to load quiz summary reports:", error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizResultsAndDetails();
  }, [attemptId, quizId, navigate]);

  // Confetti effect trigger
  useEffect(() => {
    if (results && quiz && !confettiTriggered) {
      const passed = results.passedPercentage >= (quiz.passingScore || 70);
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

  if (loading) {
    return <div className="p-8 text-center text-lg font-medium text-slate-600">Compiling Scorecards & Performance Analytics...</div>;
  }

  if (!results || !quiz) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-red-500 font-medium">Quiz result summary data could not be parsed.</p>
      </div>
    );
  }

  const passed = results.passedPercentage >= (quiz.passingScore || 70);
  const incorrectAnswers = results.totalQuestions - results.correctAnswers;

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
        return question.statements?.every((stmt: any) =>
          userAnswer[stmt.id] === stmt.correctAnswer
        ) || false;
      case 'drag-match':
        return question.matchPairs?.every((pair: any) =>
          userAnswer[pair.id] === pair.id
        ) || false;
      case 'drag-classify':
        return question.classifyItems?.every((item: any) => {
          const userCategories = Object.entries(userAnswer).find(([_, items]) =>
            (items as string[]).includes(item.id)
          );
          return userCategories && userCategories[0] === item.correctCategoryId;
        }) || false;
      case 'inline-dropdown':
        return question.inlineDropdowns?.every((dropdown: any, idx: number) =>
          userAnswer[idx] === dropdown.correctAnswer
        ) || false;
      case 'matching-dropdown':
        return question.dropdownRows?.every((row: any) =>
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
        <Card className={`p-8 mb-8 text-center border-2 ${
          passed
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-[#10b981]/20'
            : 'bg-gradient-to-r from-red-50 to-rose-50 border-[#dc2626]/20'
        }`}>
          <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-sm">
            <Trophy className={`w-16 h-16 ${passed ? 'text-[#10b981]' : 'text-[#dc2626]'}`} />
          </div>
          <h1 className="text-4xl font-bold mb-2 text-slate-900">
            {passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="text-xl text-slate-600 mb-6">
            You scored {results.passedPercentage}% on {quiz.title} with points {results.score}
          </p>
          <div className="inline-block">
            <Badge className={`text-lg px-6 py-2 tracking-wide font-semibold ${
              passed
                ? 'bg-[#10b981] text-white'
                : 'bg-[#dc2626] text-white'
            }`}>
              {passed ? 'PASSED' : 'FAILED'} - {results.passedPercentage}%
            </Badge>
          </div>
        </Card>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-[#1e40af]">{results.passedPercentage}%</div>
            <p className="text-sm text-slate-600 mt-1 font-medium">Final Score</p>
          </Card>
          <Card className="p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-[#10b981]">{results.correctAnswers}</div>
            <p className="text-sm text-slate-600 mt-1 font-medium">Correct</p>
          </Card>
          <Card className="p-6 text-center shadow-sm">
            <div className="text-3xl font-bold text-[#dc2626]">{incorrectAnswers}</div>
            <p className="text-sm text-slate-600 mt-1 font-medium">Incorrect</p>
          </Card>
          <Card className="p-6 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2">
              <Clock className="w-6 h-6 text-[#1e40af]" />
              <div className="text-3xl font-bold text-[#1e40af]">{results.timeTaken}</div>
            </div>
            <p className="text-sm text-slate-600 mt-1 font-medium">Minutes Taken</p>
          </Card>
        </div>
        
        {/* Question Review */}
        <Card className="p-8 mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6 text-slate-900">Question Review</h2>
          <div className="space-y-6">
            {quiz.questions.map((question: any, index: number) => {
              const userAnswer = results.answers[index];
              const isCorrect = checkAnswer(index);
              const wasAnswered = userAnswer !== undefined;
              
              return (
                <div
                  key={question.id}
                  className={`p-6 border-2 rounded-xl transition-all ${
                    !wasAnswered
                      ? 'border-slate-300 bg-slate-50/50'
                      : isCorrect
                      ? 'border-[#10b981]/40 bg-green-50/40'
                      : 'border-[#dc2626]/40 bg-red-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    {!wasAnswered ? (
                      <div className="w-6 h-6 rounded-full bg-slate-400 flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs font-bold">?</span>
                      </div>
                    ) : isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-[#10b981] flex-shrink-0 mt-1" />
                    ) : (
                      <XCircle className="w-6 h-6 text-[#dc2626] flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm text-slate-500">
                          Question {index + 1}
                        </span>
                        <Badge variant={!wasAnswered ? 'outline' : isCorrect ? 'default' : 'destructive'}>
                          {!wasAnswered ? 'Unanswered' : isCorrect ? 'Correct' : 'Incorrect'}
                        </Badge>
                      </div>
                      <p className="font-semibold text-lg mb-4 text-slate-900">{question.questionText || question.text}</p>
                      
                      {/* Options rendering for choice architectures */}
                      {(question.type === 'objective' || question.type === 'multiple-choice') && question.options && (
                        <div className="space-y-2 mb-4">
                          {question.options.map((option: string, optionIndex: number) => {
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
                                    ? 'border-[#10b981] bg-green-100/60'
                                    : isUserAnswer
                                    ? 'border-[#dc2626] bg-red-100/60'
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
                                  <span className={isCorrectAnswer || isUserAnswer ? 'font-semibold text-slate-900' : 'text-slate-700'}>
                                    {option}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      {/* Summary indicator badges for custom drag types */}
                      {question.type !== 'objective' && question.type !== 'multiple-choice' && wasAnswered && (
                        <div className="mb-4 p-3 rounded-lg bg-slate-100 border border-slate-200">
                          <p className="text-sm font-medium text-slate-700">
                            {question.type === 'yes-no-grid' && `Answered ${question.statements?.length || 0} statements`}
                            {question.type === 'drag-match' && `Matched ${question.matchPairs?.length || 0} pairs`}
                            {question.type === 'drag-classify' && `Classified ${question.classifyItems?.length || 0} items`}
                            {question.type === 'inline-dropdown' && `Completed ${question.inlineDropdowns?.length || 0} dropdowns`}
                            {question.type === 'matching-dropdown' && `Matched ${question.dropdownRows?.length || 0} rows`}
                          </p>
                        </div>
                      )}
                      
                      <div className="p-4 bg-blue-50/60 border border-[#1e40af]/10 rounded-xl">
                        <p className="font-bold text-sm text-[#1e40af] mb-1">Explanation:</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        
        {/* Layout Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="outline" className="w-full sm:w-auto font-medium">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Link to={`/category/${quiz.category}`}>
            <Button variant="outline" className="w-full sm:w-auto font-medium">
              View More Quizzes
            </Button>
          </Link>
          <Link to={`/quiz/${quizId}/instructions?mode=${results.mode}`}>
            <Button className="w-full sm:w-auto bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-medium shadow-sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Quiz
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}