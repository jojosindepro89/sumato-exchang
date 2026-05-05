'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';
import { CreditCard, ShieldCheck, Zap, ChevronDown, ArrowRight, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import styles from './buy.module.css';

const COINS = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67432.5, change: 2.34, icon: '₿', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', price: 3521.8, change: -0.82, icon: 'Ξ', color: '#627EEA' },
  { symbol: 'BNB', name: 'BNB', price: 567.2, change: 1.12, icon: 'B', color: '#F0B90B' },
  { symbol: 'SOL', name: 'Solana', price: 178.4, change: 4.23, icon: '◎', color: '#9945FF' },
  { symbol: 'USDT', name: 'Tether', price: 1.0, change: 0.01, icon: '₮', color: '#26A17B' },
  { symbol: 'XRP', name: 'XRP', price: 0.6321, change: -1.45, icon: 'X', color: '#346AA9' },
  { symbol: 'ADA', name: 'Cardano', price: 0.4851, change: 0.78, icon: '₳', color: '#0D1E2D' },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.1562, change: -2.10, icon: 'Ð', color: '#C2A633' },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', fee: '1.8%', time: 'Instant' },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦', fee: '0.5%', time: '1–3 days' },
  { id: 'apple', label: 'Apple Pay', icon: '🍎', fee: '1.8%', time: 'Instant' },
  { id: 'google', label: 'Google Pay', icon: 'G', fee: '1.8%', time: 'Instant' },
];

const AMOUNTS_USD = [50, 100, 250, 500, 1000];

type Step = 'form' | 'confirm' | 'success';

