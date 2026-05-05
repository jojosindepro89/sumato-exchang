'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Zap, Shield, TrendingUp, ArrowRight, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import styles from './FuturesPage.module.css';

const TradingChart = dynamic(() => import('@/components/Trading/TradingChart'), { ssr: false });

const CONTRACTS = [
  { pair: 'BTCUSDT', price: 67432.5, change: 2.34, fundRate: 0.0100, volume: '42.8B', oi: '8.2B', markPrice: 67445.2 },
  { pair: 'ETHUSDT', price: 3521.8, change: -0.82, fundRate: -0.0050, volume: '18.2B', oi: '4.1B', markPrice: 3523.4 },
  { pair: 'BNBUSDT', price: 567.2, change: 1.12, fundRate: 0.0080, volume: '2.1B', oi: '560M', markPrice: 567.8 },
  { pair: 'SOLUSDT', price: 178.4, change: 4.23, fundRate: 0.0150, volume: '4.8B', oi: '980M', markPrice: 178.9 },
  { pair: 'XRPUSDT', price: 0.6321, change: -1.45, fundRate: -0.0020, volume: '1.9B', oi: '420M', markPrice: 0.6325 },
];

const LEVERAGE_LEVELS = [5, 10, 20, 50, 75, 100, 125];

export default function FuturesPage() {
  const [activePair, setActivePair] = useState(CONTRACTS[0]);
  const [leverage, setLeverage] = useState(20);
  const [margin, setMargin] = useState<'cross' | 'isolated'>('cross');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [price, setPrice] = useState('67432.50');
  const [amount, setAmount] = useState('');
  const [showLevModal, setShowLevModal] = useState(false);

  const liqPrice = side === 'long'
    ? activePair.price * (1 - 1 / leverage)
    : activePair.price * (1 + 1 / leverage);

  return (
    <div className={styles.page}>
      {/* Top contracts bar */}
      <div className={styles.topBar}>
        <div className={styles.contractsList}>
          {CONTRACTS.map(c => (
            <button
              key={c.pair}
              className={`${styles.contractItem} ${activePair.pair === c.pair ? styles.contractActive : ''}`}
              onClick={() => setActivePair(c)}
            >
              <span className={styles.contractPair}>{c.pair.replace('USDT', '')}/USDT</span>
              <span className={`${styles.contractPrice} ${c.change >= 0 ? styles.up : styles.down}`}>
                {c.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </span>
              <span className={`${styles.contractChange} ${c.change >= 0 ? styles.up : styles.down}`}>
                {c.change >= 0 ? '+' : ''}{c.change.toFixed(2)}%
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats strip */}
      <div className={styles.statsStrip}>
        <div className={styles.stripLeft}>
          <div className={styles.pairBig}>{activePair.pair.replace('USDT', '')}/USDT Perpetual</div>
          <div className={`${styles.priceBig} ${activePair.change >= 0 ? styles.up : styles.down}`}>
            {activePair.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        {[
          { label: 'Mark Price', val: activePair.markPrice.toFixed(2) },
          { label: 'Index Price', val: (activePair.price * 0.9998).toFixed(2) },
          { label: 'Funding Rate', val: `${activePair.fundRate.toFixed(4)}%`, color: activePair.fundRate >= 0 ? 'var(--green)' : 'var(--red)' },
          { label: '24h Volume', val: `$${activePair.volume}` },
          { label: 'Open Interest', val: `$${activePair.oi}` },
        ].map(s => (
          <div key={s.label} className={styles.stripStat}>
            <div className={styles.stripLabel}>{s.label}</div>
            <div className={styles.stripVal} style={{ color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Main layout */}
      <div className={styles.mainGrid}>
        {/* Chart */}
        <div className={styles.chartArea}>
          <TradingChart symbol={activePair.pair} basePrice={activePair.price} />
        </div>

        {/* Trade panel */}
        <div className={styles.tradePanel}>
          {/* Margin & leverage */}
          <div className={styles.marginRow}>
            <button
              className={`${styles.marginBtn} ${margin === 'cross' ? styles.marginActive : ''}`}
              onClick={() => setMargin('cross')}
            >Cross</button>
            <button
              className={`${styles.marginBtn} ${margin === 'isolated' ? styles.marginActive : ''}`}
              onClick={() => setMargin('isolated')}
            >Isolated</button>
            <button className={styles.leverageBtn} onClick={() => setShowLevModal(!showLevModal)}>
              {leverage}x <ChevronDown size={13} />
            </button>
          </div>

          {/* Leverage modal */}
          {showLevModal && (
            <div className={styles.levModal}>
              <div className={styles.levModalTitle}>Adjust Leverage</div>
              <div className={styles.levButtons}>
                {LEVERAGE_LEVELS.map(l => (
                  <button
                    key={l}
                    className={`${styles.levBtn} ${leverage === l ? styles.levActive : ''}`}
                    onClick={() => { setLeverage(l); setShowLevModal(false); }}
                  >
                    {l}x
                  </button>
                ))}
              </div>
              <div className={styles.levWarning}>
                <Shield size={13} />
                <span>Maximum position at current leverage: {(leverage * 100).toFixed(0)} USDT</span>
              </div>
            </div>
          )}

          {/* Long/Short toggle */}
          <div className={styles.sideToggle}>
            <button className={`${styles.longBtn} ${side === 'long' ? styles.longActive : ''}`} onClick={() => setSide('long')}>
              <TrendingUp size={14} /> Long
            </button>
            <button className={`${styles.shortBtn} ${side === 'short' ? styles.shortActive : ''}`} onClick={() => setSide('short')}>
              Short ↘
            </button>
          </div>

          {/* Order type */}
          <div className={styles.orderTabs}>
            {(['limit', 'market'] as const).map(t => (
              <button
                key={t}
                className={`${styles.orderTab} ${orderType === t ? styles.orderTabActive : ''}`}
                onClick={() => setOrderType(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.fields}>
            <div className={styles.availRow}>
              <span className={styles.availLabel}>Available Balance</span>
              <span className={styles.availVal}>10,000.00 USDT</span>
            </div>

            {orderType === 'limit' && (
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Price (USDT)</label>
                <input
                  type="number"
                  className={styles.fieldInput}
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  id="futures-price"
                />
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.fieldLabel}>Amount ({activePair.pair.replace('USDT', '')})</label>
              <input
                type="number"
                className={styles.fieldInput}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.001"
                id="futures-amount"
              />
            </div>

            <div className={styles.pctRow}>
              {[25, 50, 75, 100].map(p => (
                <button key={p} className={styles.pctBtn} onClick={() => {
                  const avail = 10000 / (parseFloat(price || '1'));
                  setAmount((avail * p / 100 * leverage).toFixed(6));
                }}>{p}%</button>
              ))}
            </div>

            {/* Cost info */}
            <div className={styles.costInfo}>
              <div className={styles.costRow}>
                <span>Cost</span>
                <span>{amount && price ? `${(parseFloat(amount) * parseFloat(price) / leverage).toFixed(2)} USDT` : '--'}</span>
              </div>
              <div className={styles.costRow}>
                <span>Max Position</span>
                <span>{(10000 * leverage / activePair.price).toFixed(4)} {activePair.pair.replace('USDT', '')}</span>
              </div>
              <div className={styles.costRow}>
                <span>Liq. Price (Est.)</span>
                <span style={{ color: 'var(--red)' }}>${liqPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              id="futures-submit"
              className={side === 'long' ? styles.longSubmit : styles.shortSubmit}
            >
              {side === 'long' ? '↑ Open Long' : '↓ Open Short'}
            </button>

            <div className={styles.feeRow}>
              <span>Taker Fee: 0.04%</span>
              <span>Maker Fee: 0.02%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
