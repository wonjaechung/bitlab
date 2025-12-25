'use client';

import { useState } from 'react';
import Header from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import EtfFlowTracker from '@/components/dashboard/etf-flow-tracker';
import CorporateHoldingsChart from '@/components/dashboard/corporate-holdings-chart';
import BithumbMembershipBuys from '@/components/dashboard/bithumb-membership-buys';
import BithumbWhalePortfolio from '@/components/dashboard/bithumb-whale-portfolio';
import DexFuturesPositions from '@/components/dashboard/dex-futures-positions';
import MaxPainChart from '@/components/dashboard/max-pain-chart';
import EconomicCalendar from '@/components/dashboard/economic-calendar';
import MarketChart from '@/components/dashboard/market-chart';
import DominanceChart from '@/components/dashboard/dominance-chart';
import TrendComparisonChart from '@/components/dashboard/trend-comparison-chart';
import TechnicalAnalysisSection from '@/components/dashboard/technical-analysis-section';
import SniperFeed from '@/components/dashboard/sniper-feed';
import SupplyShockRadar from '@/components/dashboard/supply-shock-radar';


type Tab = 'radar' | 'smart-money' | 'market' | 'calendar';

const tabs: { id: Tab; label: string }[] = [
  { id: 'calendar', label: '캘린더' },
  { id: 'market', label: '마켓' },
  { id: 'smart-money', label: '스마트머니' },
  { id: 'radar', label: '알림' },
];

const InsightHeading = ({ title }: { title: string }) => (
    <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
);


export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('calendar');

  const renderContent = (activeTab: Tab) => {
    switch (activeTab) {
      case 'market':
        return (
          <div className="space-y-4 md:space-y-6">
            <MarketChart />
            <DominanceChart />
            <TrendComparisonChart />
            <TechnicalAnalysisSection />
          </div>
        );
      case 'radar':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SniperFeed />
            <SupplyShockRadar />
          </div>
        );
      case 'smart-money':
          return (
            <div className="space-y-6">
                <EtfFlowTracker />
                <CorporateHoldingsChart />
                <MaxPainChart />
                <DexFuturesPositions />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <BithumbMembershipBuys />
                  <BithumbWhalePortfolio />
                </div>
            </div>
          )
      case 'calendar':
        return <EconomicCalendar />;
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <main className="flex-1 overflow-auto bg-background-dark p-4 pt-20 pb-8">
        <div className="mx-auto w-full max-w-none">
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 rounded-full px-6 py-2 text-base font-bold transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground'
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
          
          {activeTab === 'calendar' ? (
            renderContent(activeTab)
          ) : (
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                  {renderContent(activeTab)}
              </CardContent>
            </Card>
          )}

        </div>
      </main>
    </>
  );
}
