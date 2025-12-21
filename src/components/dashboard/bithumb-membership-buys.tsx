'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

const membershipBuysData = {
    whale: [
        { rank: 1, name: '비앤비', ticker: 'BNB/KRW', percent: 25 },
        { rank: 2, name: '유니스왑', ticker: 'UNI/KRW', percent: 21 },
        { rank: 3, name: '비트코인 캐시', ticker: 'BCH/KRW', percent: 18 },
        { rank: 4, name: '솔라나', ticker: 'SOL/KRW', percent: 15 },
        { rank: 5, name: '페페', ticker: 'PEPE/KRW', percent: 14 },
    ],
    black: [
        { rank: 1, name: '비트코인', ticker: 'BTC/KRW', percent: 35 },
        { rank: 2, name: '이더리움', ticker: 'ETH/KRW', percent: 28 },
        { rank: 3, name: '솔라나', ticker: 'SOL/KRW', percent: 22 },
        { rank: 4, name: '리플', ticker: 'XRP/KRW', percent: 18 },
        { rank: 5, name: '에이다', ticker: 'ADA/KRW', percent: 15 },
    ],
    orange: [
        { rank: 1, name: '이더리움', ticker: 'ETH/KRW', percent: 30 },
        { rank: 2, name: '도지코인', ticker: 'DOGE/KRW', percent: 25 },
        { rank: 3, name: '비트코인', ticker: 'BTC/KRW', percent: 20 },
        { rank: 4, name: '아발란체', ticker: 'AVAX/KRW', percent: 18 },
        { rank: 5, name: '폴카닷', ticker: 'DOT/KRW', percent: 12 },
    ],
    purple: [
        { rank: 1, name: '리플', ticker: 'XRP/KRW', percent: 28 },
        { rank: 2, name: '솔라나', ticker: 'SOL/KRW', percent: 24 },
        { rank: 3, name: '이오스', ticker: 'EOS/KRW', percent: 20 },
        { rank: 4, name: '체인링크', ticker: 'LINK/KRW', percent: 15 },
        { rank: 5, name: '라이트코인', ticker: 'LTC/KRW', percent: 11 },
    ],
    green: [
        { rank: 1, name: '도지코인', ticker: 'DOGE/KRW', percent: 40 },
        { rank: 2, name: '시바이누', ticker: 'SHIB/KRW', percent: 30 },
        { rank: 3, name: '페페', ticker: 'PEPE/KRW', percent: 20 },
        { rank: 4, name: '리플', ticker: 'XRP/KRW', percent: 15 },
        { rank: 5, name: '이더리움 클래식', ticker: 'ETC/KRW', percent: 10 },
    ],
    blue: [
        { rank: 1, name: '트론', ticker: 'TRX/KRW', percent: 33 },
        { rank: 2, name: '비트코인 캐시', ticker: 'BCH/KRW', percent: 28 },
        { rank: 3, name: '스텔라루멘', ticker: 'XLM/KRW', percent: 21 },
        { rank: 4, name: '알고랜드', ticker: 'ALGO/KRW', percent: 17 },
        { rank: 5, name: '코스모스', ticker: 'ATOM/KRW', percent: 14 },
    ],
    white: [
        { rank: 1, name: '이오스', ticker: 'EOS/KRW', percent: 25 },
        { rank: 2, name: '네오', ticker: 'NEO/KRW', percent: 22 },
        { rank: 3, 'name': '퀀텀', ticker: 'QTUM/KRW', percent: 19 },
        { rank: 4, name: '온톨로지', ticker: 'ONT/KRW', percent: 16 },
        { rank: 5, name: '아이콘', ticker: 'ICX/KRW', percent: 13 },
    ],
};

const membershipLevels: { id: Membership; label: string; }[] = [
    { id: 'whale', label: '고래' },
    { id: 'black', label: '블랙' },
    { id: 'orange', label: '오렌지' },
    { id: 'purple', label: '퍼플' },
    { id: 'green', label: '그린' },
    { id: 'blue', label: '블루' },
    { id: 'white', label: '화이트' },
];

type Membership = keyof typeof membershipBuysData;

export default function BithumbMembershipBuys() {
    const [activeTab, setActiveTab] = useState<Membership>('whale');
    const data = membershipBuysData[activeTab];

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="font-headline text-lg">Bithumb Lab 상위 매수</CardTitle>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <div className="p-1">
                                        <p className="font-semibold">어제 그룹별 순매수 금액(매수금액 - 매도금액) 기준 상위 코인 순위입니다.</p>
                                        <p className="text-xs text-muted-foreground mt-1">'매수 비중'은 해당 그룹의 총 순매수 금액에서 해당 코인이 차지하는 비중을 의미합니다.</p>
                                        <hr className="my-2" />
                                        <p className="text-xs text-muted-foreground"><span className="font-bold">그룹 기준:</span><br/>
                                        - 고래: 자산 상위 1,000명<br/>
                                        - 블랙: 1000억원 이상<br/>
                                        - 오렌지: 100억원 이상<br/>
                                        - 퍼플: 10억원 이상<br/>
                                        - 그린: 1억원 이상<br/>
                                        - 블루: 1000만원 이상<br/>
                                        - 화이트: 1000만원 미만</p>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <span className="text-sm text-muted-foreground">어제 기준</span>
                </div>
                <ScrollArea className="w-full whitespace-nowrap pb-2">
                    <div className="flex items-center gap-2 pt-2">
                        {membershipLevels.map(level => (
                            <Button
                                key={level.id}
                                size="sm"
                                variant={activeTab === level.id ? 'default' : 'ghost'}
                                onClick={() => setActiveTab(level.id)}
                                className="rounded-full px-4 flex-shrink-0"
                            >
                                {level.label}
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </CardHeader>
            <CardContent>
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
                                <span className="font-code font-bold text-lg text-primary">{item.percent}%</span>
                                <p className="text-xs text-muted-foreground">매수 비중</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
