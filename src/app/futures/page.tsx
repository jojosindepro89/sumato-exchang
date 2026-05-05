import type { Metadata } from 'next';
import Navbar from '@/components/Navbar/Navbar';
import FuturesPage from './FuturesPage';

export const metadata: Metadata = {
  title: 'Futures Trading | Sumato Exchange',
  description: 'Trade crypto futures with up to 125x leverage. USDT-Margined and Coin-Margined perpetual contracts.',
};

export default function Page() {
  return (
    <>
      <Navbar />
      <FuturesPage />
    </>
  );
}
