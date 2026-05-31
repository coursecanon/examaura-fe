import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, Eye } from 'lucide-react';
import { QuestionDisplay } from '../components/QuestionDisplay';
import { useUser } from '../context/UserContext';
import api from '../api/axiosConfig'; // 👈 The interceptor handles the JWT automatically

export function ActiveQuiz() {
  const { quizId } = useParams<{ quizId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();

  const mode = searchParams.get('mode') || 'REAL';
  const isPracticeMode = mode === 'PRACTICE';

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

  // 1. Initialize the Attempt & Fetch Data
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        // Temp fallback ID matching your backend QuizController hardcoded ID (until JWT subject parsing is live)
        const userId = user?.id || 'dceb2a0a-0918-4c0e-93a5-b9c70875f34f'; 

        // Start the attempt
        const attemptRes = await api.post(`/attempts/start?userId=${userId}`, {
          quizId: quizId,
          mode: mode.toUpperCase() // Assuming ENUM expects REAL or PRACTICE
        });
        setAttemptId(attemptRes.data.id);

        // Fetch Quiz Details (for timer)
        const quizRes = await api.get(`/quizzes/${quizId}`);
        setQuizDetails(quizRes.data);
        setTimeRemaining(quizRes.data.durationMinutes * 60);

        // Fetch Paginated Questions (grabbing up to 100 to avoid pagination mid-test)
        const questionsRes = await api.get(`/quizzes/${quizId}/questions?size=100`);
        // The backend returns a PaginatedResponse wrapper, so we extract .content or .data depending on your DTO
        setQuestions(questionsRes.data.content || questionsRes.data.data || questionsRes.data);

      } catch (error) {
        console.error("Failed to initialize quiz attempt", error);
        // Handle error (e.g., redirect away)
      } finally {
        setLoading(false);
      }
    };

    if (quizId) initializeQuiz();
  }, [quizId, mode, user]);

  console.log("Quiz Details:", quizDetails); // Debug log to verify quiz metadata
  console.log("Fetched Questions:", questions); // Debug log to verify questions array
  console.log("Attempt mode:", mode); // Debug log to verify attempt mode
  console.log("Current user:", user); // Debug log to verify user context


  // Timer logic
  useEffect(() => {
    if (loading || timeRemaining <= 0) return;
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
  }, [loading, timeRemaining]);

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

  // 2. Handle Answer Selection
  const handleAnswer = (answer: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: answer }));
  };

  // 3. Sync to Backend on Navigation
  const syncAnswerToBackend = async (indexToSync: number) => {
    const answerPayload = answers[indexToSync];
    const questionToSync = questions[indexToSync];

    if (answerPayload !== undefined && attemptId && questionToSync) {
      try {
        // Adjust the payload properties to match your QuestionAnswerSubmitDTO exactly
        await api.post(`/attempts/${attemptId}/answers`, {
          questionId: questionToSync.id,
          answerData: answerPayload // Depending on how your DTO handles polymorphic JSON answers
        });
      } catch (err) {
        console.error("Failed to sync answer to server", err);
      }
    }
  };

  const handleNext = () => {
    syncAnswerToBackend(currentQuestionIndex); // Sync before moving
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    syncAnswerToBackend(currentQuestionIndex); // Sync before moving
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleQuestionJump = (index: number) => {
    syncAnswerToBackend(currentQuestionIndex);
    setCurrentQuestionIndex(index);
  };

  // 4. Final Submission
  const handleSubmit = async () => {
    // Make sure the very last question is synced before closing
    await syncAnswerToBackend(currentQuestionIndex);

    try {
      if (attemptId) {
        // Trigger backend grading compilation
        await api.post(`/attempts/${attemptId}/finish`);
      }
      // Redirect to the results page where it can call GET /attempts/{attemptId}/summary
      navigate(`/quiz/${quizId}/results?attemptId=${attemptId}`);
    } catch (error) {
      console.error("Failed to finish attempt", error);
      alert("There was an error submitting your quiz. Please try again.");
    }
  };

  const getQuestionStatus = (index: number) => {
    const hasAnswer = answers[index] !== undefined;
    if (!hasAnswer) return 'unanswered';
    // Your practice mode logic here
    return 'answered'; 
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Progress Bar and Timer */}
      <div className="bg-white border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">
              Question {currentQuestionIndex + 1} of {questions.length}
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
              
              {/* Note: Map property names from QuestionResponseDTO. 
                  e.g., if backend sends 'questionText', use currentQuestion.questionText */}
              <h2 className="text-2xl font-semibold mb-6">{currentQuestion.questionText || currentQuestion.text}</h2>

              {currentQuestion.questionImageUrl && (
                <div className="mb-6">
                  <img
                    src={currentQuestion.questionImageUrl}
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
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-3">
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button onClick={() => setShowSubmitDialog(true)} className="bg-[#10b981] hover:bg-[#059669] text-white">
                    Submit Quiz
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white">
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar logic remains mostly the same, just swap quiz.questions for the `questions` array */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="font-semibold mb-4">Question Map</h3>
              <p className="text-sm text-slate-600 mb-4">
                Answered: {answeredCount}/{questions.length}
              </p>
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
                        status === 'answered' ? 'bg-blue-100 text-[#1e40af] border border-[#1e40af]' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
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
  );
}