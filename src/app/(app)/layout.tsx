"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from 'react';
import { AppHeader } from '@/components/layout/AppHeader';
import LogoIcon from '@/components/icons/LogoIcon';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Workflow, ListChecks } from "lucide-react"; // Workflow renamed to avoid conflict
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { href: "/", label: "Workflow Designer", icon: Workflow },
  { href: "/logs", label: "Execution Logs", icon: ListChecks },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();

  const handleImport = () => {
    // Placeholder for import functionality
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const importedWorkflow = JSON.parse(event.target?.result as string);
            // TODO: Process importedWorkflow, potentially set it in a global state or pass to child
            console.log("Imported workflow:", importedWorkflow);
            toast({ title: "Workflow Imported", description: `${file.name} imported successfully.` });
          } catch (error) {
            console.error("Failed to parse workflow JSON:", error);
            toast({ variant: "destructive", title: "Import Failed", description: "Invalid JSON file." });
          }
        };
        reader.readAsText(file);
      }
    };
    fileInput.click();
  };

  const handleExport = () => {
    // Placeholder for export functionality
    // TODO: Get current workflow data from child or global state
    const workflowData = { id: "sample", name: "Sample Workflow", nodes: [], connections: [] };
    const jsonString = JSON.stringify(workflowData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowData.name.replace(/\s+/g, '_') || 'workflow'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Workflow Exported", description: "Workflow exported successfully." });
  };
  
  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r">
        <SidebarHeader className="p-4">
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <LogoIcon className="h-7 w-7 text-primary group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8" />
            <h2 className="text-lg font-headline font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              AutoFlow
            </h2>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <ScrollArea className="h-full">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      isActive={pathname === item.href}
                      tooltip={{children: item.label}}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <AppHeader onImport={handleImport} onExport={handleExport} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
