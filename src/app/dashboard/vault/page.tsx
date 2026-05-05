'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar/Navbar';
import { Lock, Unlock, Plus, ChevronRight, Clock, CheckCircle2, Loader2, Repeat, Calendar, Send, X } from 'lucide-react';
import styles from './vault.module.css';

const SCHEDULED = [
  { id: 1, recipient: 'John Doe (Staff)', uid: 'UID-2847', asset: 'USDT', amount: 500, freq: 'Monthly', nextDate: '2026-06-01', status: 'Active' },
  { id: 2, recipient: 'Freelancer — Mark', uid: 'UID-5532', asset: 'BTC', amount: 0.005, freq: 'Weekly', nextDate: '2026-05-12', status: 'Active' },
  { id: 3, recipient: 'Office Rent', uid: 'UID-9901', asset: 'USDT', amount: 2000, freq: 'Monthly', nextDate: '2026-06-01', status: 'Paused' },
];

const VAULT_LOCKS = [
  { id: 1, asset: 'BTC', amount: 0.5, locked: '2026-04-01', unlocks: '2026-10-01', apy: 4.2, status: 'Locked' },
  { id: 2, asset: 'ETH', amount: 2.0, locked: '2026-03-15', unlocks: '2026-09-15', apy: 3.8, status: 'Locked' },
];

