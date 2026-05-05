import type { Metadata } from 'next';
import Navbar from '@/components/Navbar/Navbar';
import TradePage from './TradePage';

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const symbol = pair.replace('_', '/').toUpperCase().replace('-', '/');
  return {
    title: `${symbol} | Spot Trading | Sumato Exchange`,
    description: `Trade ${symbol} with low fees and deep liquidity on Sumato Exchange.`,
  };
}

export default function Page() {
  return (
    <>
      <Navbar />
      <TradePage />
    </>
  );
}
