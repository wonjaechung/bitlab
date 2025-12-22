'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChartBig, List } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';

type Timeframe = '1M' | '6M' | '1Y' | 'All';
type ViewMode = 'chart' | 'list';

const allAssets = ['BTC', 'ETH'];
const assetColors: { [key: string]: string } = {
  BTC: 'hsl(var(--chart-1))',
  ETH: 'hsl(var(--chart-2))',
};

const corporateHoldings = {
    BTC: { total: 214400, percentOfSupply: 1.02 },
    ETH: { total: 500000, percentOfSupply: 0.42 },
}

const corporateHoldingsData = [
    { rank: 1, companyName: 'Strategy', listingLocation: 'US', ticker: 'MSTR', holdings: 660624, btcSupplyPercent: 3.146, marketCap: '$50.76B' },
    { rank: 2, companyName: 'MARA Holdings, Inc.', listingLocation: 'US', ticker: 'MARA', holdings: 53250, btcSupplyPercent: 0.254, marketCap: '$4.36B' },
    { rank: 3, companyName: 'Twenty One Capital', listingLocation: 'US', ticker: 'XXI', holdings: 43514, btcSupplyPercent: 0.207, marketCap: '$3.88B' },
    { rank: 4, companyName: 'Metaplanet Inc.', listingLocation: 'JP', ticker: 'MTPLF', holdings: 30823, btcSupplyPercent: 0.147, marketCap: '$3.09B' },
    { rank: 5, companyName: 'Bitcoin Standard Treasury Company', listingLocation: 'US', ticker: 'CEPO', holdings: 30021, btcSupplyPercent: 0.143, marketCap: '$270.30M' },
    { rank: 6, companyName: 'Bullish', listingLocation: 'US', ticker: 'BLSH', holdings: 24300, btcSupplyPercent: 0.116, marketCap: '$6.53B' },
    { rank: 7, companyName: 'Riot Platforms, Inc.', listingLocation: 'US', ticker: 'RIOT', holdings: 19324, btcSupplyPercent: 0.092, marketCap: '$5.69B' },
    { rank: 8, companyName: 'Coinbase Global, Inc.', listingLocation: 'US', ticker: 'COIN', holdings: 14548, btcSupplyPercent: 0.069, marketCap: '$72.03B' },
];

const generateChartData = (asset: string, timeframe: Timeframe) => {
  let days = 30;
  if (timeframe === '6M') days = 180;
  if (timeframe === '1Y') days = 365;
  if (timeframe === 'All') days = 500;
  
  const data = [];
  const baseValue = corporateHoldings[asset as keyof typeof corporateHoldings].total;
  let currentValue = baseValue;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    currentValue += (Math.random() - 0.48) * (baseValue * 0.01);
    if (currentValue < 0) currentValue = 0;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      [asset]: Math.floor(currentValue),
    });
  }
  return data;
};

const CustomTooltip = ({ active, payload, label, asset }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/80 backdrop-blur-sm p-2 border rounded-lg shadow-lg">
        <p className="font-bold">{label}</p>
        {payload.map((p: any) => (
            <p key={p.dataKey} className="text-sm" style={{ color: assetColors[asset] }}>
                {`총 보유량: ${p.value.toLocaleString()} ${asset}`}
            </p>
        ))}
      </div>
    );
  }
  return null;
};

const HoldingsTable = () => (
    <Table>
        <TableHeader>
            <TableRow>
                <TableHead className="w-[60px]">#</TableHead>
                <TableHead>회사명</TableHead>
                <TableHead>국가</TableHead>
                <TableHead>티커</TableHead>
                <TableHead className="text-right">보유량 (BTC)</TableHead>
                <TableHead className="text-right">BTC 공급량 %</TableHead>
                <TableHead className="text-right">시가총액</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {corporateHoldingsData.map((company) => (
                <TableRow key={company.rank}>
                    <TableCell className="font-medium text-muted-foreground">{company.rank}</TableCell>
                    <TableCell className="font-medium">{company.companyName}</TableCell>
                    <TableCell>{company.listingLocation}</TableCell>
                    <TableCell className="font-code">{company.ticker}</TableCell>
                    <TableCell className="text-right font-code">{company.holdings.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-code">{company.btcSupplyPercent.toFixed(3)}%</TableCell>
                    <TableCell className="text-right font-code">{company.marketCap}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);

export default function CorporateHoldingsChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [activeAsset, setActiveAsset] = useState<string>('BTC');
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const chartData = useMemo(() => generateChartData(activeAsset, timeframe), [activeAsset, timeframe]);
  const holdingData = corporateHoldings[activeAsset as keyof typeof corporateHoldings];

    const renderContent = () => {
    if (viewMode === 'list') {
        return (
            <div className="h-full overflow-auto">
                <div className="min-w-[800px]">
                    <HoldingsTable />
                </div>
            </div>
        );
    }

    return (
        <div className="h-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis 
                        stroke="hsl(var(--muted-foreground))" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                        domain={[0, 'auto']}
                        tickFormatter={(val) => {
                            if (val === 0) return '0';
                            if (Math.abs(val) >= 1000) {
                                return `${(val / 1000).toFixed(0)}K`;
                            }
                            return `${val}`;
                        }}
                    />
                    <Tooltip content={<CustomTooltip asset={activeAsset} />} cursor={{ fill: 'hsl(var(--accent)/0.1)' }} />
                    <Bar
                        key={activeAsset}
                        dataKey={activeAsset}
                        fill={assetColors[activeAsset]}
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
            <CardTitle>상장사 보유량</CardTitle>
            <CardDescription className="mt-2 flex flex-col items-start">
                <span className="font-code text-xs text-muted-foreground">
                    총 {holdingData.total.toLocaleString()} / 공급량의 {holdingData.percentOfSupply}%
                </span>
            </CardDescription>
        </div>
         <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Select value={activeAsset} onValueChange={setActiveAsset}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="자산 선택" />
                </SelectTrigger>
                <SelectContent>
                    {allAssets.map(asset => (
                        <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {viewMode === 'chart' && (
              <div className="flex gap-1 rounded-md bg-muted p-1 self-start">
              {(['1M', '6M', '1Y', 'All'] as Timeframe[]).map((tf) => (
                  <Button
                  key={tf}
                  size="sm"
                  variant={timeframe === tf ? 'default' : 'ghost'}
                  onClick={() => setTimeframe(tf)}
                  className="px-3"
                  >
                  {tf}
                  </Button>
              ))}
              </div>
            )}
             <div className="flex gap-1 rounded-md bg-muted p-1 self-start">
                <Button size="sm" variant={viewMode === 'chart' ? 'default' : 'ghost'} className="px-3" onClick={() => setViewMode('chart')}>
                    <BarChartBig className="h-4 w-4" />
                </Button>
                 <Button size="sm" variant={viewMode === 'list' ? 'default' : 'ghost'} className="px-3" onClick={() => setViewMode('list')}>
                    <List className="h-4 w-4" />
                </Button>
            </div>
        </div>
      </CardHeader>
      <CardContent className="h-64">
          {renderContent()}
      </CardContent>
    </Card>
  );
}
