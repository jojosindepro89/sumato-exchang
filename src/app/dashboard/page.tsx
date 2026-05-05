'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar/Navbar';
import {
  TrendingUp, TrendingDown, Wallet, BarChart2, ArrowUpRight,
  ArrowDownRight, Shield, Bell, Settings, ChevronRight,
  Clock, Gift, Zap, Copy, Eye, EyeOff
} from 'lucide-react';
import { useState } from 'react';
import styles from './dashboard.module.css';

const PORTFOLIO_HISTORY = [82000, 83100, 81500, 84200, 83800, 85100, 84291];

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const W = 120; const H = 40;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * H * 0.8 - H * 0.1;
    return `${x},${y}`;
  });
  const color = positive ? '#0ecb81' : '#f6465d';
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const RECENT_ORDERS = [
  { pair: 'BTC/USDT', type: 'Buy', price: 67100.0, amount: 0.05, total: 3355.0, status: 'Filled', time: '2 min ago' },
  { pair: 'ETH/USDT', type: 'Sell', price: 3498.2, amount: 1.2, total: 4197.84, status: 'Filled', time: '1h ago' },
  { pair: 'SOL/USDT', type: 'Buy', price: 180.5, amount: 5.0, total: 902.5, status: 'Open', time: '3h ago' },
  { pair: 'BNB/USDT', type: 'Sell', price: 562.1, amount: 2.0, total: 1124.2, status: 'Cancelled', time: '1d ago' },
];

