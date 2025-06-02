"use client";

import Link from 'next/link';
import LogoIcon from '@/components/icons/LogoIcon';
import { Button } from '@/components/ui/button';
import { Upload, Download, PanelLeft } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

interface AppHeaderProps {
  onImport: () => void;
  onExport: () => void;
}

export function AppHeader({ onImport, onExport }: AppHeaderProps) {
  const { toggleSidebar, isMobile } = useSidebar();
  
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {isMobile && (
         <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
           <PanelLeft className="h-6 w-6" />
           <span className="sr-only">Toggle Sidebar</span>
         </Button>
      )}
      <Link href="/" className="flex items-center gap-2">
        <LogoIcon className="h-7 w-7 text-primary" />
        <h1 className="text-xl font-headline font-semibold text-foreground">AutoFlow</h1>
      </Link>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </header>
  );
}
