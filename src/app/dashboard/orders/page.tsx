'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar/Navbar';
import { ChevronRight, Search, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
import styles from './orders.module.css';

const ALL_ORDERS = [
  { id: 'ORD-001', pair: 'BTC/USDT', type: 'Limit', side: 'Buy', price: 67100.00, amount: 0.05, filled: 0.05, total: 3355.00, status: 'Filled', time: '2026-05-05 14:32', fee: 3.36 },
  { id: 'ORD-002', pair: 'ETH/USDT', type: 'Market', side: 'Sell', price: 3498.20, amount: 1.2, filled: 1.2, total: 4197.84, status: 'Filled', time: '2026-05-05 11:18', fee: 4.20 },
  { id: 'ORD-003', pair: 'SOL/USDT', type: 'Limit', side: 'Buy', price: 180.50, amount: 5.0, filled: 0, total: 902.50, status: 'Open', time: '2026-05-05 09:05', fee: 0 },
  { id: 'ORD-004', pair: 'BNB/USDT', type: 'Limit', side: 'Sell', price: 562.10, amount: 2.0, filled: 0, total: 1124.20, status: 'Cancelled', time: '2026-05-04 18:43', fee: 0 },
  { id: 'ORD-005', pair: 'BTC/USDT', type: 'Stop-Limit', side: 'Sell', price: 65000.00, amount: 0.1, filled: 0, total: 6500.00, status: 'Open', time: '2026-05-04 14:20', fee: 0 },
  { id: 'ORD-006', pair: 'ETH/USDT', type: 'Market', side: 'Buy', price: 3510.00, amount: 0.8, filled: 0.8, total: 2808.00, status: 'Filled', time: '2026-05-03 21:07', fee: 2.81 },
  { id: 'ORD-007', pair: 'ADA/USDT', type: 'Limit', side: 'Buy', price: 0.452, amount: 1000, filled: 600, total: 452.00, status: 'Partial', time: '2026-05-03 10:55', fee: 0.27 },
];

type StatusFilter = 'All' | 'Open' | 'Filled' | 'Cancelled' | 'Partial';

export default function OrdersPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push('/login');
  }, [isLoading, isLoggedIn, router]);

  const filtered = ALL_ORDERS.filter(o => {
    const matchStatus = statusFilter === 'All' || o.status === statusFilter;
    const matchSearch = !search || o.pair.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>

          <div className={styles.breadcrumb}>
            <Link href="/dashboard" className={styles.breadLink}>Dashboard</Link>
            <ChevronRight size={13} />
            <span>Orders</span>
          </div>

          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Order History</h1>
            <div className={styles.headerRight}>
              <div className={styles.searchWrap}>
                <Search size={14} className={styles.searchIcon} />
                <input
                  className={styles.searchInput}
                  placeholder="Search pair or order ID..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                {search && <button className={styles.clearSearch} onClick={() => setSearch('')}><X size={12} /></button>}
              </div>
            </div>
          </div>

          {/* Status filters */}
          <div className={styles.filterTabs}>
            {(['All', 'Open', 'Filled', 'Cancelled', 'Partial'] as StatusFilter[]).map(s => (
              <button
                key={s}
                className={`${styles.filterTab} ${statusFilter === s ? styles.filterActive : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
                <span className={styles.filterCount}>
                  {s === 'All' ? ALL_ORDERS.length : ALL_ORDERS.filter(o => o.status === s).length}
                </span>
              </button>
            ))}
          </div>

          {/* Open orders summary */}
          {(statusFilter === 'All' || statusFilter === 'Open') && (
            <div className={styles.openSummary}>
              <div className={styles.openSumTitle}>Open Orders ({ALL_ORDERS.filter(o => o.status === 'Open').length})</div>
              <button className={styles.cancelAllBtn}><X size={13} /> Cancel All</button>
            </div>
          )}

          {/* Orders table */}
          <div className={styles.tableCard}>
            <div className={styles.tableHeader}>
              <span>Order ID</span>
              <span>Pair</span>
              <span>Type</span>
              <span>Side</span>
              <span>Price</span>
              <span>Amount</span>
              <span>Filled</span>
              <span>Total</span>
              <span>Fee</span>
              <span>Status</span>
              <span>Time</span>
              <span>Action</span>
            </div>

            {filtered.length === 0 ? (
              <div className={styles.emptyState}>No orders found</div>
            ) : filtered.map(order => (
              <div key={order.id} className={styles.tableRow}>
                <div className={styles.orderId}>{order.id}</div>
                <div className={styles.pairCell}>{order.pair}</div>
                <div className={styles.typeCell}>{order.type}</div>
                <div className={`${styles.sideCell} ${order.side === 'Buy' ? styles.buy : styles.sell}`}>{order.side}</div>
                <div className={styles.priceCell}>${order.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: order.price < 1 ? 4 : 2 })}</div>
                <div className={styles.amtCell}>{order.amount}</div>
                <div className={styles.filledCell}>
                  <div className={styles.filledBar}>
                    <div className={styles.filledFill} style={{ width: `${(order.filled / order.amount) * 100}%` }} />
                  </div>
                  <span>{((order.filled / order.amount) * 100).toFixed(0)}%</span>
                </div>
                <div className={styles.totalCell}>${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className={styles.feeCell}>{order.fee > 0 ? `$${order.fee.toFixed(2)}` : '—'}</div>
                <div className={styles.statusCell}>
                  <span className={`${styles.statusBadge} ${styles['s_' + order.status.toLowerCase()]}`}>{order.status}</span>
                </div>
                <div className={styles.timeCell}>{order.time}</div>
                <div className={styles.actionCell}>
                  {order.status === 'Open' ? (
                    <button className={styles.cancelBtn}><X size={12} /> Cancel</button>
                  ) : (
                    <Link href={`/trade/${order.pair.replace('/', '-')}`} className={styles.tradeAgainBtn}>
                      Trade
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className={styles.statsRow}>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Total Orders</div>
              <div className={styles.statValue}>{ALL_ORDERS.length}</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Total Buy</div>
              <div className={styles.statValue} style={{ color: 'var(--green)' }}>
                ${ALL_ORDERS.filter(o => o.side === 'Buy').reduce((s, o) => s + o.total, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Total Sell</div>
              <div className={styles.statValue} style={{ color: 'var(--red)' }}>
                ${ALL_ORDERS.filter(o => o.side === 'Sell').reduce((s, o) => s + o.total, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statLabel}>Total Fees Paid</div>
              <div className={styles.statValue}>${ALL_ORDERS.reduce((s, o) => s + o.fee, 0).toFixed(2)}</div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
