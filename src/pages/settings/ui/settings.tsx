import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export function Settings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [maxCounter, setMaxCounter] = useState(10000);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({ maxCounter })
      });

      if (response.ok) {
        setMessage('Settings saved successfully');
      } else {
        setMessage('Error saving settings');
      }
    } catch (error) {
      setMessage('Network error');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="settings-container">
      <h1>User Settings</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Maximum Counter Value:
          <input
            type="number"
            value={maxCounter}
            onChange={(e) => setMaxCounter(Number(e.target.value))}
            min="1"
          />
        </label>
        <button type="submit">Save</button>
      </form>
      {message && <div className="message">{message}</div>}
    </div>
  );
}