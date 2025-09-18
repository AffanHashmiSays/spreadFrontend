import { Metadata } from 'next';
import PricingPage from '@/pages/PricingPage';

export const metadata: Metadata = {
  title: 'Plans Tarifaires - Spread The Word',
  description: 'Choisissez le plan parfait pour vos besoins de publication d\'articles invités. Tous les plans incluent l\'accès à notre réseau de sites web allemands.',
  
  // Prevent indexing of pricing page
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function Pricing() {
  return <PricingPage />;
}