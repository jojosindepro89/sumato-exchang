'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { Search, ArrowUpDown, ArrowUpRight, ArrowDownRight, Star, TrendingUp } from 'lucide-react';
import styles from './MarketsPage.module.css';

interface Coin {
  id: string; symbol: string; name: string; image: string;
  current_price: number; price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap: number; total_volume: number;
  sparkline_in_7d?: { price: number[] };
  market_cap_rank: number;
}

const CATEGORIES = ['All', 'Spot', 'Futures', 'New Listings', 'Gainers', 'Losers', 'DeFi', 'Layer 1', 'Layer 2'];

function Sparkline({ prices, up }: { prices: number[]; up: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !prices?.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const W = canvas.width; const H = canvas.height;
    const min = Math.min(...prices); const max = Math.max(...prices);
    const range = max - min || 1;
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    prices.forEach((p, i) => {
      const x = (i / (prices.length - 1)) * W;
      const y = H - ((p - min) / range) * H;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.strokeStyle = up ? '#0ecb81' : '#f6465d';
    ctx.lineWidth = 1.5; ctx.stroke();
  }, [prices, up]);
  return <canvas ref={canvasRef} width={80} height={32} />;
}

export default function MarketsPage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortField, setSortField] = useState('market_cap_rank');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetch7d = async () => {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${page}&sparkline=true&price_change_percentage=7d`
        );
        const data = await res.json();
        if (Array.isArray(data)) setCoins(data);
      } catch {
        setCoins(FALLBACK);
      } finally {
        setLoading(false);
      }
    };
    fetch7d();
  }, [page]);

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const toggleWatch = (id: string) => {
    setWatchlist(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  let displayed = [...coins];
  if (search) displayed = displayed.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.symbol.toLowerCase().includes(search.toLowerCase())
  );
  if (category === 'Gainers') displayed = displayed.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  else if (category === 'Losers') displayed = displayed.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
  else {
    displayed.sort((a: any, b: any) => {
      const av = a[sortField] ?? 0; const bv = b[sortField] ?? 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
  }

  const SortIcon = ({ field }: { field: string }) => (
    <ArrowUpDown size={12} className={`${styles.sortIcon} ${sortField === field ? styles.sortActive : ''}`} />
  );

  return (
    <main className={styles.main}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container-wide">
          <div className={styles.headerInner}>
            <div>
              <h1 className={styles.title}>Cryptocurrency Markets</h1>
              <p className={styles.subtitle}>Live prices, market caps, and trading volumes for {coins.length}+ cryptocurrencies</p>
            </div>
            <div className={styles.searchWrap}>
              <Search size={16} className={styles.searchIcon} />
              <input
                id="markets-search"
                className={styles.searchInput}
                placeholder="Search coin or symbol..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Category tabs */}
          <div className={styles.catTabs}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`${styles.catTab} ${category === cat ? styles.catActive : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat === 'Gainers' && <TrendingUp size={12} />}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="container-wide">
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.thRank}>#</div>
            <div className={styles.thName}>Name</div>
            <div className={`${styles.thSortable} ${styles.thPrice}`} onClick={() => handleSort('current_price')}>
              Price <SortIcon field="current_price" />
            </div>
            <div className={`${styles.thSortable} ${styles.thChange}`} onClick={() => handleSort('price_change_percentage_24h')}>
              24h % <SortIcon field="price_change_percentage_24h" />
            </div>
            <div className={`${styles.thSortable} ${styles.th7d} hide-mobile`} onClick={() => handleSort('price_change_percentage_7d_in_currency')}>
              7d % <SortIcon field="price_change_percentage_7d_in_currency" />
            </div>
            <div className={`${styles.thSortable} ${styles.thMcap} hide-mobile`} onClick={() => handleSort('market_cap')}>
              Market Cap <SortIcon field="market_cap" />
            </div>
            <div className={`${styles.thSortable} ${styles.thVol} hide-mobile`} onClick={() => handleSort('total_volume')}>
              Volume (24h) <SortIcon field="total_volume" />
            </div>
            <div className={`${styles.thChart} hide-mobile`}>7D Chart</div>
            <div className={styles.thAction}>Action</div>
          </div>

          {loading ? (
            Array(20).fill(0).map((_, i) => (
              <div key={i} className={styles.skeletonRow}>
                {Array(5).fill(0).map((_, j) => (
                  <div key={j} className={styles.skeletonCell} style={{ width: `${60 + j * 20}px` }} />
                ))}
              </div>
            ))
          ) : displayed.map((coin) => {
            const pos24 = coin.price_change_percentage_24h >= 0;
            const pos7d = (coin.price_change_percentage_7d_in_currency || 0) >= 0;
            return (
              <div key={coin.id} className={styles.tableRow}>
                <div className={styles.rankCell}>
                  <button
                    className={`${styles.starBtn} ${watchlist.has(coin.id) ? styles.starActive : ''}`}
                    onClick={() => toggleWatch(coin.id)}
                    aria-label="Watchlist"
                  >
                    <Star size={13} fill={watchlist.has(coin.id) ? 'var(--accent)' : 'none'} />
                  </button>
                  <span className={styles.rank}>{coin.market_cap_rank}</span>
                </div>
                <div className={styles.nameCell}>
                  {coin.image && <img src={coin.image} alt={coin.name} className={styles.coinImg} width={32} height={32} />}
                  <div>
                    <div className={styles.coinName}>{coin.name}</div>
                    <div className={styles.coinSym}>{coin.symbol.toUpperCase()}</div>
                  </div>
                </div>
                <div className={styles.priceCell}>
                  ${coin.current_price < 0.01
                    ? coin.current_price.toFixed(8)
                    : coin.current_price < 1
                    ? coin.current_price.toFixed(5)
                    : coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={`${styles.changeCell} ${pos24 ? styles.pos : styles.neg}`}>
                  {pos24 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {pos24 ? '+' : ''}{coin.price_change_percentage_24h?.toFixed(2)}%
                </div>
                <div className={`${styles.change7dCell} hide-mobile ${pos7d ? styles.pos : styles.neg}`}>
                  {pos7d ? '+' : ''}{(coin.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                </div>
                <div className={`${styles.mcapCell} hide-mobile`}>
                  ${coin.market_cap >= 1e12
                    ? (coin.market_cap / 1e12).toFixed(2) + 'T'
                    : coin.market_cap >= 1e9
                    ? (coin.market_cap / 1e9).toFixed(2) + 'B'
                    : (coin.market_cap / 1e6).toFixed(2) + 'M'}
                </div>
                <div className={`${styles.volCell} hide-mobile`}>
                  ${coin.total_volume >= 1e9
                    ? (coin.total_volume / 1e9).toFixed(2) + 'B'
                    : (coin.total_volume / 1e6).toFixed(2) + 'M'}
                </div>
                <div className="hide-mobile">
                  {coin.sparkline_in_7d && <Sparkline prices={coin.sparkline_in_7d.price} up={pos7d} />}
                </div>
                <div className={styles.actionCell}>
                  <Link href={`/trade/${coin.symbol.toUpperCase()}-USDT`} className={styles.tradeBtn}>
                    Trade
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button className={styles.pageBtn} onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}>← Prev</button>
          {[1,2,3,4,5].map(p => (
            <button key={p} className={`${styles.pageBtn} ${page === p ? styles.pageActive : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className={styles.pageBtn} onClick={() => setPage(p => p+1)}>Next →</button>
        </div>
      </div>
    </main>
  );
}

const FALLBACK: Coin[] = [
  { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png', current_price: 67432.5, price_change_percentage_24h: 2.34, market_cap: 1327000000000, total_volume: 42800000000, market_cap_rank: 1 },
  { id: 'ethereum', symbol: 'eth', name: 'Ethereum', image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png', current_price: 3521.8, price_change_percentage_24h: -0.82, market_cap: 423000000000, total_volume: 18200000000, market_cap_rank: 2 },
  { id: 'bnb', symbol: 'bnb', name: 'BNB', image: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png', current_price: 567.2, price_change_percentage_24h: 1.12, market_cap: 82600000000, total_volume: 2100000000, market_cap_rank: 3 },
];