export default function VaultPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showLockModal, setShowLockModal] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Schedule form
  const [schedRecipient, setSchedRecipient] = useState('');
  const [schedAsset, setSchedAsset] = useState('USDT');
  const [schedAmount, setSchedAmount] = useState('');
  const [schedFreq, setSchedFreq] = useState('Monthly');
  const [schedDate, setSchedDate] = useState('');
  const [schedMemo, setSchedMemo] = useState('');

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push('/login');
  }, [isLoading, isLoggedIn, router]);

  if (!user) return null;

  const handleSchedule = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1400));
    setPlacing(false);
    setShowScheduleModal(false);
    setSuccess('Payment scheduled successfully!');
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleLock = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1200));
    setPlacing(false);
    setShowLockModal(false);
    setSuccess('Funds locked in vault!');
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>

          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <Link href="/dashboard" className={styles.breadLink}>Dashboard</Link>
            <ChevronRight size={13} />
            <span>Vault</span>
          </div>

          {success && (
            <div className={styles.successBanner}><CheckCircle2 size={16} />{success}</div>
          )}

          {/* Vault hero */}
          <div className={styles.vaultHero}>
            <div className={styles.vaultHeroLeft}>
              <div className={styles.vaultIcon}><Lock size={32} /></div>
              <div>
                <div className={styles.vaultLabel}>Vault Balance</div>
                <div className={styles.vaultAmount}>$33,850.00</div>
                <div className={styles.vaultSub}>0.5 BTC + 2.0 ETH locked</div>
              </div>
            </div>
            <div className={styles.vaultHeroRight}>
              <div className={styles.vaultStat}>
                <div className={styles.vsLabel}>Est. Annual Yield</div>
                <div className={styles.vsValue} style={{ color: 'var(--green)' }}>+$1,284.20</div>
              </div>
              <div className={styles.vaultStat}>
                <div className={styles.vsLabel}>Avg APY</div>
                <div className={styles.vsValue}>4.0%</div>
              </div>
              <div className={styles.vaultStat}>
                <div className={styles.vsLabel}>Scheduled</div>
                <div className={styles.vsValue}>{SCHEDULED.filter(s => s.status === 'Active').length} active</div>
              </div>
            </div>
          </div>

          <div className={styles.mainGrid}>
            {/* Vault locks */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}><Lock size={16} /> Locked Assets</h2>
                <button className={styles.newBtn} onClick={() => setShowLockModal(true)}>
                  <Plus size={14} /> Lock Funds
                </button>
              </div>
              <div className={styles.lockCards}>
                {VAULT_LOCKS.map(lock => {
                  const start = new Date(lock.locked);
                  const end = new Date(lock.unlocks);
                  const now = new Date();
                  const pct = Math.min(100, ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100);
                  return (
                    <div key={lock.id} className={styles.lockCard}>
                      <div className={styles.lockHeader}>
                        <div className={styles.lockAsset}>
                          <div className={styles.lockBadge}>{lock.asset}</div>
                          <div>
                            <div className={styles.lockAmount}>{lock.amount} {lock.asset}</div>
                            <div className={styles.lockValue}>${(lock.amount * (lock.asset === 'BTC' ? 67432 : 3521)).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                          </div>
                        </div>
                        <div className={styles.lockApyBadge}>APY {lock.apy}%</div>
                      </div>
                      <div className={styles.lockProgress}>
                        <div className={styles.lockProgressBar}>
                          <div className={styles.lockProgressFill} style={{ width: `${pct}%` }} />
                        </div>
                        <div className={styles.lockDates}>
                          <span>{lock.locked}</span>
                          <span>🔓 {lock.unlocks}</span>
                        </div>
                      </div>
                      <div className={styles.lockFooter}>
                        <span className={styles.lockStatus}><Lock size={12} /> {lock.status}</span>
                        <span className={styles.lockEarned}>+${(lock.amount * (lock.asset === 'BTC' ? 67432 : 3521) * lock.apy / 100 / 2).toFixed(2)} earned</span>
                      </div>
                    </div>
                  );
                })}
                <div className={styles.addLockCard} onClick={() => setShowLockModal(true)}>
                  <Plus size={24} />
                  <span>Lock More Funds</span>
                </div>
              </div>
            </div>

            {/* Scheduled payments */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}><Repeat size={16} /> Scheduled Payments</h2>
                <button className={styles.newBtn} onClick={() => setShowScheduleModal(true)}>
                  <Plus size={14} /> New Schedule
                </button>
              </div>
              <div className={styles.scheduleList}>
                <div className={styles.scheduleHeader}>
                  <span>Recipient</span><span>Asset</span><span>Amount</span><span>Frequency</span><span>Next Date</span><span>Status</span><span></span>
                </div>
                {SCHEDULED.map(s => (
                  <div key={s.id} className={styles.scheduleRow}>
                    <div className={styles.schedRecip}>
                      <div className={styles.schedAvatar}>{s.recipient.slice(0,2).toUpperCase()}</div>
                      <div>
                        <div className={styles.schedName}>{s.recipient}</div>
                        <div className={styles.schedUid}>{s.uid}</div>
                      </div>
                    </div>
                    <span className={styles.schedAsset}>{s.asset}</span>
                    <span className={styles.schedAmount}>{s.amount} {s.asset}</span>
                    <span className={styles.schedFreq}><Repeat size={10} /> {s.freq}</span>
                    <span className={styles.schedDate}><Calendar size={10} /> {s.nextDate}</span>
                    <span className={`${styles.schedStatus} ${s.status === 'Active' ? styles.statusActive : styles.statusPaused}`}>{s.status}</span>
                    <button className={styles.schedCancel}><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className={styles.overlay} onClick={() => setShowScheduleModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}><Send size={16} /> Schedule Payment</div>
              <button className={styles.modalClose} onClick={() => setShowScheduleModal(false)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.mField}><label>Recipient UID or Wallet Address</label><input className={styles.mInput} placeholder="e.g. UID-12345 or 0x..." value={schedRecipient} onChange={e => setSchedRecipient(e.target.value)} /></div>
              <div className={styles.mRow}>
                <div className={styles.mField}><label>Asset</label>
                  <select className={styles.mSelect} value={schedAsset} onChange={e => setSchedAsset(e.target.value)}>
                    {['USDT','BTC','ETH','BNB'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className={styles.mField}><label>Amount</label><input className={styles.mInput} type="number" placeholder="0.00" value={schedAmount} onChange={e => setSchedAmount(e.target.value)} /></div>
              </div>
              <div className={styles.mRow}>
                <div className={styles.mField}><label>Frequency</label>
                  <select className={styles.mSelect} value={schedFreq} onChange={e => setSchedFreq(e.target.value)}>
                    {['One-time','Daily','Weekly','Monthly'].map(f => <option key={f}>{f}</option>)}
                  </select>
                </div>
                <div className={styles.mField}><label>Start Date</label><input className={styles.mInput} type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} /></div>
              </div>
              <div className={styles.mField}><label>Memo / Label</label><input className={styles.mInput} placeholder="e.g. Monthly Salary — John" value={schedMemo} onChange={e => setSchedMemo(e.target.value)} /></div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowScheduleModal(false)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={handleSchedule} disabled={placing || !schedRecipient || !schedAmount}>
                {placing ? <><Loader2 size={14} className={styles.spin} /> Scheduling...</> : '✓ Schedule Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lock Modal */}
      {showLockModal && (
        <div className={styles.overlay} onClick={() => setShowLockModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}><Lock size={16} /> Lock Funds in Vault</div>
              <button className={styles.modalClose} onClick={() => setShowLockModal(false)}><X size={18} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.mRow}>
                <div className={styles.mField}><label>Asset</label>
                  <select className={styles.mSelect}>
                    {['BTC','ETH','USDT','BNB'].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className={styles.mField}><label>Amount</label><input className={styles.mInput} type="number" placeholder="0.000" /></div>
              </div>
              <div className={styles.mField}><label>Lock Duration</label>
                <div className={styles.durationGrid}>
                  {['30 days (3.5% APY)', '90 days (4.0% APY)', '180 days (4.5% APY)', '365 days (5.2% APY)'].map((d, i) => (
                    <button key={i} className={`${styles.durationBtn} ${i === 1 ? styles.durationActive : ''}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div className={styles.lockNote}><Lock size={12} /> Funds cannot be withdrawn until the lock period ends.</div>
            </div>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setShowLockModal(false)}>Cancel</button>
              <button className={styles.confirmBtn} onClick={handleLock} disabled={placing}>
                {placing ? <><Loader2 size={14} className={styles.spin} /> Locking...</> : '🔒 Lock Funds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
