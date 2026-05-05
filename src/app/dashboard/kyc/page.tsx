'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar/Navbar';
import {
  CheckCircle2, Clock, Upload, Shield, AlertCircle,
  ChevronRight, User, FileText, Camera
} from 'lucide-react';
import styles from './kyc.module.css';

const STEPS = [
  {
    id: 1,
    icon: User,
    title: 'Personal Information',
    desc: 'Full name, date of birth, nationality',
    status: 'done',
  },
  {
    id: 2,
    icon: FileText,
    title: 'Identity Document',
    desc: 'Passport, National ID, or Driver\'s License',
    status: 'done',
  },
  {
    id: 3,
    icon: Camera,
    title: 'Facial Verification',
    desc: 'Take a selfie to verify your identity',
    status: 'done',
  },
  {
    id: 4,
    icon: Shield,
    title: 'Address Verification',
    desc: 'Utility bill or bank statement',
    status: 'done',
  },
];

const LIMITS = [
  { label: 'Daily Withdrawal', basic: '$2,000', standard: '$100,000', pro: 'Unlimited' },
  { label: 'P2P Trading', basic: '✗', standard: '✓', pro: '✓' },
  { label: 'Fiat Deposits', basic: '✗', standard: '✓', pro: '✓' },
  { label: 'OTC Trading', basic: '✗', standard: '✗', pro: '✓' },
];

export default function KycPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push('/login');
  }, [isLoading, isLoggedIn, router]);

  if (!user) return null;

  const isVerified = user.kycStatus === 'verified';

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>

          <div className={styles.breadcrumb}>
            <Link href="/dashboard" className={styles.breadLink}>Dashboard</Link>
            <ChevronRight size={13} />
            <span>KYC Verification</span>
          </div>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Identity Verification</h1>
            <p className={styles.pageDesc}>Complete KYC to unlock higher limits and full platform access</p>
          </div>

          {/* Status banner */}
          {isVerified ? (
            <div className={styles.verifiedBanner}>
              <CheckCircle2 size={20} />
              <div>
                <div className={styles.verifiedTitle}>Verification Complete</div>
                <div className={styles.verifiedSub}>Your identity has been verified. You have access to all platform features.</div>
              </div>
              <div className={styles.verifiedLevel}>
                <span>Level</span>
                <strong>{user.level}</strong>
              </div>
            </div>
          ) : (
            <div className={styles.pendingBanner}>
              <Clock size={20} />
              <div>
                <div className={styles.pendingTitle}>Verification In Progress</div>
                <div className={styles.pendingSub}>We are reviewing your documents. This usually takes 1-3 business days.</div>
              </div>
            </div>
          )}

          <div className={styles.mainGrid}>
            {/* Verification steps */}
            <div className={styles.stepsSection}>
              <h2 className={styles.sectionTitle}>Verification Steps</h2>
              <div className={styles.stepsList}>
                {STEPS.map((step, i) => (
                  <div key={step.id} className={styles.stepItem}>
                    <div className={styles.stepConnector}>
                      <div className={`${styles.stepCircle} ${isVerified ? styles.stepDone : styles.stepPending}`}>
                        {isVerified ? <CheckCircle2 size={16} /> : <step.icon size={16} />}
                      </div>
                      {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${isVerified ? styles.lineDone : ''}`} />}
                    </div>
                    <div className={styles.stepContent}>
                      <div className={styles.stepTitle}>{step.title}</div>
                      <div className={styles.stepDesc}>{step.desc}</div>
                      {isVerified && <div className={styles.stepStatus}><CheckCircle2 size={12} /> Approved</div>}
                    </div>
                  </div>
                ))}
              </div>

              {!isVerified && (
                <button className={styles.startBtn}>
                  <Upload size={16} />
                  Start Verification
                </button>
              )}
            </div>

            {/* Account limits */}
            <div className={styles.limitsSection}>
              <h2 className={styles.sectionTitle}>Account Limits</h2>
              <div className={styles.limitsCard}>
                <div className={styles.limitsHeader}>
                  <span></span>
                  <span>Basic</span>
                  <span className={`${styles.colStd} ${user.level !== 'VIP' && user.level !== 'Pro' ? styles.colCurrent : ''}`}>Standard</span>
                  <span className={`${styles.colPro} ${user.level === 'Pro' || user.level === 'VIP' ? styles.colCurrent : ''}`}>Pro</span>
                </div>
                {LIMITS.map(row => (
                  <div key={row.label} className={styles.limitRow}>
                    <span className={styles.limitLabel}>{row.label}</span>
                    <span className={styles.limitVal}>{row.basic}</span>
                    <span className={`${styles.limitVal} ${styles.colStd}`}>{row.standard}</span>
                    <span className={`${styles.limitVal} ${styles.colPro}`}>{row.pro}</span>
                  </div>
                ))}
              </div>

              {/* Current status card */}
              <div className={styles.currentCard}>
                <div className={styles.currentLabel}>Current Level</div>
                <div className={styles.currentLevel}>{user.level}</div>
                <div className={styles.currentBenefits}>
                  <div className={styles.benefit}><CheckCircle2 size={13} color="var(--green)" /> Spot & Futures trading</div>
                  <div className={styles.benefit}><CheckCircle2 size={13} color="var(--green)" /> Fiat deposit & withdrawal</div>
                  <div className={styles.benefit}><CheckCircle2 size={13} color="var(--green)" /> P2P trading enabled</div>
                  {(user.level === 'Pro' || user.level === 'VIP') && (
                    <div className={styles.benefit}><CheckCircle2 size={13} color="var(--green)" /> OTC & institutional trading</div>
                  )}
                </div>
              </div>

              <div className={styles.securityTip}>
                <AlertCircle size={14} />
                <span>Sumato uses bank-grade encryption to protect your identity documents. Your data is never shared with third parties.</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
