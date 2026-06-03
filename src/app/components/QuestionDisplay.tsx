import { useState } from 'react';
import { Question } from '../data/mockData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CheckCircle, XCircle } from 'lucide-react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface QuestionDisplayProps {
  question: Question;
  userAnswer: any;
  onAnswer: (answer: any) => void;
  isPracticeMode: boolean;
  hasAnswered: boolean;
}

// export function QuestionDisplay(props: QuestionDisplayProps) {
//   return (
//     <DndProvider backend={HTML5Backend}>
//       <QuestionDisplayInner {...props} />
//     </DndProvider>
//   );
// }

// Change this wrapper to simply forward props to the internal content switcher
export function QuestionDisplay(props: QuestionDisplayProps) {
  return <QuestionDisplayInner {...props} />;
}

function QuestionDisplayInner({
  question,
  userAnswer,
  onAnswer,
  isPracticeMode,
  hasAnswered
}: QuestionDisplayProps) {
  switch (question.type) {
    case 'objective':
      return <ObjectiveDisplay question={question} userAnswer={userAnswer} onAnswer={onAnswer} isPracticeMode={isPracticeMode} hasAnswered={hasAnswered} />;
    case 'multiple-choice':
      return <MultipleChoiceDisplay question={question} userAnswer={userAnswer} onAnswer={onAnswer} isPracticeMode={isPracticeMode} hasAnswered={hasAnswered} />;
    case 'yes-no-grid':
      return <YesNoGridDisplay question={question} userAnswer={userAnswer} onAnswer={onAnswer} isPracticeMode={isPracticeMode} hasAnswered={hasAnswered} />;
    case 'drag-match':
      return <DragMatchDisplay question={question} userAnswer={userAnswer} onAnswer={onAnswer} isPracticeMode={isPracticeMode} hasAnswered={hasAnswered} />;
    case 'drag-classify':
      return <DragClassifyDisplay question={question} userAnswer={userAnswer} onAnswer={onAnswer} isPracticeMode={isPracticeMode} hasAnswered={hasAnswered} />;
    case 'inline-dropdown':
      return <InlineDropdownDisplay question={question} userAnswer={userAnswer} onAnswer={onAnswer} isPracticeMode={isPracticeMode} hasAnswered={hasAnswered} />;
    case 'matching-dropdown':
      return <MatchingDropdownDisplay question={question} userAnswer={userAnswer} onAnswer={onAnswer} isPracticeMode={isPracticeMode} hasAnswered={hasAnswered} />;
    default:
      return null;
  }
}

