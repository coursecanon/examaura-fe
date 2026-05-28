import { Link } from 'react-router';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, FileText } from 'lucide-react';
import { Quiz } from '../data/mockData';

interface QuizCardProps {
  quiz: Quiz;
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Link to={`/quiz/${quiz.id}/instructions`}>
      <Card className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer border border-border rounded-xl h-full">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
            <Badge className="bg-[#1e40af] text-white hover:bg-[#1e3a8a]">
              {quiz.category}
            </Badge>
          </div>
          
          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>{quiz.questionCount} Questions</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{quiz.duration} minutes</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}