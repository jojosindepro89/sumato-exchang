'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar/Navbar';
import { ArrowDownRight, ArrowUpRight, ChevronRight, Eye, EyeOff, TrendingUp, Copy } from 'lucide-react';
import styles from './wallet.module.css';

const TX_HISTORY = [
  { type: 'Deposit', asset: 'BTC', amount: '+0.5000', usd: '+$33,716', status: 'Completed', date: '2026-05-04 14:32', hash: '0x7a3b...f91c' },
  { type: 'Withdraw', asset: 'USDT', amount: '-1,000.00', usd: '-$1,000', status: 'Completed', date: '2026-05-03 09:18', hash: '0x2d8c...a44f' },
  { type: 'Deposit', asset: 'ETH', amount: '+2.0000', usd: '+$7,044', status: 'Completed', date: '2026-05-02 20:05', hash: '0x5e1f...c22b' },
  { type: 'Withdraw', asset: 'BNB', amount: '-5.0000', usd: '-$2,836', status: 'Completed', date: '2026-05-01 11:43', hash: '0x9c4a...d77e' },
  { type: 'Deposit', asset: 'SOL', amount: '+10.000', usd: '+$1,854', status: 'Pending', date: '2026-05-05 08:12', hash: '0x3f6d...b08a' },
];

export default function WalletPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [hide, setHide] = useState(false);
  const [tab, setTab] = useState<'spot' | 'futures' | 'earn'>('spot');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push('/login');
  }, [isLoading, isLoggedIn, router]);

  if (!user) return null;

  const total = user.portfolio.totalUSD;
  const positive = user.portfolio.change24hPct >= 0;

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>

          <div className={styles.breadcrumb}>
            <Link href="/dashboard" className={styles.breadLink}>Dashboard</Link>
            <ChevronRight size={13} />
            <span>My Wallet</span>
          </div>

          {/* Balance overview */}
          <div className={styles.balanceCard}>
            <div className={styles.balanceLeft}>
              <div className={styles.balanceLabel}>
                Total Balance
                <button className={styles.eyeBtn} onClick={() => setHide(!hide)}>
                  {hide ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <div className={styles.balanceAmount}>
                {hide ? '••••••' : `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                <span className={styles.balanceCurrency}>USD</span>
              </div>
              <div className={`${styles.balanceChange} ${positive ? styles.pos : styles.neg}`}>
                {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {positive ? '+' : ''}${user.portfolio.change24h.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                ({positive ? '+' : ''}{user.portfolio.change24hPct.toFixed(2)}%) today
              </div>
            </div>
            <div className={styles.balanceActions}>
              <button className={styles.depositBtn}><ArrowDownRight size={14} /> Deposit</button>
              <button className={styles.withdrawBtn}><ArrowUpRight size={14} /> Withdraw</button>
              <button className={styles.transferBtn}>Transfer</button>
              <button className={styles.historyBtn}><TrendingUp size={14} /> History</button>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {(['spot', 'futures', 'earn'] as const).map(t => (
              <button key={t} className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`} onClick={() => setTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Asset list */}
          <div className={styles.assetsCard}>
            <div className={styles.assetsHeader}>
              <span>Asset</span>
              <span>Price</span>
              <span>Available</span>
              <span>Value (USD)</span>
              <span>24h Change</span>
              <span>Action</span>
            </div>
            {user.portfolio.assets.map(asset => {
              const pos = asset.change24h >= 0;
              const value = asset.amount * asset.price;
              const pct = (value / total) * 100;
              return (
                <div key={asset.symbol} className={styles.assetRow}>
                  <div className={styles.assetInfo}>
                    <img src={asset.logoUrl} alt={asset.name} width={32} height={32} className={styles.assetImg} />
                    <div>
                      <div className={styles.assetSym}>{asset.symbol}</div>
                      <div className={styles.assetNm}>{asset.name}</div>
                    </div>
                  </div>
                  <div className={styles.assetPrice}>
                    ${asset.price < 1 ? asset.price.toFixed(4) : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={styles.assetAmt}>
                    <div>{hide ? '••••' : asset.amount.toFixed(asset.amount < 1 ? 4 : 2)}</div>
                    <div className={styles.assetBar}>
                      <div className={styles.assetBarFill} style={{ width: `${pct}%`, background: asset.color }} />
                    </div>
                    <div className={styles.assetPct}>{pct.toFixed(1)}%</div>
                  </div>
                  <div className={styles.assetValue}>
                    {hide ? '••••' : '$' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`${styles.assetChg} ${pos ? styles.pos : styles.neg}`}>
                    {pos ? '+' : ''}{asset.change24h.toFixed(2)}%
                  </div>
                  <div className={styles.assetActions}>
                    <Link href={`/trade/${asset.symbol}-USDT`} className={styles.tradeBtn}>Trade</Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Transaction history */}
          <div className={styles.historySection}>
            <h2 className={styles.historyTitle}>Transaction History</h2>
            <div className={styles.historyCard}>
              <div className={styles.historyHeader}>
                <span>Type</span>
                <span>Asset</span>
                <span>Amount</span>
                <span>USD Value</span>
                <span>Date</span>
                <span>Status</span>
                <span>Hash</span>
              </div>
              {TX_HISTORY.map((tx, i) => (
                <div key={i} className={styles.historyRow}>
                  <div className={`${styles.txType} ${tx.type === 'Deposit' ? styles.txDeposit : styles.txWithdraw}`}>{tx.type}</div>
                  <div className={styles.txAsset}>{tx.asset}</div>
                  <div className={`${styles.txAmount} ${tx.type === 'Deposit' ? styles.pos : styles.neg}`}>{tx.amount}</div>
                  <div className={styles.txUsd}>{tx.usd}</div>
                  <div className={styles.txDate}>{tx.date}</div>
                  <div className={`${styles.txStatus} ${tx.status === 'Completed' ? styles.statusOk : styles.statusPending}`}>{tx.status}</div>
                  <div className={styles.txHash}>
                    <span>{tx.hash}</span>
                    <button className={styles.copyHashBtn} onClick={() => { navigator.clipboard.writeText(tx.hash); setCopiedIdx(i); setTimeout(() => setCopiedIdx(null), 1500); }}>
                      {copiedIdx === i ? '✓' : <Copy size={11} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
