'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, Legend, CartesianGrid } from 'recharts';
import { Info, BarChart2 } from 'lucide-react';
import { MarketIndicatorsCarousel, type IndicatorId, indicatorData } from './market-indicators-carousel';


const generateData = (days: number, indicator: IndicatorId) => {
    const data = [];
    if (indicator === 'drop') {
        const startDate = new Date('2010-07-13');
        let btcPrice = 0.05;
        let ath = 0.05;

        const phases = [
            { days: 1265, growth: 0.007, volatility: 0.15 },    // to 2013-11-30 (~$1,163)
            { days: 410, growth: -0.002, volatility: 0.04 },   // to 2015-01-14 (~$220)
            { days: 730, growth: 0.009, volatility: 0.12 },    // to 2017-12-17 (~$19,783)
            { days: 365, growth: -0.006, volatility: 0.07 },   // to 2018-12-17 (~$3,122)
            { days: 1095, growth: 0.005, volatility: 0.1 },    // to 2021-11-10 (~$69,000)
            { days: 365, growth: -0.004, volatility: 0.06 },   // to 2022-11-09 (~$15,460)
            { days: 750, growth: 0.003, volatility: 0.08 },    // to 2024-03-14 (~$87,800)
            { days: 292, growth: -0.001, volatility: 0.05 },   // to 2025-01-01
        ];

        let dayCount = 0;
        for (const phase of phases) {
             for (let i = 0; i < phase.days; i++) {
                if (dayCount >= 5475) break;
                
                const date = new Date(startDate);
                date.setDate(date.getDate() + dayCount);

                const randomFactor = (Math.random() - 0.45) * phase.volatility;
                btcPrice *= (1 + phase.growth + randomFactor);
                if (btcPrice < 0.01) btcPrice = 0.01;

                if (btcPrice > ath) {
                    ath = btcPrice;
                }
                const drawdown = ath > 0 ? ((btcPrice - ath) / ath) * 100 : 0;
                
                data.push({
                    date: date.toLocaleDateString('en-CA'),
                    value: drawdown,
                    btcPrice: btcPrice
                });
                dayCount++;
            }
        }
        
        if (timeframeToDays[activeTimeframe] < 5475) {
            return data.slice(Math.max(data.length - days, 0));
        }

        return data;
    }

    // Data generation for other indicators
    let baseValue = 50;
    let volatility = 5;
    
    switch(indicator) {
        case 'dominance': baseValue = 49.08; volatility = 3; break;
        case 'volume': baseValue = 2.13; volatility = 0.5; break; // Trillion KRW
        case 'kimchi': baseValue = 1.38; volatility = 0.5; break;
        case 'fear': baseValue = 41; volatility = 10; break;
        case 'stable': baseValue = 162.7; volatility = 5; break; // Billion USD
        case 'm2': baseValue = 4100; volatility = 50; break; // Trillion
    }

    let currentValue = baseValue;
    for (let i = 0; i < days; i++) {
        const date = new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000);
        currentValue += (Math.random() - 0.5) * (volatility / 5);
        if (indicator === 'volume' && currentValue < 0) currentValue = 0;

        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: currentValue,
        });
    }
    return data;
};

