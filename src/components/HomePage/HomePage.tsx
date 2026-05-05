'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight, Shield, TrendingUp, Globe, Zap, Users, Star, Bell,
  Download, Apple, Smartphone, ChevronRight, BarChart2,
  Coins, Gift, Layers, Lock, Award, Activity, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import styles from './HomePage.module.css';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: { price: number[] };
}

const STATS = [
  { label: 'Registered Users', value: '350M+', icon: Users },
  { label: 'Countries Supported', value: '180+', icon: Globe },
  { label: 'Daily Trading Volume', value: '$76B+', icon: BarChart2 },
  { label: 'Cryptocurrencies Listed', value: '350+', icon: Coins },
];

const PRODUCTS = [
  { icon: TrendingUp, label: 'Spot Trading', desc: 'Buy & sell 350+ crypto pairs', href: '/trade/BTC-USDT', color: '#fcd535' },
  { icon: Zap, label: 'Futures', desc: 'Trade with up to 125x leverage', href: '/futures', color: '#0ecb81' },
  { icon: Coins, label: 'Simple Earn', desc: 'Earn up to 23% APY on idle assets', href: '/earn', color: '#1da2b4' },
  { icon: Globe, label: 'P2P Trading', desc: 'Buy crypto with local payment', href: '/p2p', color: '#9b59b6' },
  { icon: Gift, label: 'Launchpad', desc: 'Invest in promising new tokens', href: '/launchpad', color: '#e67e22' },
  { icon: Layers, label: 'NFT Marketplace', desc: 'Explore & trade digital art', href: '/nft', color: '#e91e63' },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Industry-Leading Security',
    desc: 'Multi-layer and multi-cluster system architecture. Advanced data encryption and secure storage with SAFU protection fund.',
    color: '#0ecb81'
  },
  {
    icon: Activity,
    title: 'Lightning Fast Trading',
    desc: 'Process up to 1.4 million orders per second with ultra-low latency matching engine.',
    color: '#fcd535'
  },
  {
    icon: Lock,
    title: 'SAFU Fund',
    desc: '$1 billion+ emergency insurance fund to protect user assets in extreme scenarios.',
    color: '#1da2b4'
  },
  {
    icon: Award,
    title: 'Trusted Globally',
    desc: 'Regulated and licensed across multiple jurisdictions with transparent proof of reserves.',
    color: '#9b59b6'
  },
];

