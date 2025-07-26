import React, { useState } from 'react';

interface PhoneNumberInputProps {
  onSubmit: (phoneNumber: string) => void;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ onSubmit }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation, should be replaced with a proper library
    if (phoneNumber.trim()) {
      // IMPORTANT: Phone number must be in E.164 format (e.g., +11234567890)
      onSubmit(phoneNumber);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="phone-number">Mobile Number</label>
      <p>Please enter your number in E.164 format (e.g., +911234567890)</p>
      <input
        id="phone-number"
        type="tel"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="+911234567890"
        required
      />
      <button type="submit">Send OTP</button>
    </form>
  );
};

export default PhoneNumberInput;
