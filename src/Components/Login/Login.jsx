import React, { useState, useRef } from "react";
import {
  Button,
  TextField,
  InputAdornment,
  Grid,
  Typography,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import RemoveRedEyeTwoToneIcon from "@mui/icons-material/RemoveRedEyeTwoTone";
import "./Login.scss";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [validationErrors2, setValidationErrors2] = useState({});
  const [email, setEmail] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [otpValidationMessage, setOtpValidationMessage] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [otpTimer, setOtpTimer] = useState(60);
  const [showNewPasswordForm, setShowNewPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPasswordValidationErrors, setNewPasswordValidationErrors] =
    useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [loginTime, setLoginTime] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const handleForgotPassword = () => {
    setForgotPassword(true);
  };

  const handleInputChange = (index, e) => {
    const value = e.target.value;
    // Ensure the input is a digit
    if (/^[0-9]$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Move to the next input field if available
      if (index < 3 && value !== "") {
        inputRefs[index + 1].current.focus();
      }
    }
    // If the value is empty, move to the previous input field
    if (value === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
    setOtpValidationMessage("");
  };
  const handleSend = () => {
    const isValidEmail = validateMail();
    if (isValidEmail) {
      setEnteredEmail(email);
      setShowOTPInput(true);
      startOtpTimer();
    }
  };
  const validateMail = () => {
    const isValid = email !== "";
    setValidationErrors2({ email: !isValid });
    return isValid;
  };

  const validate = () => {
    const errors = {
      username: username === "",
      password: password === "",
    };
    setValidationErrors(errors);
    return !errors.username && !errors.password;
  };

  const navigatingToDashBoard = (jsCokkie) => {
    Cookies.set("jwt_token", jsCokkie, {
      expires: 1 / 6,
    });
    navigate("/dashboard", {
      state: {
        token: jsCokkie,
      },
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validate()) {
      let userCredentials = {
        username,
        password,
      };
      // const apiUrl = 'http://sustainos.ai:10000/global_master_app/api/login_user/'
      const apiUrl =
        "http://3.147.10.206:9000/global_master_app/api/login_user/";
      try {
        const response = await axios.post(apiUrl, userCredentials);
        if (response.data && response.data.access_token) {
          navigatingToDashBoard(response.data.access_token);
        } else {
          setErrorMessage("Invalid username or password");
        }
      } catch (error) {
        setErrorMessage(error.response.data);
      }
    }
  };
  const startOtpTimer = () => {
    const timerInterval = setInterval(() => {
      setOtpTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        }
        clearInterval(timerInterval);
        return 0;
      });
    }, 1000);
  };
  const handleValidateOTP = () => {
    // Check if all OTP digits are filled
    const isOtpValid = otp.every((digit) => /^[0-9]$/.test(digit));

    if (!isOtpValid) {
      setOtpValidationMessage("Please enter a valid OTP");
    } else {
      setOtpValidationMessage("");
      setShowNewPasswordForm(true);
      setOtpTimer(0);
    }
  };
  const handleCreateNewPassword = () => {
    const errors = {
      newPassword: newPassword === "",
      confirmPassword:
        confirmPassword === "" || confirmPassword !== newPassword,
    };
    setNewPasswordValidationErrors(errors);

    if (!errors.newPassword && !errors.confirmPassword) {
      setPasswordResetSuccess(true);
    }
  };
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handlePasswordVisibility2 = () => {
    setShowPassword2(!showPassword2);
  };
  const handlePasswordVisibility3 = () => {
    setShowPassword3(!showPassword3);
  };
  const initial = () => {
    setPassword("");
    setUsername("");
    setEmail("");
    setConfirmPassword("");
    setNewPassword("");
    setOtp(["", "", "", ""]);
    setOtpTimer(60);
  };
  const handleBackToLogin = () => {
    setForgotPassword(false);
    setShowOTPInput(false);
    setShowNewPasswordForm(false);
    setPasswordResetSuccess(false);
    initial();
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleLogin(e);
  };
  return (
    <Grid container className="content-main">
      <Grid item xs={12} md={8} className="left-content">
        <div className="logo">
          <img src="../asset/Login/Sustain background logo.svg" alt="Logo" />
        </div>
      </Grid>
      <Grid item xs={12} md={4} className="rite-content">
        <div className="log-main">
          <div className="form-logo">
            <img
              className="Sustain-logo"
              src="../asset/Login/Sustain OS Core.svg"
              alt="Logo-core"
            />
          </div>
          {passwordResetSuccess ? (
            <div className="success-page">
              <div className="form">
                <CheckCircleOutlineIcon className="icon-animate" />
                <Typography className="login-newtext">
                  Password reset successful
                </Typography>
                <Typography className="login-subtext">
                  You can use your new password to log in to your account.
                </Typography>
                <Button
                  className="button"
                  type="button"
                  fullWidth
                  variant="contained"
                  margin="normal"
                  onClick={handleBackToLogin}
                >
                  Back To Login
                </Button>
              </div>
            </div>
          ) : (
            <>
              {showNewPasswordForm ? (
                <form className="form">
                  <Typography className="login-text">
                    Create new password. Please check your new password must be
                    different from previously used password
                  </Typography>
                  <label className="label">New Password</label>
                  <TextField
                    variant="outlined"
                    className="text-box"
                    required
                    fullWidth
                    name="newPassword"
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setNewPassword(e.target.value);
                      setNewPasswordValidationErrors({
                        ...newPasswordValidationErrors,
                        newPassword: "",
                      });
                    }}
                    error={!!newPasswordValidationErrors.newPassword}
                    helperText={
                      !!newPasswordValidationErrors.newPassword
                        ? "New Password is required"
                        : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <RemoveRedEyeTwoToneIcon
                            onClick={handlePasswordVisibility}
                            className="icon-login"
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <label className="label">Confirm Password</label>
                  <TextField
                    variant="outlined"
                    className="text-box"
                    id="confirm-password"
                    required
                    fullWidth
                    name="confirmPassword"
                    type={showPassword2 ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setConfirmPassword(e.target.value);
                      setNewPasswordValidationErrors({
                        ...newPasswordValidationErrors,
                        confirmPassword: "",
                      });
                    }}
                    error={!!newPasswordValidationErrors.confirmPassword}
                    helperText={
                      !!newPasswordValidationErrors.confirmPassword
                        ? "Passwords did not match"
                        : ""
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <RemoveRedEyeTwoToneIcon
                            className="icon-login"
                            onClick={handlePasswordVisibility2}
                          />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    className="button"
                    type="button"
                    fullWidth
                    variant="contained"
                    margin="normal"
                    onClick={handleCreateNewPassword}
                  >
                    Reset Password
                  </Button>
                </form>
              ) : (
                <>
                  {forgotPassword ? (
                    <>
                      {showOTPInput ? (
                        <div>
                          <Typography className="login-text" variant="">
                            Please check your email. We’ve sent a code to{" "}
                            {enteredEmail}
                          </Typography>
                          <form className="form">
                            <label className="label2">Enter Code</label>
                            <div className="otp-input-container">
                              {otp.map((digit, index) => (
                                <input
                                  key={index}
                                  type="text"
                                  className="otp-input"
                                  maxLength="1"
                                  value={digit}
                                  onChange={(e) => handleInputChange(index, e)}
                                  ref={inputRefs[index]}
                                />
                              ))}
                            </div>
                            <Typography
                              className="otp-helper-text"
                              color="error"
                            >
                              {otpValidationMessage}
                            </Typography>
                            <Typography className="resend">
                              Resend Code in {otpTimer} sec.{" "}
                              <a href="#">Resend</a>
                            </Typography>
                            <Button
                              className="button"
                              type="button"
                              fullWidth
                              variant="contained"
                              margin="normal"
                              onClick={handleValidateOTP}
                            >
                              Verify
                            </Button>
                          </form>
                        </div>
                      ) : (
                        <>
                          <Typography className="login-text" variant="">
                            Enter your registered e-mail below, and we will send
                            you reset instructions!
                          </Typography>
                          <form className="form">
                            <label className="label">Email</label>
                            <TextField
                              variant="outlined"
                              className="text-box"
                              type="email"
                              required
                              fullWidth
                              id="email"
                              name="email"
                              autoComplete="email"
                              placeholder="Enter Your Email"
                              value={email}
                              onChange={(e) => {
                                setEmail(e.target.value);
                                setValidationErrors2({
                                  ...validationErrors2,
                                  email: "",
                                });
                              }}
                              error={!!validationErrors2.email}
                              helperText={
                                !!validationErrors2.email
                                  ? "Email is required"
                                  : ""
                              }
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <MailOutlineIcon className="icon-login" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                            <Button
                              className="button"
                              type="button"
                              fullWidth
                              variant="contained"
                              margin="normal"
                              onClick={handleSend}
                            >
                              Send
                            </Button>
                          </form>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Typography component="h2" variant="">
                        Login{" "}
                      </Typography>
                      <form className="form" onSubmit={handleFormSubmit}>
                        <label className="label">Username</label>
                        <TextField
                          variant="outlined"
                          required
                          className="text-box"
                          fullWidth
                          id="username"
                          name="username"
                          autoComplete="username"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            setValidationErrors({
                              ...validationErrors,
                              username: "",
                            });
                          }}
                          error={!!validationErrors.username}
                          helperText={
                            !!validationErrors.username
                              ? "username is required"
                              : ""
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <PersonIcon className="icon-login" />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <label className="label">Password</label>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          className="text-box"
                          name="password"
                          type={showPassword3 ? "text" : "password"}
                          id="password"
                          autoComplete="current-password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            setValidationErrors({
                              ...validationErrors,
                              password: "",
                            });
                          }}
                          error={!!validationErrors.password}
                          helperText={
                            !!validationErrors.password
                              ? "password is required"
                              : ""
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <RemoveRedEyeTwoToneIcon
                                  className="icon-login"
                                  onClick={handlePasswordVisibility3}
                                />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Typography variant="body2" className="body2">
                          <a href="#" onClick={handleForgotPassword}>
                            Forgot Password?
                          </a>
                        </Typography>
                        <Button
                          className="button"
                          type="submit"
                          fullWidth
                          variant="contained"
                          margin="normal"
                        >
                          Login
                        </Button>
                      </form>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </div>
        <Typography className="copyright" variant="caption">
          Copyright&copy;2024 <span className="net">NetCarbonVision</span> All
          Rights Reserved
        </Typography>
      </Grid>
    </Grid>
  );
}

export default Login;
