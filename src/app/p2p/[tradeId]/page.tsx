'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar/Navbar';
import {
  Shield, CheckCircle2, Clock, Copy, Star, AlertTriangle,
  MessageCircle, ChevronRight, X, Send, Loader2, PartyPopper, ArrowLeft
} from 'lucide-react';
import styles from './escrow.module.css';

const TRADERS: Record<string, { name: string; avatar: string; rating: number; trades: number }> = {
  'trade-001': { name: 'CryptoKing_Pro', avatar: 'CK', rating: 4.97, trades: 1284 },
  'trade-002': { name: 'SafeTrader_NG', avatar: 'ST', rating: 4.89, trades: 876 },
  'trade-003': { name: 'GlobalExchange', avatar: 'GE', rating: 4.95, trades: 2341 },
  'trade-004': { name: 'QuickDealer_X', avatar: 'QD', rating: 4.72, trades: 342 },
  'trade-005': { name: 'TrustVault', avatar: 'TV', rating: 4.98, trades: 3876 },
  'trade-006': { name: 'BitMerchant22', avatar: 'BM', rating: 4.81, trades: 658 },
};

type Stage = 1 | 2 | 3 | 4;

const INIT_MESSAGES = [
  { from: 'seller', text: 'Hello! I see you want to buy USDT. Please send payment to the bank account shown.', time: '2 min ago' },
  { from: 'buyer', text: 'Hi! Yes, I\'m ready to pay. What\'s the account number?', time: '1 min ago' },
  { from: 'seller', text: 'The details are shown in the payment section. Please mark as paid once done.', time: 'Just now' },
];

