import { RouterProvider } from 'react-router';
import { router } from './routes';
import { QuizProvider } from './context/QuizContext';
import { UserProvider } from './context/UserContext';

export default function App() {
  return (
    <UserProvider>
      <QuizProvider>
        <RouterProvider router={router} />
      </QuizProvider>
    </UserProvider>
  );
}
