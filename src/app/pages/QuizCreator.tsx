import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Plus, Trash2, Check, ArrowLeft, GripVertical, Eye, X } from 'lucide-react';
import { categories } from '../data/mockData';
import { toast } from 'sonner';
import { useQuizzes } from '../context/QuizContext';

type QuestionType = 'objective' | 'multiple-choice' | 'yes-no-grid' | 'drag-match' | 'drag-classify' | 'inline-dropdown' | 'matching-dropdown';

interface BaseQuestionForm {
  id: string;
  text: string;
  type: QuestionType;
  explanation: string;
}

interface ObjectiveQuestion extends BaseQuestionForm {
  type: 'objective';
  options: string[];
  correctAnswer: number | null;
  questionImage?: string;
}

interface MultipleChoiceQuestion extends BaseQuestionForm {
  type: 'multiple-choice';
  options: string[];
  correctAnswers: number[];
  questionImage?: string;
}

interface YesNoGridQuestion extends BaseQuestionForm {
  type: 'yes-no-grid';
  statements: {
    id: string;
    text: string;
    correctAnswer: 'yes' | 'no' | null;
  }[];
}

interface DragMatchQuestion extends BaseQuestionForm {
  type: 'drag-match';
  matchPairs: {
    id: string;
    term: string;
    definition: string;
  }[];
}

interface DragClassifyQuestion extends BaseQuestionForm {
  type: 'drag-classify';
  categories: {
    id: string;
    name: string;
  }[];
  classifyItems: {
    id: string;
    text: string;
    correctCategoryId: string | null;
  }[];
}

interface InlineDropdownQuestion extends BaseQuestionForm {
  type: 'inline-dropdown';
  sentenceTemplate: string;
  inlineDropdowns: {
    id: string;
    options: string[];
    correctAnswer: number | null;
  }[];
}

interface MatchingDropdownQuestion extends BaseQuestionForm {
  type: 'matching-dropdown';
  dropdownRows: {
    id: string;
    label: string;
    options: string[];
    correctAnswer: number | null;
  }[];
}

type QuestionForm = ObjectiveQuestion | MultipleChoiceQuestion | YesNoGridQuestion | DragMatchQuestion | DragClassifyQuestion | InlineDropdownQuestion | MatchingDropdownQuestion;

