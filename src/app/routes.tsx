import { createBrowserRouter } from 'react-router';
import { Dashboard } from './pages/Dashboard';
import { AllQuizzes } from './pages/AllQuizzes';
import { CategoryPage } from './pages/CategoryPage';
import { QuizInstructions } from './pages/QuizInstructions';
import { ActiveQuiz } from './pages/ActiveQuiz';
import { QuizResults } from './pages/QuizResults';
import { QuizCreator } from './pages/QuizCreator';
import { Profile } from './pages/Profile';
import { Navbar } from './components/Navbar';
import { Toaster } from './components/ui/sonner';
import { OAuth2RedirectHandler } from './auth/OAuth2RedirectHandler';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {children}
      <Toaster />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RootLayout>
        <Dashboard />
      </RootLayout>
    ),
  },
  {
    path: '/quizzes',
    element: (
      <RootLayout>
        <AllQuizzes />
      </RootLayout>
    ),
  },
  {
    path: '/category/:categoryId',
    element: (
      <RootLayout>
        <CategoryPage />
      </RootLayout>
    ),
  },
  {
    path: '/quiz/:quizId/instructions',
    element: (
      <RootLayout>
        <QuizInstructions />
      </RootLayout>
    ),
  },
  {
    path: '/quiz/:quizId/attempt',
    element: <ActiveQuiz />,
  },
  {
    path: '/quiz/:quizId/results',
    element: (
      <RootLayout>
        <QuizResults />
      </RootLayout>
    ),
  },
  {
    path: '/create-quiz',
    element: (
      <RootLayout>
        <QuizCreator />
      </RootLayout>
    ),
  },
  {
    path: '/profile',
    element: (
      <RootLayout>
        <Profile />
      </RootLayout>
    ),
  },
  {
    path: '/oauth2/redirect',
    element: (
      <RootLayout>
        <OAuth2RedirectHandler />
      </RootLayout>
    ),
  },
]);
