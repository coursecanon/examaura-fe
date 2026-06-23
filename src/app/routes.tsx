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
import LoginPage from "./pages/LoginPage";
import  ProtectedRoute  from './routes/ProtectedRoute'; // 🚀 Import your new gatekeeper
import  PublicOnlyRoute  from './routes/PublicOnlyRoute';

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
  // ==========================================
  // 🟢 PUBLIC ROUTES (Anyone can access these)
  // ==========================================
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
    path: '/quiz/:quizId/instructions',
    element: (
      <RootLayout>
        <QuizInstructions />
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
  element: <PublicOnlyRoute />,
  children: [
    {
      path: "/login",
      element: <LoginPage />
    }
  ]
},
  {
    path: '/oauth2/redirect',
    element: (
      <RootLayout>
        <OAuth2RedirectHandler />
      </RootLayout>
    ),
  },

  // ==========================================
  // 🔴 PROTECTED ROUTES (Requires Login)
  // ==========================================
  {
    element: <ProtectedRoute />, // 🚀 The Gatekeeper sits here
    children: [
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
        path: '/quiz/:quizId/attempt',
        element: <ActiveQuiz />, // Note: Intentionally left out of RootLayout per your original setup
      },
      {
        path: '/quiz/:quizId/results',
        element: (
          <RootLayout>
            <QuizResults />
          </RootLayout>
        ),
      },
    ],
  },
]);