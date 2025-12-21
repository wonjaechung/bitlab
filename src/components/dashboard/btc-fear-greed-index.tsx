'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function BtcFearGreedIndex() {
  const indexValue = 41;

  let statusText = "중립";
  let statusColor = "text-yellow-500";
  if (indexValue > 75) {
      statusText = "극도의 탐욕";
      statusColor = "text-destructive";
  } else if (indexValue > 55) {
      statusText = "탐욕";
      statusColor = "text-red-500";
  } else if (indexValue < 25) {
      statusText = "극도의 공포";
      statusColor = "text-blue-500";
  } else if (indexValue < 45) {
      statusText = "공포";
      statusColor = "text-sky-500";
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-1 whitespace-nowrap tracking-tight">
            BTC 공포/탐욕 지수
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start justify-center">
        <p className={cn("font-code text-2xl font-bold", statusColor)}>{indexValue}</p>
        <p className={cn("text-base font-semibold mt-1", statusColor)}>{statusText}</p>
      </CardContent>
    </Card>
  );
}
