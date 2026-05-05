'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar/Navbar';
import {
  ChevronRight, User, Shield, Bell, Smartphone, Key,
  Globe, Moon, Save, CheckCircle2, Eye, EyeOff
} from 'lucide-react';
import styles from './settings.module.css';

type Tab = 'profile' | 'security' | 'notifications' | 'api';

export default function SettingsPage() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);
  const [showPw, setShowPw] = useState(false);

  // Notification prefs
  const [notifs, setNotifs] = useState({
    priceAlerts: true, orderFills: true, deposits: true,
    withdrawals: true, news: false, marketing: false,
  });

  // 2FA
  const [twofa, setTwofa] = useState(true);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push('/login');
  }, [isLoading, isLoggedIn, router]);

  if (!user) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>

          <div className={styles.breadcrumb}>
            <Link href="/dashboard" className={styles.breadLink}>Dashboard</Link>
            <ChevronRight size={13} />
            <span>Settings</span>
          </div>

          <h1 className={styles.pageTitle}>Account Settings</h1>

          <div className={styles.layout}>
            {/* Sidebar nav */}
            <nav className={styles.settingsNav}>
              {([
                { id: 'profile', icon: User, label: 'Profile' },
                { id: 'security', icon: Shield, label: 'Security' },
                { id: 'notifications', icon: Bell, label: 'Notifications' },
                { id: 'api', icon: Key, label: 'API Management' },
              ] as { id: Tab; icon: typeof User; label: string }[]).map(item => (
                <button
                  key={item.id}
                  className={`${styles.navItem} ${tab === item.id ? styles.navActive : ''}`}
                  onClick={() => setTab(item.id)}
                >
                  <item.icon size={16} />
                  {item.label}
                  <ChevronRight size={13} className={styles.navArrow} />
                </button>
              ))}
            </nav>

            {/* Content */}
            <div className={styles.settingsContent}>

              {/* ===== PROFILE ===== */}
              {tab === 'profile' && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Profile Information</h2>

                  <div className={styles.avatarRow}>
                    <div className={styles.bigAvatar}>{user.avatar}</div>
                    <div>
                      <button className={styles.changeAvatarBtn}>Change Avatar</button>
                      <div className={styles.avatarHint}>JPG, GIF or PNG. Max 2MB.</div>
                    </div>
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>Full Name</label>
                      <input defaultValue={user.name} className={styles.fieldInput} />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>Display Name</label>
                      <input defaultValue={user.name.split(' ')[0]} className={styles.fieldInput} />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>Email Address</label>
                      <input defaultValue={user.email} type="email" className={styles.fieldInput} />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>Phone Number</label>
                      <input defaultValue="+1 (555) 012-3456" type="tel" className={styles.fieldInput} />
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>Country</label>
                      <select className={styles.fieldSelect}>
                        <option>United States</option>
                        <option>United Kingdom</option>
                        <option>Nigeria</option>
                        <option>Germany</option>
                        <option>Singapore</option>
                      </select>
                    </div>
                    <div className={styles.formField}>
                      <label className={styles.fieldLabel}>Preferred Language</label>
                      <select className={styles.fieldSelect}>
                        <option>English</option>
                        <option>Chinese (Simplified)</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formField} style={{ maxWidth: '100%' }}>
                    <label className={styles.fieldLabel}>Bio</label>
                    <textarea className={styles.fieldTextarea} rows={3} defaultValue="Crypto trader & investor. Building wealth one block at a time. 🚀" />
                  </div>

                  <button className={styles.saveBtn} onClick={handleSave}>
                    {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
                  </button>
                </div>
              )}

              {/* ===== SECURITY ===== */}
              {tab === 'security' && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Security Settings</h2>

                  <div className={styles.securityItem}>
                    <div className={styles.secItemLeft}>
                      <div className={styles.secItemIcon} style={{ background: 'rgba(252,213,53,0.1)', color: 'var(--accent)' }}>
                        <Key size={18} />
                      </div>
                      <div>
                        <div className={styles.secItemTitle}>Password</div>
                        <div className={styles.secItemDesc}>Last changed 30 days ago</div>
                      </div>
                    </div>
                    <button className={styles.secActionBtn}>Change Password</button>
                  </div>

                  <div className={styles.securityItem}>
                    <div className={styles.secItemLeft}>
                      <div className={styles.secItemIcon} style={{ background: 'rgba(14,203,129,0.1)', color: 'var(--green)' }}>
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <div className={styles.secItemTitle}>2-Factor Authentication (2FA)</div>
                        <div className={styles.secItemDesc}>{twofa ? 'Enabled — Google Authenticator' : 'Not enabled — Your account is at risk'}</div>
                      </div>
                    </div>
                    <label className={styles.toggle}>
                      <input type="checkbox" checked={twofa} onChange={e => setTwofa(e.target.checked)} />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>

                  <div className={styles.securityItem}>
                    <div className={styles.secItemLeft}>
                      <div className={styles.secItemIcon} style={{ background: 'rgba(99,126,234,0.1)', color: '#627eea' }}>
                        <Shield size={18} />
                      </div>
                      <div>
                        <div className={styles.secItemTitle}>Anti-Phishing Code</div>
                        <div className={styles.secItemDesc}>Add a unique code to all Sumato emails</div>
                      </div>
                    </div>
                    <button className={styles.secActionBtn}>Set Code</button>
                  </div>

                  <div className={styles.securityItem}>
                    <div className={styles.secItemLeft}>
                      <div className={styles.secItemIcon} style={{ background: 'rgba(246,70,93,0.1)', color: 'var(--red)' }}>
                        <Globe size={18} />
                      </div>
                      <div>
                        <div className={styles.secItemTitle}>Login Whitelist</div>
                        <div className={styles.secItemDesc}>Restrict logins to approved IP addresses only</div>
                      </div>
                    </div>
                    <button className={styles.secActionBtn}>Manage</button>
                  </div>

                  <div className={styles.passwordSection}>
                    <h3 className={styles.subTitle}>Change Password</h3>
                    <div className={styles.passwordForm}>
                      <div className={styles.formField}>
                        <label className={styles.fieldLabel}>Current Password</label>
                        <div className={styles.pwWrap}>
                          <input type={showPw ? 'text' : 'password'} className={styles.fieldInput} placeholder="Enter current password" />
                          <button className={styles.pwToggle} type="button" onClick={() => setShowPw(!showPw)}>
                            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.fieldLabel}>New Password</label>
                        <input type="password" className={styles.fieldInput} placeholder="Min. 8 characters" />
                      </div>
                      <div className={styles.formField}>
                        <label className={styles.fieldLabel}>Confirm New Password</label>
                        <input type="password" className={styles.fieldInput} placeholder="Repeat new password" />
                      </div>
                    </div>
                    <button className={styles.saveBtn} onClick={handleSave}>
                      {saved ? <><CheckCircle2 size={16} /> Updated!</> : <><Save size={16} /> Update Password</>}
                    </button>
                  </div>
                </div>
              )}

              {/* ===== NOTIFICATIONS ===== */}
              {tab === 'notifications' && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>Notification Preferences</h2>
                  <div className={styles.notifList}>
                    {(Object.keys(notifs) as (keyof typeof notifs)[]).map(key => (
                      <div key={key} className={styles.notifRow}>
                        <div>
                          <div className={styles.notifLabel}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                          </div>
                          <div className={styles.notifDesc}>
                            {key === 'priceAlerts' && 'Get notified when your price targets are hit'}
                            {key === 'orderFills' && 'Notifications when your orders are filled'}
                            {key === 'deposits' && 'Confirm deposit arrivals via email & push'}
                            {key === 'withdrawals' && 'Security alerts for all withdrawals'}
                            {key === 'news' && 'Market news and exchange announcements'}
                            {key === 'marketing' && 'Promotions, rewards and referral updates'}
                          </div>
                        </div>
                        <label className={styles.toggle}>
                          <input type="checkbox" checked={notifs[key]} onChange={e => setNotifs(prev => ({ ...prev, [key]: e.target.checked }))} />
                          <span className={styles.toggleSlider} />
                        </label>
                      </div>
                    ))}
                  </div>
                  <button className={styles.saveBtn} onClick={handleSave}>
                    {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Preferences</>}
                  </button>
                </div>
              )}

              {/* ===== API ===== */}
              {tab === 'api' && (
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>API Management</h2>
                  <div className={styles.apiEmpty}>
                    <Key size={40} className={styles.apiIcon} />
                    <div className={styles.apiEmptyTitle}>No API Keys</div>
                    <div className={styles.apiEmptyDesc}>Create an API key to access Sumato programmatically via trading bots, data tools, and more.</div>
                    <button className={styles.createApiBtn}>+ Create API Key</button>
                  </div>
                  <div className={styles.apiNote}>
                    <Shield size={14} />
                    <span>API keys grant access to your account. Never share them. Always restrict IPs for security.</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>
    </>
  );
}
