import styles from './login.module.css';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

export function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      login,
      password
    });

    if (result?.error) {
      setError('Неправильный логин или пароль');
    } else {
      router.push('/');
    }
  };

  return (
    <div className={styles.containerPage}>
      <div className={styles.containerForm}>

        <p className={styles.label}>Вход</p>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required

            className={styles.formInput}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            
            className={styles.formInput}
          />
          <button type="submit" className={styles.formSubmit}>Вход</button>
        </form>

      </div>
    </div>
  );
}