'use client';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import { Search, Filter, Star, ChevronDown, Shield, Clock, MessageCircle, Plus } from 'lucide-react';
import styles from './p2p.module.css';

const COINS = ['USDT', 'BTC', 'ETH', 'BNB'];
const PAYMENT_METHODS = ['All Methods', 'Bank Transfer', 'PayPal', 'Revolut', 'Cash App', 'Wise', 'Apple Pay'];
const CURRENCIES = ['USD', 'GBP', 'EUR', 'NGN', 'GHS', 'KES', 'ZAR'];

const RATES: Record<string, number> = { USDT: 1, BTC: 67432.5, ETH: 3521.8, BNB: 567.2 };

const LISTINGS = [
  { id: 'trade-001', name: 'CryptoKing_Pro', avatar: 'CK', rating: 4.97, trades: 1284, completionRate: 99.2, price: 1.002, minAmt: 100, maxAmt: 50000, methods: ['Bank Transfer', 'Wise'], available: 84320, verified: true, online: true },
  { id: 'trade-002', name: 'SafeTrader_NG', avatar: 'ST', rating: 4.89, trades: 876, completionRate: 98.7, price: 1.001, minAmt: 50, maxAmt: 20000, methods: ['PayPal', 'Cash App'], available: 42100, verified: true, online: true },
  { id: 'trade-003', name: 'GlobalExchange', avatar: 'GE', rating: 4.95, trades: 2341, completionRate: 99.8, price: 1.000, minAmt: 200, maxAmt: 100000, methods: ['Bank Transfer', 'Revolut', 'Wise'], available: 218000, verified: true, online: false },
  { id: 'trade-004', name: 'QuickDealer_X', avatar: 'QD', rating: 4.72, trades: 342, completionRate: 96.5, price: 0.999, minAmt: 20, maxAmt: 5000, methods: ['Apple Pay', 'PayPal'], available: 8500, verified: false, online: true },
  { id: 'trade-005', name: 'TrustVault', avatar: 'TV', rating: 4.98, trades: 3876, completionRate: 99.9, price: 1.003, minAmt: 500, maxAmt: 200000, methods: ['Bank Transfer'], available: 540000, verified: true, online: true },
  { id: 'trade-006', name: 'BitMerchant22', avatar: 'BM', rating: 4.81, trades: 658, completionRate: 97.3, price: 1.001, minAmt: 100, maxAmt: 30000, methods: ['Wise', 'Revolut'], available: 76400, verified: true, online: false },
];