// Objective (Single Answer)
function ObjectiveDisplay({ question, userAnswer, onAnswer, isPracticeMode, hasAnswered }: QuestionDisplayProps) {
  const getOptionClassName = (optionIndex: number) => {
    if (!isPracticeMode || !hasAnswered) {
      return `p-4 border-2 rounded-xl cursor-pointer transition-all ${
        userAnswer === optionIndex
          ? 'border-[#1e40af] bg-blue-50'
          : 'border-border hover:border-[#1e40af]/50'
      }`;
    }
    const isCorrect = optionIndex === question.correctAnswer;
    const wasSelected = userAnswer === optionIndex;
    if (isCorrect) return 'p-4 border-2 border-[#10b981] bg-green-50 rounded-xl cursor-pointer';
    if (wasSelected && !isCorrect) return 'p-4 border-2 border-[#dc2626] bg-red-50 rounded-xl cursor-pointer';

    return 'p-4 border-2 border-border rounded-xl opacity-50 cursor-pointer';
  };

  return (
    <div className="space-y-3">
      {question.options?.map((option, index) => (
        <div key={index} onClick={() => onAnswer(index)} className={getOptionClassName(index)}>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0">
              {userAnswer === index && <div className="w-3 h-3 rounded-full bg-current" />}
            </div>
            <span>{option}</span>
            {isPracticeMode && hasAnswered && index === question.correctAnswer && (
              <CheckCircle className="w-4 h-4 text-[#10b981] ml-auto" />
            )}
            {isPracticeMode && hasAnswered && userAnswer === index && index !== question.correctAnswer && (
              <XCircle className="w-4 h-4 text-[#dc2626] ml-auto" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Multiple Choice (Select All That Apply)
function MultipleChoiceDisplay({ question, userAnswer, onAnswer, isPracticeMode, hasAnswered }: QuestionDisplayProps) {
  const selectedAnswers: number[] = userAnswer || [];

  const toggleAnswer = (optionIndex: number) => {
    const newAnswers = selectedAnswers.includes(optionIndex)
      ? selectedAnswers.filter((ans: number) => ans !== optionIndex)
      : [...selectedAnswers, optionIndex];
    onAnswer(newAnswers);
  };

  const getOptionClassName = (optionIndex: number) => {
    const isSelected = selectedAnswers.includes(optionIndex);
    if (!isPracticeMode || !hasAnswered) {
      return `p-4 border-2 rounded-xl cursor-pointer transition-all ${
        isSelected ? 'border-[#1e40af] bg-blue-50' : 'border-border hover:border-[#1e40af]/50'
      }`;
    }
    const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
    const isCorrect = correctAnswers.includes(optionIndex);
    if (isCorrect && isSelected) return 'p-4 border-2 border-[#10b981] bg-green-50 rounded-xl cursor-pointer';
    if (isCorrect && !isSelected) return 'p-4 border-2 border-[#10b981] bg-green-50 rounded-xl opacity-70 cursor-pointer';
    if (isSelected && !isCorrect) return 'p-4 border-2 border-[#dc2626] bg-red-50 rounded-xl cursor-pointer';
    return 'p-4 border-2 border-border rounded-xl opacity-50 cursor-pointer';
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600 mb-3">Select all that apply</p>
      {question.options?.map((option, index) => (
        <div key={index} onClick={() => toggleAnswer(index)} className={getOptionClassName(index)}>
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
              selectedAnswers.includes(index) ? 'border-current bg-current' : 'border-current'
            }`}>
              {selectedAnswers.includes(index) && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span>{option}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Yes/No Grid
function YesNoGridDisplay({ question, userAnswer, onAnswer, isPracticeMode, hasAnswered }: QuestionDisplayProps) {
  const answers = userAnswer || {};

  const handleAnswer = (statementId: string, answer: 'yes' | 'no') => {
    onAnswer({ ...answers, [statementId]: answer });
  };

  const getButtonClassName = (statementId: string, option: 'yes' | 'no') => {
    const isSelected = answers[statementId] === option;
    const statement = question.statements?.find(s => s.id === statementId);
    const isCorrect = statement?.correctAnswer === option;

    if (!isPracticeMode || !hasAnswered) {
      return `w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
        isSelected ? 'border-[#1e40af] bg-[#1e40af] text-white' : 'border-border hover:border-[#1e40af]/50'
      }`;
    }
    if (isCorrect) return `w-12 h-12 rounded-full border-2 border-[#10b981] cursor-pointer flex items-center justify-center ${isSelected ? 'bg-[#10b981] text-white' : 'bg-green-50'}`;
    if (isSelected && !isCorrect) return 'w-12 h-12 rounded-full border-2 border-[#dc2626] bg-[#dc2626] text-white cursor-pointer flex items-center justify-center';
    return 'w-12 h-12 rounded-full border-2 border-border bg-slate-50 opacity-50 cursor-pointer flex items-center justify-center';
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-[1fr_100px_100px] gap-4 mb-4">
          <div className="font-semibold">Statements</div>
          <div className="font-semibold text-center">Yes</div>
          <div className="font-semibold text-center">No</div>
        </div>
        {question.statements?.map((statement) => (
          <div key={statement.id} className="grid grid-cols-[1fr_100px_100px] gap-4 items-center py-3 border-b border-border">
            <div className="text-sm">{statement.term}</div>
            <div className="flex justify-center">
              <button onClick={() => handleAnswer(statement.id, 'yes')} className={getButtonClassName(statement.id, 'yes')}>
                {answers[statement.id] === 'yes' && <div className="w-3 h-3 rounded-full bg-current" />}
              </button>
            </div>
            <div className="flex justify-center">
              <button onClick={() => handleAnswer(statement.id, 'no')} className={getButtonClassName(statement.id, 'no')}>
                {answers[statement.id] === 'no' && <div className="w-3 h-3 rounded-full bg-current" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Drag & Drop Matching ────────────────────────────────────────────────────

// Drag item type for match
const MATCH_TERM = 'MATCH_TERM';

interface MatchDragItem {
  termId: string;
  term: string;
  fromDefinitionId?: string; // undefined = coming from the pool
}

function MatchDraggableTerm({ termId, term, fromDefinitionId }: { termId: string; term: string; fromDefinitionId?: string }) {
  const [{ isDragging }, drag] = useDrag<MatchDragItem, void, { isDragging: boolean }>({
    type: MATCH_TERM,
    item: { termId, term, fromDefinitionId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={drag}
      className={`p-3 bg-white border-2 border-[#1e40af] rounded-lg cursor-move transition-all select-none ${
        isDragging ? 'opacity-40 scale-95' : 'hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <p className="text-sm font-medium text-[#1e40af]">{term}</p>
    </div>
  );
}

function MatchPoolZone({
  availableTerms,
  onReturnTerm
}: {
  availableTerms: Array<{ id: string; term: string }>;
  onReturnTerm: (termId: string, fromDefinitionId: string) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop<MatchDragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: MATCH_TERM,
    canDrop: (item) => !!item.fromDefinitionId, // only accept items being returned from answer zones
    drop: (item) => {
      if (item.fromDefinitionId) {
        onReturnTerm(item.termId, item.fromDefinitionId);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-[80px] p-3 rounded-xl border-2 border-dashed transition-all space-y-3 ${
        isOver && canDrop ? 'border-[#1e40af] bg-blue-50' : 'border-slate-200'
      }`}
    >
      {availableTerms.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-4">All options placed</p>
      )}
      {availableTerms.map(({ id, term }) => (
        <MatchDraggableTerm key={id} termId={id} term={term} fromDefinitionId={undefined} />
      ))}
    </div>
  );
}

function MatchDropZone({
  definitionId,
  matchedTermId,
  matchedTerm,
  onDrop,
  isCorrect
}: {
  definitionId: string;
  matchedTermId?: string;
  matchedTerm?: string;
  onDrop: (definitionId: string, item: MatchDragItem) => void;
  isCorrect?: boolean;
}) {
  const [{ isOver, canDrop }, drop] = useDrop<MatchDragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: MATCH_TERM,
    drop: (item) => onDrop(definitionId, item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const getBg = () => {
    if (isCorrect === true) return 'border-[#10b981] bg-green-50';
    if (isCorrect === false) return 'border-[#dc2626] bg-red-50';
    if (isOver && canDrop) return 'border-[#1e40af] bg-blue-100';
    if (matchedTermId) return 'border-[#1e40af] bg-blue-50';
    return 'border-dashed border-slate-300';
  };

  return (
    <div
      ref={drop}
      className={`w-44 min-h-[56px] border-2 rounded-lg transition-all flex items-center justify-center ${getBg()}`}
    >
      {matchedTermId && matchedTerm ? (
        // The placed term is itself draggable back out or to another zone
        <MatchDraggableTerm termId={matchedTermId} term={matchedTerm} fromDefinitionId={definitionId} />
      ) : (
        <p className="text-xs text-slate-400">Drop here</p>
      )}
    </div>
  );
}

function DragMatchDisplay({ question, userAnswer, onAnswer, isPracticeMode, hasAnswered }: QuestionDisplayProps) {
  const [matches, setMatches] = useState<Record<string, string>>(userAnswer || {});

  const update = (newMatches: Record<string, string>) => {
    setMatches(newMatches);
    onAnswer(newMatches);
  };

  // Handle a drop onto a definition drop zone
  const handleDropOnZone = (targetDefinitionId: string, item: MatchDragItem) => {
    const newMatches = { ...matches };
    const { termId, fromDefinitionId } = item;

    // If the target zone already has a term and source is another zone → swap
    if (newMatches[targetDefinitionId] && fromDefinitionId && newMatches[targetDefinitionId] !== termId) {
      newMatches[fromDefinitionId] = newMatches[targetDefinitionId];
    } else if (fromDefinitionId) {
      // Just move (no swap needed, or target was empty)
      delete newMatches[fromDefinitionId];
    }

    newMatches[targetDefinitionId] = termId;
    update(newMatches);
  };

  // Handle returning a term to the pool
  const handleReturnTerm = (_termId: string, fromDefinitionId: string) => {
    const newMatches = { ...matches };
    delete newMatches[fromDefinitionId];
    update(newMatches);
  };

  const usedTermIds = new Set(Object.values(matches));
  const availableTerms = question.matchPairs?.filter(p => !usedTermIds.has(p.id)) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="font-semibold mb-3 text-slate-700">Answer Options</h3>
        <MatchPoolZone
          availableTerms={availableTerms.map(p => ({ id: p.id, term: p.term }))}
          onReturnTerm={handleReturnTerm}
        />
      </div>
      <div>
        <h3 className="font-semibold mb-3 text-slate-700">Answer Area</h3>
        <div className="space-y-4">
          {question.matchPairs?.map((pair) => {
            const isCorrect = isPracticeMode && hasAnswered ? matches[pair.id] === pair.id : undefined;
            const matchedTerm = question.matchPairs?.find(p => p.id === matches[pair.id])?.term;
            return (
              <div key={pair.id} className="flex gap-3 items-start">
                <div className="flex-1 p-3 bg-slate-50 rounded-lg border border-border text-sm">
                  {pair.definition}
                </div>
                <MatchDropZone
                  definitionId={pair.id}
                  matchedTermId={matches[pair.id]}
                  matchedTerm={matchedTerm}
                  onDrop={handleDropOnZone}
                  isCorrect={isCorrect}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Drag & Drop Classification ──────────────────────────────────────────────

const CLASSIFY_ITEM = 'CLASSIFY_ITEM';

interface ClassifyDragItem {
  itemId: string;
  text: string;
  fromCategoryId?: string; // undefined = unassigned pool
}

function ClassifyDraggableItem({ itemId, text, fromCategoryId }: { itemId: string; text: string; fromCategoryId?: string }) {
  const [{ isDragging }, drag] = useDrag<ClassifyDragItem, void, { isDragging: boolean }>({
    type: CLASSIFY_ITEM,
    item: { itemId, text, fromCategoryId },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={drag}
      className={`p-2.5 bg-white border-2 border-[#1e40af] rounded-lg cursor-move select-none transition-all text-sm ${
        isDragging ? 'opacity-40 scale-95' : 'hover:shadow-sm hover:-translate-y-0.5'
      }`}
    >
      {text}
    </div>
  );
}

function ClassifyPoolZone({
  unassignedItems,
  onReturn
}: {
  unassignedItems: Array<{ id: string; text: string }>;
  onReturn: (itemId: string, fromCategoryId: string) => void;
}) {
  const [{ isOver, canDrop }, drop] = useDrop<ClassifyDragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: CLASSIFY_ITEM,
    canDrop: (item) => !!item.fromCategoryId,
    drop: (item) => {
      if (item.fromCategoryId) onReturn(item.itemId, item.fromCategoryId);
    },
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-[80px] p-3 rounded-xl border-2 border-dashed transition-all space-y-2 ${
        isOver && canDrop ? 'border-[#1e40af] bg-blue-50' : 'border-slate-200'
      }`}
    >
      {unassignedItems.length === 0 && (
        <p className="text-xs text-slate-400 text-center py-4">All items classified</p>
      )}
      {unassignedItems.map(({ id, text }) => (
        <ClassifyDraggableItem key={id} itemId={id} text={text} fromCategoryId={undefined} />
      ))}
    </div>
  );
}

function ClassifyCategoryZone({
  category,
  itemIds,
  question,
  onDrop,
  onReturn,
  isPracticeMode,
  hasAnswered
}: {
  category: { id: string; name: string };
  itemIds: string[];
  question: Question;
  onDrop: (categoryId: string, item: ClassifyDragItem) => void;
  onReturn: (itemId: string, fromCategoryId: string) => void;
  isPracticeMode: boolean;
  hasAnswered: boolean;
}) {
  const [{ isOver, canDrop }, drop] = useDrop<ClassifyDragItem, void, { isOver: boolean; canDrop: boolean }>({
    accept: CLASSIFY_ITEM,
    drop: (item) => onDrop(category.id, item),
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  });

  return (
    <div
      ref={drop}
      className={`min-h-[100px] p-4 border-2 rounded-xl transition-all ${
        isOver && canDrop ? 'border-[#1e40af] bg-blue-50' : 'border-dashed border-[#1e40af]/30'
      }`}
    >
      <h4 className="font-medium mb-3 text-sm text-slate-700">{category.name}</h4>
      <div className="space-y-2">
        {itemIds.map((itemId) => {
          const item = question.classifyItems?.find(i => i.id === itemId);
          if (!item) return null;
          const isCorrect = isPracticeMode && hasAnswered ? item.correctCategoryId === category.id : undefined;

          return (
            <div
              key={itemId}
              className={`p-2 rounded-lg border relative ${
                isCorrect === true ? 'border-[#10b981] bg-green-50' :
                isCorrect === false ? 'border-[#dc2626] bg-red-50' :
                'border-[#1e40af]/30 bg-blue-50'
              }`}
            >
              {/* Items already in a category are draggable to other categories or back to pool */}
              <ClassifyDraggableItem itemId={item.id} text={item.text} fromCategoryId={category.id} />
              <button
                onClick={() => onReturn(itemId, category.id)}
                className="absolute top-1 right-1 text-slate-400 hover:text-slate-600 transition-colors"
                title="Remove from category"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DragClassifyDisplay({ question, userAnswer, onAnswer, isPracticeMode, hasAnswered }: QuestionDisplayProps) {
  const [classifications, setClassifications] = useState<Record<string, string[]>>(userAnswer || {});

  const update = (newClassifications: Record<string, string[]>) => {
    setClassifications(newClassifications);
    onAnswer(newClassifications);
  };

  // Drop onto a category zone
  const handleDropOnCategory = (targetCategoryId: string, item: ClassifyDragItem) => {
    const newClassifications = { ...classifications };
    const { itemId, fromCategoryId } = item;

    // Remove from source (pool has no entry, category needs cleanup)
    if (fromCategoryId) {
      newClassifications[fromCategoryId] = (newClassifications[fromCategoryId] || []).filter(id => id !== itemId);
    }

    // Add to target
    if (!newClassifications[targetCategoryId]) {
      newClassifications[targetCategoryId] = [];
    }
    if (!newClassifications[targetCategoryId].includes(itemId)) {
      newClassifications[targetCategoryId] = [...newClassifications[targetCategoryId], itemId];
    }

    update(newClassifications);
  };

  // Return to pool (remove from any category)
  const handleReturnToPool = (itemId: string, fromCategoryId: string) => {
    const newClassifications = { ...classifications };
    newClassifications[fromCategoryId] = (newClassifications[fromCategoryId] || []).filter(id => id !== itemId);
    update(newClassifications);
  };

  const assignedItems = new Set(Object.values(classifications).flat());
  const unassignedItems = question.classifyItems?.filter(item => !assignedItems.has(item.id)) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="font-semibold mb-3 text-slate-700">Options</h3>
        <ClassifyPoolZone
          unassignedItems={unassignedItems.map(i => ({ id: i.id, text: i.text }))}
          onReturn={handleReturnToPool}
        />
      </div>
      <div>
        <h3 className="font-semibold mb-3 text-slate-700">Answer</h3>
        <div className="space-y-4">
          {question.categories?.map((category) => (
            <ClassifyCategoryZone
              key={category.id}
              category={category}
              itemIds={classifications[category.id] || []}
              question={question}
              onDrop={handleDropOnCategory}
              onReturn={handleReturnToPool}
              isPracticeMode={isPracticeMode}
              hasAnswered={hasAnswered}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Inline Dropdown
function InlineDropdownDisplay({ question, userAnswer, onAnswer, isPracticeMode, hasAnswered }: QuestionDisplayProps) {
  const answers = userAnswer || {};

  const handleDropdownChange = (dropdownIndex: number, value: string) => {
    onAnswer({ ...answers, [dropdownIndex]: parseInt(value) });
  };

  const parts = question.sentenceTemplate?.split('[select]') || [];

  return (
    <div className="text-lg leading-relaxed">
      {parts.map((part, index) => (
        <span key={index}>
          <span>{part}</span>
          {index < parts.length - 1 && question.inlineDropdowns && question.inlineDropdowns[index] && (
            <span className="inline-block mx-1">
              <Select
                value={answers[index]?.toString() || ''}
                onValueChange={(value) => handleDropdownChange(index, value)}
              >
                <SelectTrigger className={`w-[200px] inline-flex ${
                  isPracticeMode && hasAnswered
                    ? answers[index] === question.inlineDropdowns[index].correctAnswer
                      ? 'border-[#10b981] bg-green-50'
                      : 'border-[#dc2626] bg-red-50'
                    : 'border-[#1e40af]'
                }`}>
                  <SelectValue placeholder="[select]" />
                </SelectTrigger>
                <SelectContent>
                  {question.inlineDropdowns[index].options.map((option, optIndex) => (
                    <SelectItem key={optIndex} value={optIndex.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

// Matching Dropdown
function MatchingDropdownDisplay({ question, userAnswer, onAnswer, isPracticeMode, hasAnswered }: QuestionDisplayProps) {
  const answers = userAnswer || {};

  const handleDropdownChange = (rowId: string, value: string) => {
    onAnswer({ ...answers, [rowId]: parseInt(value) });
  };

  return (
    <div className="space-y-4">
      {question.dropdownRows?.map((row) => {
        const isCorrect = isPracticeMode && hasAnswered ? answers[row.id] === row.correctAnswer : undefined;
        return (
          <div key={row.id} className="grid grid-cols-[1fr_300px] gap-4 items-center">
            <div className="font-medium">{row.label}</div>
            <Select
              value={answers[row.id]?.toString() || ''}
              onValueChange={(value) => handleDropdownChange(row.id, value)}
            >
              <SelectTrigger className={`${
                isCorrect === true ? 'border-[#10b981] bg-green-50' :
                isCorrect === false ? 'border-[#dc2626] bg-red-50' :
                'border-[#1e40af]'
              }`}>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {row.options.map((option, optIndex) => (
                  <SelectItem key={optIndex} value={optIndex.toString()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      })}
    </div>
  );
}
