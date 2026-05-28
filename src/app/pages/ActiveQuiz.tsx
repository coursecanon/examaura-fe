import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { useQuizzes } from '../context/QuizContext';
import { useUser } from '../context/UserContext';

export function ActiveQuiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { getQuizById, addAttempt } = useQuizzes();
  const { isLoggedIn } = useUser();

  const mode = searchParams.get('mode') || 'exam';
  const quiz = quizId ? getQuizById(quizId) : undefined;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeRemaining, setTimeRemaining] = useState((quiz?.duration || 60) * 60);
  const [startTime] = useState(Date.now());
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  // Track which questions have had "Show Answer" clicked — persists across navigation
  const [feedbackShown, setFeedbackShown] = useState<Record<number, boolean>>({});

  const isPracticeMode = mode === 'practice';

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!quiz) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p>Quiz not found</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const checkAnswer = (questionIndex: number) => {
    const question = quiz.questions[questionIndex];
    const userAnswer = answers[questionIndex];
    if (userAnswer === undefined) return false;

    switch (question.type) {
      case 'objective':
        return userAnswer === question.correctAnswer;
      case 'multiple-choice': {
        const correctAnswers = question.correctAnswer as number[];
        if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswers)) return false;
        return userAnswer.length === correctAnswers.length &&
               userAnswer.every((ans: number) => correctAnswers.includes(ans));
      }
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
          const entry = Object.entries(userAnswer).find(([_, items]) =>
            (items as string[]).includes(item.id)
          );
          return entry && entry[0] === item.correctCategoryId;
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

  const handleSubmit = () => {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000 / 60);

    let correctAnswers = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      if (checkAnswer(i)) correctAnswers++;
    }

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    sessionStorage.setItem('quizResults', JSON.stringify({
      quizId: quiz.id,
      answers,
      score,
      correctAnswers,
      totalQuestions: quiz.questions.length,
      timeTaken,
      mode
    }));

    // Persist attempt to history if logged in
    if (isLoggedIn) {
      addAttempt({
        quizId: quiz.id,
        quizName: quiz.title,
        category: quiz.category,
        score,
        date: new Date().toISOString().split('T')[0]
      });
    }

    navigate(`/quiz/${quizId}/results`);
  };

  // KEY FIX: In practice mode, only show correct/incorrect color AFTER "Show Answer" is clicked
  const getQuestionStatus = (index: number) => {
    const hasAnswer = answers[index] !== undefined;
    if (!hasAnswer) return 'unanswered';

    if (isPracticeMode && feedbackShown[index]) {
      return checkAnswer(index) ? 'correct' : 'incorrect';
    }

    return 'answered';
  };

  const handleShowAnswer = () => {
    setFeedbackShown(prev => ({ ...prev, [currentQuestionIndex]: true }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Progress Bar and Timer */}
      <div className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </span>
            <div className={`flex items-center gap-2 font-semibold ${timeRemaining < 300 ? 'text-[#dc2626]' : 'text-[#1e40af]'}`}>
              <Clock className="w-5 h-5" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Area */}
          <div className="lg:col-span-3">
            <Card className="p-8 shadow-lg mb-6">
              <h2 className="text-2xl font-semibold mb-6">{currentQuestion.text}</h2>

              {currentQuestion.questionImage && (
                <div className="mb-6">
                  <img
                    src={currentQuestion.questionImage}
                    alt="Question illustration"
                    className="max-w-full h-auto rounded-lg border border-border"
                    style={{ maxHeight: '400px', objectFit: 'contain' }}
                  />
                </div>
              )}

              <QuestionDisplay
                question={currentQuestion}
                userAnswer={answers[currentQuestionIndex]}
                onAnswer={handleAnswer}
                isPracticeMode={isPracticeMode}
                hasAnswered={feedbackShown[currentQuestionIndex] || false}
              />

              {/* Show explanation ONLY after "Show Answer" is clicked in practice mode */}
              {isPracticeMode && feedbackShown[currentQuestionIndex] && answers[currentQuestionIndex] !== undefined && (
                <div className={`mt-6 p-4 rounded-xl border ${checkAnswer(currentQuestionIndex) ? 'bg-green-50 border-[#10b981]/30' : 'bg-red-50 border-[#dc2626]/30'}`}>
                  <div className="flex items-start gap-3">
                    {checkAnswer(currentQuestionIndex) ? (
                      <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">
                        {checkAnswer(currentQuestionIndex) ? 'Correct!' : 'Incorrect'}
                      </p>
                      <p className="text-sm text-slate-700">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-3">
                {/* Show Answer Button: only in practice mode, after answering, before feedback shown */}
                {isPracticeMode && answers[currentQuestionIndex] !== undefined && !feedbackShown[currentQuestionIndex] && (
                  <Button
                    variant="outline"
                    onClick={handleShowAnswer}
                    className="border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Show Answer
                  </Button>
                )}

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <Button
                    onClick={() => setShowSubmitDialog(true)}
                    className="bg-[#10b981] hover:bg-[#059669] text-white"
                  >
                    Submit Quiz
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Question Map Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Question Map</h3>
              <p className="text-sm text-slate-600 mb-4">
                Answered: {answeredCount}/{quiz.questions.length}
              </p>
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionJump(index)}
                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                        index === currentQuestionIndex ? 'ring-2 ring-[#1e40af] ring-offset-2' : ''
                      } ${
                        status === 'correct'
                          ? 'bg-[#10b981] text-white'
                          : status === 'incorrect'
                          ? 'bg-[#dc2626] text-white'
                          : status === 'answered'
                          ? 'bg-blue-100 text-[#1e40af] border border-[#1e40af]'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-100 rounded" />
                  <span>Unanswered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-[#1e40af] rounded" />
                  <span>Answered</span>
                </div>
                {isPracticeMode && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#10b981] rounded" />
                      <span>Correct (after Show Answer)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#dc2626] rounded" />
                      <span>Incorrect (after Show Answer)</span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quiz?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this quiz? You have answered{' '}
              {answeredCount} out of {quiz.questions.length} questions.
              {answeredCount < quiz.questions.length && (
                <span className="block mt-2 text-[#dc2626]">
                  Warning: You have {quiz.questions.length - answeredCount} unanswered question(s).
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#10b981] hover:bg-[#059669] text-white"
            >
              Yes, Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
