import { Category } from './category';
import { Creator } from './user';

export interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: string;
  durationMinutes: number;
  passingPercentage: number;
  totalQuestions: number;
  averageScore: number;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  creator: Creator;
}