'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Timeframe = '1M' | '6M' | '1Y' | 'All';

const allAssets = ['BTC', 'ETH', 'ETC', 'BCH', 'LTC', 'ZEC', 'XLM', 'ZEN', 'BAT', 'LINK', 'MANA', 'FIL', 'LPT'];
const assetColors: { [key: string]: string } = {
  BTC: 'hsl(var(--chart-1))',
  ETH: 'hsl(var(--chart-2))',
  ETC: 'hsl(var(--chart-3))',
  BCH: 'hsl(var(--chart-4))',
  LTC: 'hsl(var(--chart-5))',
  ZEC: '#F3B729',
  XLM: '#000000',
  ZEN: '#00AEEF',
  BAT: '#FF5000',
  LINK: '#375BD2',
  MANA: '#FF445D',
  FIL: '#0090FF',
  LPT: '#000000',
};

const grayscaleHoldings = {
    BTC: { total: 277_380, percentOfSupply: 1.32 },
    ETH: { total: 3_000_000, percentOfSupply: 2.5 },
    ETC: { total: 10_000_000, percentOfSupply: 4.78 },
    BCH: { total: 80_000, percentOfSupply: 0.41 },
    LTC: { total: 1_500_000, percentOfSupply: 2.02 },
    ZEC: { total: 200_000, percentOfSupply: 1.25 },
    XLM: { total: 500_000_000, percentOfSupply: 1.78 },
    ZEN: { total: 600_000, percentOfSupply: 4.12 },
    BAT: { total: 50_000_000, percentOfSupply: 3.33 },
    LINK: { total: 1_000_000, percentOfSupply: 1.0 },
    MANA: { total: 20_000_000, percentOfSupply: 1.12 },
    FIL: { total: 1_000_000, percentOfSupply: 0.18 },
    LPT: { total: 500_000, percentOfSupply: 1.52 },
};

const generateChartData = (asset: string, timeframe: Timeframe) => {
  let days = 30;
  if (timeframe === '6M') days = 180;
  if (timeframe === '1Y') days = 365;
  if (timeframe === 'All') days = 500;
  
  const data = [];
  const baseValue = grayscaleHoldings[asset as keyof typeof grayscaleHoldings].total * 0.8;
  let currentValue = baseValue;

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    currentValue += (Math.random() - 0.45) * (baseValue * 0.05);
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

export default function GrayscaleHoldingsChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [activeAsset, setActiveAsset] = useState<string>('BTC');
  const chartData = useMemo(() => generateChartData(activeAsset, timeframe), [activeAsset, timeframe]);
  const holdingData = grayscaleHoldings[activeAsset as keyof typeof grayscaleHoldings];


  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
            <CardTitle>그레이스케일 보유량</CardTitle>
            <CardDescription className="mt-2 flex flex-col items-start">
                <span className="font-code text-xs text-muted-foreground">
                    총 {holdingData.total.toLocaleString()} / 공급량의 {holdingData.percentOfSupply}%
                </span>
            </CardDescription>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
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
        </div>
      </CardHeader>
      <CardContent className="h-64">
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
                    if (Math.abs(val) >= 1000000) {
                      return `${(val / 1000000).toFixed(0)}M`;
                    }
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
      </CardContent>
    </Card>
  );
}
