import { useState } from 'react';
import { useNavigate } from 'react-router';
import { QuizCard } from '../components/QuizCard';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { categories } from '../data/mockData';
import { ArrowLeft, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuizzes } from '../context/QuizContext';

const ITEMS_PER_PAGE = 12;

export function AllQuizzes() {
  const navigate = useNavigate();
  const { quizzes } = useQuizzes();
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter quizzes
  let filteredQuizzes = quizzes;
  if (filterCategory !== 'all') {
    filteredQuizzes = filteredQuizzes.filter(q => q.category === filterCategory);
  }
  if (filterDifficulty !== 'all') {
    filteredQuizzes = filteredQuizzes.filter(q => q.difficulty === filterDifficulty);
  }
  
  // Sort quizzes
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        // Assuming newer quizzes have higher IDs or are later in the array
        return 0; // Keep original order (newest first)
      case 'oldest':
        return 0; // Would reverse if we had dates
      case 'most-attempted':
        // Mock implementation - would use actual attempt counts
        return 0;
      case 'category-az':
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  });
  
  if (sortBy === 'oldest') {
    sortedQuizzes.reverse();
  }
  
  const totalPages = Math.ceil(sortedQuizzes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentQuizzes = sortedQuizzes.slice(startIndex, endIndex);
  
  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6 -ml-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">All Quizzes</h1>
        <p className="text-slate-600">
          Browse our complete collection of practice tests
        </p>
      </div>
      
      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[200px]">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1 min-w-[200px]">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="most-attempted">Most Attempted</SelectItem>
              <SelectItem value="category-az">Category (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Quiz Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {currentQuizzes.map((quiz) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
      
      {/* No results message */}
      {currentQuizzes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-600">No quizzes found with the selected filters.</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => goToPage(page)}
              className={currentPage === page ? 'bg-[#1e40af] hover:bg-[#1e3a8a]' : ''}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}