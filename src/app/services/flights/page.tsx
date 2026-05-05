'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Search, Plane, Users, ArrowRightLeft, CheckCircle2, Loader2, MapPin } from 'lucide-react';
import styles from './flights.module.css';

const MOCK_FLIGHTS = [
  { id: 1, airline: '✈️ Emirates', from: 'LHR', to: 'DXB', dep: '08:15', arr: '18:45', duration: '7h 30m', stops: 'Direct', price: 642, class: 'Economy' },
  { id: 2, airline: '🛩️ British Airways', from: 'LHR', to: 'DXB', dep: '11:30', arr: '23:00', duration: '8h 30m', stops: '1 stop', price: 489, class: 'Economy' },
  { id: 3, airline: '✈️ Etihad', from: 'LHR', to: 'DXB', dep: '14:00', arr: '01:00+1', duration: '8h 00m', stops: 'Direct', price: 718, class: 'Economy' },
  { id: 4, airline: '🛩️ Flydubai', from: 'LHR', to: 'DXB', dep: '22:45', arr: '10:15+1', duration: '8h 30m', stops: 'Direct', price: 394, class: 'Economy' },
];

type Step = 'search' | 'results' | 'seat' | 'confirm' | 'success';

export default function FlightsPage() {
  const [step, setStep] = useState<Step>('search');
  const [from, setFrom] = useState('London (LHR)');
  const [to, setTo] = useState('Dubai (DXB)');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cls, setCls] = useState('Economy');
  const [selected, setSelected] = useState(MOCK_FLIGHTS[0]);
  const [seat, setSeat] = useState('');
  const [payAsset, setPayAsset] = useState('USDT');
  const [placing, setPlacing] = useState(false);
  const [ref] = useState(`FLT-${Date.now().toString().slice(-6)}`);

  const swap = () => { const tmp = from; setFrom(to); setTo(tmp); };

  const handleSearch = () => setStep('results');
  const handleBook = async () => {
    setPlacing(true);
    await new Promise(r => setTimeout(r, 1800));
    setPlacing(false);
    setStep('success');
  };

  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumb}>
            <Link href="/services" className={styles.breadLink}><ArrowLeft size={13} /> Services</Link>
            <ChevronRight size={13} />
            <span>Flight Tickets</span>
          </div>

          <h1 className={styles.pageTitle}>✈️ Book Flights with Crypto</h1>

          {/* Search form */}
          {(step === 'search' || step === 'results') && (
            <div className={styles.searchCard}>
              <div className={styles.routeRow}>
                <div className={styles.routeField}>
                  <label><MapPin size={12} /> From</label>
                  <input className={styles.routeInput} value={from} onChange={e => setFrom(e.target.value)} />
                </div>
                <button className={styles.swapBtn} onClick={swap}><ArrowRightLeft size={16} /></button>
                <div className={styles.routeField}>
                  <label><MapPin size={12} /> To</label>
                  <input className={styles.routeInput} value={to} onChange={e => setTo(e.target.value)} />
                </div>
                <div className={styles.routeField}>
                  <label>Date</label>
                  <input type="date" className={styles.routeInput} value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className={styles.routeField} style={{ maxWidth: 90 }}>
                  <label><Users size={12} /> Pax</label>
                  <select className={styles.routeInput} value={passengers} onChange={e => setPassengers(Number(e.target.value))}>
                    {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div className={styles.routeField} style={{ maxWidth: 110 }}>
                  <label>Class</label>
                  <select className={styles.routeInput} value={cls} onChange={e => setCls(e.target.value)}>
                    {['Economy','Business','First'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <button className={styles.searchBtn} onClick={handleSearch}>
                  <Search size={14} /> Search
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {step === 'results' && (
            <>
              <div className={styles.resultsHeader}>
                <div className={styles.resultsCount}>{MOCK_FLIGHTS.length} flights found — {from} → {to}</div>
                <div className={styles.sortRow}>
                  Sort by: <button className={`${styles.sortBtn} ${styles.sortActive}`}>Price</button>
                  <button className={styles.sortBtn}>Duration</button>
                  <button className={styles.sortBtn}>Departure</button>
                </div>
              </div>
              <div className={styles.flightsList}>
                {MOCK_FLIGHTS.map(f => (
                  <div key={f.id} className={`${styles.flightCard} ${selected.id === f.id ? styles.flightSelected : ''}`} onClick={() => setSelected(f)}>
                    <div className={styles.flightAirline}>{f.airline}</div>
                    <div className={styles.flightRoute}>
                      <div className={styles.flightPort}>
                        <div className={styles.flightTime}>{f.dep}</div>
                        <div className={styles.flightCode}>{f.from}</div>
                      </div>
                      <div className={styles.flightMid}>
                        <div className={styles.flightDur}>{f.duration}</div>
                        <div className={styles.flightLine}><div className={styles.flightDot} /><div className={styles.flightLineLine} /><Plane size={14} className={styles.flightPlane} /></div>
                        <div className={styles.flightStops}>{f.stops}</div>
                      </div>
                      <div className={styles.flightPort}>
                        <div className={styles.flightTime}>{f.arr}</div>
                        <div className={styles.flightCode}>{f.to}</div>
                      </div>
                    </div>
                    <div className={styles.flightRight}>
                      <div className={styles.flightPrice}>${f.price}</div>
                      <div className={styles.flightClass}>{f.class}</div>
                      <button className={`${styles.selectBtn} ${selected.id === f.id ? styles.selectActive : ''}`} onClick={() => { setSelected(f); setStep('seat'); }}>
                        {selected.id === f.id ? '✓ Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Seat + payment */}
          {step === 'seat' && (
            <div className={styles.formCard}>
              <button className={styles.backBtn} onClick={() => setStep('results')}><ArrowLeft size={14} /> Back</button>
              <h2 className={styles.subTitle}>Booking — {selected.airline}</h2>
              <div className={styles.flightSummary}>
                <span>{selected.from} → {selected.to}</span>
                <span>{selected.dep} – {selected.arr}</span>
                <span>{selected.duration}</span>
                <span className={styles.directBadge}>{selected.stops}</span>
              </div>
              <div className={styles.field}>
                <label>Seat Preference</label>
                <div className={styles.seatOptions}>
                  {['Window','Middle','Aisle'].map(s => (
                    <button key={s} className={`${styles.seatBtn} ${seat === s ? styles.seatActive : ''}`} onClick={() => setSeat(s)}>{s}</button>
                  ))}
                </div>
              </div>
              <div className={styles.field}>
                <label>Pay With</label>
                <div className={styles.assetSelector}>
                  {['USDT','BTC','ETH','BNB'].map(a => (
                    <button key={a} className={`${styles.assetBtn} ${payAsset === a ? styles.assetActive : ''}`} onClick={() => setPayAsset(a)}>{a}</button>
                  ))}
                </div>
              </div>
              <div className={styles.summary}>
                <div className={styles.sumRow}><span>Flight</span><strong>{selected.from} → {selected.to}</strong></div>
                <div className={styles.sumRow}><span>Passengers</span><strong>{passengers}</strong></div>
                <div className={styles.sumRow}><span>Price</span><strong>${(selected.price * passengers).toLocaleString()}</strong></div>
                <div className={styles.sumRow}><span>In {payAsset}</span><strong>{payAsset === 'BTC' ? ((selected.price * passengers) / 67432).toFixed(6) : (selected.price * passengers).toFixed(2)} {payAsset}</strong></div>
              </div>
              <button className={styles.bookBtn} onClick={handleBook} disabled={placing}>
                {placing ? <><Loader2 size={14} className={styles.spin} /> Booking...</> : `Book with ${payAsset} →`}
              </button>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className={styles.successCard}>
              <CheckCircle2 size={56} className={styles.successIcon} />
              <h2 className={styles.successTitle}>Booking Confirmed! ✈️</h2>
              <p className={styles.successSub}>{selected.from} → {selected.to} · {selected.dep}</p>
              <div className={styles.eticket}>
                <div className={styles.eticketHeader}>E-TICKET</div>
                <div className={styles.eticketRef}>{ref}</div>
                <div className={styles.eticketDetails}>
                  <div>{selected.airline}</div>
                  <div>{selected.dep} → {selected.arr}</div>
                  <div>{passengers} passenger{passengers > 1 ? 's' : ''} · {seat || 'Any seat'}</div>
                </div>
              </div>
              <button className={styles.bookBtn} onClick={() => setStep('search')}>Book Another Flight</button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
