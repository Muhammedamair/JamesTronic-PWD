import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';

interface OtpInputProps {
  onSubmit: (otp: string) => void;
}

const OtpInput: React.FC<OtpInputProps> = ({ onSubmit }) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      setLoading(true);
      await onSubmit(otp);
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="otp"
        label="6-Digit OTP"
        name="otp"
        autoFocus
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        inputProps={{ maxLength: 6 }}
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Verify'}
      </Button>
    </Box>
  );
};

export default OtpInput;
