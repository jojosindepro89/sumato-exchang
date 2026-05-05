'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search, ChevronDown, Bell, Menu, X, TrendingUp, Zap,
  Coins, Gift, Layers, Globe, LogIn, Wallet, BarChart2,
  Settings, LogOut, User, Shield, Copy, ChevronRight,
  MessageCircle, Zap as ZapIcon, Plane, ShoppingBag, Lock, Users
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './Navbar.module.css';

const navLinks = [
  { label: 'Buy Crypto', href: '/buy', icon: null },
  { label: 'Markets', href: '/markets', icon: null },
  {
    label: 'Trade', href: '#', icon: ChevronDown,
    dropdown: [
      { label: 'Spot', href: '/trade/BTC-USDT', icon: TrendingUp, desc: 'Buy & sell crypto' },
      { label: 'Futures', href: '/futures', icon: Zap, desc: 'Trade with leverage' },
      { label: 'Options', href: '/options', icon: Layers, desc: 'Options trading' },
    ]
  },
  {
    label: 'Earn', href: '/earn', icon: ChevronDown,
    dropdown: [
      { label: 'Simple Earn', href: '/earn', icon: Coins, desc: 'Earn daily rewards' },
      { label: 'Launchpad', href: '/launchpad', icon: Gift, desc: 'Discover new tokens' },
      { label: 'Vault', href: '/dashboard/vault', icon: Lock, desc: 'Lock & earn yield' },
    ]
  },
  { label: 'P2P', href: '/p2p', icon: null },
  {
    label: 'Services', href: '#', icon: ChevronDown,
    dropdown: [
      { label: 'Bill Payments', href: '/services/bills', icon: ZapIcon, desc: 'Electricity, water, internet' },
      { label: 'Flight Tickets', href: '/services/flights', icon: Plane, desc: 'Book flights with crypto' },
      { label: 'Gift Cards', href: '/services/giftcards', icon: ShoppingBag, desc: 'Buy & sell gift cards' },
    ]
  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    router.push('/');
  };

  const copyUid = () => {
    if (user?.uid) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" fill="#fcd535"/>
              <polygon points="14,6 22,10 22,18 14,22 6,18 6,10" fill="#0b0e11"/>
              <polygon points="14,10 18,12 18,16 14,18 10,16 10,12" fill="#fcd535"/>
            </svg>
          </div>
          <span className={styles.logoText}>SUMATO</span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <div
              key={link.label}
              className={styles.navItem}
              onMouseEnter={() => link.dropdown && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
              >
                {link.label}
                {link.icon && <link.icon size={14} className={styles.chevron} />}
              </Link>

              {link.dropdown && activeDropdown === link.label && (
                <div className={styles.dropdown}>
                  {link.dropdown.map((item) => (
                    <Link key={item.label} href={item.href} className={styles.dropdownItem}>
                      <div className={styles.dropdownIcon}>
                        <item.icon size={18} />
                      </div>
                      <div>
                        <div className={styles.dropdownLabel}>{item.label}</div>
                        <div className={styles.dropdownDesc}>{item.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Actions */}
        <div className={styles.navRight}>
          <button className={styles.iconBtn} onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
            <Search size={18} />
          </button>
          <button className={styles.iconBtn} aria-label="Language">
            <Globe size={18} />
          </button>

          {isLoggedIn && user ? (
            <>
              <Link href="/chat" className={styles.iconBtn} aria-label="Messages" style={{ position: 'relative' }}>
                <MessageCircle size={18} />
                <span className={styles.chatBadge}>3</span>
              </Link>
              <button className={styles.iconBtn} aria-label="Notifications" style={{ position: 'relative' }}>
                <Bell size={18} />
                <span className={styles.notifDot} />
              </button>

              <div ref={profileRef} className={styles.profileWrap}>
                <button
                  className={styles.avatarBtn}
                  onClick={() => setProfileOpen(!profileOpen)}
                  id="navbar-profile-btn"
                >
                  <div className={styles.avatar}>{user.avatar}</div>
                  <ChevronDown size={14} className={profileOpen ? styles.chevronUp : ''} />
                </button>

                {profileOpen && (
                  <div className={styles.profileDropdown}>
                    {/* User info */}
                    <div className={styles.profileHeader}>
                      <div className={styles.profileAvatar}>{user.avatar}</div>
                      <div>
                        <div className={styles.profileName}>{user.name}</div>
                        <div className={styles.profileEmail}>{user.email}</div>
                        <div className={styles.profileLevel}>
                          <span className={styles.levelBadge}>{user.level}</span>
                          {user.kycStatus === 'verified' && <span className={styles.kycBadge}>✓ KYC</span>}
                        </div>
                      </div>
                    </div>

                    <div className={styles.profileUid}>
                      <span>UID: {user.uid}</span>
                      <button onClick={copyUid} className={styles.copyBtn}>
                        {copied ? '✓' : <Copy size={12} />}
                      </button>
                    </div>

                    <div className={styles.profileMenu}>
                      <Link href="/dashboard" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                        <BarChart2 size={15} /> Dashboard
                        <ChevronRight size={13} className={styles.menuArrow} />
                      </Link>
                      <Link href="/dashboard/wallet" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                        <Wallet size={15} /> My Wallet
                        <ChevronRight size={13} className={styles.menuArrow} />
                      </Link>
                      <Link href="/dashboard/vault" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                        <Lock size={15} /> Vault
                        <ChevronRight size={13} className={styles.menuArrow} />
                      </Link>
                      <Link href="/p2p" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                        <Users size={15} /> P2P Trading
                        <ChevronRight size={13} className={styles.menuArrow} />
                      </Link>
                      <Link href="/services" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                        <ShoppingBag size={15} /> Services
                        <ChevronRight size={13} className={styles.menuArrow} />
                      </Link>
                      <Link href="/chat" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                        <MessageCircle size={15} /> Messages
                        <ChevronRight size={13} className={styles.menuArrow} />
                      </Link>
                      <Link href="/dashboard/orders" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                        <TrendingUp size={15} /> Orders
                        <ChevronRight size={13} className={styles.menuArrow} />
                      </Link>
                      <Link href="/dashboard/kyc" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                        <Shield size={15} /> Verification
                        <ChevronRight size={13} className={styles.menuArrow} />
                      </Link>
                      <Link href="/dashboard/settings" className={styles.profileMenuItem} onClick={() => setProfileOpen(false)}>
                        <Settings size={15} /> Settings
                        <ChevronRight size={13} className={styles.menuArrow} />
                      </Link>
                    </div>

                    <button className={styles.logoutBtn} onClick={handleLogout} id="navbar-logout-btn">
                      <LogOut size={15} /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button className={styles.iconBtn} aria-label="Notifications">
                <Bell size={18} />
              </button>
              <Link href="/login" className={styles.loginBtn}>
                <LogIn size={15} />
                Log In
              </Link>
              <Link href="/register" className={styles.registerBtn}>
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <button
            className={`${styles.iconBtn} ${styles.mobileToggle}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Search bar */}
      {searchOpen && (
        <div className={styles.searchBar}>
          <div className={styles.searchInner}>
            <Search size={16} className={styles.searchIcon} />
            <input autoFocus placeholder="Search coins, pairs..." className={styles.searchInput} />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isLoggedIn ? (
            <div className={styles.mobileBtns}>
              <Link href="/dashboard" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>
                <User size={14} /> Dashboard
              </Link>
              <button className="btn-secondary" style={{ flex: 1, justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => { handleLogout(); setMobileOpen(false); }}>
                <LogOut size={14} /> Log Out
              </button>
            </div>
          ) : (
            <div className={styles.mobileBtns}>
              <Link href="/login" className="btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Log In</Link>
              <Link href="/register" className="btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
