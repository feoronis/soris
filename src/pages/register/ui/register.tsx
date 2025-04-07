import { useState } from 'react';
import { useRouter } from 'next/router';
import { Register, RegisterParams } from '@/shared/api/endpoints/register';

export function RegisterPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await Register({login: login, password: password});
      console.log(response);

      if (response.status >= 200 && response.status < 300) {
        router.push('/login');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
        setError('Network error');
        console.log(err);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}