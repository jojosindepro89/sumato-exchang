'use client';
import Link from 'next/link';
import { X, Send, Video, Camera, GitBranch } from 'lucide-react';
import styles from './Footer.module.css';

const FOOTER_LINKS = [
  {
    title: 'About Us',
    links: [
      { label: 'About Sumato', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Business Contacts', href: '/business' },
      { label: 'Blog', href: '/blog' },
      { label: 'Community', href: '/community' },
      { label: 'Sumato Charity', href: '/charity' },
    ]
  },
  {
    title: 'Products',
    links: [
      { label: 'Spot Trading', href: '/trade/BTC-USDT' },
      { label: 'Futures Trading', href: '/futures' },
      { label: 'P2P Trading', href: '/p2p' },
      { label: 'Simple Earn', href: '/earn' },
      { label: 'Launchpad', href: '/launchpad' },
      { label: 'NFT Marketplace', href: '/nft' },
    ]
  },
  {
    title: 'Services',
    links: [
      { label: 'Buy Crypto', href: '/buy' },
      { label: 'Markets', href: '/markets' },
      { label: 'Trading Fee', href: '/fees' },
      { label: 'Affiliate', href: '/affiliate' },
      { label: 'Referral', href: '/referral' },
      { label: 'API', href: '/api-docs' },
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Live Chat', href: '/support' },
      { label: 'Fees', href: '/fees' },
      { label: 'Trading Rules', href: '/rules' },
      { label: 'Announcements', href: '/announcements' },
      { label: 'Status Page', href: '/status' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Use', href: '/terms' },
      { label: 'Risk Disclosure', href: '/risk' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'AML Policy', href: '/aml' },
    ]
  },
];

const SOCIALS = [
  { Icon: X, href: '#', label: 'Twitter/X' },
  { Icon: Send, href: '#', label: 'Telegram' },
  { Icon: Video, href: '#', label: 'YouTube' },
  { Icon: Camera, href: '#', label: 'Instagram' },
  { Icon: GitBranch, href: '#', label: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Main grid */}
      <div className={styles.footerMain}>
        <div className="container-wide">
          <div className={styles.footerGrid}>
            {/* Brand */}
            <div className={styles.brand}>
              <div className={styles.brandLogo}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="#fcd535"/>
                  <polygon points="14,6 22,10 22,18 14,22 6,18 6,10" fill="#0b0e11"/>
                  <polygon points="14,10 18,12 18,16 14,18 10,16 10,12" fill="#fcd535"/>
                </svg>
                <span className={styles.brandName}>SUMATO</span>
              </div>
              <p className={styles.brandDesc}>
                The world's most trusted cryptocurrency exchange. Trade with confidence on the most secure and liquid platform.
              </p>
              <div className={styles.socials}>
                {SOCIALS.map(({ Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} className={styles.socialIcon}>
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links */}
            {FOOTER_LINKS.map((col) => (
              <div key={col.title} className={styles.footerCol}>
                <h4 className={styles.colTitle}>{col.title}</h4>
                <ul className={styles.colLinks}>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className={styles.colLink}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className={styles.footerBottom}>
        <div className="container-wide">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © 2024 Sumato Exchange. All Rights Reserved.
            </p>
            <div className={styles.bottomLinks}>
              <Link href="/privacy" className={styles.bottomLink}>Privacy</Link>
              <span>·</span>
              <Link href="/terms" className={styles.bottomLink}>Terms</Link>
              <span>·</span>
              <Link href="/cookies" className={styles.bottomLink}>Cookies</Link>
              <span>·</span>
              <Link href="/sitemap" className={styles.bottomLink}>Sitemap</Link>
            </div>
            <div className={styles.disclaimer}>
              Crypto trading involves risk. Only invest what you can afford to lose.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
