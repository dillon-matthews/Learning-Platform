import React, { useState } from "react";
import { useApi } from "../apiV3";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Avatar,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { CheckCircle, Error as ErrorIcon } from "@mui/icons-material";
import { green, red } from "@mui/material/colors";

const RegisterPage = () => {
  const usersApi = useApi("users");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [userType, setUserType] = useState("Student");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    await usersApi.create({
      email,
      name,
      age,
      userType,
      password,
    });
    navigate("/login");
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordsMatch(newPassword === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordsMatch(newConfirmPassword === password);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <TextField
              label="Age"
              type="number"
              fullWidth
              margin="normal"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={handlePasswordChange}
              required
              autoComplete="new-password"
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              autoComplete="new-password"
              error={!passwordsMatch && confirmPassword.length > 0}
              helperText={
                !passwordsMatch && confirmPassword.length > 0
                  ? "Passwords do not match."
                  : ""
              }
              InputProps={{
                endAdornment:
                  confirmPassword.length > 0 ? (
                    <InputAdornment position="end">
                      {passwordsMatch ? (
                        <CheckCircle sx={{ color: green[500] }} />
                      ) : (
                        <ErrorIcon sx={{ color: red[500] }} />
                      )}
                    </InputAdornment>
                  ) : null,
              }}
              sx={{
                "& .MuiOutlinedInput-root":
                  passwordsMatch && confirmPassword.length > 0
                    ? {
                        "& fieldset": {
                          borderColor: green[500],
                        },
                        "&:hover fieldset": {
                          borderColor: green[700],
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: green[700],
                        },
                      }
                    : {},
              }}
            />
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              fullWidth
              sx={{ mt: 3, mb: 2 }}
              disabled={
                !email ||
                !password ||
                !confirmPassword ||
                !passwordsMatch ||
                !name ||
                !age
              }
            >
              Sign Up
            </Button>
            <Box display="flex" justifyContent="center">
              <Typography variant="body2">
                Already have an account?{" "}
                <Link to="/login" style={{ textDecoration: "none" }}>
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