export default function EscrowPage() {
  const params = useParams();
  const tradeId = (params?.tradeId as string) || 'trade-001';
  const trader = TRADERS[tradeId] || TRADERS['trade-001'];

  const [stage, setStage] = useState<Stage>(1);
  const [countdown, setCountdown] = useState(900); // 15 minutes
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [chatMsg, setChatMsg] = useState('');
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingHover, setRatingHover] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Countdown timer
  useEffect(() => {
    if (stage !== 2) return;
    const iv = setInterval(() => {
      setCountdown(c => c > 0 ? c - 1 : 0);
    }, 1000);
    return () => clearInterval(iv);
  }, [stage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setMessages(prev => [...prev, { from: 'buyer', text: chatMsg, time: 'Just now' }]);
    setChatMsg('');
    // Simulate seller reply
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'seller', text: 'Got it, thank you! I will check.', time: 'Just now' }]);
    }, 1800);
  };

  const handleConfirmOrder = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1400));
    setPlacing(false);
    setStage(2);
  };

  const handlePaid = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1200));
    setPlacing(false);
    setStage(3);
    // Simulate seller releasing after 5s
    setTimeout(() => setStage(4), 5000);
  };

  const submitDispute = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1200));
    setPlacing(false);
    setDisputeSubmitted(true);
  };

  const steps = [
    { n: 1, label: 'Confirm Order' },
    { n: 2, label: 'Make Payment' },
    { n: 3, label: 'Awaiting Release' },
    { n: 4, label: 'Complete' },
  ];

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>

          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <Link href="/p2p" className={styles.backLink}><ArrowLeft size={14} /> P2P Market</Link>
            <ChevronRight size={13} />
            <span>Order #{tradeId}</span>
          </div>

          {/* Progress stepper */}
          <div className={styles.stepper}>
            {steps.map((s, i) => (
              <div key={s.n} className={styles.stepItem}>
                <div className={`${styles.stepNum} ${stage > s.n ? styles.stepDone : stage === s.n ? styles.stepActive : styles.stepFuture}`}>
                  {stage > s.n ? <CheckCircle2 size={14} /> : s.n}
                </div>
                <div className={`${styles.stepLabel} ${stage === s.n ? styles.stepLabelActive : ''}`}>{s.label}</div>
                {i < steps.length - 1 && <div className={`${styles.stepLine} ${stage > s.n ? styles.stepLineDone : ''}`} />}
              </div>
            ))}
          </div>

          <div className={styles.mainGrid}>
            {/* Left: Trade flow */}
            <div className={styles.tradePanel}>

              {/* ===== STAGE 1 — Confirm ===== */}
              {stage === 1 && (
                <div className={styles.stageCard}>
                  <div className={styles.stageTitle}>📋 Confirm Your Order</div>
                  <div className={styles.orderSummary}>
                    <div className={styles.summaryRow}><span>You Buy</span><strong className={styles.greenText}>200.00 USDT</strong></div>
                    <div className={styles.summaryRow}><span>Unit Price</span><strong>$1.002 USD</strong></div>
                    <div className={styles.summaryRow}><span>You Pay</span><strong className={styles.accentText}>$200.40 USD</strong></div>
                    <div className={styles.summaryRow}><span>Payment Method</span><strong>Bank Transfer</strong></div>
                    <div className={styles.summaryRow}><span>Time Limit</span><strong>15 minutes</strong></div>
                    <div className={styles.summaryRow}><span>Order Ref</span><strong>#{tradeId.toUpperCase()}</strong></div>
                  </div>

                  <div className={styles.traderInfo}>
                    <div className={styles.traderAvatar}>{trader.avatar}</div>
                    <div>
                      <div className={styles.traderName}>{trader.name}</div>
                      <div className={styles.traderStats}>
                        <Star size={12} fill="var(--accent)" color="var(--accent)" />
                        {trader.rating} · {trader.trades} trades
                      </div>
                    </div>
                    <div className={styles.traderBadge}><Shield size={12} /> Verified</div>
                  </div>

                  <div className={styles.escrowNote}>
                    <Shield size={14} />
                    <span>Once you click confirm, <strong>200 USDT will be locked in escrow</strong> by Sumato until the trade is complete.</span>
                  </div>

                  <button className={styles.confirmBtn} onClick={handleConfirmOrder} disabled={placing}>
                    {placing ? <><Loader2 size={15} className={styles.spin} /> Placing Order...</> : '🔒 Confirm & Lock Escrow'}
                  </button>
                </div>
              )}

              {/* ===== STAGE 2 — Payment ===== */}
              {stage === 2 && (
                <div className={styles.stageCard}>
                  <div className={styles.escapBanner}>
                    <Shield size={18} />
                    <div>
                      <div className={styles.escrowTitle}>🔐 Funds in Escrow — Make Payment Now</div>
                      <div className={styles.escrowSub}>200 USDT is held securely. Send $200.40 USD to the account below.</div>
                    </div>
                    <div className={styles.timerBox}>
                      <Clock size={14} />
                      <span className={`${styles.timer} ${countdown < 120 ? styles.timerRed : ''}`}>{fmt(countdown)}</span>
                    </div>
                  </div>

                  <div className={styles.paymentDetails}>
                    <div className={styles.payTitle}>Payment Details — Bank Transfer</div>
                    {[
                      { label: 'Account Name', value: 'John A. Smith', key: 'name' },
                      { label: 'Bank Name', value: 'Chase Bank USA', key: 'bank' },
                      { label: 'Account Number', value: '4872 0193 5582 6641', key: 'acct' },
                      { label: 'Routing Number', value: '021000021', key: 'routing' },
                      { label: 'Reference', value: tradeId.toUpperCase(), key: 'ref' },
                      { label: 'Amount to Send', value: '$200.40 USD', key: 'amount' },
                    ].map(field => (
                      <div key={field.key} className={styles.payRow}>
                        <span className={styles.payLabel}>{field.label}</span>
                        <div className={styles.payValue}>
                          <span>{field.value}</span>
                          <button className={styles.copyBtn} onClick={() => copyText(field.value, field.key)}>
                            {copiedField === field.key ? '✓' : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.payWarning}>
                    <AlertTriangle size={13} />
                    <span>Do NOT include "crypto", "USDT", or "Sumato" in the payment reference. This may flag your bank transfer.</span>
                  </div>

                  <button className={styles.paidBtn} onClick={handlePaid} disabled={placing}>
                    {placing ? <><Loader2 size={15} className={styles.spin} /> Confirming...</> : '✅ I Have Sent the Payment'}
                  </button>
                  <button className={styles.cancelTradeBtn}>Cancel Trade</button>
                </div>
              )}

              {/* ===== STAGE 3 — Awaiting Release ===== */}
              {stage === 3 && (
                <div className={styles.stageCard}>
                  <div className={styles.awaitingBanner}>
                    <div className={styles.awaitSpinner} />
                    <div>
                      <div className={styles.awaitTitle}>Payment Received — Awaiting Crypto Release</div>
                      <div className={styles.awaitSub}>The seller is verifying your payment. Funds will be released automatically.</div>
                    </div>
                  </div>

                  <div className={styles.awaitSteps}>
                    <div className={styles.awaitStep}><CheckCircle2 size={15} className={styles.awaitDone} /> Order confirmed</div>
                    <div className={styles.awaitStep}><CheckCircle2 size={15} className={styles.awaitDone} /> Payment sent</div>
                    <div className={styles.awaitStep}><div className={styles.awaitPending} /><span>Seller verifying payment...</span></div>
                    <div className={styles.awaitStep}><div className={styles.awaitFuture} /> Crypto released to your wallet</div>
                  </div>

                  <div className={styles.awaitNote}>
                    <Clock size={13} /> Expected release in <strong>1–5 minutes</strong>
                  </div>

                  <button className={styles.disputeBtn} onClick={() => setShowDispute(true)}>
                    <AlertTriangle size={14} /> Raise a Dispute
                  </button>
                </div>
              )}

              {/* ===== STAGE 4 — Complete ===== */}
              {stage === 4 && (
                <div className={styles.stageCard}>
                  <div className={styles.successCard}>
                    <div className={styles.successIcon}><PartyPopper size={40} /></div>
                    <div className={styles.successTitle}>Trade Complete! 🎉</div>
                    <div className={styles.successSub}>200 USDT has been released to your wallet</div>
                  </div>

                  <div className={styles.receiptGrid}>
                    <div className={styles.receiptRow}><span>Received</span><strong className={styles.greenText}>200.00 USDT</strong></div>
                    <div className={styles.receiptRow}><span>You Paid</span><strong>$200.40 USD</strong></div>
                    <div className={styles.receiptRow}><span>Platform Fee</span><strong>$0.00</strong></div>
                    <div className={styles.receiptRow}><span>Order Ref</span><strong>#{tradeId.toUpperCase()}</strong></div>
                    <div className={styles.receiptRow}><span>Completed At</span><strong>{new Date().toLocaleString()}</strong></div>
                  </div>

                  {/* Rating */}
                  {!ratingSubmitted ? (
                    <div className={styles.ratingBox}>
                      <div className={styles.ratingTitle}>Rate {trader.name}</div>
                      <div className={styles.stars}>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} className={styles.starBtn}
                            onMouseEnter={() => setRatingHover(n)}
                            onMouseLeave={() => setRatingHover(0)}
                            onClick={() => setRating(n)}
                          >
                            <Star size={28} fill={(ratingHover || rating) >= n ? 'var(--accent)' : 'none'} color={(ratingHover || rating) >= n ? 'var(--accent)' : 'var(--border)'} />
                          </button>
                        ))}
                      </div>
                      <textarea className={styles.reviewInput} placeholder="Leave a comment (optional)..." rows={2} />
                      <button className={styles.submitRatingBtn} onClick={() => setRatingSubmitted(true)} disabled={rating === 0}>
                        Submit Rating
                      </button>
                    </div>
                  ) : (
                    <div className={styles.ratingDone}><CheckCircle2 size={16} /> Rating submitted — thank you!</div>
                  )}

                  <div className={styles.successActions}>
                    <Link href="/p2p" className={styles.backToP2PBtn}>← Back to P2P</Link>
                    <Link href="/dashboard/wallet" className={styles.viewWalletBtn}>View Wallet</Link>
                  </div>
                </div>
              )}

            </div>

            {/* Right: Chat */}
            <div className={styles.chatPanel}>
              <div className={styles.chatHeader}>
                <div className={styles.chatTrader}>
                  <div className={styles.chatAvatar}>{trader.avatar}</div>
                  <div>
                    <div className={styles.chatName}>{trader.name}</div>
                    <div className={styles.chatOnline}>🟢 Online</div>
                  </div>
                </div>
                <MessageCircle size={18} className={styles.chatIcon} />
              </div>

              <div className={styles.chatMessages}>
                <div className={styles.chatSystemMsg}>Trade started — order #{tradeId.toUpperCase()}</div>
                {messages.map((m, i) => (
                  <div key={i} className={`${styles.messageBubble} ${m.from === 'buyer' ? styles.bubbleMine : styles.bubbleTheirs}`}>
                    <div className={styles.bubbleText}>{m.text}</div>
                    <div className={styles.bubbleTime}>{m.time}</div>
                  </div>
                ))}
                {stage === 4 && <div className={styles.chatSystemMsg}>✅ Trade completed successfully</div>}
                <div ref={chatEndRef} />
              </div>

              <div className={styles.chatInput}>
                <input
                  className={styles.chatInputField}
                  placeholder="Type a message..."
                  value={chatMsg}
                  onChange={e => setChatMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendChat()}
                  disabled={stage === 4}
                />
                <button className={styles.sendBtn} onClick={sendChat} disabled={!chatMsg.trim() || stage === 4}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dispute Modal */}
        {showDispute && (
          <div className={styles.modalOverlay} onClick={() => !placing && !disputeSubmitted && setShowDispute(false)}>
            <div className={styles.disputeModal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalTitle}><AlertTriangle size={18} /> Raise a Dispute</div>
                {!disputeSubmitted && <button className={styles.modalClose} onClick={() => setShowDispute(false)}><X size={18} /></button>}
              </div>
              {!disputeSubmitted ? (
                <>
                  <div className={styles.modalBody}>
                    <div className={styles.disputeField}>
                      <label>Reason for Dispute</label>
                      <select className={styles.disputeSelect} value={disputeReason} onChange={e => setDisputeReason(e.target.value)}>
                        <option value="">Select reason...</option>
                        <option>Payment sent but crypto not released</option>
                        <option>Wrong amount received</option>
                        <option>Suspected fraud</option>
                        <option>Seller unresponsive</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className={styles.disputeField}>
                      <label>Additional Notes</label>
                      <textarea className={styles.disputeTextarea} rows={4} placeholder="Describe the issue..." value={disputeNotes} onChange={e => setDisputeNotes(e.target.value)} />
                    </div>
                    <div className={styles.evidenceArea}>
                      <div className={styles.evidenceIcon}>📎</div>
                      <div>Upload Evidence (screenshot, receipt)</div>
                      <div className={styles.evidenceSub}>Drag & drop or click to upload</div>
                    </div>
                  </div>
                  <div className={styles.modalActions}>
                    <button className={styles.cancelDisputeBtn} onClick={() => setShowDispute(false)}>Cancel</button>
                    <button className={styles.submitDisputeBtn} disabled={!disputeReason || placing} onClick={submitDispute}>
                      {placing ? <><Loader2 size={14} className={styles.spin} /> Submitting...</> : 'Submit Dispute'}
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.disputeSuccess}>
                  <CheckCircle2 size={40} className={styles.disputeSuccessIcon} />
                  <div className={styles.disputeSuccessTitle}>Dispute Submitted</div>
                  <div className={styles.caseRef}>Case Reference: <strong>DSP-{Date.now().toString().slice(-6)}</strong></div>
                  <div className={styles.disputeSuccessSub}>Our team will review within <strong>24–48 hours</strong>. Check your email for updates.</div>
                  <button className={styles.closeDisputeBtn} onClick={() => { setShowDispute(false); setDisputeSubmitted(false); }}>Close</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
