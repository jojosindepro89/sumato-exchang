'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Search, ChevronDown, ArrowUpRight, ArrowDownRight, X, CheckCircle2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import OrderBook from '@/components/Trading/OrderBook';
import TradeHistory from '@/components/Trading/TradeHistory';
import TradeForm, { PlacedOrder } from '@/components/Trading/TradeForm';
import styles from './TradePage.module.css';

const TradingChart = dynamic(() => import('@/components/Trading/TradingChart'), { ssr: false });

const POPULAR_PAIRS = [
  { symbol: 'BTC-USDT', price: 67432.5, change: 2.34, base: 67000 },
  { symbol: 'ETH-USDT', price: 3521.8, change: -0.82, base: 3500 },
  { symbol: 'BNB-USDT', price: 567.2, change: 1.12, base: 560 },
  { symbol: 'SOL-USDT', price: 178.4, change: 4.23, base: 175 },
  { symbol: 'XRP-USDT', price: 0.6321, change: -1.45, base: 0.63 },
  { symbol: 'ADA-USDT', price: 0.4851, change: 0.78, base: 0.48 },
  { symbol: 'DOGE-USDT', price: 0.1562, change: -2.10, base: 0.155 },
  { symbol: 'AVAX-USDT', price: 38.72, change: 3.12, base: 38 },
  { symbol: 'LINK-USDT', price: 18.34, change: 5.67, base: 18 },
  { symbol: 'DOT-USDT', price: 7.82, change: 0.45, base: 7.8 },
  { symbol: 'MATIC-USDT', price: 0.892, change: -3.21, base: 0.89 },
  { symbol: 'LTC-USDT', price: 89.45, change: 1.87, base: 89 },
  { symbol: 'UNI-USDT', price: 12.34, change: 2.56, base: 12 },
  { symbol: 'ATOM-USDT', price: 10.21, change: -0.34, base: 10 },
  { symbol: 'NEAR-USDT', price: 7.65, change: 6.78, base: 7.5 },
];

interface Stats {
  price: number; change: number; high: number; low: number; volume: number; quoteVol: number;
}