export function QuizCreator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addQuiz, updateQuiz, getQuizById } = useQuizzes();

  // Check if we're in edit mode
  const editQuizId = location.state?.editQuizId as string | undefined;
  const isEditMode = !!editQuizId;

  const [quizTitle, setQuizTitle] = useState('');
  const [quizCategory, setQuizCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [quizDuration, setQuizDuration] = useState('60');
  const [quizDescription, setQuizDescription] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([]);

  // Load existing quiz data if in edit mode
  useEffect(() => {
    if (isEditMode && editQuizId) {
      const quiz = getQuizById(editQuizId);
      if (quiz) {
        setQuizTitle(quiz.title);
        setQuizCategory(quiz.category);
        setQuizDuration(quiz.duration.toString());
        setQuizDescription(quiz.description || '');

        // Convert quiz questions to form format
        const formQuestions: QuestionForm[] = quiz.questions.map(q => {
          if (q.type === 'objective') {
            return {
              id: q.id,
              text: q.text,
              type: 'objective',
              options: q.options || [],
              correctAnswer: q.correctAnswer as number,
              explanation: q.explanation,
              questionImage: q.questionImage
            };
          } else if (q.type === 'multiple-choice') {
            return {
              id: q.id,
              text: q.text,
              type: 'multiple-choice',
              options: q.options || [],
              correctAnswers: q.correctAnswer as number[],
              explanation: q.explanation,
              questionImage: q.questionImage
            };
          } else if (q.type === 'yes-no-grid') {
            return {
              id: q.id,
              text: q.text,
              type: 'yes-no-grid',
              statements: q.statements || [],
              explanation: q.explanation
            };
          } else if (q.type === 'drag-match') {
            return {
              id: q.id,
              text: q.text,
              type: 'drag-match',
              matchPairs: q.matchPairs || [],
              explanation: q.explanation
            };
          } else if (q.type === 'drag-classify') {
            return {
              id: q.id,
              text: q.text,
              type: 'drag-classify',
              categories: q.categories || [],
              classifyItems: q.classifyItems || [],
              explanation: q.explanation
            };
          } else if (q.type === 'inline-dropdown') {
            return {
              id: q.id,
              text: q.text,
              type: 'inline-dropdown',
              sentenceTemplate: q.sentenceTemplate || '',
              inlineDropdowns: q.inlineDropdowns || [],
              explanation: q.explanation
            };
          } else if (q.type === 'matching-dropdown') {
            return {
              id: q.id,
              text: q.text,
              type: 'matching-dropdown',
              dropdownRows: q.dropdownRows || [],
              explanation: q.explanation
            };
          }
          // Default case
          return {
            id: q.id,
            text: q.text,
            type: 'objective',
            options: [],
            correctAnswer: null,
            explanation: q.explanation
          };
        });

        setQuestions(formQuestions);
      } else {
        toast.error('Quiz not found');
        navigate('/profile');
      }
    }
  }, [isEditMode, editQuizId, getQuizById, navigate]);
  
  const createNewQuestion = (type: QuestionType): QuestionForm => {
    const base = {
      id: Date.now().toString(),
      text: '',
      type,
      explanation: ''
    };

    switch (type) {
      case 'objective':
        return { ...base, type: 'objective', options: ['', ''], correctAnswer: null };
      case 'multiple-choice':
        return { ...base, type: 'multiple-choice', options: ['', ''], correctAnswers: [] };
      case 'yes-no-grid':
        return { ...base, type: 'yes-no-grid', statements: [{ id: '1', text: '', correctAnswer: null }] };
      case 'drag-match':
        return { ...base, type: 'drag-match', matchPairs: [{ id: '1', term: '', definition: '' }] };
      case 'drag-classify':
        return {
          ...base,
          type: 'drag-classify',
          categories: [{ id: '1', name: '' }],
          classifyItems: [{ id: '1', text: '', correctCategoryId: null }]
        };
      case 'inline-dropdown':
        return { ...base, type: 'inline-dropdown', sentenceTemplate: '', inlineDropdowns: [] };
      case 'matching-dropdown':
        return {
          ...base,
          type: 'matching-dropdown',
          dropdownRows: [{ id: '1', label: '', options: [''], correctAnswer: null }]
        };
      default:
        return { ...base, type: 'objective', options: ['', ''], correctAnswer: null };
    }
  };

  const addQuestion = (type: QuestionType) => {
    setQuestions([...questions, createNewQuestion(type)]);
  };

  const removeQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestion = <T extends QuestionForm>(questionId: string, updates: Partial<T>) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    ));
  };

  const handlePublish = () => {
    if (!quizTitle.trim()) {
      toast.error('Please enter a quiz title');
      return;
    }
    
    if (!quizCategory) {
      toast.error('Please select a category');
      return;
    }
    
    if (quizCategory === 'custom' && !customCategory.trim()) {
      toast.error('Please enter a custom category name');
      return;
    }
    
    if (!quizDuration || parseInt(quizDuration) < 1) {
      toast.error('Please enter a valid duration');
      return;
    }

    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }
    
    // Validate each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        toast.error(`Question ${i + 1}: Please enter the question text`);
        return;
      }
      
      // Type-specific validation
      if (q.type === 'objective') {
        if (q.options.some(opt => !opt.trim())) {
          toast.error(`Question ${i + 1}: All options must have text`);
          return;
        }
        if (q.correctAnswer === null) {
          toast.error(`Question ${i + 1}: Please select the correct answer`);
          return;
        }
      } else if (q.type === 'multiple-choice') {
        if (q.options.some(opt => !opt.trim())) {
          toast.error(`Question ${i + 1}: All options must have text`);
          return;
        }
        if (q.correctAnswers.length === 0) {
          toast.error(`Question ${i + 1}: Please select at least one correct answer`);
          return;
        }
      } else if (q.type === 'yes-no-grid') {
        if (q.statements.some(s => !s.text.trim())) {
          toast.error(`Question ${i + 1}: All statements must have text`);
          return;
        }
        if (q.statements.some(s => s.correctAnswer === null)) {
          toast.error(`Question ${i + 1}: Please mark Yes or No for all statements`);
          return;
        }
      } else if (q.type === 'drag-match') {
        if (q.matchPairs.some(p => !p.term.trim() || !p.definition.trim())) {
          toast.error(`Question ${i + 1}: All pairs must have both term and definition`);
          return;
        }
      } else if (q.type === 'drag-classify') {
        if (q.categories.some(c => !c.name.trim())) {
          toast.error(`Question ${i + 1}: All categories must have a name`);
          return;
        }
        if (q.classifyItems.some(item => !item.text.trim())) {
          toast.error(`Question ${i + 1}: All items must have text`);
          return;
        }
        if (q.classifyItems.some(item => item.correctCategoryId === null)) {
          toast.error(`Question ${i + 1}: Please assign all items to a category`);
          return;
        }
      } else if (q.type === 'inline-dropdown') {
        if (!q.sentenceTemplate.trim()) {
          toast.error(`Question ${i + 1}: Please enter the sentence template`);
          return;
        }
        const selectCount = (q.sentenceTemplate.match(/\[select\]/g) || []).length;
        if (selectCount !== q.inlineDropdowns.length) {
          toast.error(`Question ${i + 1}: Number of [select] placeholders doesn't match dropdown configurations`);
          return;
        }
        if (q.inlineDropdowns.some(d => d.options.some(opt => !opt.trim()))) {
          toast.error(`Question ${i + 1}: All dropdown options must have text`);
          return;
        }
        if (q.inlineDropdowns.some(d => d.correctAnswer === null)) {
          toast.error(`Question ${i + 1}: Please select correct answer for all dropdowns`);
          return;
        }
      } else if (q.type === 'matching-dropdown') {
        if (q.dropdownRows.some(r => !r.label.trim())) {
          toast.error(`Question ${i + 1}: All rows must have a label`);
          return;
        }
        if (q.dropdownRows.some(r => r.options.some(opt => !opt.trim()))) {
          toast.error(`Question ${i + 1}: All dropdown options must have text`);
          return;
        }
        if (q.dropdownRows.some(r => r.correctAnswer === null)) {
          toast.error(`Question ${i + 1}: Please select correct answer for all dropdowns`);
          return;
        }
      }
      
      if (!q.explanation.trim()) {
        toast.error(`Question ${i + 1}: Please provide an explanation`);
        return;
      }
    }
    
    const quizData = {
      title: quizTitle,
      category: quizCategory === 'custom' ? customCategory : quizCategory,
      duration: parseInt(quizDuration),
      description: quizDescription,
      questions: questions
    };

    if (isEditMode && editQuizId) {
      updateQuiz(editQuizId, quizData);
      toast.success('Quiz updated successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } else {
      addQuiz(quizData);
      toast.success('Quiz published successfully!');
      setTimeout(() => {
        navigate('/quizzes');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 -ml-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">{isEditMode ? 'Edit Quiz' : 'Create New Quiz'}</h1>
          <p className="text-slate-600">
            {isEditMode ? 'Update your quiz with various question types' : 'Build a comprehensive quiz with various question types'}
          </p>
        </div>
        
        {/* Quiz Details */}
        <Card className="p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Quiz Details</h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Azure AZ-900 Practice Test 3"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={quizCategory} 
                onValueChange={(value) => {
                  setQuizCategory(value);
                  setShowCustomCategory(value === 'custom');
                }}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">
                    ➕ Add Custom Category
                  </SelectItem>
                </SelectContent>
              </Select>
              {showCustomCategory && (
                <Input
                  id="customCategory"
                  placeholder="Enter custom category name"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="mt-2"
                />
              )}
            </div>
            
            <div>
              <Label htmlFor="duration">Total Time (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="60"
                value={quizDuration}
                onChange={(e) => setQuizDuration(e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Brief description of what this quiz covers..."
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </div>
        </Card>
        
        {/* Questions */}
        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
          </div>
          
          {questions.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-slate-600 mb-6">No questions added yet. Select a question type to get started.</p>
              <AddQuestionDropdown onAddQuestion={addQuestion} />
            </Card>
          )}
          
          {questions.map((question, qIndex) => (
            <Card key={question.id} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <button className="mt-1 cursor-move text-slate-400 hover:text-slate-600">
                  <GripVertical className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#1e40af] text-white">
                        Question {qIndex + 1}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getQuestionTypeLabel(question.type)}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-slate-600">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeQuestion(question.id)}
                        className="text-[#dc2626] hover:text-[#b91c1c] hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <QuestionEditor question={question} updateQuestion={updateQuestion} />
                </div>
              </div>
              
              {/* Add Question Button at bottom */}
              <div className="mt-6 pt-4 border-t border-border ml-9">
                <AddQuestionDropdown onAddQuestion={addQuestion} />
              </div>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Fixed Publish Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border py-6 shadow-lg z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => navigate(-1)} size="lg">
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              size="lg"
              className="bg-[#10b981] hover:bg-[#059669] text-white px-12 font-semibold text-lg"
            >
              <Check className="w-5 h-5 mr-2" />
              Publish Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddQuestionDropdown({ onAddQuestion }: { onAddQuestion: (type: QuestionType) => void }) {
  return (
    <Select onValueChange={(value) => onAddQuestion(value as QuestionType)}>
      <SelectTrigger className="w-full max-w-md text-[#1e40af] border-[#1e40af] hover:bg-blue-50">
        <Plus className="w-4 h-4 mr-2" />
        <SelectValue placeholder="Add Question" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="objective">Objective (Single Answer)</SelectItem>
        <SelectItem value="multiple-choice">Multiple Choice (Select All That Apply)</SelectItem>
        <SelectItem value="yes-no-grid">Yes/No Statement Grid</SelectItem>
        <SelectItem value="drag-match">Drag & Drop: Matching</SelectItem>
        <SelectItem value="drag-classify">Drag & Drop: Classification</SelectItem>
        <SelectItem value="inline-dropdown">Inline Dropdown</SelectItem>
        <SelectItem value="matching-dropdown">Matching Dropdown</SelectItem>
      </SelectContent>
    </Select>
  );
}

function getQuestionTypeLabel(type: QuestionType): string {
  const labels: Record<QuestionType, string> = {
    'objective': 'Single Answer',
    'multiple-choice': 'Multiple Answers',
    'yes-no-grid': 'Yes/No Grid',
    'drag-match': 'Drag & Match',
    'drag-classify': 'Drag & Classify',
    'inline-dropdown': 'Inline Dropdown',
    'matching-dropdown': 'Matching Dropdown'
  };
  return labels[type];
}

function QuestionEditor({ question, updateQuestion }: {
  question: QuestionForm;
  updateQuestion: <T extends QuestionForm>(questionId: string, updates: Partial<T>) => void;
}) {
  const commonFields = (
    <>
      <div className="mb-4">
        <Label>Question Text *</Label>
        <Textarea
          placeholder="Enter your question here..."
          value={question.text}
          onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
          className="mt-2"
          rows={2}
        />
      </div>
    </>
  );

  const explanationField = (
    <div className="mt-4">
      <Label>Explanation *</Label>
      <Textarea
        placeholder="Explain the correct answer..."
        value={question.explanation}
        onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
        className="mt-2"
        rows={3}
      />
    </div>
  );

  switch (question.type) {
    case 'objective':
      return <ObjectiveEditor question={question} updateQuestion={updateQuestion} commonFields={commonFields} explanationField={explanationField} />;
    case 'multiple-choice':
      return <MultipleChoiceEditor question={question} updateQuestion={updateQuestion} commonFields={commonFields} explanationField={explanationField} />;
    case 'yes-no-grid':
      return <YesNoGridEditor question={question} updateQuestion={updateQuestion} commonFields={commonFields} explanationField={explanationField} />;
    case 'drag-match':
      return <DragMatchEditor question={question} updateQuestion={updateQuestion} commonFields={commonFields} explanationField={explanationField} />;
    case 'drag-classify':
      return <DragClassifyEditor question={question} updateQuestion={updateQuestion} commonFields={commonFields} explanationField={explanationField} />;
    case 'inline-dropdown':
      return <InlineDropdownEditor question={question} updateQuestion={updateQuestion} commonFields={commonFields} explanationField={explanationField} />;
    case 'matching-dropdown':
      return <MatchingDropdownEditor question={question} updateQuestion={updateQuestion} commonFields={commonFields} explanationField={explanationField} />;
    default:
      return null;
  }
}

// Individual Editor Components
function ObjectiveEditor({ question, updateQuestion, commonFields, explanationField }: any) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateQuestion(question.id, { questionImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    updateQuestion(question.id, { questionImage: undefined });
  };

  const addOption = () => {
    updateQuestion(question.id, { options: [...question.options, ''] });
  };

  const removeOption = (index: number) => {
    if (question.options.length > 2) {
      const newOptions = question.options.filter((_: string, i: number) => i !== index);
      const newCorrectAnswer = question.correctAnswer === index ? null :
        (question.correctAnswer !== null && question.correctAnswer > index ? question.correctAnswer - 1 : question.correctAnswer);
      updateQuestion(question.id, { options: newOptions, correctAnswer: newCorrectAnswer });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    updateQuestion(question.id, { options: newOptions });
  };

  return (
    <div>
      {commonFields}
      
      {/* Image Upload Section */}
      <div className="mb-4">
        <Label>Question Image (Optional)</Label>
        {question.questionImage ? (
          <div className="mt-2">
            <div className="relative inline-block">
              <img 
                src={question.questionImage} 
                alt="Question" 
                className="max-w-full h-auto rounded-lg border border-border"
                style={{ maxHeight: '200px' }}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            <p className="text-xs text-slate-600 mt-1">
              Upload an image to accompany your question
            </p>
          </div>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label>Answer Options *</Label>
          <Button variant="outline" size="sm" onClick={addOption}>
            <Plus className="w-3 h-3 mr-1" />
            Add Option
          </Button>
        </div>
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <div key={index} className="flex gap-2">
              <button
                onClick={() => updateQuestion(question.id, { correctAnswer: index })}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  question.correctAnswer === index
                    ? 'border-[#10b981] bg-green-50'
                    : 'border-border hover:border-[#10b981]/50'
                }`}
                title="Mark as correct answer"
              >
                {question.correctAnswer === index && (
                  <div className="w-5 h-5 rounded-full bg-[#10b981]" />
                )}
              </button>
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              {question.options.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-slate-400" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-2">
          Click the circle to mark the correct answer
        </p>
      </div>
      {explanationField}
    </div>
  );
}

function MultipleChoiceEditor({ question, updateQuestion, commonFields, explanationField }: any) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateQuestion(question.id, { questionImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    updateQuestion(question.id, { questionImage: undefined });
  };

  const addOption = () => {
    updateQuestion(question.id, { options: [...question.options, ''] });
  };

  const removeOption = (index: number) => {
    if (question.options.length > 2) {
      const newOptions = question.options.filter((_: string, i: number) => i !== index);
      const newCorrectAnswers = question.correctAnswers
        .filter((ans: number) => ans !== index)
        .map((ans: number) => ans > index ? ans - 1 : ans);
      updateQuestion(question.id, { options: newOptions, correctAnswers: newCorrectAnswers });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...question.options];
    newOptions[index] = value;
    updateQuestion(question.id, { options: newOptions });
  };

  const toggleCorrectAnswer = (index: number) => {
    const newCorrectAnswers = question.correctAnswers.includes(index)
      ? question.correctAnswers.filter((ans: number) => ans !== index)
      : [...question.correctAnswers, index];
    updateQuestion(question.id, { correctAnswers: newCorrectAnswers });
  };

  return (
    <div>
      {commonFields}
      
      {/* Image Upload Section */}
      <div className="mb-4">
        <Label>Question Image (Optional)</Label>
        {question.questionImage ? (
          <div className="mt-2">
            <div className="relative inline-block">
              <img 
                src={question.questionImage} 
                alt="Question" 
                className="max-w-full h-auto rounded-lg border border-border"
                style={{ maxHeight: '200px' }}
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute top-2 right-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
            <p className="text-xs text-slate-600 mt-1">
              Upload an image to accompany your question
            </p>
          </div>
        )}
      </div>
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label>Answer Options * (Select all that apply)</Label>
          <Button variant="outline" size="sm" onClick={addOption}>
            <Plus className="w-3 h-3 mr-1" />
            Add Option
          </Button>
        </div>
        <div className="space-y-3">
          {question.options.map((option: string, index: number) => (
            <div key={index} className="flex gap-2">
              <button
                onClick={() => toggleCorrectAnswer(index)}
                className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                  question.correctAnswers.includes(index)
                    ? 'border-[#10b981] bg-green-50'
                    : 'border-border hover:border-[#10b981]/50'
                }`}
                title="Mark as correct answer"
              >
                {question.correctAnswers.includes(index) && (
                  <Check className="w-5 h-5 text-[#10b981]" />
                )}
              </button>
              <Input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              {question.options.length > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-slate-400" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-600 mt-2">
          Click the checkboxes to mark all correct answers
        </p>
      </div>
      {explanationField}
    </div>
  );
}

function YesNoGridEditor({ question, updateQuestion, commonFields, explanationField }: any) {
  const addStatement = () => {
    const newStatements = [...question.statements, { id: Date.now().toString(), text: '', correctAnswer: null }];
    updateQuestion(question.id, { statements: newStatements });
  };

  const removeStatement = (id: string) => {
    if (question.statements.length > 1) {
      updateQuestion(question.id, { statements: question.statements.filter((s: any) => s.id !== id) });
    }
  };

  const updateStatement = (id: string, field: string, value: any) => {
    const newStatements = question.statements.map((s: any) =>
      s.id === id ? { ...s, [field]: value } : s
    );
    updateQuestion(question.id, { statements: newStatements });
  };

  return (
    <div>
      {commonFields}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label>Statements *</Label>
          <Button variant="outline" size="sm" onClick={addStatement}>
            <Plus className="w-3 h-3 mr-1" />
            Add Statement
          </Button>
        </div>
        <div className="space-y-3">
          {question.statements.map((statement: any) => (
            <div key={statement.id} className="p-4 border-2 border-border rounded-lg">
              <div className="flex gap-2 mb-3">
                <Textarea
                  placeholder="Statement text"
                  value={statement.text}
                  onChange={(e) => updateStatement(statement.id, 'text', e.target.value)}
                  rows={2}
                  className="flex-1"
                />
                {question.statements.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStatement(statement.id)}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400" />
                  </Button>
                )}
              </div>
              <div className="flex gap-4 items-center">
                <Label className="text-sm">Correct Answer:</Label>
                <RadioGroup
                  value={statement.correctAnswer || ''}
                  onValueChange={(value) => updateStatement(statement.id, 'correctAnswer', value)}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id={`${statement.id}-yes`} />
                    <Label htmlFor={`${statement.id}-yes`} className="font-normal cursor-pointer">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id={`${statement.id}-no`} />
                    <Label htmlFor={`${statement.id}-no`} className="font-normal cursor-pointer">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          ))}
        </div>
      </div>
      {explanationField}
    </div>
  );
}

function DragMatchEditor({ question, updateQuestion, commonFields, explanationField }: any) {
  const addPair = () => {
    const newPairs = [...question.matchPairs, { id: Date.now().toString(), term: '', definition: '' }];
    updateQuestion(question.id, { matchPairs: newPairs });
  };

  const removePair = (id: string) => {
    if (question.matchPairs.length > 1) {
      updateQuestion(question.id, { matchPairs: question.matchPairs.filter((p: any) => p.id !== id) });
    }
  };

  const updatePair = (id: string, field: string, value: string) => {
    const newPairs = question.matchPairs.map((p: any) =>
      p.id === id ? { ...p, [field]: value } : p
    );
    updateQuestion(question.id, { matchPairs: newPairs });
  };

  return (
    <div>
      {commonFields}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label>Match Pairs *</Label>
          <Button variant="outline" size="sm" onClick={addPair}>
            <Plus className="w-3 h-3 mr-1" />
            Add Pair
          </Button>
        </div>
        <div className="space-y-3">
          {question.matchPairs.map((pair: any) => (
            <div key={pair.id} className="p-4 border-2 border-border rounded-lg">
              <div className="flex gap-2 mb-2">
                <div className="flex-1">
                  <Label className="text-xs text-slate-600">Term (Draggable)</Label>
                  <Input
                    placeholder="e.g., Low Latency"
                    value={pair.term}
                    onChange={(e) => updatePair(pair.id, 'term', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-slate-600">Definition (Target)</Label>
                  <Input
                    placeholder="e.g., A cloud service that performs quickly..."
                    value={pair.definition}
                    onChange={(e) => updatePair(pair.id, 'definition', e.target.value)}
                    className="mt-1"
                  />
                </div>
                {question.matchPairs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePair(pair.id)}
                    className="flex-shrink-0 mt-5"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {explanationField}
    </div>
  );
}

function DragClassifyEditor({ question, updateQuestion, commonFields, explanationField }: any) {
  const addCategory = () => {
    const newCategories = [...question.categories, { id: Date.now().toString(), name: '' }];
    updateQuestion(question.id, { categories: newCategories });
  };

  const removeCategory = (id: string) => {
    if (question.categories.length > 1) {
      const newCategories = question.categories.filter((c: any) => c.id !== id);
      const newItems = question.classifyItems.map((item: any) => 
        item.correctCategoryId === id ? { ...item, correctCategoryId: null } : item
      );
      updateQuestion(question.id, { categories: newCategories, classifyItems: newItems });
    }
  };

  const updateCategory = (id: string, value: string) => {
    const newCategories = question.categories.map((c: any) =>
      c.id === id ? { ...c, name: value } : c
    );
    updateQuestion(question.id, { categories: newCategories });
  };

  const addItem = () => {
    const newItems = [...question.classifyItems, { id: Date.now().toString(), text: '', correctCategoryId: null }];
    updateQuestion(question.id, { classifyItems: newItems });
  };

  const removeItem = (id: string) => {
    if (question.classifyItems.length > 1) {
      updateQuestion(question.id, { classifyItems: question.classifyItems.filter((i: any) => i.id !== id) });
    }
  };

  const updateItem = (id: string, field: string, value: any) => {
    const newItems = question.classifyItems.map((i: any) =>
      i.id === id ? { ...i, [field]: value } : i
    );
    updateQuestion(question.id, { classifyItems: newItems });
  };

  return (
    <div>
      {commonFields}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <Label>Target Categories *</Label>
          <Button variant="outline" size="sm" onClick={addCategory}>
            <Plus className="w-3 h-3 mr-1" />
            Add Category
          </Button>
        </div>
        <div className="space-y-2">
          {question.categories.map((category: any) => (
            <div key={category.id} className="flex gap-2">
              <Input
                placeholder="Category name (e.g., US Entity)"
                value={category.name}
                onChange={(e) => updateCategory(category.id, e.target.value)}
              />
              {question.categories.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCategory(category.id)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-slate-400" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label>Items to Classify *</Label>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-3 h-3 mr-1" />
            Add Item
          </Button>
        </div>
        <div className="space-y-3">
          {question.classifyItems.map((item: any) => (
            <div key={item.id} className="flex gap-2">
              <Input
                placeholder="Item text"
                value={item.text}
                onChange={(e) => updateItem(item.id, 'text', e.target.value)}
                className="flex-1"
              />
              <Select
                value={item.correctCategoryId || ''}
                onValueChange={(value) => updateItem(item.id, 'correctCategoryId', value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {question.categories.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name || 'Unnamed Category'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {question.classifyItems.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(item.id)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-slate-400" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
      {explanationField}
    </div>
  );
}

function InlineDropdownEditor({ question, updateQuestion, commonFields, explanationField }: any) {
  const handleTemplateChange = (value: string) => {
    const selectCount = (value.match(/\[select\]/g) || []).length;
    const currentCount = question.inlineDropdowns.length;
    
    let newDropdowns = [...question.inlineDropdowns];
    
    if (selectCount > currentCount) {
      // Add new dropdowns
      for (let i = 0; i < selectCount - currentCount; i++) {
        newDropdowns.push({
          id: Date.now().toString() + i,
          options: [''],
          correctAnswer: null
        });
      }
    } else if (selectCount < currentCount) {
      // Remove excess dropdowns
      newDropdowns = newDropdowns.slice(0, selectCount);
    }
    
    updateQuestion(question.id, {
      sentenceTemplate: value,
      inlineDropdowns: newDropdowns
    });
  };

  const updateDropdown = (index: number, field: string, value: any) => {
    const newDropdowns = [...question.inlineDropdowns];
    newDropdowns[index] = { ...newDropdowns[index], [field]: value };
    updateQuestion(question.id, { inlineDropdowns: newDropdowns });
  };

  const addOption = (dropdownIndex: number) => {
    const newDropdowns = [...question.inlineDropdowns];
    newDropdowns[dropdownIndex].options.push('');
    updateQuestion(question.id, { inlineDropdowns: newDropdowns });
  };

  const removeOption = (dropdownIndex: number, optionIndex: number) => {
    const newDropdowns = [...question.inlineDropdowns];
    if (newDropdowns[dropdownIndex].options.length > 1) {
      newDropdowns[dropdownIndex].options = newDropdowns[dropdownIndex].options.filter((_: string, i: number) => i !== optionIndex);
      if (newDropdowns[dropdownIndex].correctAnswer === optionIndex) {
        newDropdowns[dropdownIndex].correctAnswer = null;
      } else if (newDropdowns[dropdownIndex].correctAnswer !== null && newDropdowns[dropdownIndex].correctAnswer! > optionIndex) {
        newDropdowns[dropdownIndex].correctAnswer = newDropdowns[dropdownIndex].correctAnswer! - 1;
      }
      updateQuestion(question.id, { inlineDropdowns: newDropdowns });
    }
  };

  const updateOption = (dropdownIndex: number, optionIndex: number, value: string) => {
    const newDropdowns = [...question.inlineDropdowns];
    newDropdowns[dropdownIndex].options[optionIndex] = value;
    updateQuestion(question.id, { inlineDropdowns: newDropdowns });
  };

  return (
    <div>
      {commonFields}
      <div>
        <Label>Sentence Template * <span className="text-xs text-slate-600">(Use [select] for dropdown placeholders)</span></Label>
        <Textarea
          placeholder="e.g., When you are implementing a Software as a Service (SaaS) solution, you are responsible for [select]."
          value={question.sentenceTemplate}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="mt-2"
          rows={3}
        />
      </div>
      
      {question.inlineDropdowns.length > 0 && (
        <div className="mt-4 space-y-4">
          <Label>Configure Dropdowns</Label>
          {question.inlineDropdowns.map((dropdown: any, dIndex: number) => (
            <Card key={dropdown.id} className="p-4">
              <div className="flex justify-between items-center mb-3">
                <Label className="text-sm">Dropdown {dIndex + 1}</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(dIndex)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Option
                </Button>
              </div>
              <div className="space-y-2">
                {dropdown.options.map((option: string, oIndex: number) => (
                  <div key={oIndex} className="flex gap-2">
                    <button
                      onClick={() => updateDropdown(dIndex, 'correctAnswer', oIndex)}
                      className={`w-8 h-8 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        dropdown.correctAnswer === oIndex
                          ? 'border-[#10b981] bg-green-50'
                          : 'border-border hover:border-[#10b981]/50'
                      }`}
                    >
                      {dropdown.correctAnswer === oIndex && (
                        <Check className="w-4 h-4 text-[#10b981]" />
                      )}
                    </button>
                    <Input
                      placeholder={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => updateOption(dIndex, oIndex, e.target.value)}
                    />
                    {dropdown.options.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOption(dIndex, oIndex)}
                        className="flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
      {explanationField}
    </div>
  );
}

function MatchingDropdownEditor({ question, updateQuestion, commonFields, explanationField }: any) {
  const addRow = () => {
    const newRows = [...question.dropdownRows, { id: Date.now().toString(), label: '', options: [''], correctAnswer: null }];
    updateQuestion(question.id, { dropdownRows: newRows });
  };

  const removeRow = (id: string) => {
    if (question.dropdownRows.length > 1) {
      updateQuestion(question.id, { dropdownRows: question.dropdownRows.filter((r: any) => r.id !== id) });
    }
  };

  const updateRow = (id: string, field: string, value: any) => {
    const newRows = question.dropdownRows.map((r: any) =>
      r.id === id ? { ...r, [field]: value } : r
    );
    updateQuestion(question.id, { dropdownRows: newRows });
  };

  const addOption = (rowId: string) => {
    const newRows = question.dropdownRows.map((r: any) =>
      r.id === rowId ? { ...r, options: [...r.options, ''] } : r
    );
    updateQuestion(question.id, { dropdownRows: newRows });
  };

  const removeOption = (rowId: string, optionIndex: number) => {
    const newRows = question.dropdownRows.map((r: any) => {
      if (r.id === rowId && r.options.length > 1) {
        const newOptions = r.options.filter((_: string, i: number) => i !== optionIndex);
        const newCorrectAnswer = r.correctAnswer === optionIndex ? null :
          (r.correctAnswer !== null && r.correctAnswer > optionIndex ? r.correctAnswer - 1 : r.correctAnswer);
        return { ...r, options: newOptions, correctAnswer: newCorrectAnswer };
      }
      return r;
    });
    updateQuestion(question.id, { dropdownRows: newRows });
  };

  const updateOption = (rowId: string, optionIndex: number, value: string) => {
    const newRows = question.dropdownRows.map((r: any) => {
      if (r.id === rowId) {
        const newOptions = [...r.options];
        newOptions[optionIndex] = value;
        return { ...r, options: newOptions };
      }
      return r;
    });
    updateQuestion(question.id, { dropdownRows: newRows });
  };

  return (
    <div>
      {commonFields}
      <div>
        <div className="flex justify-between items-center mb-3">
          <Label>Dropdown Rows *</Label>
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="w-3 h-3 mr-1" />
            Add Row
          </Button>
        </div>
        <div className="space-y-4">
          {question.dropdownRows.map((row: any) => (
            <Card key={row.id} className="p-4">
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <Label className="text-xs text-slate-600 mb-1">Label</Label>
                  <Input
                    placeholder="e.g., Azure Virtual Machines"
                    value={row.label}
                    onChange={(e) => updateRow(row.id, 'label', e.target.value)}
                  />
                </div>
                {question.dropdownRows.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeRow(row.id)}
                    className="flex-shrink-0 mt-5"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400" />
                  </Button>
                )}
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-xs text-slate-600">Options</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(row.id)}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {row.options.map((option: string, oIndex: number) => (
                    <div key={oIndex} className="flex gap-2">
                      <button
                        onClick={() => updateRow(row.id, 'correctAnswer', oIndex)}
                        className={`w-8 h-8 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          row.correctAnswer === oIndex
                            ? 'border-[#10b981] bg-green-50'
                            : 'border-border hover:border-[#10b981]/50'
                        }`}
                      >
                        {row.correctAnswer === oIndex && (
                          <Check className="w-4 h-4 text-[#10b981]" />
                        )}
                      </button>
                      <Input
                        placeholder={`Option ${oIndex + 1}`}
                        value={option}
                        onChange={(e) => updateOption(row.id, oIndex, e.target.value)}
                      />
                      {row.options.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(row.id, oIndex)}
                          className="flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4 text-slate-400" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      {explanationField}
    </div>
  );
}