'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import { Zap, Wifi, Phone, Tv2, Plane, Gift, ArrowRight, ShieldCheck } from 'lucide-react';
import styles from './services.module.css';

const SERVICES = [
  { icon: Zap, label: 'Electricity', desc: 'Pay your electricity bill with crypto instantly', href: '/services/bills?cat=electricity', color: '#fcd535', bg: 'rgba(252,213,53,0.1)' },
  { icon: Wifi, label: 'Internet', desc: 'Top up broadband & fiber subscriptions', href: '/services/bills?cat=internet', color: '#627eea', bg: 'rgba(99,126,234,0.1)' },
  { icon: Phone, label: 'Mobile Top-Up', desc: 'Recharge any mobile number worldwide', href: '/services/bills?cat=mobile', color: '#0ecb81', bg: 'rgba(14,203,129,0.1)' },
  { icon: Tv2, label: 'TV / Cable', desc: 'Pay DSTV, StarTimes, Netflix and more', href: '/services/bills?cat=tv', color: '#f0b90b', bg: 'rgba(240,185,11,0.1)' },
  { icon: Plane, label: 'Flight Tickets', desc: 'Book flights and pay with any crypto', href: '/services/flights', color: '#3bc8e4', bg: 'rgba(59,200,228,0.1)' },
  { icon: Gift, label: 'Gift Cards', desc: 'Buy & sell Amazon, iTunes, Steam and more', href: '/services/giftcards', color: '#e84393', bg: 'rgba(232,67,147,0.1)' },
];

const RECENT = [
  { icon: Zap, label: 'EKEDC Electricity', amount: '₦5,000', asset: '3.28 USDT', date: 'May 4, 2026', status: 'Success' },
  { icon: Phone, label: 'MTN Top-Up +234 815...', amount: '₦2,000', asset: '1.31 USDT', date: 'May 2, 2026', status: 'Success' },
  { icon: Gift, label: 'Amazon Gift Card', amount: '$50.00', asset: '50.12 USDT', date: 'Apr 30, 2026', status: 'Success' },
];

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Services</h1>
            <p className={styles.pageDesc}>Pay bills, book flights, and buy gift cards using your crypto balance</p>
          </div>

          <div className={styles.trustRow}>
            <ShieldCheck size={14} /> All payments are instant and secured by blockchain technology
          </div>

          {/* Service grid */}
          <div className={styles.servicesGrid}>
            {SERVICES.map(s => (
              <Link key={s.label} href={s.href} className={styles.serviceCard}>
                <div className={styles.serviceIcon} style={{ background: s.bg, color: s.color }}>
                  <s.icon size={26} />
                </div>
                <div className={styles.serviceLabel}>{s.label}</div>
                <div className={styles.serviceDesc}>{s.desc}</div>
                <ArrowRight size={14} className={styles.serviceArrow} />
              </Link>
            ))}
          </div>

          {/* Recent transactions */}
          <div className={styles.recentSection}>
            <h2 className={styles.recentTitle}>Recent Service Payments</h2>
            <div className={styles.recentList}>
              {RECENT.map((r, i) => (
                <div key={i} className={styles.recentRow}>
                  <div className={styles.recentIcon}><r.icon size={18} /></div>
                  <div className={styles.recentInfo}>
                    <div className={styles.recentLabel}>{r.label}</div>
                    <div className={styles.recentDate}>{r.date}</div>
                  </div>
                  <div className={styles.recentRight}>
                    <div className={styles.recentAmount}>{r.amount}</div>
                    <div className={styles.recentAsset}>{r.asset}</div>
                  </div>
                  <div className={styles.recentStatus}>{r.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
