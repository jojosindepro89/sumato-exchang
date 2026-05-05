'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';
import { Zap, Wifi, Phone, Tv2, Building2, ArrowLeft, ChevronRight, CheckCircle2, Loader2 } from 'lucide-react';
import styles from './bills.module.css';

const CATS = [
  { id: 'electricity', icon: Zap, label: 'Electricity', color: '#fcd535', providers: ['EKEDC (Eko)','IKEDC (Ikeja)','AEDC','PHEDC','KEDC'] },
  { id: 'internet', icon: Wifi, label: 'Internet', color: '#627eea', providers: ['MTN Fiber','Spectranet','Smile','Airtel','Glo Broadband'] },
  { id: 'mobile', icon: Phone, label: 'Mobile', color: '#0ecb81', providers: ['MTN','Airtel','Glo','9mobile','T-Mobile','AT&T','Vodafone'] },
  { id: 'tv', icon: Tv2, label: 'TV/Cable', color: '#f0b90b', providers: ['DSTV','GOtv','StarTimes','Netflix','ShowMax'] },
  { id: 'government', icon: Building2, label: 'Government', color: '#e84393', providers: ['Tax Payment','WAEC/NECO','NIN Renewal','Passport Fee'] },
];

const AMOUNTS = ['1,000','2,000','5,000','10,000','20,000','50,000'];

type Step = 'cat' | 'provider' | 'form' | 'confirm' | 'success';