const NOTIFICATIONS = [
  { icon: '📈', text: 'BTC rose 2.3% in the last hour', time: '5 min ago' },
  { icon: '💰', text: 'Your SOL order was filled at $180.50', time: '3h ago' },
  { icon: '🔐', text: 'New login from Chrome, Nigeria', time: '1d ago' },
  { icon: '🎁', text: 'You earned 0.01 BNB from referral bonus', time: '2d ago' },
];

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [hideBalance, setHideBalance] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  const totalUSD = user.portfolio.totalUSD;
  const positive = user.portfolio.change24hPct >= 0;

  const copyRef = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>

          {/* Welcome header */}
          <div className={styles.welcomeRow}>
            <div>
              <h1 className={styles.welcomeTitle}>Welcome back, {user.name.split(' ')[0]} 👋</h1>
              <p className={styles.welcomeSub}>Here's your portfolio overview</p>
            </div>
            <div className={styles.welcomeActions}>
              <Link href="/dashboard/kyc" className={`${styles.actionBtn} ${user.kycStatus === 'verified' ? styles.actionBtnVerified : styles.actionBtnWarn}`}>
                <Shield size={14} />
                {user.kycStatus === 'verified' ? 'KYC Verified' : 'Complete KYC'}
              </Link>
              <Link href="/dashboard/settings" className={styles.iconActionBtn}>
                <Settings size={16} />
              </Link>
            </div>
          </div>

          {/* Top cards */}
          <div className={styles.topGrid}>
            {/* Portfolio card */}
            <div className={styles.portfolioCard}>
              <div className={styles.portfolioCardHeader}>
                <div>
                  <div className={styles.portfolioLabel}>
                    Total Portfolio Value
                    <button className={styles.eyeBtn} onClick={() => setHideBalance(!hideBalance)}>
                      {hideBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                  <div className={styles.portfolioAmount}>
                    {hideBalance ? '••••••' : `$${totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </div>
                  <div className={`${styles.portfolioChange} ${positive ? styles.pos : styles.neg}`}>
                    {positive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {positive ? '+' : ''}${user.portfolio.change24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    <span>({positive ? '+' : ''}{user.portfolio.change24hPct.toFixed(2)}%)</span>
                    <span className={styles.period}>24h</span>
                  </div>
                </div>
                <MiniSparkline data={PORTFOLIO_HISTORY} positive={positive} />
              </div>
              <div className={styles.portfolioActions}>
                <button className={styles.depositBtn}><ArrowDownRight size={14} /> Deposit</button>
                <button className={styles.withdrawBtn}><ArrowUpRight size={14} /> Withdraw</button>
                <button className={styles.transferBtn}>Transfer</button>
              </div>
            </div>

            {/* Quick stats */}
            <div className={styles.quickStats}>
              <div className={styles.quickStat}>
                <div className={styles.qsIcon} style={{ background: 'rgba(252,213,53,0.12)', color: 'var(--accent)' }}>
                  <Wallet size={20} />
                </div>
                <div>
                  <div className={styles.qsLabel}>Spot Balance</div>
                  <div className={styles.qsValue}>{hideBalance ? '••••' : '$' + totalUSD.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                </div>
              </div>
              <div className={styles.quickStat}>
                <div className={styles.qsIcon} style={{ background: 'rgba(14,203,129,0.12)', color: 'var(--green)' }}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div className={styles.qsLabel}>Futures PnL (Today)</div>
                  <div className={styles.qsValue} style={{ color: 'var(--green)' }}>+$284.12</div>
                </div>
              </div>
              <div className={styles.quickStat}>
                <div className={styles.qsIcon} style={{ background: 'rgba(99,126,234,0.12)', color: '#627eea' }}>
                  <Gift size={20} />
                </div>
                <div>
                  <div className={styles.qsLabel}>Earn Rewards</div>
                  <div className={styles.qsValue}>{hideBalance ? '••••' : '$12.48'}</div>
                </div>
              </div>
              <div className={styles.quickStat}>
                <div className={styles.qsIcon} style={{ background: 'rgba(246,70,93,0.12)', color: 'var(--red)' }}>
                  <Zap size={20} />
                </div>
                <div>
                  <div className={styles.qsLabel}>Open Orders</div>
                  <div className={styles.qsValue}>3</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mainGrid}>
            {/* Assets */}
            <div className={styles.assetsSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>My Assets</h2>
                <Link href="/dashboard/wallet" className={styles.viewAll}>View All <ChevronRight size={14} /></Link>
              </div>
              <div className={styles.assetsList}>
                <div className={styles.assetsHeader}>
                  <span>Asset</span>
                  <span>Price</span>
                  <span className={styles.hideSmall}>Holdings</span>
                  <span>24h</span>
                  <span className={styles.hideSmall}>Value</span>
                  <span></span>
                </div>
                {user.portfolio.assets.map(asset => {
                  const pos = asset.change24h >= 0;
                  const value = asset.amount * asset.price;
                  return (
                    <div key={asset.symbol} className={styles.assetRow}>
                      <div className={styles.assetInfo}>
                        <div className={styles.assetLogo} style={{ background: asset.color + '22', border: `1px solid ${asset.color}44` }}>
                          <img src={asset.logoUrl} alt={asset.name} width={22} height={22} />
                        </div>
                        <div>
                          <div className={styles.assetSymbol}>{asset.symbol}</div>
                          <div className={styles.assetName}>{asset.name}</div>
                        </div>
                      </div>
                      <div className={styles.assetPrice}>
                        ${asset.price < 1 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={`${styles.assetHolding} ${styles.hideSmall}`}>
                        {asset.amount.toFixed(asset.amount < 1 ? 4 : 2)}
                      </div>
                      <div className={`${styles.assetChange} ${pos ? styles.pos : styles.neg}`}>
                        {pos ? '+' : ''}{asset.change24h.toFixed(2)}%
                      </div>
                      <div className={`${styles.assetValue} ${styles.hideSmall}`}>
                        {hideBalance ? '••••' : '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className={styles.assetAction}>
                        <Link href={`/trade/${asset.symbol}-USDT`} className={styles.tradeBtn}>Trade</Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right sidebar */}
            <div className={styles.sidebar}>
              {/* Recent orders */}
              <div className={styles.sideCard}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sideTitle}>Recent Orders</h3>
                  <Link href="/dashboard/orders" className={styles.viewAll}>All <ChevronRight size={14} /></Link>
                </div>
                <div className={styles.ordersList}>
                  {RECENT_ORDERS.map((order, i) => (
                    <div key={i} className={styles.orderItem}>
                      <div className={styles.orderLeft}>
                        <span className={`${styles.orderSide} ${order.type === 'Buy' ? styles.buy : styles.sell}`}>{order.type}</span>
                        <div>
                          <div className={styles.orderPair}>{order.pair}</div>
                          <div className={styles.orderTime}><Clock size={10} /> {order.time}</div>
                        </div>
                      </div>
                      <div className={styles.orderRight}>
                        <div className={styles.orderTotal}>${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div className={`${styles.orderStatus} ${styles['status_' + order.status.toLowerCase()]}`}>{order.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div className={styles.sideCard}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sideTitle}>Notifications</h3>
                  <Bell size={14} className={styles.bellIcon} />
                </div>
                <div className={styles.notifList}>
                  {NOTIFICATIONS.map((n, i) => (
                    <div key={i} className={styles.notifItem}>
                      <span className={styles.notifIcon}>{n.icon}</span>
                      <div className={styles.notifText}>
                        <span>{n.text}</span>
                        <span className={styles.notifTime}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referral */}
              <div className={styles.referralCard}>
                <div className={styles.referralTitle}>🎁 Refer & Earn</div>
                <div className={styles.referralDesc}>Share your code and earn 20% commission on each trade</div>
                <div className={styles.referralCode}>
                  <span>{user.referralCode}</span>
                  <button className={styles.copyCodeBtn} onClick={copyRef}>
                    {copied ? '✓' : <Copy size={13} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.quickLinks}>
            {[
              { icon: TrendingUp, label: 'Spot Trading', desc: 'Buy & sell crypto', href: '/trade/BTC-USDT', color: '#fcd535' },
              { icon: Zap, label: 'Futures', desc: 'Up to 125x leverage', href: '/futures', color: '#627eea' },
              { icon: Gift, label: 'Simple Earn', desc: 'Earn daily rewards', href: '/earn', color: '#0ecb81' },
              { icon: BarChart2, label: 'Markets', desc: 'Live crypto prices', href: '/markets', color: '#f0b90b' },
            ].map(q => (
              <Link key={q.label} href={q.href} className={styles.quickLink}>
                <div className={styles.qlIcon} style={{ background: q.color + '22', color: q.color }}>
                  <q.icon size={22} />
                </div>
                <div className={styles.qlLabel}>{q.label}</div>
                <div className={styles.qlDesc}>{q.desc}</div>
                <ChevronRight size={14} className={styles.qlArrow} />
              </Link>
            ))}
          </div>

        </div>
      </main>
    </>
  );
}
