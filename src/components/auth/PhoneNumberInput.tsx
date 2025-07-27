import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';

interface PhoneNumberInputProps {
  onSubmit: (phoneNumber: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim()) {
      setLoading(true);
      // IMPORTANT: Phone number must be in E.164 format (e.g., +11234567890)
      await onSubmit(phoneNumber);
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="phone-number"
        label="Mobile Number"
        name="phone-number"
        autoComplete="tel"
        autoFocus
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="+911234567890"
        helperText="Include country code (e.g., +91)"
      />
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Send OTP'}
      </Button>
    </Box>
  );
};

export default PhoneNumberInput;
