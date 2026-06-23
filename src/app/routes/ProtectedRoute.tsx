import { Navigate, Outlet } from 'react-router';
import { useUser } from '../context/UserContext';

export default function ProtectedRoute() {
  const { isLoggedIn } = useUser();

  // If they aren't logged in, kick them to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the child routes!
  return <Outlet />;
}