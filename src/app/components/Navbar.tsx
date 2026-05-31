import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { BookOpen, Plus, User, LogOut, ChevronDown, X } from 'lucide-react';
import { Button } from './ui/button';
import { useUser } from '../context/UserContext';

function SignInModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  const handleSignIn = (provider: 'google' | 'github' | 'email') => {
    if (provider === 'email') {
      // Keep this placeholder or point it to your standard /login form route
      
      console.log('Traditional login active');
      onClose();
      navigate('/login');
      return;
    }

    // 2. Point directly to your Spring Boot port and context path setup
    const BACKEND_URL = 'http://localhost:8081/api/v1';
    
    // 3. Force browser redirection to initiate the Spring Security handshake
    window.location.href = `${BACKEND_URL}/oauth2/authorization/${provider}`;
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="bg-[#1e40af] text-white w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sign in to QuizMaster</h2>
          <p className="text-slate-500 mt-1 text-sm">Track your progress and quiz history</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => handleSignIn('google')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-[#1e40af]/40 hover:bg-blue-50 transition-all font-medium text-slate-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <button
            onClick={() => handleSignIn('github')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all font-medium text-slate-700"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Sign in with GitHub
          </button>
          <button
            onClick={() => handleSignIn('email')}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all font-medium text-slate-700"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 6C2 4.89543 2.89543 4 4 4H20C21.1046 4 22 4.89543 22 6V18C22 19.1046 21.1046 20 20 20H4C2.89543 20 2 19.1046 2 18V6ZM4 6L12 11L20 6H4ZM20 8.236L12.53 12.904C12.206 13.106 11.794 13.106 11.47 12.904L4 8.236V18H20V8.236Z" />
            </svg>
            Sign in with Email
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileDropdown({ onClose }: { onClose: () => void }) {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/');
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-border rounded-xl shadow-lg py-2 z-50">
      <div className="px-4 py-3 border-b border-border">
        <p className="font-semibold text-sm text-slate-900">{user?.name}</p>
        <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
      </div>
      <Link
        to="/profile"
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <User className="w-4 h-4" />
        Profile
      </Link>
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </button>
    </div>
  );
}

export function Navbar() {
  const location = useLocation();
  const { user, isLoggedIn } = useUser();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { path: '/category/azure', label: 'Azure' },
    { path: '/category/aws', label: 'AWS' },
    { path: '/category/salesforce', label: 'Salesforce' },
    { path: '/quizzes', label: 'All Quizzes' }
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleOpenSignin = () => setShowSignIn(true);
    window.addEventListener('open-signin', handleOpenSignin);
    return () => window.removeEventListener('open-signin', handleOpenSignin);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="bg-[#1e40af] text-white p-2 rounded-lg">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-semibold text-xl">Examaura</span>
            </Link>

            {/* Center Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`transition-colors hover:text-[#1e40af] ${
                    isActive(link.path) ? 'text-[#1e40af] font-medium' : 'text-slate-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <Link to="/create-quiz">
                <Button className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Quiz
                </Button>
              </Link>

              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(prev => !prev)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    <img
                      src={user?.avatar}
                      alt={user?.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-[#1e40af]/20"
                    />
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showDropdown && <ProfileDropdown onClose={() => setShowDropdown(false)} />}
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowSignIn(true)}
                  className="border-[#1e40af] text-[#1e40af] hover:bg-blue-50"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </>
  );
}
