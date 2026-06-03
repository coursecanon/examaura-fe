import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { useUser } from '../context/UserContext';
import { QuizTimer } from '../components/QuizTimer';
import api from '../api/axiosConfig';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export function ActiveQuiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const mode = searchParams.get('mode') || 'REAL';
  const isPracticeMode = mode === 'PRACTICE' || mode === 'practice'; // Catching both cases

  // API State
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [quizDetails, setQuizDetails] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [feedbackShown, setFeedbackShown] = useState<Record<number, boolean>>({});

  const questionStartTime = useRef<number>(Date.now());
  const accumulatedTime = useRef<Record<number, number>>({});

  // Reset the clock timestamp whenever the user jumps to a new question
  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [currentQuestionIndex]);

  // 1. Initialize the Attempt & Fetch Data
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const userId = user?.id || 'dceb2a0a-0918-4c0e-93a5-b9c70875f34f'; 

        const attemptRes = await api.post(`/attempts/start?userId=${userId}`, {
          quizId: quizId,
          mode: mode.toUpperCase() 
        });
        setAttemptId(attemptRes.data.id);

        const quizRes = await api.get(`/quizzes/${quizId}`);
        setQuizDetails(quizRes.data);
        setTimeRemaining(quizRes.data.durationMinutes * 60);

        const questionsRes = await api.get(`/quizzes/${quizId}/questions?size=100`);
        const rawQuestions = questionsRes.data.content || questionsRes.data.data || questionsRes.data;

        // DATA ADAPTER
