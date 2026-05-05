'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, X, Loader2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './TradeForm.module.css';

const PERCENTAGES = [25, 50, 75, 100];

interface Props {
  symbol: string;
  currentPrice: number;
  onOrderPlaced?: (order: PlacedOrder) => void;
}

export interface PlacedOrder {
  id: string;
  pair: string;
  side: 'buy' | 'sell';
  type: string;
  price: number;
  amount: number;
  total: number;
  time: string;
  status: 'open' | 'filled';
}

type OrderType = 'limit' | 'market' | 'stop-limit';

export default function TradeForm({ symbol, currentPrice, onOrderPlaced }: Props) {
  const { isLoggedIn, user } = useAuth();
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<OrderType>('limit');
  const [price, setPrice] = useState(currentPrice.toFixed(2));
  const [amount, setAmount] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [tpsl, setTpsl] = useState(false);
  const [tp, setTp] = useState('');
  const [sl, setSl] = useState('');

  // Modal + toast state
  const [showConfirm, setShowConfirm] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState<PlacedOrder | null>(null);

  const base = symbol.split('-')[0] || 'BTC';
  const quote = symbol.split('-')[1] || 'USDT';
  const execPrice = orderType === 'market' ? currentPrice : parseFloat(price) || currentPrice;
  const total = amount ? (execPrice * parseFloat(amount)).toFixed(2) : '';

  // Available balances (simulated)
  const availBuy = user ? 10000 : 0;
  const availSell = user ? 1.5 : 0;

  useEffect(() => {
    setPrice(currentPrice.toFixed(2));
  }, [symbol]);

  const handlePct = (pct: number) => {
    setPercentage(pct);
    if (side === 'buy') {
      setAmount(((availBuy * pct / 100) / execPrice).toFixed(6));
    } else {
      setAmount((availSell * pct / 100).toFixed(6));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    if (!amount || parseFloat(amount) <= 0) return;
    setShowConfirm(true);
  };

  const confirmOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1400));

    const order: PlacedOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      pair: symbol,
      side,
      type: orderType,
      price: execPrice,
      amount: parseFloat(amount),
      total: parseFloat(total || '0'),
      time: new Date().toLocaleTimeString(),
      status: orderType === 'market' ? 'filled' : 'open',
    };

    setPlacing(false);
    setShowConfirm(false);
    setAmount('');
    setPercentage(0);
    setToast(order);
    onOrderPlaced?.(order);
    setTimeout(() => setToast(null), 5000);
  };

  const fee = total ? (parseFloat(total) * 0.001).toFixed(4) : '0.0000';

  return (
    <div className={styles.form}>

      {/* Toast notification */}
      {toast && (
        <div className={`${styles.toast} ${toast.side === 'buy' ? styles.toastBuy : styles.toastSell}`}>
          <CheckCircle2 size={18} />
          <div className={styles.toastContent}>
            <div className={styles.toastTitle}>
              {toast.status === 'filled' ? 'Order Filled!' : 'Order Placed!'}
            </div>
            <div className={styles.toastDetail}>
              {toast.side === 'buy' ? 'Bought' : 'Sold'} {toast.amount.toFixed(6)} {base} @ ${toast.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <button className={styles.toastClose} onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}

      {/* Auth banner */}
      {!isLoggedIn && (
        <div className={styles.authBanner}>
          <Link href="/login" className={styles.authLink}>Log In</Link>
          <span> or </span>
          <Link href="/register" className={styles.authLink}>Register Now</Link>
          <span> to trade</span>
        </div>
      )}

      {/* Buy/Sell toggle */}
      <div className={styles.sideToggle}>
        <button
          className={`${styles.sideBtn} ${side === 'buy' ? styles.buyActive : ''}`}
          onClick={() => { setSide('buy'); setAmount(''); setPercentage(0); }}
          id="trade-buy-btn"
        >
          <TrendingUp size={14} /> Buy
        </button>
        <button
          className={`${styles.sideBtn} ${side === 'sell' ? styles.sellActive : ''}`}
          onClick={() => { setSide('sell'); setAmount(''); setPercentage(0); }}
          id="trade-sell-btn"
        >
          <TrendingDown size={14} /> Sell
        </button>
      </div>

      {/* Order type tabs */}
      <div className={styles.orderTypeTabs}>
        {(['limit', 'market', 'stop-limit'] as const).map(t => (
          <button
            key={t}
            className={`${styles.typeBtn} ${orderType === t ? styles.typeActive : ''}`}
            onClick={() => setOrderType(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      <form className={styles.fields} onSubmit={handleSubmit}>
        {/* Available */}
        <div className={styles.avail}>
          <span className={styles.availLabel}>Available</span>
          <span className={styles.availValue}>
            {side === 'buy'
              ? `${availBuy.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${quote}`
              : `${availSell.toFixed(4)} ${base}`}
          </span>
        </div>

        {/* Price */}
        {orderType !== 'market' ? (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Price ({quote})</label>
            <div className={styles.inputWrap}>
              <input
                type="number"
                className={styles.fieldInput}
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="0.00"
                id="trade-price-input"
                disabled={!isLoggedIn}
              />
              <button type="button" className={styles.inputAdj} onClick={() => setPrice(p => (parseFloat(p) + 1).toFixed(2))}>+</button>
              <button type="button" className={styles.inputAdj} onClick={() => setPrice(p => Math.max(0, parseFloat(p) - 1).toFixed(2))}>−</button>
            </div>
          </div>
        ) : (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Price ({quote})</label>
            <div className={styles.marketPrice}>
              Market ≈ <strong>${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
          </div>
        )}

        {/* Stop price for stop-limit */}
        {orderType === 'stop-limit' && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Stop ({quote})</label>
            <div className={styles.inputWrap}>
              <input type="number" className={styles.fieldInput} placeholder="Stop price" disabled={!isLoggedIn} />
            </div>
          </div>
        )}

        {/* Amount */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Amount ({base})</label>
          <div className={styles.inputWrap}>
            <input
              type="number"
              className={styles.fieldInput}
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.0000"
              id="trade-amount-input"
              disabled={!isLoggedIn}
            />
          </div>
        </div>

        {/* Percentage slider */}
        <div className={styles.pctButtons}>
          {PERCENTAGES.map(pct => (
            <button
              type="button"
              key={pct}
              className={`${styles.pctBtn} ${percentage === pct ? (side === 'buy' ? styles.pctActiveBuy : styles.pctActiveSell) : ''}`}
              onClick={() => handlePct(pct)}
              disabled={!isLoggedIn}
            >
              {pct}%
            </button>
          ))}
        </div>

        {/* Total */}
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Total ({quote})</label>
          <div className={styles.inputWrap}>
            <input
              type="number"
              className={`${styles.fieldInput} ${styles.totalInput}`}
              value={total}
              readOnly
              placeholder="0.00"
              id="trade-total-input"
            />
          </div>
        </div>

        {/* TP/SL */}
        <label className={styles.tpslToggle}>
          <input type="checkbox" checked={tpsl} onChange={e => setTpsl(e.target.checked)} disabled={!isLoggedIn} />
          <span>TP / SL</span>
        </label>
        {tpsl && (
          <div className={styles.tpslFields}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Take Profit ({quote})</label>
              <input type="number" className={styles.fieldInput} placeholder="0.00" value={tp} onChange={e => setTp(e.target.value)} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Stop Loss ({quote})</label>
              <input type="number" className={styles.fieldInput} placeholder="0.00" value={sl} onChange={e => setSl(e.target.value)} />
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className={side === 'buy' ? styles.buySubmit : styles.sellSubmit}
          id="trade-submit-btn"
          disabled={!isLoggedIn || !amount || parseFloat(amount) <= 0}
        >
          {side === 'buy' ? `Buy ${base}` : `Sell ${base}`}
        </button>

        {/* Fee info */}
        <div className={styles.feeInfo}>
          <span>Fee (0.1%): {fee} {quote}</span>
          <span>Maker/Taker: 0.1%</span>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className={styles.modalOverlay} onClick={() => !placing && setShowConfirm(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div className={`${styles.modalTitle} ${side === 'buy' ? styles.modalBuy : styles.modalSell}`}>
                {side === 'buy' ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                Confirm {side === 'buy' ? 'Buy' : 'Sell'} Order
              </div>
              {!placing && <button className={styles.modalClose} onClick={() => setShowConfirm(false)}><X size={18} /></button>}
            </div>

            <div className={styles.modalBody}>
              <div className={styles.confirmRow}>
                <span>Pair</span><strong>{symbol.replace('-', '/')}</strong>
              </div>
              <div className={styles.confirmRow}>
                <span>Order Type</span><strong>{orderType.charAt(0).toUpperCase() + orderType.slice(1).replace('-', ' ')}</strong>
              </div>
              <div className={styles.confirmRow}>
                <span>Price</span>
                <strong>{orderType === 'market' ? 'Market Price' : `$${parseFloat(price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</strong>
              </div>
              <div className={styles.confirmRow}>
                <span>Amount</span><strong>{parseFloat(amount).toFixed(6)} {base}</strong>
              </div>
              <div className={`${styles.confirmRow} ${styles.confirmTotal}`}>
                <span>Total</span>
                <strong className={side === 'buy' ? styles.totalBuy : styles.totalSell}>
                  ${parseFloat(total || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </strong>
              </div>
              <div className={styles.confirmRow}>
                <span>Est. Fee</span><strong>{fee} {quote}</strong>
              </div>
              {tpsl && tp && (
                <div className={styles.confirmRow}>
                  <span>Take Profit</span><strong style={{ color: 'var(--green)' }}>${tp}</strong>
                </div>
              )}
              {tpsl && sl && (
                <div className={styles.confirmRow}>
                  <span>Stop Loss</span><strong style={{ color: 'var(--red)' }}>${sl}</strong>
                </div>
              )}
            </div>

            <div className={styles.modalWarning}>
              <AlertTriangle size={13} />
              <span>Crypto trading involves risk. Only invest what you can afford to lose.</span>
            </div>

            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowConfirm(false)} disabled={placing}>
                Cancel
              </button>
              <button
                className={side === 'buy' ? styles.modalConfirmBuy : styles.modalConfirmSell}
                onClick={confirmOrder}
                disabled={placing}
                id="trade-confirm-btn"
              >
                {placing ? (
                  <><Loader2 size={15} className={styles.spinner} /> Placing Order...</>
                ) : (
                  `Confirm ${side === 'buy' ? 'Buy' : 'Sell'}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
