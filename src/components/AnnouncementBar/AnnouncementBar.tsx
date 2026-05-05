'use client';
import { useState, useEffect } from 'react';
import { Megaphone, X, ChevronRight } from 'lucide-react';
import styles from './AnnouncementBar.module.css';

const announcements = [
  '🔥 New Listing: PEPE/USDT Spot Trading Now Live — Trade with Zero Fees for 30 Days!',
  '⚡ Sumato Launchpad: Subscribe to the Latest IEO Before It Ends — Limited Slots!',
  '🎁 Referral Program: Earn up to 40% Commission — Invite Friends and Earn Together',
  '📈 Futures Trading: Up to 125x Leverage on BTC/USDT Perpetual',
  '🛡️ Security Notice: Enable 2FA to protect your account and earn 10 USDT bonus',
  '💰 Earn up to 23% APY on USDT Flexible Savings — Start Earning Now',
];

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (closed) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <Megaphone size={14} className={styles.icon} />
        <div className={styles.textWrapper}>
          <span className={styles.text}>{announcements[current]}</span>
        </div>
        <a href="#" className={styles.more}>
          More <ChevronRight size={12} />
        </a>
        <button className={styles.close} onClick={() => setClosed(true)} aria-label="Close">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
