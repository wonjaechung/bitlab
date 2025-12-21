'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const portfolioData = {
    whale: [
        { rank: 1, name: '비트코인', ticker: 'BTC', value: 45 },
        { rank: 2, name: '이더리움', ticker: 'ETH', value: 25 },
        { rank: 3, name: '리플', ticker: 'XRP', value: 15 },
        { rank: 4, name: '스테이블코인', ticker: 'STABLE', value: 10 },
        { rank: 5, name: '기타', ticker: 'OTHERS', value: 5 },
    ],
    black: [
        { rank: 1, name: '비트코인', ticker: 'BTC', value: 60 },
        { rank: 2, name: '이더리움', ticker: 'ETH', value: 20 },
        { rank: 3, name: '리플', ticker: 'XRP', value: 10 },
        { rank: 4, name: '스테이블코인', ticker: 'STABLE', value: 5 },
        { rank: 5, name: '기타', ticker: 'OTHERS', value: 5 },
    ],
    orange: [
        { rank: 1, name: '비트코인', ticker: 'BTC', value: 35 },
        { rank: 2, name: '이더리움', ticker: 'ETH', value: 30 },
        { rank: 3, name: '솔라나', ticker: 'SOL', value: 15 },
        { rank: 4, name: '리플', ticker: 'XRP', value: 10 },
        { rank: 5, name: '기타', ticker: 'OTHERS', value: 10 },
    ],
    purple: [
        { rank: 1, name: '이더리움', ticker: 'ETH', value: 40 },
        { rank: 2, name: '솔라나', ticker: 'SOL', value: 20 },
        { rank: 3, name: '에이다', ticker: 'ADA', value: 15 },
        { rank: 4, name: '비트코인', ticker: 'BTC', value: 10 },
        { rank: 5, name: '기타', ticker: 'OTHERS', value: 15 },
    ],
};

type PortfolioTab = keyof typeof portfolioData;

const portfolioTabs: { id: PortfolioTab; label: string; }[] = [
    { id: 'whale', label: '고래' },
    { id: 'black', label: '블랙' },
    { id: 'orange', label: '오렌지' },
    { id: 'purple', label: '퍼플' },
];

export default function BithumbWhalePortfolio() {
    const [activeTab, setActiveTab] = useState<PortfolioTab>('whale');
    const data = portfolioData[activeTab];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="font-headline text-lg">Bithumb Lab 평균 포트폴리오</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p>그룹별 평균 자산 분배 현황입니다.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                 <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex items-center gap-2 pt-2">
                        {portfolioTabs.map(tab => (
                            <Button
                                key={tab.id}
                                size="sm"
                                variant={activeTab === tab.id ? 'default' : 'ghost'}
                                onClick={() => setActiveTab(tab.id)}
                                className="rounded-full px-4"
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-64">
                    <div className="space-y-4">
                        {data.map(item => (
                            <div key={item.rank} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-muted-foreground w-4 text-center">{item.rank}</span>
                                    <div>
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.ticker}</p>
                                    </div>
                                </div>
                                 <div className="text-right">
                                    <span className="font-code font-bold text-lg text-primary">{item.value}%</span>
                                    <p className="text-xs text-muted-foreground">비중</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
