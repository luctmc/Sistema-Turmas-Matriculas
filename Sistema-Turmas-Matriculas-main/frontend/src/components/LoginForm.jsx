import { useState } from 'react';

const defaultCredentials = {
  email: '',
  password: ''
};

export function LoginForm({ onLogin }) {
  const [credentials, setCredentials] = useState(defaultCredentials);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(credentials);
      setCredentials(defaultCredentials);
    } catch (err) {
      setError(err.message || 'Falha ao autenticar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Acesse o painel</h2>
      <label>
        Email
        <input name="email" type="email" value={credentials.email} onChange={handleChange} required />
      </label>
      <label>
        Senha
        <input name="password" type="password" value={credentials.password} onChange={handleChange} required />
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