export default function TradePage() {
  const params = useParams();
  const pairParam = (params?.pair as string) || 'BTC-USDT';
  const pair = pairParam.replace('_', '-').toUpperCase();
  const pairInfo = POPULAR_PAIRS.find(p => p.symbol === pair) || POPULAR_PAIRS[0];

  const [stats, setStats] = useState<Stats>({
    price: pairInfo.price,
    change: pairInfo.change,
    high: pairInfo.price * 1.025,
    low: pairInfo.price * 0.975,
    volume: 42800,
    quoteVol: 2890000000,
  });
  const [searchPair, setSearchPair] = useState('');
  const [activePanel, setActivePanel] = useState<'orderbook' | 'trades'>('orderbook');
  const [activeOrders, setActiveOrders] = useState<'open' | 'history' | 'funds'>('open');
  const [currentPrice, setCurrentPrice] = useState(pairInfo.price);
  const [openOrders, setOpenOrders] = useState<PlacedOrder[]>([]);
  const [orderHistory, setOrderHistory] = useState<PlacedOrder[]>([]);

  const handleOrderPlaced = (order: PlacedOrder) => {
    if (order.status === 'filled') {
      setOrderHistory(prev => [order, ...prev]);
    } else {
      setOpenOrders(prev => [order, ...prev]);
      // Simulate fill after 8 seconds for limit orders
      setTimeout(() => {
        setOpenOrders(prev => prev.filter(o => o.id !== order.id));
        setOrderHistory(prev => [{ ...order, status: 'filled' }, ...prev]);
      }, 8000);
    }
  };

  const cancelOrder = (id: string) => {
    setOpenOrders(prev => prev.filter(o => o.id !== id));
  };

  const base = pair.split('-')[0];
  const quote = pair.split('-')[1] || 'USDT';

  useEffect(() => {
    const iv = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.49) * pairInfo.base * 0.001;
        return prev + change;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [pairInfo.base]);

  const filteredPairs = POPULAR_PAIRS.filter(p =>
    p.symbol.toLowerCase().includes(searchPair.toLowerCase())
  );

  return (
    <div className={styles.tradePage}>
      {/* Top bar */}
      <div className={styles.topBar}>
        {/* Pair info */}
        <div className={styles.pairInfo}>
          <div className={styles.pairSelector}>
            <span className={styles.pairBase}>{base}</span>
            <span className={styles.pairQuote}>/{quote}</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>
          <div className={styles.pairFav}><Star size={14} /></div>
        </div>

        {/* Stats */}
        <div className={styles.statsStrip}>
          <div className={styles.statsPrice}>
            <div className={`${styles.bigPrice} ${stats.change >= 0 ? styles.priceUp : styles.priceDown}`}>
              {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: currentPrice < 1 ? 6 : 2 })}
              {stats.change >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            </div>
            <div className={`${styles.changeChip} ${stats.change >= 0 ? styles.upChip : styles.downChip}`}>
              {stats.change >= 0 ? '+' : ''}{stats.change.toFixed(2)}%
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statKey}>24h High</div>
            <div className={styles.statVal} style={{ color: 'var(--green)' }}>
              {stats.high.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statKey}>24h Low</div>
            <div className={styles.statVal} style={{ color: 'var(--red)' }}>
              {stats.low.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statKey}>24h Vol ({base})</div>
            <div className={styles.statVal}>{stats.volume.toFixed(2)}K</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statKey}>24h Vol ({quote})</div>
            <div className={styles.statVal}>${(stats.quoteVol / 1e9).toFixed(2)}B</div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className={styles.mainGrid}>
        {/* LEFT: Order Book + Trades */}
        <div className={styles.leftPanel}>
          <div className={styles.panelTabs}>
            <button
              className={`${styles.panelTab} ${activePanel === 'orderbook' ? styles.panelTabActive : ''}`}
              onClick={() => setActivePanel('orderbook')}
            >Order Book</button>
            <button
              className={`${styles.panelTab} ${activePanel === 'trades' ? styles.panelTabActive : ''}`}
              onClick={() => setActivePanel('trades')}
            >Trades</button>
          </div>
          <div className={styles.panelContent}>
            {activePanel === 'orderbook' ? (
              <OrderBook basePrice={currentPrice} symbol={pair} />
            ) : (
              <TradeHistory basePrice={currentPrice} />
            )}
          </div>
        </div>

        {/* CENTER: Chart + Orders */}
        <div className={styles.centerPanel}>
          <div className={styles.chartArea}>
            <TradingChart symbol={pair} basePrice={pairInfo.base} />
          </div>

          {/* Open Orders */}
          <div className={styles.ordersPanel}>
            <div className={styles.ordersTabs}>
              {(['open', 'history', 'funds'] as const).map(tab => (
                <button
                  key={tab}
                  className={`${styles.ordersTab} ${activeOrders === tab ? styles.ordersTabActive : ''}`}
                  onClick={() => setActiveOrders(tab)}
                >
                  {tab === 'open' ? 'Open Orders' : tab === 'history' ? 'Order History' : 'Funds'}
                </button>
              ))}
            </div>
            <div className={styles.ordersContent}>
              {activeOrders === 'open' ? (
                openOrders.length === 0 ? (
                  <div className={styles.emptyOrders}>
                    <div className={styles.emptyIcon}>📋</div>
                    <div className={styles.emptyText}>No open orders — place a trade above</div>
                  </div>
                ) : (
                  <div className={styles.liveOrdersTable}>
                    <div className={styles.liveOrdersHeader}>
                      <span>Pair</span><span>Type</span><span>Side</span><span>Price</span><span>Amount</span><span>Total</span><span>Status</span><span>Time</span><span></span>
                    </div>
                    {openOrders.map(o => (
                      <div key={o.id} className={styles.liveOrderRow}>
                        <span className={styles.loCell}>{o.pair.replace('-','/')}</span>
                        <span className={styles.loCell}>{o.type}</span>
                        <span className={`${styles.loCell} ${o.side === 'buy' ? styles.loBuy : styles.loSell}`}>{o.side.toUpperCase()}</span>
                        <span className={styles.loCell}>${o.price.toLocaleString(undefined,{maximumFractionDigits:2})}</span>
                        <span className={styles.loCell}>{o.amount.toFixed(6)}</span>
                        <span className={styles.loCell}>${o.total.toFixed(2)}</span>
                        <span className={`${styles.loCell} ${styles.loStatus}`}>Open</span>
                        <span className={styles.loCell}>{o.time}</span>
                        <button className={styles.loCancelBtn} onClick={() => cancelOrder(o.id)}><X size={11} /></button>
                      </div>
                    ))}
                  </div>
                )
              ) : activeOrders === 'history' ? (
                orderHistory.length === 0 ? (
                  <div className={styles.emptyOrders}>
                    <div className={styles.emptyIcon}>📊</div>
                    <div className={styles.emptyText}>No order history yet</div>
                  </div>
                ) : (
                  <div className={styles.liveOrdersTable}>
                    <div className={styles.liveOrdersHeader}>
                      <span>Pair</span><span>Type</span><span>Side</span><span>Price</span><span>Amount</span><span>Total</span><span>Status</span><span>Time</span>
                    </div>
                    {orderHistory.map(o => (
                      <div key={o.id + o.time} className={styles.liveOrderRow}>
                        <span className={styles.loCell}>{o.pair.replace('-','/')}</span>
                        <span className={styles.loCell}>{o.type}</span>
                        <span className={`${styles.loCell} ${o.side === 'buy' ? styles.loBuy : styles.loSell}`}>{o.side.toUpperCase()}</span>
                        <span className={styles.loCell}>${o.price.toLocaleString(undefined,{maximumFractionDigits:2})}</span>
                        <span className={styles.loCell}>{o.amount.toFixed(6)}</span>
                        <span className={styles.loCell}>${o.total.toFixed(2)}</span>
                        <span className={`${styles.loCell} ${styles.loFilled}`}><CheckCircle2 size={11} /> Filled</span>
                        <span className={styles.loCell}>{o.time}</span>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className={styles.fundsTable}>
                  <div className={styles.fundsHeader}>
                    <span>Asset</span><span>Available</span><span>Locked</span><span>Total</span>
                  </div>
                  <div className={styles.fundsRow}>
                    <span>USDT</span><span>10,000.00</span><span>0.00</span><span>10,000.00</span>
                  </div>
                  <div className={styles.fundsRow}>
                    <span>{base}</span><span>1.5000</span><span>0.0000</span><span>1.5000</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Pairs + Trade Form */}
        <div className={styles.rightPanel}>
          {/* Pair search */}
          <div className={styles.pairsSearch}>
            <div className={styles.pairsSearchInner}>
              <Search size={13} />
              <input
                placeholder="Search pairs"
                className={styles.pairsInput}
                value={searchPair}
                onChange={e => setSearchPair(e.target.value)}
                id="trade-pair-search"
              />
            </div>
          </div>
          <div className={styles.pairsList}>
            <div className={styles.pairsHeader}>
              <span>Pair</span>
              <span>Price</span>
              <span>Change</span>
            </div>
            {filteredPairs.map(p => (
              <Link
                key={p.symbol}
                href={`/trade/${p.symbol}`}
                className={`${styles.pairItem} ${p.symbol === pair ? styles.pairActive : ''}`}
              >
                <span className={styles.pairSym}>{p.symbol.replace('-USDT', '')}<span style={{ color: 'var(--text-muted)' }}>/USDT</span></span>
                <span className={styles.pairPrice}>
                  {p.price < 1 ? p.price.toFixed(4) : p.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </span>
                <span className={p.change >= 0 ? styles.pairUp : styles.pairDown}>
                  {p.change >= 0 ? '+' : ''}{p.change.toFixed(2)}%
                </span>
              </Link>
            ))}
          </div>

          {/* Trade form */}
          <div className={styles.tradeFormArea}>
            <TradeForm symbol={pair} currentPrice={currentPrice} onOrderPlaced={handleOrderPlaced} />
          </div>
        </div>
      </div>
    </div>
  );
}
