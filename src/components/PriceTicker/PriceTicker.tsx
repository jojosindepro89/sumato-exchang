'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown } from 'lucide-react';
import styles from './PriceTicker.module.css';

interface TickerCoin {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export default function PriceTicker() {
  const [coins, setCoins] = useState<TickerCoin[]>([]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const res = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false'
        );
        const data = await res.json();
        setCoins(data);
      } catch {
        // Fallback static data
        setCoins([
          { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 67432.5, price_change_percentage_24h: 2.34 },
          { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 3521.8, price_change_percentage_24h: -0.82 },
          { id: 'bnb', symbol: 'BNB', name: 'BNB', current_price: 567.2, price_change_percentage_24h: 1.12 },
          { id: 'solana', symbol: 'SOL', name: 'Solana', current_price: 178.4, price_change_percentage_24h: 4.23 },
          { id: 'xrp', symbol: 'XRP', name: 'XRP', current_price: 0.632, price_change_percentage_24h: -1.45 },
          { id: 'cardano', symbol: 'ADA', name: 'Cardano', current_price: 0.485, price_change_percentage_24h: 0.78 },
          { id: 'avalanche-2', symbol: 'AVAX', name: 'Avalanche', current_price: 38.7, price_change_percentage_24h: 3.12 },
          { id: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', current_price: 0.156, price_change_percentage_24h: -2.1 },
          { id: 'polkadot', symbol: 'DOT', name: 'Polkadot', current_price: 7.82, price_change_percentage_24h: 0.45 },
          { id: 'chainlink', symbol: 'LINK', name: 'Chainlink', current_price: 18.34, price_change_percentage_24h: 5.67 },
        ]);
      }
    };
    fetchCoins();
    const interval = setInterval(fetchCoins, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!coins.length) return <div className={styles.skeleton} />;

  const items = [...coins, ...coins]; // duplicate for seamless loop

  return (
    <div className={styles.ticker}>
      <div className={styles.track}>
        {items.map((coin, i) => {
          const positive = coin.price_change_percentage_24h >= 0;
          return (
            <Link
              key={`${coin.id}-${i}`}
              href={`/trade/${coin.symbol.toUpperCase()}-USDT`}
              className={styles.item}
            >
              <span className={styles.symbol}>{coin.symbol.toUpperCase()}/USDT</span>
              <span className={styles.price}>
                ${coin.current_price < 1
                  ? coin.current_price.toFixed(4)
                  : coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`${styles.change} ${positive ? styles.positive : styles.negative}`}>
                {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {positive ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
