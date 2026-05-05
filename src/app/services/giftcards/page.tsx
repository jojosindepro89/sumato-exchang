'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Search, CheckCircle2, Loader2 } from 'lucide-react';
import styles from './giftcards.module.css';

const BRANDS = [
  { id: 'amazon', name: 'Amazon', logo: '🛒', color: '#FF9900', amounts: [10, 25, 50, 100, 200] },
  { id: 'itunes', name: 'Apple iTunes', logo: '🎵', color: '#fc3c44', amounts: [15, 25, 50, 100] },
  { id: 'google', name: 'Google Play', logo: '▶️', color: '#01875f', amounts: [10, 25, 50, 100] },
  { id: 'steam', name: 'Steam', logo: '🎮', color: '#1b2838', amounts: [5, 10, 20, 50, 100] },
  { id: 'netflix', name: 'Netflix', logo: '🎬', color: '#e50914', amounts: [15, 25, 50] },
  { id: 'spotify', name: 'Spotify', logo: '🎧', color: '#1db954', amounts: [10, 30, 60] },
  { id: 'xbox', name: 'Xbox', logo: '🕹️', color: '#107c10', amounts: [15, 25, 50, 100] },
  { id: 'walmart', name: 'Walmart', logo: '🏪', color: '#0071ce', amounts: [10, 25, 50, 100, 200] },
];

type Step = 'browse' | 'amount' | 'pay' | 'success';

