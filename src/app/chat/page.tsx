'use client';
import { useState, useRef, useEffect } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Send, Search, MessageCircle, Shield, AlertTriangle, Paperclip, Phone, MoreVertical, Check, CheckCheck } from 'lucide-react';
import styles from './chat.module.css';

type Message = { from: 'me' | 'them'; text: string; time: string; read: boolean; };
type Thread = { id: string; name: string; avatar: string; lastMsg: string; time: string; unread: number; tradeRef: string; tradeStatus: string; tradeAmount: string; online: boolean; messages: Message[] };

const THREADS: Thread[] = [
  {
    id: 't1', name: 'CryptoKing_Pro', avatar: 'CK', lastMsg: 'Payment details are shown above.', time: '2m ago',
    unread: 2, tradeRef: 'TRADE-001', tradeStatus: 'Payment Pending', tradeAmount: '200 USDT', online: true,
    messages: [
      { from: 'them', text: 'Hello! I see you want to buy USDT. Please check the payment details.', time: '14:30', read: true },
      { from: 'me', text: 'Hi! Yes, ready to proceed. What bank details should I use?', time: '14:31', read: true },
      { from: 'them', text: 'Payment details are shown above. Make sure to include the reference.', time: '14:32', read: false },
      { from: 'them', text: 'Also don\'t write "crypto" in the payment reference — it may flag your transfer.', time: '14:32', read: false },
    ],
  },
  {
    id: 't2', name: 'SafeTrader_NG', avatar: 'ST', lastMsg: 'Your payment has been confirmed ✓', time: '1h ago',
    unread: 0, tradeRef: 'TRADE-002', tradeStatus: 'Completed', tradeAmount: '0.05 BTC', online: false,
    messages: [
      { from: 'them', text: 'I received your payment. Releasing BTC now.', time: '11:00', read: true },
      { from: 'me', text: 'Thank you! Really smooth trade.', time: '11:02', read: true },
      { from: 'them', text: 'Your payment has been confirmed ✓', time: '11:03', read: true },
    ],
  },
  {
    id: 't3', name: 'TrustVault', avatar: 'TV', lastMsg: 'Please send payment ASAP.', time: '3h ago',
    unread: 1, tradeRef: 'TRADE-003', tradeStatus: 'Awaiting Payment', tradeAmount: '500 USDT', online: true,
    messages: [
      { from: 'them', text: 'Hi, your order for 500 USDT is confirmed. Please proceed with payment.', time: '09:00', read: true },
      { from: 'them', text: 'Please send payment ASAP.', time: '09:45', read: false },
    ],
  },
];