export default function BuyCryptoPage() {
  const [coin, setCoin] = useState(COINS[0]);
  const [showCoinDrop, setShowCoinDrop] = useState(false);
  const [amountUSD, setAmountUSD] = useState('100');
  const [payMethod, setPayMethod] = useState(PAYMENT_METHODS[0]);
  const [step, setStep] = useState<Step>('form');
  const [placing, setPlacing] = useState(false);

  // Card form fields
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');

  const coinAmount = amountUSD && !isNaN(parseFloat(amountUSD))
    ? (parseFloat(amountUSD) / coin.price).toFixed(6)
    : '0';
  const fee = amountUSD ? (parseFloat(amountUSD) * (payMethod.id === 'bank' ? 0.005 : 0.018)).toFixed(2) : '0.00';
  const total = amountUSD ? (parseFloat(amountUSD) + parseFloat(fee)).toFixed(2) : '0.00';

  const handleBuy = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 2000));
    setPlacing(false);
    setStep('success');
  };

  const formatCard = (v: string) => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 4);
    return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroBadge}><Zap size={13} /> Instant crypto purchase</div>
          <h1 className={styles.heroTitle}>Buy Crypto Instantly</h1>
          <p className={styles.heroSub}>Purchase Bitcoin, Ethereum and 200+ cryptocurrencies with your card or bank account</p>
          <div className={styles.heroStats}>
            <div className={styles.heroStat}><span>180+</span> Countries</div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}><span>200+</span> Cryptos</div>
            <div className={styles.heroStatDiv} />
            <div className={styles.heroStat}><span>0%</span> Fees on first buy</div>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.mainGrid}>
            {/* Left: Buy form */}
            <div className={styles.buyCard}>
              {step === 'form' && (
                <>
                  <div className={styles.cardTitle}>Buy Crypto</div>

                  {/* Coin selector */}
                  <div className={styles.field}>
                    <label>Select Cryptocurrency</label>
                    <div className={styles.coinSelector} onClick={() => setShowCoinDrop(!showCoinDrop)}>
                      <div className={styles.coinSel}>
                        <div className={styles.coinIcon} style={{ background: coin.color + '22', color: coin.color }}>{coin.icon}</div>
                        <div>
                          <div className={styles.coinSymbol}>{coin.symbol}</div>
                          <div className={styles.coinName}>{coin.name}</div>
                        </div>
                      </div>
                      <div className={styles.coinPrice}>
                        <div>${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                        <div className={coin.change >= 0 ? styles.priceUp : styles.priceDown}>{coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%</div>
                      </div>
                      <ChevronDown size={16} className={`${styles.chevron} ${showCoinDrop ? styles.chevronUp : ''}`} />
                    </div>
                    {showCoinDrop && (
                      <div className={styles.coinDropdown}>
                        {COINS.map(c => (
                          <button key={c.symbol} className={`${styles.coinOption} ${coin.symbol === c.symbol ? styles.coinActive : ''}`}
                            onClick={() => { setCoin(c); setShowCoinDrop(false); }}>
                            <div className={styles.coinIcon} style={{ background: c.color + '22', color: c.color, width: 32, height: 32, fontSize: 13 }}>{c.icon}</div>
                            <div>
                              <div className={styles.coinSymbol}>{c.symbol}</div>
                              <div className={styles.coinName}>{c.name}</div>
                            </div>
                            <div className={`${styles.coinOptionChange} ${c.change >= 0 ? styles.priceUp : styles.priceDown}`}>{c.change >= 0 ? '+' : ''}{c.change.toFixed(2)}%</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Amount */}
                  <div className={styles.field}>
                    <label>Amount (USD)</label>
                    <div className={styles.amountPresets}>
                      {AMOUNTS_USD.map(a => (
                        <button key={a} className={`${styles.amtBtn} ${amountUSD === String(a) ? styles.amtActive : ''}`} onClick={() => setAmountUSD(String(a))}>
                          ${a}
                        </button>
                      ))}
                    </div>
                    <div className={styles.amountInput}>
                      <span className={styles.amountCurrency}>$</span>
                      <input
                        className={styles.amountField}
                        type="number"
                        value={amountUSD}
                        onChange={e => setAmountUSD(e.target.value)}
                        placeholder="Enter amount"
                        min="10"
                        id="buy-amount-input"
                      />
                      <span className={styles.amountUSD}>USD</span>
                    </div>
                    {amountUSD && parseFloat(amountUSD) > 0 && (
                      <div className={styles.youReceive}>
                        You receive ≈ <strong>{coinAmount} {coin.symbol}</strong>
                      </div>
                    )}
                  </div>

                  {/* Payment method */}
                  <div className={styles.field}>
                    <label>Payment Method</label>
                    <div className={styles.payMethods}>
                      {PAYMENT_METHODS.map(m => (
                        <button key={m.id}
                          className={`${styles.payMethod} ${payMethod.id === m.id ? styles.payMethodActive : ''}`}
                          onClick={() => setPayMethod(m)}
                        >
                          <span className={styles.payIcon}>{m.icon}</span>
                          <div>
                            <div className={styles.payLabel}>{m.label}</div>
                            <div className={styles.payMeta}>{m.fee} fee · {m.time}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card details (only for card/apple/google) */}
                  {payMethod.id === 'card' && (
                    <div className={styles.cardDetails}>
                      <div className={styles.cardHeader}>Card Details</div>
                      <div className={styles.cardFieldGroup}>
                        <div className={styles.cField}>
                          <label>Cardholder Name</label>
                          <input className={styles.cInput} placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className={styles.cField}>
                          <label>Card Number</label>
                          <input className={styles.cInput} placeholder="4242 4242 4242 4242" value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} maxLength={19} id="card-number-input" />
                        </div>
                        <div className={styles.cRow}>
                          <div className={styles.cField}>
                            <label>Expiry</label>
                            <input className={styles.cInput} placeholder="MM/YY" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} maxLength={5} />
                          </div>
                          <div className={styles.cField}>
                            <label>CVV</label>
                            <input className={styles.cInput} placeholder="123" type="password" value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} maxLength={3} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Fee summary */}
                  <div className={styles.feeSummary}>
                    <div className={styles.feeRow}><span>Subtotal</span><strong>${amountUSD || '0'}</strong></div>
                    <div className={styles.feeRow}><span>Fee ({payMethod.fee})</span><strong>${fee}</strong></div>
                    <div className={`${styles.feeRow} ${styles.feeTotal}`}><span>Total</span><strong className={styles.totalAmt}>${total}</strong></div>
                  </div>

                  <button
                    className={styles.buyBtn}
                    onClick={() => setStep('confirm')}
                    disabled={!amountUSD || parseFloat(amountUSD) < 10}
                    id="buy-continue-btn"
                  >
                    Continue to Buy {coin.symbol} <ArrowRight size={16} />
                  </button>

                  <div className={styles.secureNote}>
                    <ShieldCheck size={13} /> Secured by 256-bit SSL encryption · Regulated exchange
                  </div>
                </>
              )}

              {step === 'confirm' && (
                <>
                  <div className={styles.cardTitle}>Confirm Purchase</div>
                  <div className={styles.confirmSummary}>
                    <div className={styles.confirmCoinHeader}>
                      <div className={styles.coinIconLg} style={{ background: coin.color + '22', color: coin.color }}>{coin.icon}</div>
                      <div>
                        <div className={styles.confirmCoinName}>{coin.name}</div>
                        <div className={styles.confirmCoinAmt}>{coinAmount} {coin.symbol}</div>
                      </div>
                    </div>
                    <div className={styles.confirmRows}>
                      <div className={styles.feeRow}><span>Amount (USD)</span><strong>${amountUSD}</strong></div>
                      <div className={styles.feeRow}><span>Price per {coin.symbol}</span><strong>${coin.price < 1 ? coin.price.toFixed(4) : coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</strong></div>
                      <div className={styles.feeRow}><span>You Receive</span><strong>{coinAmount} {coin.symbol}</strong></div>
                      <div className={styles.feeRow}><span>Fee</span><strong>${fee}</strong></div>
                      <div className={styles.feeRow}><span>Payment Method</span><strong>{payMethod.label}</strong></div>
                      <div className={`${styles.feeRow} ${styles.feeTotal}`}><span>Total Charged</span><strong className={styles.totalAmt}>${total}</strong></div>
                    </div>
                  </div>
                  <div className={styles.confirmWarning}>
                    <AlertTriangle size={13} />
                    Crypto prices are volatile. The final amount may differ slightly due to price movements.
                  </div>
                  <div className={styles.confirmActions}>
                    <button className={styles.backBtn} onClick={() => setStep('form')}>← Edit</button>
                    <button className={styles.buyBtn} style={{ flex: 2 }} onClick={handleBuy} disabled={placing} id="buy-confirm-btn">
                      {placing ? <><Loader2 size={15} className={styles.spin} /> Processing...</> : `Confirm & Buy ${coin.symbol}`}
                    </button>
                  </div>
                </>
              )}

              {step === 'success' && (
                <div className={styles.successCard}>
                  <div className={styles.successAnim}>
                    <CheckCircle2 size={56} className={styles.successIcon} />
                  </div>
                  <h2 className={styles.successTitle}>Purchase Complete! 🎉</h2>
                  <p className={styles.successSub}>
                    You bought <strong>{coinAmount} {coin.symbol}</strong> for <strong>${total}</strong>
                  </p>
                  <div className={styles.receiptCard}>
                    <div className={styles.feeRow}><span>Transaction ID</span><strong className={styles.txId}>TXN-{Date.now().toString().slice(-7)}</strong></div>
                    <div className={styles.feeRow}><span>Asset</span><strong>{coinAmount} {coin.symbol}</strong></div>
                    <div className={styles.feeRow}><span>Added to Wallet</span><strong style={{ color: 'var(--green)' }}>✓ Confirmed</strong></div>
                    <div className={styles.feeRow}><span>Time</span><strong>{new Date().toLocaleString()}</strong></div>
                  </div>
                  <div className={styles.successActions}>
                    <button className={styles.anotherBtn} onClick={() => { setStep('form'); setAmountUSD('100'); }}>Buy More</button>
                    <Link href="/dashboard/wallet" className={styles.walletBtn}>View Wallet →</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Trust + trending */}
            <div className={styles.rightCol}>
              <div className={styles.trustCard}>
                <div className={styles.trustTitle}>Why Sumato?</div>
                <div className={styles.trustItems}>
                  <div className={styles.trustItem}><ShieldCheck size={18} className={styles.trustIcon} /><div><div className={styles.trustLabel}>Regulated & Secure</div><div className={styles.trustDesc}>Licensed exchange with cold storage protection</div></div></div>
                  <div className={styles.trustItem}><Zap size={18} className={styles.trustIcon} /><div><div className={styles.trustLabel}>Instant Delivery</div><div className={styles.trustDesc}>Crypto arrives in your wallet within seconds</div></div></div>
                  <div className={styles.trustItem}><CreditCard size={18} className={styles.trustIcon} /><div><div className={styles.trustLabel}>All Cards Accepted</div><div className={styles.trustDesc}>Visa, Mastercard, Amex, Apple Pay & more</div></div></div>
                </div>
              </div>

              <div className={styles.trendingCard}>
                <div className={styles.trendingTitle}>🔥 Trending Now</div>
                {COINS.slice(0, 5).map(c => (
                  <div key={c.symbol} className={styles.trendingRow} onClick={() => { setCoin(c); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                    <div className={styles.coinIcon} style={{ background: c.color + '22', color: c.color, width: 34, height: 34, fontSize: 14 }}>{c.icon}</div>
                    <div className={styles.trendingInfo}>
                      <div className={styles.trendingSymbol}>{c.symbol}</div>
                      <div className={styles.trendingName}>{c.name}</div>
                    </div>
                    <div className={styles.trendingRight}>
                      <div className={styles.trendingPrice}>${c.price < 1 ? c.price.toFixed(4) : c.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                      <div className={c.change >= 0 ? styles.priceUp : styles.priceDown}>{c.change >= 0 ? '+' : ''}{c.change.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
