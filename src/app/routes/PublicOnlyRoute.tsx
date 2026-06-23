import { Navigate, Outlet } from 'react-router';
import { useUser } from '../context/UserContext';

export default function PublicOnlyRoute() {
  const { isLoggedIn } = useUser();

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}