export default function GiftCardsPage() {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [step, setStep] = useState<Step>('browse');
  const [brand, setBrand] = useState(BRANDS[0]);
  const [amount, setAmount] = useState(0);
  const [payAsset, setPayAsset] = useState('USDT');
  const [placing, setPlacing] = useState(false);
  const [cardCode] = useState(`XXXX-${Math.random().toString(36).substr(2,4).toUpperCase()}-${Math.random().toString(36).substr(2,4).toUpperCase()}-XXXX`);
  const [search, setSearch] = useState('');

  // Sell tab
  const [sellBrand, setSellBrand] = useState('Amazon');
  const [sellAmount, setSellAmount] = useState('');
  const [sellCode, setSellCode] = useState('');
  const [sellStep, setSellStep] = useState<'form' | 'quote' | 'done'>('form');

  const handleBuy = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1600));
    setPlacing(false);
    setStep('success');
  };

  const handleSellQuote = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1200));
    setPlacing(false);
    setSellStep('quote');
  };

  const handleSellConfirm = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1400));
    setPlacing(false);
    setSellStep('done');
  };

  const filtered = BRANDS.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href="/services" className={styles.breadLink}><ArrowLeft size={13} /> Services</Link>
            <ChevronRight size={13} />
            <span>Gift Cards</span>
          </div>

          <h1 className={styles.pageTitle}>Gift Cards</h1>

          <div className={styles.tabs}>
            <button className={`${styles.tab} ${tab === 'buy' ? styles.tabActive : ''}`} onClick={() => { setTab('buy'); setStep('browse'); }}>🛒 Buy Gift Cards</button>
            <button className={`${styles.tab} ${tab === 'sell' ? styles.tabActive : ''}`} onClick={() => { setTab('sell'); setSellStep('form'); }}>💰 Sell Gift Cards</button>
          </div>

          {/* BUY TAB */}
          {tab === 'buy' && (
            <>
              {step === 'browse' && (
                <>
                  <div className={styles.searchWrap}>
                    <Search size={14} />
                    <input className={styles.searchInput} placeholder="Search gift cards..." value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div className={styles.brandsGrid}>
                    {filtered.map(b => (
                      <button key={b.id} className={styles.brandCard} onClick={() => { setBrand(b); setStep('amount'); }}>
                        <div className={styles.brandLogo}>{b.logo}</div>
                        <div className={styles.brandName}>{b.name}</div>
                        <div className={styles.brandFrom}>From ${Math.min(...b.amounts)}</div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {step === 'amount' && (
                <div className={styles.formCard}>
                  <button className={styles.backBtn} onClick={() => setStep('browse')}><ArrowLeft size={14} /> Back</button>
                  <div className={styles.brandHeader}>
                    <div className={styles.brandLogoLg}>{brand.logo}</div>
                    <div className={styles.brandName}>{brand.name} Gift Card</div>
                  </div>
                  <div className={styles.field}><label>Select Amount</label>
                    <div className={styles.amtGrid}>
                      {brand.amounts.map(a => (
                        <button key={a} className={`${styles.amtBtn} ${amount === a ? styles.amtActive : ''}`} onClick={() => setAmount(a)}>${a}</button>
                      ))}
                    </div>
                  </div>
                  <div className={styles.field}><label>Pay With</label>
                    <div className={styles.assetSelector}>
                      {['USDT','BTC','ETH','BNB'].map(a => (
                        <button key={a} className={`${styles.assetBtn} ${payAsset === a ? styles.assetActive : ''}`} onClick={() => setPayAsset(a)}>{a}</button>
                      ))}
                    </div>
                  </div>
                  {amount > 0 && <div className={styles.summary}>
                    <div className={styles.sumRow}><span>Gift Card Value</span><strong>${amount}</strong></div>
                    <div className={styles.sumRow}><span>You Pay</span><strong>{payAsset === 'BTC' ? (amount/67432).toFixed(6) : amount.toFixed(2)} {payAsset}</strong></div>
                    <div className={styles.sumRow}><span>Delivery</span><strong>Instant (code revealed)</strong></div>
                  </div>}
                  <button className={styles.buyBtn} onClick={() => setStep('pay')} disabled={amount === 0}>Purchase for ${amount} →</button>
                </div>
              )}

              {step === 'pay' && (
                <div className={styles.formCard}>
                  <h2 className={styles.subTitle}>Confirm Purchase</h2>
                  <div className={styles.summary}>
                    <div className={styles.sumRow}><span>Gift Card</span><strong>{brand.name} ${amount}</strong></div>
                    <div className={styles.sumRow}><span>Pay With</span><strong>{payAsset}</strong></div>
                    <div className={styles.sumRow}><span>Amount</span><strong>{payAsset === 'BTC' ? (amount/67432).toFixed(6) : amount.toFixed(2)} {payAsset}</strong></div>
                  </div>
                  <button className={styles.buyBtn} onClick={handleBuy} disabled={placing}>
                    {placing ? <><Loader2 size={14} className={styles.spin} /> Processing...</> : `Confirm Purchase`}
                  </button>
                </div>
              )}

              {step === 'success' && (
                <div className={styles.successCard}>
                  <div className={styles.successIcon}>🎁</div>
                  <h2 className={styles.successTitle}>Gift Card Ready!</h2>
                  <p className={styles.successSub}>{brand.name} ${amount} gift card</p>
                  <div className={styles.cardCodeBox}>
                    <div className={styles.codeLabel}>Your Gift Card Code</div>
                    <div className={styles.codeValue}>{cardCode}</div>
                    <button className={styles.copyCodeBtn} onClick={() => navigator.clipboard.writeText(cardCode)}>Copy Code</button>
                  </div>
                  <p className={styles.codeNote}>This code is valid and can be redeemed on the {brand.name} website or app.</p>
                  <button className={styles.buyBtn} onClick={() => { setStep('browse'); setAmount(0); }}>Buy Another</button>
                </div>
              )}
            </>
          )}

          {/* SELL TAB */}
          {tab === 'sell' && (
            <div className={styles.formCard}>
              {sellStep === 'form' && (
                <>
                  <h2 className={styles.subTitle}>Sell Your Gift Card</h2>
                  <div className={styles.field}><label>Gift Card Brand</label>
                    <select className={styles.selectInput} value={sellBrand} onChange={e => setSellBrand(e.target.value)}>
                      {BRANDS.map(b => <option key={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className={styles.field}><label>Gift Card Value (USD)</label>
                    <input className={styles.input} type="number" placeholder="Enter the face value" value={sellAmount} onChange={e => setSellAmount(e.target.value)} />
                  </div>
                  <div className={styles.field}><label>Gift Card Code</label>
                    <input className={styles.input} placeholder="Enter the card code" value={sellCode} onChange={e => setSellCode(e.target.value)} />
                  </div>
                  <button className={styles.buyBtn} onClick={handleSellQuote} disabled={!sellAmount || !sellCode || placing}>
                    {placing ? <><Loader2 size={14} className={styles.spin} /> Getting Quote...</> : 'Get Quote →'}
                  </button>
                </>
              )}
              {sellStep === 'quote' && (
                <>
                  <h2 className={styles.subTitle}>Your Quote</h2>
                  <div className={styles.quoteBox}>
                    <div className={styles.quoteBrand}>{sellBrand} ${sellAmount}</div>
                    <div className={styles.quoteRate}>Rate: 85%</div>
                    <div className={styles.quoteAmount}>You Receive: <strong>${(parseFloat(sellAmount) * 0.85).toFixed(2)} USDT</strong></div>
                    <div className={styles.quoteExpiry}>⏳ Quote valid for 10 minutes</div>
                  </div>
                  <button className={styles.buyBtn} onClick={handleSellConfirm} disabled={placing}>
                    {placing ? <><Loader2 size={14} className={styles.spin} /> Processing...</> : 'Accept & Receive USDT'}
                  </button>
                  <button className={styles.backBtn} onClick={() => setSellStep('form')} style={{ marginTop: 8 }}><ArrowLeft size={14} /> Decline</button>
                </>
              )}
              {sellStep === 'done' && (
                <div className={styles.successCard}>
                  <CheckCircle2 size={48} className={styles.successCheckIcon} />
                  <h2 className={styles.successTitle}>Sale Complete!</h2>
                  <p className={styles.successSub}><strong>${(parseFloat(sellAmount) * 0.85).toFixed(2)} USDT</strong> added to your wallet</p>
                  <button className={styles.buyBtn} onClick={() => { setSellStep('form'); setSellAmount(''); setSellCode(''); }}>Sell Another</button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