export default function BillsPage() {
  const [step, setStep] = useState<Step>('cat');
  const [cat, setCat] = useState(CATS[0]);
  const [provider, setProvider] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [amount, setAmount] = useState('');
  const [payAsset, setPayAsset] = useState('USDT');
  const [placing, setPlacing] = useState(false);
  const [ref] = useState(`PAY-${Date.now().toString().slice(-7)}`);

  const handlePay = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    setPlacing(false);
    setStep('success');
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href="/services" className={styles.breadLink}><ArrowLeft size={13} /> Services</Link>
            <ChevronRight size={13} />
            <span>Bill Payment</span>
          </div>

          {/* Step: Category */}
          {step === 'cat' && (
            <>
              <h1 className={styles.pageTitle}>Pay a Bill</h1>
              <p className={styles.pageDesc}>Choose a bill category to get started</p>
              <div className={styles.catGrid}>
                {CATS.map(c => (
                  <button key={c.id} className={styles.catCard} onClick={() => { setCat(c); setStep('provider'); }}>
                    <div className={styles.catIcon} style={{ background: c.color + '18', color: c.color }}><c.icon size={24} /></div>
                    <div className={styles.catLabel}>{c.label}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step: Provider */}
          {step === 'provider' && (
            <>
              <button className={styles.backBtn} onClick={() => setStep('cat')}><ArrowLeft size={14} /> Back</button>
              <h2 className={styles.subTitle}>Select {cat.label} Provider</h2>
              <div className={styles.providerList}>
                {cat.providers.map(p => (
                  <button key={p} className={styles.providerCard} onClick={() => { setProvider(p); setStep('form'); }}>
                    <div className={styles.providerIcon} style={{ background: cat.color + '18', color: cat.color }}><cat.icon size={20} /></div>
                    <span>{p}</span>
                    <ChevronRight size={16} className={styles.provArrow} />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step: Form */}
          {step === 'form' && (
            <div className={styles.formCard}>
              <button className={styles.backBtn} onClick={() => setStep('provider')}><ArrowLeft size={14} /> Back</button>
              <div className={styles.providerHeader}>
                <div className={styles.catIcon} style={{ background: cat.color + '18', color: cat.color }}><cat.icon size={20} /></div>
                <div>
                  <div className={styles.provName}>{provider}</div>
                  <div className={styles.catName}>{cat.label}</div>
                </div>
              </div>

              <div className={styles.field}>
                <label>Account / Meter Number</label>
                <input className={styles.input} placeholder="Enter account number" value={accountNum} onChange={e => setAccountNum(e.target.value)} />
              </div>

              <div className={styles.field}>
                <label>Amount</label>
                <div className={styles.amountPresets}>
                  {AMOUNTS.map(a => (
                    <button key={a} className={`${styles.amtBtn} ${amount === a ? styles.amtActive : ''}`} onClick={() => setAmount(a)}>₦{a}</button>
                  ))}
                </div>
                <input className={styles.input} placeholder="Or enter custom amount..." value={amount} onChange={e => setAmount(e.target.value)} style={{ marginTop: 8 }} />
              </div>

              <div className={styles.field}>
                <label>Pay With</label>
                <div className={styles.assetSelector}>
                  {['USDT','BTC','ETH','BNB'].map(a => (
                    <button key={a} className={`${styles.assetBtn} ${payAsset === a ? styles.assetActive : ''}`} onClick={() => setPayAsset(a)}>{a}</button>
                  ))}
                </div>
              </div>

              {amount && (
                <div className={styles.summary}>
                  <div className={styles.sumRow}><span>Bill Amount</span><strong>₦{amount}</strong></div>
                  <div className={styles.sumRow}><span>Crypto Equivalent</span><strong>{payAsset === 'BTC' ? '0.0000098' : payAsset === 'ETH' ? '0.000423' : '0.98'} {payAsset}</strong></div>
                  <div className={styles.sumRow}><span>Platform Fee</span><strong>₦0.00</strong></div>
                </div>
              )}

              <button className={styles.payBtn} onClick={() => setStep('confirm')} disabled={!accountNum || !amount}>
                Continue to Payment →
              </button>
            </div>
          )}

          {/* Step: Confirm */}
          {step === 'confirm' && (
            <div className={styles.formCard}>
              <h2 className={styles.subTitle}>Confirm Payment</h2>
              <div className={styles.confirmDetails}>
                <div className={styles.sumRow}><span>Service</span><strong>{provider} — {cat.label}</strong></div>
                <div className={styles.sumRow}><span>Account No.</span><strong>{accountNum}</strong></div>
                <div className={styles.sumRow}><span>Amount</span><strong>₦{amount}</strong></div>
                <div className={styles.sumRow}><span>Pay With</span><strong>{payAsset}</strong></div>
                <div className={styles.sumRow}><span>Reference</span><strong>{ref}</strong></div>
              </div>
              <div className={styles.payActions}>
                <button className={styles.editBtn} onClick={() => setStep('form')}>Edit</button>
                <button className={styles.payBtn} onClick={handlePay} disabled={placing}>
                  {placing ? <><Loader2 size={14} className={styles.spin} /> Processing...</> : `Pay with ${payAsset}`}
                </button>
              </div>
            </div>
          )}

          {/* Step: Success */}
          {step === 'success' && (
            <div className={styles.successCard}>
              <CheckCircle2 size={56} className={styles.successIcon} />
              <h2 className={styles.successTitle}>Payment Successful! 🎉</h2>
              <p className={styles.successSub}>{cat.label} bill of <strong>₦{amount}</strong> paid to <strong>{provider}</strong></p>
              <div className={styles.receiptBox}>
                <div className={styles.sumRow}><span>Reference</span><strong>{ref}</strong></div>
                <div className={styles.sumRow}><span>Status</span><strong style={{ color: 'var(--green)' }}>✓ Confirmed</strong></div>
                <div className={styles.sumRow}><span>Time</span><strong>{new Date().toLocaleString()}</strong></div>
              </div>
              <div className={styles.successActions}>
                <button className={styles.editBtn} onClick={() => { setStep('cat'); setAccountNum(''); setAmount(''); }}>Pay Another</button>
                <Link href="/services" className={styles.payBtn} style={{ textAlign: 'center' }}>Back to Services</Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
