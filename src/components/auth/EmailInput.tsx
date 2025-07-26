import React, { useState } from 'react';

interface EmailInputProps {
  onSubmit: (email: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && /S+@S+.S+/.test(email)) { // Basic email regex
      onSubmit(email);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Enter Email for Activation</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <button type="submit">Send Activation Link</button>
    </form>
  );
};

export default EmailInput;
