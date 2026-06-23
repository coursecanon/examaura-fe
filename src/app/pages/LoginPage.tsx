import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "../context/UserContext";
import {
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Typography,
  Divider,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Person,
  Badge,
  Lock,
} from "@mui/icons-material";
import api from "../api/axiosConfig";

type AuthMode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { loginWithToken } = useUser();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  // Track which fields the user has clicked into and left
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    username: false,
    password: false,
  });

  // --- Validation Logic ---
  const validations = {
    // Only alphabets and spaces, cannot be blank
    fullName: /^[A-Za-z\s]+$/.test(form.fullName) && form.fullName.trim().length > 0,
    // Minimum 8 characters
    username: form.username.length >= 8,
    // Minimum 8 characters
    password: form.password.length >= 8,
    // Basic email format check
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email), 
  };

  // Determine if the overall form is valid based on the current mode
  const isFormValid =
    mode === "login"
      ? validations.email && validations.password
      : validations.email &&
        validations.password &&
        validations.fullName &&
        validations.username;

  // --- Handlers ---
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return; // Extra safeguard

    setIsLoading(true);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      
      const response = await api.post(endpoint, {
        email: form.email,
        password: form.password,
        ...(mode === "register" && { fullName: form.fullName, username: form.username })
      });

      const { token, refreshToken } = response.data;
      
      loginWithToken(token, refreshToken, response.data);
      navigate("/");
    } catch (error: any) {
      console.error(`${mode} failed:`, error);
      alert(error.response?.data?.message || `${mode} failed. Please verify details.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = (provider: 'google') => {
    const BACKEND_URL = 'http://localhost:8081/api/v1';
    window.location.href = `${BACKEND_URL}/oauth2/authorization/${provider}`;
  };

  const handleChange = (field: keyof typeof form) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Reset touched state when swapping between Login and Register
  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setTouched({ fullName: false, email: false, username: false, password: false });
  };

  return (
    <div className="h-screen bg-[#d1d1d1] flex selection:bg-indigo-500">
      {/* Left Side Banner */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12">
        <div className="max-w-lg text-black">
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Welcome {mode === "login" ? "Back" : ""}
          </h1>

          <p className="text-xl text-black-100">
            Play and practice for your certification exams with our interactive platform. Join a community of learners and achieve your goals together!
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#b1b1b1]" />
              Exam Style Practice Papers
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#b1b1b1]" />
              Track Progress
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#b1b1b1]" />
              Create your own
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/4 right-1 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <Paper
          elevation={0}
          className="w-full max-w-md !bg-white/95 !backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <Typography variant="h4" fontWeight={700}>
              {mode === "login" ? "Sign In" : "Create Account"}
            </Typography>

            <Typography color="text.secondary" mt={1}>
              {mode === "login" ? "Access your account" : "Create a new account"}
            </Typography>
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-5">
            {mode === "register" && (
              <>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                  onBlur={() => handleBlur("fullName")}
                  error={touched.fullName && !validations.fullName}
                  helperText={
                    touched.fullName && !validations.fullName
                      ? "Must contain only alphabets and cannot be blank"
                      : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Username"
                  value={form.username}
                  onChange={handleChange("username")}
                  onBlur={() => handleBlur("username")}
                  error={touched.username && !validations.username}
                  helperText={
                    touched.username && !validations.username
                      ? "Username must be at least 8 characters"
                      : ""
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </>
            )}

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={form.email}
              onChange={handleChange("email")}
              onBlur={() => handleBlur("email")}
              error={touched.email && !validations.email}
              helperText={
                touched.email && !validations.email
                  ? "Please enter a valid email address"
                  : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange("password")}
              onBlur={() => handleBlur("password")}
              error={touched.password && !validations.password}
              helperText={
                touched.password && !validations.password
                  ? "Password must be at least 8 characters"
                  : ""
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading || !isFormValid} // 🚀 Disabled until valid
              sx={{
                height: 52,
                borderRadius: "14px",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {isLoading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="space-y-5 mt-5">
            <Divider>
              <span className="text-gray-500 text-sm">OR</span>
            </Divider>

            <button
              type="button"
              onClick={() => handleSocialSignIn('google')}
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

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {mode === "login"
                  ? "Need an account? Register"
                  : "Already have an account? Sign In"}
              </button>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
}