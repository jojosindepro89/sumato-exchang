'use client';
import { useEffect, useState } from 'react';
import styles from './TradeHistory.module.css';

interface Trade { time: string; price: number; amount: number; side: 'buy' | 'sell'; }

function genTrade(basePrice: number): Trade {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
  return {
    time,
    price: basePrice + (Math.random() - 0.5) * basePrice * 0.002,
    amount: Math.random() * 2,
    side: Math.random() > 0.5 ? 'buy' : 'sell',
  };
}

export default function TradeHistory({ basePrice }: { basePrice: number }) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const initial = Array(20).fill(0).map(() => genTrade(basePrice));
    setTrades(initial);
    const iv = setInterval(() => {
      setTrades(prev => [genTrade(basePrice), ...prev.slice(0, 29)]);
    }, 600);
    return () => clearInterval(iv);
  }, [basePrice]);

  return (
    <div className={styles.history}>
      <div className={styles.header}>
        <h3 className={styles.title}>Market Trades</h3>
      </div>
      <div className={styles.colHeaders}>
        <span>Time</span>
        <span>Price</span>
        <span>Amount</span>
      </div>
      <div className={styles.list}>
        {trades.map((t, i) => (
          <div key={i} className={styles.row}>
            <span className={styles.time}>{t.time}</span>
            <span className={t.side === 'buy' ? styles.buy : styles.sell}>
              {t.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={styles.amount}>{t.amount.toFixed(4)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
