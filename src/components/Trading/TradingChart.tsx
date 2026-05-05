'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './TradingChart.module.css';

const TIMEFRAMES = ['1m', '5m', '15m', '1H', '4H', '1D', '1W'];

function generateCandles(count = 200, basePrice = 67000) {
  const candles: { time: number; open: number; high: number; low: number; close: number; volume: number; isUp: boolean }[] = [];
  let price = basePrice;
  const now = Math.floor(Date.now() / 1000);
  for (let i = count; i >= 0; i--) {
    const time = now - i * 3600;
    const open = price;
    const change = (Math.random() - 0.48) * price * 0.02;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * price * 0.008;
    const low = Math.min(open, close) - Math.random() * price * 0.008;
    const volume = 1000 + Math.random() * 5000;
    candles.push({ time, open, high, low, close, volume, isUp: close >= open });
    price = close;
  }
  return candles;
}

interface Props {
  symbol: string;
  basePrice: number;
}

export default function TradingChart({ symbol, basePrice }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTimeframe, setActiveTimeframe] = useState('1H');

  useEffect(() => {
    if (!containerRef.current) return;
    if (typeof window === 'undefined') return;

    let chart: any = null;
    let interval: ReturnType<typeof setInterval>;
    let observer: ResizeObserver;

    const init = async () => {
      const { createChart, ColorType, CandlestickSeries, HistogramSeries } = await import('lightweight-charts');
      if (!containerRef.current) return;

      chart = createChart(containerRef.current, {
        layout: {
          background: { type: ColorType.Solid, color: '#1e2329' },
          textColor: '#848e9c',
          fontSize: 11,
        },
        grid: {
          vertLines: { color: 'rgba(43,49,57,0.4)' },
          horzLines: { color: 'rgba(43,49,57,0.4)' },
        },
        crosshair: { mode: 1 },
        rightPriceScale: {
          borderColor: '#2b3139',
          scaleMargins: { top: 0.1, bottom: 0.25 },
        },
        timeScale: {
          borderColor: '#2b3139',
          timeVisible: true,
          secondsVisible: false,
        },
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight || 400,
      });

      const candleData = generateCandles(200, basePrice);

      const candleSeries = chart.addSeries(CandlestickSeries, {
        upColor: '#0ecb81',
        downColor: '#f6465d',
        borderUpColor: '#0ecb81',
        borderDownColor: '#f6465d',
        wickUpColor: '#0ecb81',
        wickDownColor: '#f6465d',
      });

      candleSeries.setData(
        candleData.map(c => ({ time: c.time as any, open: c.open, high: c.high, low: c.low, close: c.close }))
      );

      const volumeSeries = chart.addSeries(HistogramSeries, {
        color: '#0ecb8180',
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
      });
      chart.priceScale('volume').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
      volumeSeries.setData(
        candleData.map(c => ({
          time: c.time as any,
          value: c.volume,
          color: c.isUp ? '#0ecb8150' : '#f6465d50'
        }))
      );

      chart.timeScale().fitContent();

      // Live update
      let lastCandle = { ...candleData[candleData.length - 1] };
      interval = setInterval(() => {
        const change = (Math.random() - 0.49) * basePrice * 0.001;
        const newClose = lastCandle.close + change;
        lastCandle = {
          ...lastCandle,
          high: Math.max(lastCandle.high, newClose),
          low: Math.min(lastCandle.low, newClose),
          close: newClose,
          isUp: newClose >= lastCandle.open,
        };
        candleSeries.update({
          time: lastCandle.time as any,
          open: lastCandle.open,
          high: lastCandle.high,
          low: lastCandle.low,
          close: newClose,
        });
      }, 1000);

      if (containerRef.current) {
        observer = new ResizeObserver(() => {
          if (containerRef.current && chart) {
            chart.applyOptions({
              width: containerRef.current.clientWidth,
              height: containerRef.current.clientHeight || 400,
            });
          }
        });
        observer.observe(containerRef.current);
      }
    };

    init();

    return () => {
      if (interval) clearInterval(interval);
      if (observer) observer.disconnect();
      if (chart) chart.remove();
    };
  }, [basePrice, activeTimeframe]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <div className={styles.timeframes}>
          {TIMEFRAMES.map(tf => (
            <button
              key={tf}
              className={`${styles.tfBtn} ${activeTimeframe === tf ? styles.tfActive : ''}`}
              onClick={() => setActiveTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
        <div className={styles.indicators}>
          <button className={styles.indBtn}>Indicators</button>
          <button className={styles.indBtn}>Templates</button>
        </div>
      </div>
      <div ref={containerRef} className={styles.chart} />
    </div>
  );
}
