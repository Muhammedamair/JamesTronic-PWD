import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PhoneNumberInput from '../components/auth/PhoneNumberInput';
import OtpInput from '../components/auth/OtpInput';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../services/firebase';
import { Container, Box, Typography } from '@mui/material';

type Step = 'mobile' | 'otp' | 'success';

const RegistrationPage = () => {
  const [step, setStep] = useState<Step>('mobile');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const navigate = useNavigate();

  // Initialize reCAPTCHA verifier only once on component mount
  useEffect(() => {
    const verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible'
    });
    setRecaptchaVerifier(verifier);
  }, []);

  const handleMobileSubmit = async (phoneNumber: string) => {
    if (!recaptchaVerifier) {
      console.error("reCAPTCHA verifier not initialized");
      return;
    }
    try {
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };

  const handleOtpSubmit = async (otp: string) => {
    if (!confirmationResult) return;
    try {
      await confirmationResult.confirm(otp);
      setStep('success');
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  // Redirect after a short delay on success
  useEffect(() => {
    if (step === 'success') {
      setTimeout(() => {
        navigate('/'); // Redirect to home page after login
      }, 2000);
    }
  }, [step, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {step === 'mobile' && 'Enter Mobile Number'}
          {step === 'otp' && 'Enter Verification Code'}
          {step === 'success' && 'Success!'}
        </Typography>
        <Box sx={{ mt: 3 }}>
          {step === 'mobile' && <PhoneNumberInput onSubmit={handleMobileSubmit} />}
          {step === 'otp' && <OtpInput onSubmit={handleOtpSubmit} />}
          {step === 'success' && (
            <Typography align="center">
              You have been successfully registered and logged in. Redirecting...
            </Typography>
          )}
        </Box>
      </Box>
      {/* This container is required for Firebase reCAPTCHA and is now managed by the useEffect hook */}
      <div id="recaptcha-container" style={{ marginTop: '20px' }}></div>
    </Container>
  );
};

export default RegistrationPage;