const formattedQuestions = rawQuestions.map((q: any) => {
  const rawType = q.questionType || q.type || '';
  const mappedType = rawType.toLowerCase().replace(/_/g, '-');

  const parseJSON = (val: any) => {
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch (e) { return null; }
    }
    return val;
  };

  // 🛡️ SAFE FIX: Safely flatten backend correct answer format { answer: 1 } -> 1
  let rawCorrectAnswer = parseJSON(q.correctAnswer);
  let mappedCorrectAnswer = rawCorrectAnswer;
  
  if (rawCorrectAnswer && typeof rawCorrectAnswer === 'object') {
    if (rawCorrectAnswer.answer !== undefined) {
      mappedCorrectAnswer = rawCorrectAnswer.answer;
    } else if (rawCorrectAnswer.answers !== undefined) {
      mappedCorrectAnswer = rawCorrectAnswer.answers;
    }
  }

  const mappedQ: any = {
    ...q,
    id: q.id,
    text: q.questionText || q.text,
    type: mappedType,
    explanation: q.explanation,
    questionImage: q.questionImageUrl,
    options: parseJSON(q.options),
    correctAnswer: mappedCorrectAnswer,
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
          mappedQ.sentenceTemplate = q.sentenceTemplate;
          mappedQ.inlineDropdowns = parseJSON(q.inlineDropdowns);

          return mappedQ;
        });

        setQuestions(formattedQuestions);
        
      } catch (error) {
        console.error("Failed to initialize quiz attempt", error);
      } finally {
        setLoading(false);
      }
    };

    if (quizId) initializeQuiz();
  }, [quizId, mode, user?.id]); // 👈 FIX 1: user?.id stops the infinite loop!

  // Timer logic
  useEffect(() => {
    if (loading || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => handleSubmit(), 0); // Safe closure delay
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [loading]); // 👈 FIX 2: Removed timeRemaining from dep array to stop thrashing

  if (loading) return <div className="p-8 text-center text-lg font-medium text-slate-600">Initializing Exam Environment...</div>;
  if (questions.length === 0) return <div className="p-8 text-center text-red-500">No questions found for this quiz.</div>;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

const syncAnswerToBackend = async (indexToSync: number) => {
    const answerPayload = answers[indexToSync];
    const questionToSync = questions[indexToSync];

    if (answerPayload !== undefined && attemptId && questionToSync) {
      try {
        // ⏱️ CALCULATE TIME SPENT
        const timeSpentNow = Math.floor((Date.now() - questionStartTime.current) / 1000);
        const totalTimeForQuestion = (accumulatedTime.current[indexToSync] || 0) + timeSpentNow;
        
        // Update the ref so if they navigate back and forth, the time adds up correctly
        if (indexToSync === currentQuestionIndex) {
            accumulatedTime.current[indexToSync] = totalTimeForQuestion;
            questionStartTime.current = Date.now(); 
        }

        await api.post(`/attempts/${attemptId}/answers`, {
          questionId: questionToSync.id,
          userAnswer: answerPayload, 
          timeSpentSeconds: totalTimeForQuestion, // 👈 Now sends the actual calculated time!
          isAnswerRevealed: feedbackShown[indexToSync] || false
        });
      } catch (err) {
        console.error("Failed to sync answer to server", err);
      }
    }
  };

  const handleNext = () => {
    syncAnswerToBackend(currentQuestionIndex);
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1);
  };

  const handlePrevious = () => {
    syncAnswerToBackend(currentQuestionIndex);
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
  };

  const handleQuestionJump = (index: number) => {
    syncAnswerToBackend(currentQuestionIndex);
    setCurrentQuestionIndex(index);
  };

  // 👈 FIX 3: Brought back checkAnswer logic
  const checkAnswer = (questionIndex: number) => {
    const question = questions[questionIndex];
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
        return question.statements?.every((stmt: any) => userAnswer[stmt.id] === stmt.correctAnswer) || false;
      case 'drag-match':
        return question.matchPairs?.every((pair: any) => userAnswer[pair.id] === pair.id) || false;
      case 'drag-classify':
        return question.classifyItems?.every((item: any) => {
          const entry = Object.entries(userAnswer).find(([_, items]) => (items as string[]).includes(item.id));
          return entry && entry[0] === item.correctCategoryId;
        }) || false;
      case 'inline-dropdown':
        return question.inlineDropdowns?.every((dropdown: any, idx: number) => userAnswer[idx] === dropdown.correctAnswer) || false;
      case 'matching-dropdown':
        return question.dropdownRows?.every((row: any) => userAnswer[row.id] === row.correctAnswer) || false;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    await syncAnswerToBackend(currentQuestionIndex);
    try {
      if (attemptId) await api.post(`/attempts/${attemptId}/finish`);
      navigate(`/quiz/${quizId}/results?attemptId=${attemptId}`);
    } catch (error) {
      console.error("Failed to finish attempt", error);
      alert("Error submitting quiz.");
    }
  };

  // 👈 FIX 4: Brought back Practice Mode Status logic
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
    <DndProvider backend={HTML5Backend}>
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">Question {currentQuestionIndex + 1} of {questions.length}</span>

            {/* The new isolated timer! */}
  {quizDetails && (
    <QuizTimer 
      initialMinutes={quizDetails.durationMinutes} 
      onTimeUp={handleSubmit} 
    />
  )}
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="p-8 shadow-lg mb-6">
              
              <h2 className="text-2xl font-semibold mb-6">{currentQuestion.text}</h2>

              {currentQuestion.questionImage && (
                <div className="mb-6">
                  <img src={currentQuestion.questionImage} alt="Question" className="max-w-full h-auto rounded-lg border border-border" style={{ maxHeight: '400px', objectFit: 'contain' }} />
                </div>
              )}

              <QuestionDisplay
                question={currentQuestion}
                userAnswer={answers[currentQuestionIndex]}
                onAnswer={handleAnswer}
                isPracticeMode={isPracticeMode}
                hasAnswered={feedbackShown[currentQuestionIndex] || false}
              />

              {/* 👈 FIX 5: Explanation block restored */}
              {isPracticeMode && feedbackShown[currentQuestionIndex] && answers[currentQuestionIndex] !== undefined && (
                <div className={`mt-6 p-4 rounded-xl border ${checkAnswer(currentQuestionIndex) ? 'bg-green-50 border-[#10b981]/30' : 'bg-red-50 border-[#dc2626]/30'}`}>
                  <div className="flex items-start gap-3">
                    {checkAnswer(currentQuestionIndex) ? (
                      <CheckCircle className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[#dc2626] flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">{checkAnswer(currentQuestionIndex) ? 'Correct!' : 'Incorrect'}</p>
                      <p className="text-sm text-slate-700">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>

              <div className="flex gap-3">
                {/* 👈 FIX 6: Show Answer button restored */}
                {isPracticeMode && answers[currentQuestionIndex] !== undefined && !feedbackShown[currentQuestionIndex] && (
                  <Button variant="outline" onClick={handleShowAnswer} className="border-[#10b981] text-[#10b981] hover:bg-[#10b981] hover:text-white">
                    <Eye className="w-4 h-4 mr-2" /> Show Answer
                  </Button>
                )}

                {currentQuestionIndex === questions.length - 1 ? (
                  <Button onClick={() => setShowSubmitDialog(true)} className="bg-[#10b981] hover:bg-[#059669] text-white">
                    Submit Quiz
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white">
                    Next <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Question Map</h3>
              <p className="text-sm text-slate-600 mb-4">Answered: {answeredCount}/{questions.length}</p>
              
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => {
                  const status = getQuestionStatus(index);
                  return (
                    <button
                      key={index}
                      onClick={() => handleQuestionJump(index)}
                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                        index === currentQuestionIndex ? 'ring-2 ring-[#1e40af] ring-offset-2' : ''
                      } ${
                        status === 'correct' ? 'bg-[#10b981] text-white' : 
                        status === 'incorrect' ? 'bg-[#dc2626] text-white' : 
                        status === 'answered' ? 'bg-blue-100 text-[#1e40af] border border-[#1e40af]' : 
                        'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* 👈 FIX 7: Sidebar legend restored */}
              <div className="mt-6 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-100 rounded" /><span>Unanswered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-[#1e40af] rounded" /><span>Answered</span>
                </div>
                {isPracticeMode && (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#10b981] rounded" /><span>Correct</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#dc2626] rounded" /><span>Incorrect</span>
                    </div>
                  </>
                )}
              </div>

            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quiz?</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this quiz? You have answered {answeredCount} out of {questions.length} questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSubmitDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} className="bg-[#10b981] text-white">Yes, Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </DndProvider>
  );
}