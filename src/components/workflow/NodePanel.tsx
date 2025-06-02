"use client";

import type { AvailableNode } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface NodePanelProps {
  availableNodes: AvailableNode[];
  onAddNode: (nodeType: string) => void;
}

export function NodePanel({ availableNodes, onAddNode }: NodePanelProps) {
  return (
    <Card className="h-full flex flex-col shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Available Nodes</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <div className="grid grid-cols-1 gap-3">
            {availableNodes.map((node) => (
              <Button
                key={node.type}
                variant="outline"
                className="w-full justify-start p-3 h-auto text-left bg-card hover:bg-secondary/80 border-border"
                onClick={() => onAddNode(node.type)}
              >
                <div className="flex items-center gap-3">
                  {node.icon && <node.icon className="h-5 w-5 text-primary" />}
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-foreground">{node.name}</span>
                    <span className="text-xs text-muted-foreground">{node.description}</span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
