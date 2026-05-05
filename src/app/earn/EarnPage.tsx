'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Coins, Lock, Zap, ArrowRight, TrendingUp, Search } from 'lucide-react';
import styles from './EarnPage.module.css';

const PRODUCTS = [
  { coin: 'USDT', name: 'Tether', type: 'flexible', apy: 8.2, minAmount: 1, icon: '₮', color: '#26a17b' },
  { coin: 'USDC', name: 'USD Coin', type: 'flexible', apy: 7.8, minAmount: 1, icon: '$', color: '#2775ca' },
  { coin: 'BTC', name: 'Bitcoin', type: 'flexible', apy: 1.5, minAmount: 0.001, icon: '₿', color: '#fcd535' },
  { coin: 'ETH', name: 'Ethereum', type: 'flexible', apy: 3.2, minAmount: 0.01, icon: 'Ξ', color: '#627eea' },
  { coin: 'BNB', name: 'BNB', type: 'locked', apy: 12.5, minAmount: 0.1, duration: '30 Days', icon: 'B', color: '#f0b90b' },
  { coin: 'SOL', name: 'Solana', type: 'locked', apy: 9.8, minAmount: 0.1, duration: '30 Days', icon: '◎', color: '#9945ff' },
  { coin: 'ADA', name: 'Cardano', type: 'locked', apy: 15.3, minAmount: 10, duration: '60 Days', icon: '₳', color: '#0033ad' },
  { coin: 'MATIC', name: 'Polygon', type: 'locked', apy: 18.7, minAmount: 5, duration: '90 Days', icon: 'M', color: '#8247e5' },
  { coin: 'DOT', name: 'Polkadot', type: 'locked', apy: 14.2, minAmount: 1, duration: '60 Days', icon: '●', color: '#e6007a' },
  { coin: 'AVAX', name: 'Avalanche', type: 'locked', apy: 11.5, minAmount: 0.5, duration: '30 Days', icon: 'A', color: '#e84142' },
  { coin: 'NEAR', name: 'NEAR Protocol', type: 'locked', apy: 23.0, minAmount: 5, duration: '90 Days', icon: 'N', color: '#00ec97' },
  { coin: 'LINK', name: 'Chainlink', type: 'locked', apy: 6.8, minAmount: 1, duration: '30 Days', icon: '⬡', color: '#375bd2' },
];

const STATS = [
  { label: 'Total Value Locked', value: '$48.2B', sub: 'Across all products' },
  { label: 'Users Earning', value: '14.8M+', sub: 'Active savers' },
  { label: 'Max APY Available', value: '23.0%', sub: 'NEAR 90-day lock' },
  { label: 'Products Available', value: '150+', sub: 'Coins & tokens' },
];

export default function EarnPage() {
  const [activeType, setActiveType] = useState<'all' | 'flexible' | 'locked'>('all');
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter(p => {
    const typeMatch = activeType === 'all' || p.type === activeType;
    const searchMatch = p.coin.toLowerCase().includes(search.toLowerCase()) || p.name.toLowerCase().includes(search.toLowerCase());
    return typeMatch && searchMatch;
  });

  return (
    <main className={styles.main}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <TrendingUp size={14} />
              Earn up to 23% APY on your crypto
            </div>
            <h1 className={styles.heroTitle}>
              Make Your Crypto<br />
              <span className={styles.accent}>Work For You</span>
            </h1>
            <p className={styles.heroDesc}>
              Simple Earn lets you earn daily rewards on your crypto holdings. 
              Choose flexible or fixed-term products to maximize your yields.
            </p>
            <div className={styles.heroStats}>
              {STATS.map(s => (
                <div key={s.label} className={styles.heroStat}>
                  <div className={styles.heroStatVal}>{s.value}</div>
                  <div className={styles.heroStatLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className={styles.productsSection}>
        <div className="container-wide">
          <div className={styles.filters}>
            <div className={styles.filterTabs}>
              {(['all', 'flexible', 'locked'] as const).map(t => (
                <button
                  key={t}
                  className={`${styles.filterTab} ${activeType === t ? styles.filterActive : ''}`}
                  onClick={() => setActiveType(t)}
                >
                  {t === 'all' ? 'All Products' : t === 'flexible' ? <><Zap size={14} /> Flexible</> : <><Lock size={14} /> Fixed-Term</>}
                </button>
              ))}
            </div>
            <div className={styles.searchWrap}>
              <Search size={14} />
              <input
                placeholder="Search asset..."
                className={styles.searchInput}
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="earn-search"
              />
            </div>
          </div>

          {/* Table header */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <div>Asset</div>
              <div>Type</div>
              <div>APY / APR</div>
              <div>Duration</div>
              <div>Min. Amount</div>
              <div>Action</div>
            </div>

            {filtered.map(p => (
              <div key={`${p.coin}-${p.type}`} className={styles.tableRow}>
                <div className={styles.assetCell}>
                  <div className={styles.coinIcon} style={{ background: `${p.color}22`, color: p.color }}>
                    {p.icon}
                  </div>
                  <div>
                    <div className={styles.coinName}>{p.coin}</div>
                    <div className={styles.coinFull}>{p.name}</div>
                  </div>
                </div>
                <div>
                  <span className={`${styles.typeBadge} ${p.type === 'flexible' ? styles.flexBadge : styles.lockBadge}`}>
                    {p.type === 'flexible' ? <><Zap size={11} /> Flexible</> : <><Lock size={11} /> Fixed</>}
                  </span>
                </div>
                <div className={styles.apyCell}>
                  <span className={styles.apyVal}>{p.apy.toFixed(1)}%</span>
                  <span className={styles.apySub}>APY</span>
                </div>
                <div className={styles.durationCell}>
                  {p.type === 'flexible' ? <span className={styles.flexDur}>Anytime</span> : <span className={styles.lockDur}>{p.duration}</span>}
                </div>
                <div className={styles.minCell}>
                  {p.minAmount} {p.coin}
                </div>
                <div>
                  <Link href="/login" className={styles.subscribeBtn}>
                    Subscribe <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className={styles.howSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How Simple Earn Works</h2>
          <div className={styles.stepsGrid}>
            {[
              { step: '01', icon: Coins, title: 'Choose a Product', desc: 'Select from flexible or fixed-term savings products across 150+ cryptocurrencies.' },
              { step: '02', icon: Lock, title: 'Deposit Crypto', desc: 'Enter the amount you want to earn on. No minimums for most flexible products.' },
              { step: '03', icon: TrendingUp, title: 'Earn Daily Rewards', desc: 'Rewards are distributed daily to your spot wallet automatically.' },
            ].map(s => (
              <div key={s.step} className={styles.stepCard}>
                <div className={styles.stepNum}>{s.step}</div>
                <div className={styles.stepIcon}><s.icon size={28} /></div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