function Sparkline({ prices }: { prices: number[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !prices?.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width;
    const H = canvas.height;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;
    const isUp = prices[prices.length - 1] >= prices[0];
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    prices.forEach((p, i) => {
      const x = (i / (prices.length - 1)) * W;
      const y = H - ((p - min) / range) * H;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = isUp ? '#0ecb81' : '#f6465d';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [prices]);
  return <canvas ref={canvasRef} width={80} height={32} className={styles.sparkline} />;
}

export default function HomePageClient() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [activeTab, setActiveTab] = useState<'popular' | 'new' | 'gainers' | 'losers'>('popular');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h'
        );
        const data = await res.json();
        setCoins(data);
      } catch {
        setCoins(FALLBACK_COINS);
      } finally {
        setLoading(false);
      }
    };
    fetchMarkets();
    const iv = setInterval(fetchMarkets, 60000);
    return () => clearInterval(iv);
  }, []);

  const getFilteredCoins = () => {
    const sorted = [...coins];
    switch (activeTab) {
      case 'gainers': return sorted.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 6);
      case 'losers': return sorted.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 6);
      case 'new': return sorted.slice(40, 46);
      default: return sorted.slice(0, 6);
    }
  };

  const displayCoins = getFilteredCoins();

  return (
    <main className={styles.main}>
      {/* ========== HERO ========== */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              350M+ Users Trust Sumato Exchange
            </div>
            <h1 className={styles.heroTitle}>
              Buy & Trade Crypto<br />
              <span className={styles.heroAccent}>With Confidence</span>
            </h1>
            <p className={styles.heroDesc}>
              The world's leading crypto exchange. Trade 350+ cryptocurrencies with the lowest fees, deepest liquidity, and industry-leading security.
            </p>

            {/* Sign up form */}
            <div className={styles.heroForm}>
              <input
                type="email"
                placeholder="Email / Phone number"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={styles.heroInput}
                id="hero-email"
              />
              <Link href={`/register${email ? `?email=${encodeURIComponent(email)}` : ''}`} className={styles.heroBtn}>
                Get Started <ArrowRight size={16} />
              </Link>
            </div>
            <div className={styles.heroAlternative}>
              <span>Or sign up with</span>
              <button className={styles.socialBtn}>
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 19.026 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
                Google
              </button>
              <button className={styles.socialBtn}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.73-8.835L1.254 2.25H8.08l4.259 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter
              </button>
            </div>
          </div>

          {/* Hero Stats Card */}
          <div className={styles.heroRight}>
            <div className={styles.heroPriceCard}>
              <div className={styles.heroPriceHeader}>
                <div className={styles.heroCoinInfo}>
                  <div className={styles.heroCoinBg}>₿</div>
                  <div>
                    <div className={styles.heroCoinName}>Bitcoin</div>
                    <div className={styles.heroCoinSym}>BTC/USDT</div>
                  </div>
                </div>
                {coins[0] && (
                  <span className={`${styles.heroBadgePill} ${coins[0].price_change_percentage_24h >= 0 ? styles.pillGreen : styles.pillRed}`}>
                    {coins[0].price_change_percentage_24h >= 0 ? '+' : ''}{coins[0].price_change_percentage_24h?.toFixed(2)}%
                  </span>
                )}
              </div>
              <div className={styles.heroPriceVal}>
                ${coins[0]?.current_price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '67,432.50'}
              </div>
              {coins[0]?.sparkline_in_7d && (
                <div className={styles.heroSparkline}>
                  <Sparkline prices={coins[0].sparkline_in_7d.price} />
                </div>
              )}
              <div className={styles.heroPriceStats}>
                <div>
                  <div className={styles.statLabel}>24h High</div>
                  <div className={styles.statVal} style={{ color: 'var(--green)' }}>
                    ${((coins[0]?.current_price || 67432) * 1.025).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div>
                  <div className={styles.statLabel}>24h Low</div>
                  <div className={styles.statVal} style={{ color: 'var(--red)' }}>
                    ${((coins[0]?.current_price || 67432) * 0.975).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                </div>
                <div>
                  <div className={styles.statLabel}>24h Vol</div>
                  <div className={styles.statVal}>$42.8B</div>
                </div>
              </div>
              <Link href="/trade/BTC-USDT" className={styles.heroTradeBtn}>
                Trade Now <ArrowRight size={16} />
              </Link>
            </div>

            {/* Mini coins */}
            <div className={styles.miniCoins}>
              {coins.slice(1, 4).map(c => (
                <Link key={c.id} href={`/trade/${c.symbol.toUpperCase()}-USDT`} className={styles.miniCoin}>
                  {c.image && <img src={c.image} alt={c.name} className={styles.miniCoinImg} />}
                  <span className={styles.miniCoinSym}>{c.symbol.toUpperCase()}</span>
                  <span className={styles.miniCoinPrice}>
                    ${c.current_price < 1 ? c.current_price.toFixed(4) : c.current_price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </span>
                  <span className={`${styles.miniCoinChange} ${c.price_change_percentage_24h >= 0 ? styles.up : styles.down}`}>
                    {c.price_change_percentage_24h >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(c.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Animated background blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </section>

      {/* ========== STATS ========== */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statCard}>
                <div className={styles.statIcon}><s.icon size={24} /></div>
                <div className={styles.statCardValue}>{s.value}</div>
                <div className={styles.statCardLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== MARKETS ========== */}
      <section className={styles.marketsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Live Market Prices</h2>
              <p className="section-subtitle">Real-time cryptocurrency prices from global markets</p>
            </div>
            <Link href="/markets" className={styles.viewAll}>
              View All Markets <ChevronRight size={16} />
            </Link>
          </div>

          {/* Tabs */}
          <div className={styles.marketTabs}>
            {(['popular', 'new', 'gainers', 'losers'] as const).map(tab => (
              <button
                key={tab}
                className={`${styles.marketTab} ${activeTab === tab ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Coin Table */}
          <div className={styles.marketTable}>
            <div className={styles.tableHeader}>
              <div>Name</div>
              <div>Price</div>
              <div>24h Change</div>
              <div className="hide-mobile">Market Cap</div>
              <div className="hide-mobile">Volume (24h)</div>
              <div className="hide-mobile">7D Chart</div>
              <div>Action</div>
            </div>
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className={styles.skeletonRow}>
                  <div className={styles.skeletonCell} style={{ width: '180px', height: '20px' }} />
                  <div className={styles.skeletonCell} style={{ width: '100px', height: '20px' }} />
                  <div className={styles.skeletonCell} style={{ width: '80px', height: '20px' }} />
                </div>
              ))
            ) : displayCoins.map((coin) => {
              const pos = coin.price_change_percentage_24h >= 0;
              return (
                <div key={coin.id} className={styles.tableRow}>
                  <div className={styles.coinCell}>
                    <img src={coin.image} alt={coin.name} className={styles.coinImg} />
                    <div>
                      <div className={styles.coinName}>{coin.name}</div>
                      <div className={styles.coinSym}>{coin.symbol.toUpperCase()}/USDT</div>
                    </div>
                  </div>
                  <div className={styles.priceCell}>
                    ${coin.current_price < 1
                      ? coin.current_price.toFixed(5)
                      : coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`${styles.changeCell} ${pos ? styles.pos : styles.neg}`}>
                    {pos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {pos ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
                  </div>
                  <div className={`${styles.mcapCell} hide-mobile`}>
                    ${(coin.market_cap / 1e9).toFixed(2)}B
                  </div>
                  <div className={`${styles.volCell} hide-mobile`}>
                    ${(coin.total_volume / 1e9).toFixed(2)}B
                  </div>
                  <div className="hide-mobile">
                    {coin.sparkline_in_7d && <Sparkline prices={coin.sparkline_in_7d.price} />}
                  </div>
                  <div>
                    <Link href={`/trade/${coin.symbol.toUpperCase()}-USDT`} className={styles.tradeBtn}>
                      Trade
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== PRODUCTS ========== */}
      <section className={styles.productsSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Explore Our Products</h2>
              <p className="section-subtitle">One platform for all your crypto needs</p>
            </div>
          </div>
          <div className={styles.productsGrid}>
            {PRODUCTS.map((p) => (
              <Link key={p.label} href={p.href} className={styles.productCard}>
                <div className={styles.productIcon} style={{ background: `${p.color}22`, color: p.color }}>
                  <p.icon size={28} />
                </div>
                <h3 className={styles.productLabel}>{p.label}</h3>
                <p className={styles.productDesc}>{p.desc}</p>
                <div className={styles.productArrow} style={{ color: p.color }}>
                  Explore <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title">Why Choose Sumato?</h2>
            <p className="section-subtitle">Industry-leading technology with uncompromising security</p>
          </div>
          <div className={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon} style={{ background: `${f.color}22`, color: f.color }}>
                  <f.icon size={28} />
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== APP DOWNLOAD ========== */}
      <section className={styles.downloadSection}>
        <div className="container">
          <div className={styles.downloadGrid}>
            <div className={styles.downloadContent}>
              <h2 className={styles.downloadTitle}>
                Trade Anywhere,<br />
                <span style={{ color: 'var(--accent)' }}>Anytime</span>
              </h2>
              <p className={styles.downloadDesc}>
                Download the Sumato Exchange app and trade on the go. Available for iOS and Android with full feature parity.
              </p>
              <div className={styles.downloadBtns}>
                <button className={styles.storeBtn}>
                  <Apple size={24} />
                  <div>
                    <div className={styles.storeSub}>Download on</div>
                    <div className={styles.storeMain}>App Store</div>
                  </div>
                </button>
                <button className={styles.storeBtn}>
                  <Smartphone size={24} />
                  <div>
                    <div className={styles.storeSub}>Get it on</div>
                    <div className={styles.storeMain}>Google Play</div>
                  </div>
                </button>
              </div>
            </div>
            <div className={styles.downloadVisual}>
              <div className={styles.phoneFrame}>
                <div className={styles.phoneBg}>
                  <div className={styles.phoneContent}>
                    <div className={styles.phoneHeader}>
                      <span style={{ color: 'var(--accent)', fontWeight: 700 }}>SUMATO</span>
                      <Bell size={14} color="var(--text-secondary)" />
                    </div>
                    <div className={styles.phonePrice}>$67,432</div>
                    <div className={styles.phoneSub}>Bitcoin · +2.34%</div>
                    <div style={{ margin: '12px 0 8px', height: '1px', background: 'var(--border)' }} />
                    {['ETH', 'BNB', 'SOL', 'XRP'].map((s, i) => (
                      <div key={s} className={styles.phoneCoin}>
                        <span className={styles.phoneSym}>{s}</span>
                        <span className={styles.phoneP}>${[3521, 567, 178, 0.632][i].toLocaleString()}</span>
                        <span className={`${styles.phoneC} ${[true, true, true, false][i] ? styles.up : styles.down}`}>
                          {['+1.2%', '+0.8%', '+4.2%', '-1.4%'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Start Trading in Minutes</h2>
            <p className={styles.ctaDesc}>Join 350M+ users on the world's most trusted crypto exchange</p>
            <div className={styles.ctaBtns}>
              <Link href="/register" className="btn-primary" style={{ padding: '14px 32px', fontSize: '16px' }}>
                Create Free Account <ArrowRight size={18} />
              </Link>
              <Link href="/markets" className="btn-secondary" style={{ padding: '14px 32px', fontSize: '16px' }}>
                View Markets
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Fallback data
const FALLBACK_COINS: Coin[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', current_price: 67432.5, price_change_percentage_24h: 2.34, market_cap: 1327000000000, total_volume: 42800000000 },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', current_price: 3521.8, price_change_percentage_24h: -0.82, market_cap: 423000000000, total_volume: 18200000000 },
  { id: 'bnb', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', current_price: 567.2, price_change_percentage_24h: 1.12, market_cap: 82600000000, total_volume: 2100000000 },
  { id: 'solana', symbol: 'sol', name: 'Solana', image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png', current_price: 178.4, price_change_percentage_24h: 4.23, market_cap: 78100000000, total_volume: 4800000000 },
  { id: 'xrp', symbol: 'xrp', name: 'XRP', image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png', current_price: 0.632, price_change_percentage_24h: -1.45, market_cap: 35200000000, total_volume: 1900000000 },
  { id: 'cardano', symbol: 'ada', name: 'Cardano', image: 'https://assets.coingecko.com/coins/images/975/small/cardano.png', current_price: 0.485, price_change_percentage_24h: 0.78, market_cap: 17100000000, total_volume: 620000000 },
];
