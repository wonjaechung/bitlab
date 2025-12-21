'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const data = [
  { rank: 1, name: 'BTC', ticker: 'BTC', price: 70000, shortPain: { price: 75000, amount: '12억' }, longPain: { price: 65000, amount: '8억' } },
  { rank: 2, name: 'ETH', ticker: 'ETH', price: 3500, shortPain: { price: 3800, amount: '5억' }, longPain: { price: 3200, amount: '3.5억' } },
  { rank: 3, name: 'SOL', ticker: 'SOL', price: 160, shortPain: { price: 180, amount: '2억' }, longPain: { price: 140, amount: '2억' } },
  { rank: 4, name: 'XRP', ticker: 'XRP', price: 0.48, shortPain: { price: 0.52, amount: '2.5억' }, longPain: { price: 0.45, amount: '1.8억' } },
  { rank: 5, name: 'DOGE', ticker: 'DOGE', price: 0.12, shortPain: { price: 0.14, amount: '1.5억' }, longPain: { price: 0.10, amount: '1억' } },
];

const PainBar = ({ current, high, low }: { current: number, high: number, low: number }) => {
    const totalRange = high - low;
    if (totalRange <= 0) return null;

    const currentPosition = ((current - low) / totalRange) * 100;

    return (
        <div className="w-full h-3 my-1 rounded-full bg-gradient-to-r from-bullish to-destructive relative">
            <div 
                className="absolute top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-full border-2 border-background shadow"
                style={{ left: `${currentPosition}%` }}
            />
        </div>
    );
}

export default function MaxPainChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-lg">Hyperliquid 고래 최대 청산 발생 구간</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="space-y-4">
            {data.map((item) => {
                const longPainPercent = ((item.longPain.price - item.price) / item.price) * 100;
                const shortPainPercent = ((item.shortPain.price - item.price) / item.price) * 100;

                return (
                    <div key={item.rank} className="grid grid-cols-[60px_1fr] items-center gap-4">
                         <div className="flex items-center gap-3">
                            <div>
                                <div className="font-semibold">{item.ticker}</div>
                            </div>
                        </div>
                        <div className="relative flex flex-col">
                            <div className="flex justify-between w-full text-xs">
                                <div className="text-left space-y-1">
                                    <p className="font-code text-bullish font-semibold">${item.longPain.price.toLocaleString()} ({longPainPercent.toFixed(2)}%)</p>
                                    <p className="text-muted-foreground">{item.longPain.amount}</p>
                                </div>
                                <div className="text-center absolute left-1/2 -translate-x-1/2 top-0">
                                    <p className="font-code font-bold text-foreground">${item.price.toLocaleString()}</p>
                                    <p className="text-muted-foreground">현재가</p>
                                </div>
                                <div className="text-right space-y-1">
                                    <p className="font-code text-destructive font-semibold">${item.shortPain.price.toLocaleString()} (+{shortPainPercent.toFixed(2)}%)</p>
                                    <p className="text-muted-foreground">{item.shortPain.amount}</p>
                                </div>
                            </div>
                             <PainBar current={item.price} high={item.shortPain.price} low={item.longPain.price} />
                             <div className="flex justify-between w-full text-xs text-muted-foreground">
                                <span>롱 청산 밀집 구간</span>
                                <span>숏 청산 밀집 구간</span>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
      </CardContent>
    </Card>
  );
}
