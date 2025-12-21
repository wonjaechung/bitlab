import * as React from 'react';
import { cn } from '@/lib/utils';

export const Logo = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
    <span
        className={cn("font-headline font-bold text-2xl tracking-tighter text-foreground", className)}
        {...props}
    >
        Bithumb Lab
    </span>
);
