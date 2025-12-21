'use client';

import React from 'react';
import { Logo } from './logo';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const NavLink = ({ href, children, isNew = false }: { href: string; children: React.ReactNode; isNew?: boolean }) => (
    <Link href={href} className="text-base font-medium text-foreground/80 hover:text-foreground relative">
        {children}
        {isNew && <span className="absolute -top-1 -right-2 h-1.5 w-1.5 rounded-full bg-primary"></span>}
    </Link>
);

const NAV_ITEMS = [
    { label: '거래소', href: '#' },
    { label: '자산', href: '#' },
    { label: '입출금', href: '#' },
    { label: '시장동향', href: '#' },
    { label: '혜택·서비스', href: '#', isNew: true },
    { label: '고객지원', href: '#' },
    { label: '빗썸 BIZ', href: '#' },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-card-dark border-zinc-800 px-4">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>
        <nav className="hidden lg:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
                <NavLink key={item.label} href={item.href} isNew={item.isNew}>{item.label}</NavLink>
            ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
         <div className="hidden lg:flex items-center gap-4">
            <Button variant="ghost" size="sm">로그인</Button>
            <Button size="sm" className="bg-gray-800 text-white hover:bg-gray-700">회원가입</Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        KR <ChevronDown className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>English</DropdownMenuItem>
                    <DropdownMenuItem>日本語</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm">앱 다운로드</Button>
         </div>
         
         <div className="lg:hidden">
             <Sheet>
                 <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-6 w-6" />
                    </Button>
                 </SheetTrigger>
                 <SheetContent side="right" className="bg-card-dark border-zinc-800">
                    <SheetHeader>
                        <SheetTitle className="text-left">Menu</SheetTitle>
                    </SheetHeader>
                     <div className="flex flex-col gap-6 mt-8">
                        <nav className="flex flex-col gap-4">
                            {NAV_ITEMS.map((item) => (
                                <NavLink key={item.label} href={item.href} isNew={item.isNew}>{item.label}</NavLink>
                            ))}
                        </nav>
                        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-zinc-800">
                            <Button variant="ghost" className="justify-start px-0">로그인</Button>
                            <Button className="justify-start bg-gray-800 text-white hover:bg-gray-700">회원가입</Button>
                            <Button variant="ghost" className="justify-start px-0">앱 다운로드</Button>
                        </div>
                     </div>
                 </SheetContent>
             </Sheet>
         </div>
      </div>
    </header>
  );
}
