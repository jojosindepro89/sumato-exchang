'use client';
import { useEffect, useState } from 'react';
import styles from './OrderBook.module.css';

interface Order { price: number; amount: number; total: number; depth: number; }

function generateOrders(basePrice: number, count = 16, side: 'ask' | 'bid') {
  const orders: Order[] = [];
  let cumulative = 0;
  for (let i = 0; i < count; i++) {
    const spread = side === 'ask' ? (i + 1) * 0.5 : -(i + 1) * 0.5;
    const price = basePrice + spread + (Math.random() - 0.5) * 0.2;
    const amount = 0.01 + Math.random() * 2;
    cumulative += amount;
    orders.push({ price, amount, total: cumulative, depth: 0 });
  }
  const maxTotal = orders[orders.length - 1].total;
  return orders.map(o => ({ ...o, depth: (o.total / maxTotal) * 100 }));
}

interface Props {
  basePrice: number;
  symbol: string;
}

export default function OrderBook({ basePrice, symbol }: Props) {
  const [asks, setAsks] = useState<Order[]>([]);
  const [bids, setBids] = useState<Order[]>([]);
  const [spread, setSpread] = useState(0);
  const [currentPrice, setCurrentPrice] = useState(basePrice);
  const [priceDir, setPriceDir] = useState<'up' | 'down'>('up');

  useEffect(() => {
    const update = () => {
      const change = (Math.random() - 0.49) * basePrice * 0.0005;
      const newPrice = currentPrice + change;
      setPriceDir(change >= 0 ? 'up' : 'down');
      setCurrentPrice(newPrice);
      const newAsks = generateOrders(newPrice, 16, 'ask').reverse();
      const newBids = generateOrders(newPrice, 16, 'bid');
      setAsks(newAsks);
      setBids(newBids);
      setSpread(newAsks[newAsks.length - 1].price - newBids[0].price);
    };
    update();
    const iv = setInterval(update, 800);
    return () => clearInterval(iv);
  }, [basePrice]);

  const fmt = (n: number) => n.toFixed(n >= 1000 ? 2 : n >= 1 ? 4 : 6);

  return (
    <div className={styles.book}>
      <div className={styles.header}>
        <h3 className={styles.title}>Order Book</h3>
      </div>
      <div className={styles.colHeaders}>
        <span>Price ({symbol.split('-')[1] || 'USDT'})</span>
        <span>Amount ({symbol.split('-')[0] || 'BTC'})</span>
        <span>Total</span>
      </div>

      {/* Asks (sells) */}
      <div className={styles.asks}>
        {asks.map((ask, i) => (
          <div key={i} className={styles.row}>
            <div className={styles.depthBar} style={{ width: `${ask.depth}%`, background: 'rgba(246,70,93,0.12)' }} />
            <span className={styles.askPrice}>{fmt(ask.price)}</span>
            <span className={styles.amount}>{ask.amount.toFixed(4)}</span>
            <span className={styles.total}>{ask.total.toFixed(4)}</span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className={styles.spreadRow}>
        <span className={`${styles.midPrice} ${priceDir === 'up' ? styles.priceUp : styles.priceDown}`}>
          {currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          {priceDir === 'up' ? ' ↑' : ' ↓'}
        </span>
        <span className={styles.spreadLabel}>Spread: {Math.abs(spread).toFixed(2)}</span>
      </div>

      {/* Bids (buys) */}
      <div className={styles.bids}>
        {bids.map((bid, i) => (
          <div key={i} className={styles.row}>
            <div className={styles.depthBar} style={{ width: `${bid.depth}%`, background: 'rgba(14,203,129,0.12)' }} />
            <span className={styles.bidPrice}>{fmt(bid.price)}</span>
            <span className={styles.amount}>{bid.amount.toFixed(4)}</span>
            <span className={styles.total}>{bid.total.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
