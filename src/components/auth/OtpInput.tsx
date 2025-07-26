import React, { useState } from 'react';

interface OtpInputProps {
  onSubmit: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ onSubmit }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      onSubmit(otp);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="otp">Enter OTP</label>
      <input
        id="otp"
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        maxLength={6}
        required
      />
      <button type="submit">Verify</button>
    </form>
  );
};

export default OtpInput;