const timeframeToDays: { [key: string]: number } = {
    '24h': 24,
    '7D': 7,
    '30D': 30,
    '90D': 90,
    '1Y': 365,
    'All': 5475, // Approx 15 years
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

const CustomTooltip = ({ active, payload, label, indicator }: any) => {
  if (active && payload && payload.length) {
    const btcPricePayload = payload.find(p => p.dataKey === 'btcPrice');
    const valuePayload = payload.find(p => p.dataKey === 'value');
    
    return (
      <div className="bg-background/80 backdrop-blur-sm p-2 border rounded-lg shadow-lg">
        <p className="font-bold">{new Date(label).toLocaleDateString()}</p>
        {valuePayload && (
             <p className="text-sm" style={{ color: valuePayload.stroke }}>
                {indicator.id === 'drop' ? '고점대비낙폭' : indicator.title}: {valuePayload.value.toFixed(2)}{indicator.unit}
            </p>
        )}
        {btcPricePayload && (
            <p className="text-sm" style={{ color: btcPricePayload.stroke }}>
                BTC 가격: ${btcPricePayload.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
        )}
      </div>
    );
  }
  return null;
};
let activeTimeframe = 'All';

export default function DominanceChart() {
    const [internalActiveTimeframe, setInternalActiveTimeframe] = useState('24h');
    activeTimeframe = internalActiveTimeframe;
    const [activeIndicator, setActiveIndicator] = useState<IndicatorId>('volume');
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const days = timeframeToDays[internalActiveTimeframe] || 365;

            if (activeIndicator === 'drop') {
                try {
                    const res = await fetch('/api/btc-metrics?type=history');
                    if (res.ok) {
                        const allData = await res.json();
                        // Filter data based on days
                        // Note: Data is expected to be daily.
                        const filteredData = (days < 5475 && days < allData.length)
                            ? allData.slice(allData.length - days)
                            : allData;
                        
                        setChartData(filteredData);
                        return;
                    }
                } catch (e) {
                    console.error("Failed to fetch drop history", e);
                }
            }

            const newData = generateData(days, activeIndicator);
            setChartData(newData);
        };

        fetchData();
    }, [internalActiveTimeframe, activeIndicator]);

    const currentIndicator = indicatorData[activeIndicator];
    const isDrawdownChart = activeIndicator === 'drop';

    const getYAxisTickFormatter = (isLeft: boolean) => {
        if(isDrawdownChart) {
            if(isLeft) {
                return (value: number) => {
                    if (value < 1) return `$${value.toFixed(2)}`;
                    if (value < 1000) return `$${value.toFixed(0)}`;
                    if (value < 1000000) return `$${(value/1000).toFixed(0)}K`;
                    return `$${(value/1000000).toFixed(0)}M`;
                }
            } else {
                 return (value: number) => `${value.toFixed(0)}%`;
            }
        }

        switch(activeIndicator) {
            case 'dominance':
            case 'kimchi':
                return (value: number) => `${value.toFixed(0)}%`;
            case 'volume':
                return (value: number) => `${value.toFixed(2)}조`;
            case 'stable':
                return (value: number) => `$${value.toFixed(0)}B`;
            case 'm2':
                 return (value: number) => `${value.toFixed(0)}조`;
            case 'fear':
                return (value: number) => value.toFixed(0);
            default:
                return (value: number) => value.toString();
        }
    }

    const getYAxisDomain = (isLeft: boolean) => {
        if (isDrawdownChart) {
            return isLeft ? [0.01, 100000] : [-100, 0];
        }
        const values = chartData.map(d => d.value);
        if (values.length === 0) return [0, 100];
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = (max - min) * 0.1;
        return [min - padding, max + padding];
    }


    const getIndicatorDescription = (indicator: IndicatorId) => {
        switch(indicator) {
            case 'dominance':
                return (
                    <div className="text-sm text-zinc-400 mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <h4 className="font-bold text-white mb-2">BTC 도미넌스란?</h4>
                        <p className="mb-2">전체 암호화폐 시가총액 중 비트코인이 차지하는 비중입니다.</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li><span className="text-zinc-200">상승 시:</span> 비트코인 강세 또는 알트코인 약세 (자금이 비트코인으로 쏠림)</li>
                            <li><span className="text-zinc-200">하락 시:</span> 알트코인 강세 (자금이 알트코인으로 이동, 알트장 가능성)</li>
                        </ul>
                    </div>
                );
            case 'volume':
                return (
                    <div className="text-sm text-zinc-400 mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <h4 className="font-bold text-white mb-2">빗썸 거래대금이란?</h4>
                        <p className="mb-2">빗썸 거래소의 최근 24시간 총 거래 금액입니다.</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li><span className="text-zinc-200">증가 시:</span> 시장 활성화 (투자자 관심 증가, 상승장 신호 가능성)</li>
                            <li><span className="text-zinc-200">감소 시:</span> 시장 침체 또는 관망세 (변동성 축소)</li>
                        </ul>
                    </div>
                );
            case 'kimchi':
                return (
                    <div className="text-sm text-zinc-400 mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <h4 className="font-bold text-white mb-2">김치 프리미엄이란?</h4>
                        <p className="mb-2">한국 거래소(빗썸/업비트) 가격이 해외 거래소(바이낸스 등)보다 얼마나 높은지를 나타내는 지표입니다.</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li><span className="text-zinc-200">높을 때 (+):</span> 국내 매수세가 강함 (과열 신호 가능성)</li>
                            <li><span className="text-zinc-200">낮을 때 (-):</span> 국내 매도세가 강함 (저점 매수 기회 가능성, 역프리미엄)</li>
                        </ul>
                    </div>
                );
            case 'fear':
                return (
                    <div className="text-sm text-zinc-400 mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <h4 className="font-bold text-white mb-2">공포/탐욕 지수란?</h4>
                        <p className="mb-2">시장 참여자들의 심리를 수치화한 지표입니다.</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li><span className="text-zinc-200">극단적 공포 (0~20):</span> 과매도 구간, 매수 기회일 수 있음</li>
                            <li><span className="text-zinc-200">극단적 탐욕 (80~100):</span> 과매수 구간, 조정 가능성 주의</li>
                        </ul>
                    </div>
                );
            case 'drop':
                return (
                    <div className="text-sm text-zinc-400 mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <h4 className="font-bold text-white mb-2">고점 대비 낙폭(MDD)이란?</h4>
                        <p className="mb-2">비트코인 가격이 역대 최고점(ATH) 대비 얼마나 하락했는지를 보여줍니다.</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li><span className="text-zinc-200">낙폭 심화:</span> 저점 매수 기회 (과거 데이터 기반)</li>
                            <li><span className="text-zinc-200">낙폭 축소:</span> 전고점 돌파 시도 중</li>
                        </ul>
                    </div>
                );
            case 'stable':
                return (
                    <div className="text-sm text-zinc-400 mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <h4 className="font-bold text-white mb-2">스테이블코인 시가총액이란?</h4>
                        <p className="mb-2">USDT, USDC 등 주요 스테이블코인의 총 발행량입니다.</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                            <li><span className="text-zinc-200">증가 시:</span> 매수 대기 자금 유입 (잠재적 상승 동력)</li>
                            <li><span className="text-zinc-200">감소 시:</span> 자금 이탈 (시장 유동성 축소)</li>
                        </ul>
                    </div>
                );
            case 'm2':
                return (
                    <div className="text-sm text-zinc-400 mt-4 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                        <h4 className="font-bold text-white mb-2">Global M2 통화량이란?</h4>
                        <p className="mb-2">주요국 중앙은행의 통화 공급량 지표입니다. 유동성이 풍부할수록 위험자산에 유리합니다.</p>
                         <ul className="list-disc list-inside space-y-1 text-xs">
                            <li><span className="text-zinc-200">증가 추세:</span> 유동성 장세 (비트코인 가격 상승과 높은 상관관계)</li>
                            <li><span className="text-zinc-200">감소 추세:</span> 긴축 정책 (시장 하락 압력)</li>
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <Card className="bg-card-dark border-zinc-800 overflow-visible">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 pt-1">
                        <BarChart2 className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold text-white">보조지표</h3>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold text-white">
                                {currentIndicator.title}
                            </h2>
                        </div>
                        <div className="text-right">
                            {!isDrawdownChart ? (
                                <p className="text-2xl font-bold text-white whitespace-nowrap leading-none tracking-tight">{chartData.length > 0 ? `${chartData[chartData.length - 1].value.toFixed(2)}${currentIndicator.unit || ''}` : currentIndicator.value}</p>
                            ) : (
                                <div className="flex flex-col items-end gap-1">
                                    <div className='flex items-center gap-1 text-sm'>
                                        <div className='w-3 h-3 rounded-sm' style={{backgroundColor: '#16a34a'}}/>
                                        <span>고점대비낙폭</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="overflow-visible">
                <div className="flex justify-between items-end mb-4">
                    <div className="flex space-x-2">
                        {isDrawdownChart ? (
                            null
                        ) : (
                            (['24h', '7D', '30D', '90D', '1Y'].map(tf => (
                                <TimeframeButton
                                    key={tf}
                                    active={internalActiveTimeframe === tf}
                                    onClick={() => setInternalActiveTimeframe(tf)}
                                >
                                    {tf}
                                </TimeframeButton>
                            )))
                        )}
                    </div>
                </div>
                <div className="h-64 md:h-96 relative z-20 overflow-visible dominance-chart-container">
                    <style jsx global>{`
                        .dominance-chart-container .recharts-wrapper {
                            overflow: visible !important;
                        }
                        .dominance-chart-container .recharts-surface {
                            overflow: visible !important;
                        }
                    `}</style>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                             <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={isDrawdownChart ? '#16a34a' : 'hsl(var(--bullish))'} stopOpacity={isDrawdownChart ? 1 : 0.3}/>
                                    <stop offset="95%" stopColor={isDrawdownChart ? '#16a34a' : 'hsl(var(--bullish))'} stopOpacity={isDrawdownChart ? 1 : 0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis 
                                dataKey="date" 
                                stroke="#6b7280" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(tick) => {
                                    if(isDrawdownChart) {
                                        return new Date(tick).getFullYear().toString();
                                    }
                                    if(internalActiveTimeframe === '24h') {
                                        return new Date(tick).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                                    }
                                    return tick;
                                }}
                                interval={isDrawdownChart ? Math.floor(chartData.length / 15) : Math.floor(chartData.length / 7)}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                scale={isDrawdownChart ? "log" : "auto"}
                                domain={getYAxisDomain(true)}
                                tickFormatter={getYAxisTickFormatter(true)}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={getYAxisDomain(false)}
                                tickFormatter={getYAxisTickFormatter(false)}
                            />
                            <Tooltip
                                content={<CustomTooltip indicator={currentIndicator} />}
                                wrapperStyle={{ outline: 'none', display: 'none' }}
                                cursor={false}
                            />
                            <Area 
                                yAxisId={isDrawdownChart ? 'right' : 'left'} 
                                type="monotone" 
                                dataKey="value" 
                                name={isDrawdownChart ? "고점대비낙폭" : currentIndicator.title} 
                                stroke={isDrawdownChart ? '#16a34a' : 'hsl(var(--bullish))'}
                                fill="url(#colorValue)"
                                fillOpacity={1}
                            />
                            {isDrawdownChart && <Line yAxisId="left" type="monotone" dataKey="btcPrice" name="BTC 가격" stroke="#F7931A" strokeWidth={2} dot={false} />}
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
                 <div className="mt-4 md:mt-6">
                    <MarketIndicatorsCarousel selectedIndicator={activeIndicator} onIndicatorSelect={(id) => {
                        setActiveIndicator(id);
                        if (id === 'drop') {
                            setInternalActiveTimeframe('All');
                        } else if(internalActiveTimeframe === 'All') {
                             setInternalActiveTimeframe('1Y');
                        }
                    }} />
                    </div>
                    {getIndicatorDescription(activeIndicator)}
                </CardContent>
            </Card>
    );
}