export default function P2PPage() {
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const [coin, setCoin] = useState('USDT');
  const [currency, setCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('All Methods');
  const [showFilters, setShowFilters] = useState(false);

  const rate = RATES[coin] || 1;
  const filtered = LISTINGS.filter(l => method === 'All Methods' || l.methods.includes(method));

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerInner}>
            <div>
              <h1 className={styles.title}>P2P Trading</h1>
              <p className={styles.subtitle}>Trade crypto directly with other users — protected by escrow</p>
            </div>
            <div className={styles.headerActions}>
              <Link href="/p2p/my-orders" className={styles.myOrdersBtn}>
                <Clock size={14} /> My Orders
              </Link>
              <button className={styles.postAdBtn}>
                <Plus size={14} /> Post Ad
              </button>
            </div>
          </div>
        </div>

        <div className={styles.container}>
          {/* Filters bar */}
          <div className={styles.filterBar}>
            {/* Buy/Sell toggle */}
            <div className={styles.modeToggle}>
              <button className={`${styles.modeBtn} ${mode === 'buy' ? styles.modeBuyActive : ''}`} onClick={() => setMode('buy')}>Buy</button>
              <button className={`${styles.modeBtn} ${mode === 'sell' ? styles.modeSellActive : ''}`} onClick={() => setMode('sell')}>Sell</button>
            </div>

            {/* Coin selector */}
            <div className={styles.coinTabs}>
              {COINS.map(c => (
                <button key={c} className={`${styles.coinTab} ${coin === c ? styles.coinActive : ''}`} onClick={() => setCoin(c)}>
                  {c}
                </button>
              ))}
            </div>

            {/* Amount input */}
            <div className={styles.amountWrap}>
              <Search size={14} className={styles.amountIcon} />
              <input
                className={styles.amountInput}
                placeholder="Enter amount..."
                value={amount}
                onChange={e => setAmount(e.target.value)}
                type="number"
              />
              <select className={styles.currencySelect} value={currency} onChange={e => setCurrency(e.target.value)}>
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {/* Payment method */}
            <select className={styles.methodSelect} value={method} onChange={e => setMethod(e.target.value)}>
              {PAYMENT_METHODS.map(m => <option key={m}>{m}</option>)}
            </select>

            <button className={`${styles.filterBtn} ${showFilters ? styles.filterActive : ''}`} onClick={() => setShowFilters(!showFilters)}>
              <Filter size={14} /> Filters
            </button>
          </div>

          {/* Extra filters */}
          {showFilters && (
            <div className={styles.extraFilters}>
              <label className={styles.filterLabel}>
                <input type="checkbox" /> Verified traders only
              </label>
              <label className={styles.filterLabel}>
                <input type="checkbox" defaultChecked /> Online only
              </label>
              <label className={styles.filterLabel}>
                <input type="checkbox" /> 500+ trades
              </label>
              <label className={styles.filterLabel}>
                <input type="checkbox" /> 99%+ completion
              </label>
            </div>
          )}

          {/* Trust banner */}
          <div className={styles.trustBanner}>
            <Shield size={14} />
            <span>All trades are protected by <strong>Sumato Escrow</strong> — funds are held securely until both parties confirm</span>
          </div>

          {/* Table header */}
          <div className={styles.tableHeader}>
            <span>Advertiser</span>
            <span>Price</span>
            <span>Limit / Available</span>
            <span>Payment</span>
            <span>Trade</span>
          </div>

          {/* Listings */}
          <div className={styles.listings}>
            {filtered.map((listing, i) => {
              const priceInCurrency = (listing.price * rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              return (
                <div key={listing.id} className={`${styles.listingRow} ${i % 2 === 0 ? styles.listingAlt : ''}`}>
                  {/* Advertiser */}
                  <div className={styles.advertiser}>
                    <div className={styles.avatarWrap}>
                      <div className={styles.avatar}>{listing.avatar}</div>
                      <div className={`${styles.onlineDot} ${listing.online ? styles.online : styles.offline}`} />
                    </div>
                    <div>
                      <div className={styles.advertiserName}>
                        {listing.name}
                        {listing.verified && <Shield size={11} className={styles.verifiedIcon} />}
                      </div>
                      <div className={styles.advertiserStats}>
                        <span className={styles.ratingBadge}>
                          <Star size={10} fill="var(--accent)" color="var(--accent)" />
                          {listing.rating}
                        </span>
                        <span>{listing.trades} trades</span>
                        <span>{listing.completionRate}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className={styles.priceCell}>
                    <span className={styles.priceAmount}>{priceInCurrency}</span>
                    <span className={styles.priceCurrency}>{currency}</span>
                  </div>

                  {/* Limits */}
                  <div className={styles.limitsCell}>
                    <div className={styles.limitRow}>
                      <span className={styles.limitLabel}>Limit</span>
                      <span className={styles.limitVal}>${listing.minAmt.toLocaleString()} – ${listing.maxAmt.toLocaleString()}</span>
                    </div>
                    <div className={styles.limitRow}>
                      <span className={styles.limitLabel}>Available</span>
                      <span className={styles.limitVal}>{listing.available.toLocaleString()} {coin}</span>
                    </div>
                  </div>

                  {/* Payment methods */}
                  <div className={styles.methodsCell}>
                    {listing.methods.map(m => (
                      <span key={m} className={styles.methodBadge}>{m}</span>
                    ))}
                  </div>

                  {/* Action */}
                  <div className={styles.actionCell}>
                    <Link
                      href={`/p2p/${listing.id}`}
                      className={`${styles.tradeNowBtn} ${mode === 'buy' ? styles.tradeBuyBtn : styles.tradeSellBtn}`}
                    >
                      {mode === 'buy' ? 'Buy' : 'Sell'} {coin}
                    </Link>
                    <button className={styles.chatBtn}>
                      <MessageCircle size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
