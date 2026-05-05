'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Shield, Smartphone, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState('demo@sumato.com');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const identifier = tab === 'email' ? email : phone;
    const result = await login(identifier, password);

    if (result.ok) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="#fcd535"/>
            <polygon points="14,6 22,10 22,18 14,22 6,18 6,10" fill="#0b0e11"/>
            <polygon points="14,10 18,12 18,16 14,18 10,16 10,12" fill="#fcd535"/>
          </svg>
          <span className={styles.logoText}>SUMATO</span>
        </div>

        <h1 className={styles.title}>Log In</h1>

        {/* Demo hint */}
        <div className={styles.demoHint}>
          <span>🎯 Demo: </span>
          <strong>demo@sumato.com</strong> / <strong>demo123</strong>
        </div>

        <div className={styles.tabBar}>
          <button className={`${styles.tabItem} ${tab === 'email' ? styles.activeTab : ''}`} onClick={() => setTab('email')}>Email</button>
          <button className={`${styles.tabItem} ${tab === 'phone' ? styles.activeTab : ''}`} onClick={() => setTab('phone')}>
            <Smartphone size={14} /> Phone
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {tab === 'email' ? (
            <div className={styles.field}>
              <label className={styles.label}>Email Address</label>
              <input
                id="login-email"
                type="email"
                className={styles.input}
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          ) : (
            <div className={styles.field}>
              <label className={styles.label}>Phone Number</label>
              <div className={styles.phoneInput}>
                <select className={styles.countryCode}>
                  <option>+1</option><option>+44</option><option>+234</option><option>+91</option><option>+86</option>
                </select>
                <input id="login-phone" type="tel" className={styles.phoneNum} placeholder="Phone number" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.pwWrap}>
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className={styles.input}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className={styles.pwToggle} onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className={styles.forgotRow}>
            <Link href="/forgot-password" className={styles.forgot}>Forgot Password?</Link>
          </div>

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" id="login-submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <><Loader2 size={16} className={styles.spinner} /> Signing in...</>
            ) : 'Log In'}
          </button>

          <div className={styles.divider}><span>or continue with</span></div>

          <div className={styles.socials}>
            <button type="button" className={styles.socialBtn} onClick={async () => {
              setLoading(true);
              const r = await login('google@sumato.com', 'google123');
              if (r.ok) router.push('/dashboard');
              setLoading(false);
            }}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 19.026 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
              Google
            </button>
            <button type="button" className={styles.socialBtn} onClick={async () => {
              setLoading(true);
              const r = await login('apple@sumato.com', 'apple123');
              if (r.ok) router.push('/dashboard');
              setLoading(false);
            }}>
              <AppleIcon size={18} />
              Apple
            </button>
          </div>
        </form>

        <div className={styles.footer}>
          <p>Don't have an account? <Link href="/register" className={styles.link}>Sign Up</Link></p>
        </div>

        <div className={styles.securityNote}>
          <Shield size={13} />
          <span>Sumato Exchange uses 256-bit SSL encryption to protect your data</span>
        </div>
      </div>
    </div>
  );
}

function AppleIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}
