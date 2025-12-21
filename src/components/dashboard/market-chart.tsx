'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronDown, Check, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';


const allCoins = [
    { value: 'BTC', label: '비트코인', price: 87800000, satoshi: 1.00, marketCap: 1723456700000000, change: 0.86, vwapPosition: 45 },
    { value: 'ETH', label: '이더리움', price: 4500000, satoshi: 0.051, marketCap: 543210900000000, change: 1.23, vwapPosition: 55 },
    { value: 'XRP', label: '리플', price: 700, satoshi: 0.000008, marketCap: 38000000000000, change: -0.52, vwapPosition: 35 },
    { value: 'SOL', label: '솔라나', price: 230000, satoshi: 0.0026, marketCap: 100000000000000, change: 2.15, vwapPosition: 60 },
    { value: 'DOGE', label: '도지코인', price: 210, satoshi: 0.0000024, marketCap: 30000000000000, change: -1.10, vwapPosition: 40 },
]

const generateData = (coin: typeof allCoins[0], chartType: '원화' | '사토시' | '시가총액') => {
    const data = [];
    let baseValue;
    switch(chartType) {
        case '원화': baseValue = coin.price; break;
        case '사토시': baseValue = coin.satoshi; break;
        case '시가총액': baseValue = coin.marketCap; break;
    }

    for (let i = 0; i < 25; i++) {
        const date = new Date();
        date.setHours(date.getHours() - (24 - i));
        let value = baseValue * (1 + (Math.random() - 0.5) * 0.1);
        data.push({
            time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
            value: value
        });
    }
    return data;
};

const TimeframeButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
    <Button
        variant="ghost"
        onClick={onClick}
        className={`px-3 py-1 h-auto text-sm rounded-full ${
            active ? 'bg-zinc-700 text-white' : 'text-zinc-400'
        }`}
    >
        {children}
    </Button>
);