export default function ChatPage() {
  const { isLoggedIn, isLoading, user } = useAuth();
  const router = useRouter();
  const [activeId, setActiveId] = useState('t1');
  const [threads, setThreads] = useState(THREADS);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) router.push('/login');
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, threads]);

  const active = threads.find(t => t.id === activeId)!;

  const sendMsg = () => {
    if (!message.trim()) return;
    const newMsg: Message = { from: 'me', text: message, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), read: false };
    setThreads(prev => prev.map(t =>
      t.id === activeId ? { ...t, messages: [...t.messages, newMsg], lastMsg: message, time: 'Just now' } : t
    ));
    setMessage('');

    // Auto-reply after 1.5s
    const replies = [
      'Got it, I\'ll check now.',
      'One moment please.',
      'Thank you for the update!',
      'Everything looks good on my end.',
      'Payment confirmed, releasing funds now. ✓',
    ];
    setTimeout(() => {
      const reply: Message = { from: 'them', text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), read: false };
      setThreads(prev => prev.map(t =>
        t.id === activeId ? { ...t, messages: [...t.messages, reply], lastMsg: reply.text, time: 'Just now' } : t
      ));
    }, 1500);
  };

  if (!user) return null;

  const filteredThreads = threads.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.chatLayout}>

          {/* Left sidebar — conversation list */}
          <div className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <div className={styles.sidebarTitle}>
                <MessageCircle size={18} />
                <span>Messages</span>
                {totalUnread > 0 && <span className={styles.totalBadge}>{totalUnread}</span>}
              </div>
              <div className={styles.searchWrap}>
                <Search size={13} className={styles.searchIcon} />
                <input className={styles.searchInput} placeholder="Search conversations..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
            </div>

            <div className={styles.threadList}>
              {filteredThreads.map(t => (
                <div
                  key={t.id}
                  className={`${styles.threadItem} ${t.id === activeId ? styles.threadActive : ''}`}
                  onClick={() => {
                    setActiveId(t.id);
                    setThreads(prev => prev.map(th => th.id === t.id ? { ...th, unread: 0 } : th));
                  }}
                >
                  <div className={styles.threadAvatarWrap}>
                    <div className={styles.threadAvatar}>{t.avatar}</div>
                    <div className={`${styles.threadDot} ${t.online ? styles.dotOnline : styles.dotOffline}`} />
                  </div>
                  <div className={styles.threadInfo}>
                    <div className={styles.threadTop}>
                      <span className={styles.threadName}>{t.name}</span>
                      <span className={styles.threadTime}>{t.time}</span>
                    </div>
                    <div className={styles.threadBottom}>
                      <span className={styles.threadPreview}>{t.lastMsg}</span>
                      {t.unread > 0 && <span className={styles.unreadBadge}>{t.unread}</span>}
                    </div>
                    <div className={`${styles.tradePill} ${t.tradeStatus === 'Completed' ? styles.pillDone : styles.pillPending}`}>
                      {t.tradeRef} · {t.tradeStatus}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main chat area */}
          <div className={styles.chatMain}>
            {active && (
              <>
                {/* Chat header */}
                <div className={styles.chatHeader}>
                  <div className={styles.chatTrader}>
                    <div className={styles.chatAvatarWrap}>
                      <div className={styles.chatAvatar}>{active.avatar}</div>
                      <div className={`${styles.chatDot} ${active.online ? styles.dotOnline : styles.dotOffline}`} />
                    </div>
                    <div>
                      <div className={styles.chatName}>{active.name}</div>
                      <div className={styles.chatOnlineStatus}>{active.online ? '🟢 Online' : '⚫ Offline'}</div>
                    </div>
                  </div>
                  <div className={styles.chatHeaderActions}>
                    <button className={styles.headerActionBtn}><Phone size={16} /></button>
                    <button className={styles.headerActionBtn}><AlertTriangle size={16} /></button>
                    <button className={styles.headerActionBtn}><MoreVertical size={16} /></button>
                  </div>
                </div>

                {/* Trade card pinned at top */}
                <div className={styles.tradeCard}>
                  <Shield size={14} className={styles.tradeCardIcon} />
                  <div className={styles.tradeCardInfo}>
                    <span className={styles.tradeCardRef}>{active.tradeRef}</span>
                    <span className={styles.tradeCardSep}>·</span>
                    <span className={styles.tradeCardAmount}>{active.tradeAmount}</span>
                    <span className={styles.tradeCardSep}>·</span>
                    <span className={`${styles.tradeCardStatus} ${active.tradeStatus === 'Completed' ? styles.statusDone : styles.statusPending}`}>
                      {active.tradeStatus}
                    </span>
                  </div>
                  <Link href={`/p2p/${active.tradeRef.toLowerCase().replace('trade-', 'trade-00')}`} className={styles.viewTradeBtn}>
                    View Trade →
                  </Link>
                </div>

                {/* Messages */}
                <div className={styles.messages}>
                  <div className={styles.dateChip}>Today</div>
                  {active.messages.map((m, i) => (
                    <div key={i} className={`${styles.msgRow} ${m.from === 'me' ? styles.msgMine : styles.msgTheirs}`}>
                      {m.from === 'them' && <div className={styles.msgAvatar}>{active.avatar}</div>}
                      <div className={styles.bubble}>
                        <div className={`${styles.bubbleText} ${m.from === 'me' ? styles.bubbleMine : styles.bubbleTheirs}`}>
                          {m.text}
                        </div>
                        <div className={styles.msgMeta}>
                          <span className={styles.msgTime}>{m.time}</span>
                          {m.from === 'me' && (m.read ? <CheckCheck size={12} className={styles.readTick} /> : <Check size={12} className={styles.unreadTick} />)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Input bar */}
                <div className={styles.inputBar}>
                  <button className={styles.attachBtn}><Paperclip size={18} /></button>
                  <input
                    className={styles.msgInput}
                    placeholder="Type a message..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMsg()}
                  />
                  <button className={styles.sendBtn} onClick={sendMsg} disabled={!message.trim()}>
                    <Send size={18} />
                  </button>
                </div>

                {/* Dispute quick action */}
                <div className={styles.disputeBar}>
                  <AlertTriangle size={12} />
                  <span>Having issues?</span>
                  <button className={styles.disputeQuickBtn}>Raise a Dispute</button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
