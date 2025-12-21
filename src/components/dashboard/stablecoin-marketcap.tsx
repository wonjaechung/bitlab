'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function StablecoinMarketCap() {
  const marketCap = 225.4; // in Trillion KRW
  const monthlyChange = -1.2;

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1 whitespace-nowrap tracking-tight">
          스테이블 시총
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-code text-2xl font-bold whitespace-nowrap">{marketCap.toFixed(1)}조</p>
        <p className="text-sm text-muted-foreground mt-1">
            저번달 대비: {monthlyChange.toFixed(1)}%
        </p>
      </CardContent>
    </Card>
  );
}
