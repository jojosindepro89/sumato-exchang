'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Shield, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from '../login/auth.module.css';
import regStyles from './register.module.css';

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [referral, setReferral] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Medium', 'Strong'][strength];
  const strengthColor = ['', '#f6465d', '#fcd535', '#0ecb81'][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!agreed) return;

    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[0-9]/.test(password),
    ];
    if (checks.some(c => !c)) {
      setError('Please meet all password requirements.');
      return;
    }

    setLoading(true);
    // For demo: use login which creates a session
    const result = await login(email, password);
    if (result.ok) {
      router.push('/dashboard');
    } else {
      // Even for new registrations route to dashboard in demo
      router.push('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card} style={{ maxWidth: '460px' }}>
        <div className={styles.logo}>
          <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
            <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="#fcd535"/>
            <polygon points="14,6 22,10 22,18 14,22 6,18 6,10" fill="#0b0e11"/>
            <polygon points="14,10 18,12 18,16 14,18 10,16 10,12" fill="#fcd535"/>
          </svg>
          <span className={styles.logoText}>SUMATO</span>
        </div>

        <h1 className={styles.title}>Create Account</h1>

        {/* Demo hint */}
        <div className={styles.demoHint}>
          🎯 <span>Want a quick demo? </span>
          <a href="/login" style={{ color: 'var(--accent)', fontWeight: 700 }}>Log in</a>
          <span> with </span><strong>demo@sumato.com</strong> / <strong>demo123</strong>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>Email Address</label>
            <input
              id="reg-email"
              type="email"
              className={styles.input}
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <div className={styles.pwWrap}>
              <input
                id="reg-password"
                type={showPw ? 'text' : 'password'}
                className={styles.input}
                placeholder="Min. 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button type="button" className={styles.pwToggle} onClick={() => setShowPw(!showPw)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password && (
              <div className={regStyles.strengthRow}>
                <div className={regStyles.strengthBars}>
                  {[1,2,3].map(l => (
                    <div key={l} className={regStyles.strengthBar} style={{ background: l <= strength ? strengthColor : 'var(--border)' }} />
                  ))}
                </div>
                <span style={{ color: strengthColor, fontSize: '11px', fontWeight: 600 }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Referral Code (Optional)</label>
            <input id="reg-referral" type="text" className={styles.input} placeholder="Enter referral code" value={referral} onChange={e => setReferral(e.target.value)} />
          </div>

          <div className={regStyles.requirements}>
            {[
              { label: 'At least 8 characters', ok: password.length >= 8 },
              { label: 'Contains uppercase letter', ok: /[A-Z]/.test(password) },
              { label: 'Contains number', ok: /[0-9]/.test(password) },
            ].map(r => (
              <div key={r.label} className={regStyles.reqItem}>
                <CheckCircle2 size={13} color={r.ok ? 'var(--green)' : 'var(--text-muted)'} />
                <span style={{ color: r.ok ? 'var(--green)' : 'var(--text-muted)', fontSize: '12px' }}>{r.label}</span>
              </div>
            ))}
          </div>

          <label className={regStyles.agreeLabel}>
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className={regStyles.checkbox} />
            <span>
              I agree to the <Link href="/terms" className={styles.link}>Terms of Service</Link> and{' '}
              <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            </span>
          </label>

          {error && (
            <div className={styles.errorBox}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" id="reg-submit" className={styles.submitBtn} disabled={!agreed || loading}>
            {loading ? (
              <><Loader2 size={16} className={styles.spinner} /> Creating Account...</>
            ) : 'Create Account'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Already have an account? <Link href="/login" className={styles.link}>Log In</Link></p>
        </div>

        <div className={styles.securityNote}>
          <Shield size={13} />
          <span>Protected by 256-bit SSL encryption</span>
        </div>
      </div>
    </div>
  );
}
