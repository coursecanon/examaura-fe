import { useState } from "react";
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

type AuthMode = "login" | "register";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    password: "",
  });

  const handleChange = (field: keyof typeof form) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };
  };

  const handleSubmit = () => {
    console.log(mode, form);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Left Side */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-800 p-12">
        <div className="max-w-lg text-white">
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Welcome Back
          </h1>

          <p className="text-xl text-blue-100">
            Secure authentication experience built with React, Material UI,
            Tailwind and TypeScript.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-400" />
              Fast authentication
            </div>

            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-400" />
              Modern UI Design
            </div>

            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-400" />
              Fully Responsive
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Paper
          elevation={0}
          className="w-full max-w-md !bg-white/95 !backdrop-blur-xl rounded-3xl p-8 shadow-2xl"
        >
          <div className="text-center mb-8">
            <Typography variant="h4" fontWeight={700}>
              {mode === "login" ? "Sign In" : "Create Account"}
            </Typography>

            <Typography color="text.secondary" mt={1}>
              {mode === "login"
                ? "Access your account"
                : "Create a new account"}
            </Typography>
          </div>

          <div className="space-y-5">
            {mode === "register" && (
              <TextField
                fullWidth
                label="Full Name"
                value={form.fullName}
                onChange={handleChange("fullName")}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <TextField
              fullWidth
              label="Username"
              value={form.username}
              onChange={handleChange("username")}
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              sx={{
                height: 52,
                borderRadius: "14px",
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {mode === "login"
                ? "Sign In"
                : "Create Account"}
            </Button>

            <Divider>
              <span className="text-gray-500 text-sm">OR</span>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              sx={{
                borderRadius: "14px",
                textTransform: "none",
              }}
            >
              Continue with Google
            </Button>

            <div className="text-center pt-2">
              <button
                onClick={() =>
                  setMode(
                    mode === "login"
                      ? "register"
                      : "login"
                  )
                }
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