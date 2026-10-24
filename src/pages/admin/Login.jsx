import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Field, Card, Alert } from '../../components/admin/ui';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';
    return () => {
      if (meta) meta.content = 'index, follow';
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: username, username, password }),
      });

      const data = await res.json();

      if (!res.ok || (!data.success && !data.token)) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      if (data.token) {
        localStorage.setItem('aura_token', data.token);
      }

      navigate('/admin/dashboard/projects');
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 font-sans selection:bg-foreground/10 text-foreground">
      <Card className="w-full max-w-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col items-center text-center">
          <img
            src="/icon-classic.svg"
            alt="Logo"
            className="w-10 h-10 rounded-lg mb-3"
          />
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Admin Sign in
          </h1>
          <p className="text-xs text-muted mt-1">
            Enter your credentials to manage portfolio content
          </p>
        </div>

        {error && <Alert type="error" message={error} />}

        <form onSubmit={handleLogin} className="space-y-4">
          <Field label="Username or Email" required>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin@aura.dev"
              required
              autoFocus
            />
          </Field>

          <Field label="Password" required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </Field>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </Button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-border">
          <a
            href="/"
            className="text-xs text-muted hover:text-foreground transition-colors"
          >
            ← Back to public portfolio
          </a>
        </div>
      </Card>
    </div>
  );
};

export default Login;
