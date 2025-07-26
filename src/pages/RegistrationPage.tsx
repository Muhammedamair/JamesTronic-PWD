import React, { useState } from 'react';
import PhoneNumberInput from '../components/auth/PhoneNumberInput';
import OtpInput from '../components/auth/OtpInput';
import EmailInput from '../components/auth/EmailInput';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { auth } from '../services/firebase';

// Define the steps in the registration flow
type Step = 'mobile' | 'otp' | 'email' | 'success';

const RegistrationPage = () => {
  const [step, setStep] = useState<Step>('mobile');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // This function will be called by the PhoneNumberInput component
  const handleMobileSubmit = async (phoneNumber: string) => {
    try {
      // Setup reCAPTCHA for phone auth verification
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible'
      });
      
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(result);
      setStep('otp');
    } catch (error) {
      console.error("Error sending OTP:", error);
      // Handle error (e.g., show a toast message)
    }
  };

  // This function will be called by the OtpInput component
  const handleOtpSubmit = async (otp: string) => {
    if (!confirmationResult) return;
    try {
      await confirmationResult.confirm(otp);
      // User is now signed in (provisionally)
      setStep('email');
    } catch (error) {
      console.error("Error verifying OTP:", error);
      // Handle error (e.g., invalid OTP)
    }
  };
  
  // This function will be called by the EmailInput component
  const handleEmailSubmit = async (email: string) => {
    try {
      const functions = getFunctions();
      const sendActivationEmail = httpsCallable(functions, 'sendActivationEmail');
      await sendActivationEmail({ email });
      setStep('success');
    } catch (error) {
      console.error("Error calling sendActivationEmail function:", error);
      // Handle error
    }
  };

  return (
    <div>
      <h1>Create Your Account</h1>
      {step === 'mobile' && <PhoneNumberInput onSubmit={handleMobileSubmit} />}
      {step === 'otp' && <OtpInput onSubmit={handleOtpSubmit} />}
      {step === 'email' && <EmailInput onSubmit={handleEmailSubmit} />}
      {step === 'success' && (
        <div>
          <h2>Registration Successful!</h2>
          <p>We've sent an activation link to your email. Please check your inbox to complete the process.</p>
        </div>
      )}
      {/* This container is required for Firebase reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default RegistrationPage;