const ChartTypeButton = ({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) => (
    <Button
        variant="ghost"
        onClick={onClick}
        className={`flex-1 rounded-md text-sm ${
            active ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-400'
        }`}
    >
        {children}
    </Button>
);

const RangeBar = ({ vwapPosition, showVwap, currentPosition, lowPrice, highPrice } : { vwapPosition: number, showVwap: boolean, currentPosition: number, lowPrice: number, highPrice: number }) => (
    <div className="w-full relative h-10 mt-4">
        <div className="h-1.5 bg-gradient-to-r from-red-600 via-yellow-500 to-green-500 rounded-full w-full absolute top-1/2 -translate-y-1/2" />
        
        {showVwap && (
            <div className="absolute bottom-full" style={{ left: `${vwapPosition}%`}}>
               <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-500 transform -translate-x-1/2 translate-y-1.5"></div>
               <span className="text-xs text-zinc-400 absolute left-1/2 -translate-x-1/2 whitespace-nowrap bottom-full mb-1">평균매수가격</span>
            </div>
        )}
        
        <div className="absolute top-full" style={{ left: `${currentPosition}%`}}>
           <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-yellow-500 transform -translate-x-1/2 -translate-y-1.5"></div>
           <span className="text-xs text-zinc-400 absolute left-1/2 -translate-x-1/2 whitespace-nowrap top-full mt-1">현재위치</span>
        </div>
        <div className="flex justify-between text-xs text-zinc-400 absolute w-full" style={{ top: 'calc(50% + 0.75rem)' }}>
            <div className="flex flex-col items-start">
                <span>{lowPrice.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원</span>
                <span className="text-[10px] text-zinc-600 mt-0.5">저가</span>
            </div>
            <div className="flex flex-col items-end">
                <span>{highPrice.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원</span>
                <span className="text-[10px] text-zinc-600 mt-0.5">고가</span>
            </div>
        </div>
    </div>
);


export default function MarketChart() {
    const [activeTimeframe, setActiveTimeframe] = useState('24h');
    const [activeChartType, setActiveChartType] = useState<'원화' | '사토시' | '시가총액'>('원화');
    const [selectedCoin, setSelectedCoin] = useState(allCoins[0]);
    const [popoverOpen, setPopoverOpen] = useState(false);
    
    const chartData = useMemo(() => {
        return generateData(selectedCoin, activeChartType);
    }, [selectedCoin, activeChartType, activeTimeframe]);


    const handleCoinSelect = (coinValue: string) => {
        const coin = allCoins.find(c => c.value === coinValue);
        if(coin) {
            setSelectedCoin(coin);
            setPopoverOpen(false);
        }
    }

    const formatPrice = () => {
        switch(activeChartType) {
            case '원화': return `${selectedCoin.price.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원`;
            case '사토시': return `${selectedCoin.satoshi.toFixed(8)} BTC`;
            case '시가총액': return `${(selectedCoin.marketCap / 1000000000000).toLocaleString('ko-KR', {maximumFractionDigits: 0})}조원`;
            default: return '';
        }
    }
    
    const yAxisFormat = (value: any) => {
         switch(activeChartType) {
            case '원화': 
                if (value >= 10000) return `${(value / 10000).toLocaleString('ko-KR', { maximumFractionDigits: 0 })}만원`;
                return `${value.toLocaleString()}원`;
            case '사토시': return `${value.toFixed(8)}`;
            case '시가총액': return `${(value / 1000000000000).toFixed(0)}조`;
            default: return value.toString();
        }
    }
    
    const yDomain = useMemo(() => {
        if (!chartData || chartData.length === 0) return [0, 0];
        const values = chartData.map(d => d.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max-min) * 0.1;
        return [min - padding, max + padding];
    }, [chartData]);


    return (
        <Card className="bg-card-dark border-zinc-800">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 pt-1">
                        <Activity className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold text-white">실시간 시세</h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                            <PopoverTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto hover:bg-transparent justify-end">
                                    <h2 className="text-base font-bold text-white">{selectedCoin.label} ({selectedCoin.value})</h2>
                                    <ChevronDown className="h-5 w-5 text-zinc-400" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[250px]" align="end">
                                    <Command>
                                    <CommandInput placeholder="코인 검색..." />
                                    <CommandList>
                                        <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
                                        <CommandGroup>
                                            {allCoins.map((coin) => (
                                            <CommandItem
                                                key={coin.value}
                                                value={coin.value}
                                                onSelect={(currentValue) => {
                                                    handleCoinSelect(currentValue.toUpperCase())
                                                }}
                                            >
                                                <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedCoin.value === coin.value ? "opacity-100" : "opacity-0"
                                                )}
                                                />
                                                {coin.label} ({coin.value})
                                            </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-col items-end mt-1 w-full">
                            <div className="flex items-center justify-end w-full gap-2">
                                <p className="text-xl font-bold text-white whitespace-nowrap leading-none tracking-tight">{formatPrice()}</p>
                                <p className={`text-xs font-bold ${selectedCoin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {selectedCoin.change >= 0 ? '+' : ''}{selectedCoin.change.toFixed(2)}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-2 mt-4">
                    {['24h', '7D', '30D', '90D', '1Y', 'All'].map(tf => (
                        <TimeframeButton 
                            key={tf} 
                            active={activeTimeframe === tf}
                            onClick={() => setActiveTimeframe(tf)}
                        >
                            {tf}
                        </TimeframeButton>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-40 md:h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} interval={5} />
                            <YAxis
                                orientation="right"
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={yDomain}
                                tickFormatter={yAxisFormat}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(20, 20, 20, 0.8)',
                                    borderColor: '#4b5563',
                                    color: '#e5e7eb',
                                }}
                                itemStyle={{ color: '#e5e7eb' }}
                                labelStyle={{ fontWeight: 'bold' }}
                                formatter={(value: number) => {
                                    if (activeChartType === '사토시') return value.toFixed(8);
                                    if (activeChartType === '원화' && value > 1) return value.toLocaleString('ko-KR', { maximumFractionDigits: 0 });
                                    if (activeChartType === '시가총액') return `${(value / 1000000000000).toFixed(2)}조원`;
                                    return value.toLocaleString();
                                }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex space-x-2 mt-4">
                    {(['원화', '사토시', '시가총액'] as const).map(type => (
                         <ChartTypeButton
                            key={type}
                            active={activeChartType === type}
                            onClick={() => setActiveChartType(type)}
                        >
                            {type}
                        </ChartTypeButton>
                    ))}
                </div>
                 <div className="mt-6 space-y-2">
                    <div className="relative pt-8 pb-8">
                        <RangeBar 
                            vwapPosition={selectedCoin.vwapPosition} 
                            showVwap={activeChartType !== '시가총액'}
                            currentPosition={30}
                            lowPrice={selectedCoin.price * 0.98}
                            highPrice={selectedCoin.price * 1.02}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
