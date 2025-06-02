"use client";

import type { AvailableNode } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// Button is not directly used for drag, but kept for structure. div will be draggable.

interface NodePanelProps {
  availableNodes: AvailableNode[];
  // onAddNode is removed as adding nodes will be handled by drag-and-drop
}

export function NodePanel({ availableNodes }: NodePanelProps) {
  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, nodeName: string) => {
    event.dataTransfer.setData('application/reactflow-type', nodeType);
    event.dataTransfer.setData('application/reactflow-name', nodeName);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Card className="h-full flex flex-col shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Available Nodes</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <div className="grid grid-cols-1 gap-3">
            {availableNodes.map((node) => (
              <div
                key={node.type}
                className="p-3 h-auto text-left bg-card hover:bg-secondary/80 border border-border rounded-md cursor-grab shadow-sm"
                onDragStart={(event) => onDragStart(event, node.type, node.name)}
                draggable
              >
                <div className="flex items-center gap-3">
                  {node.icon && <node.icon className="h-5 w-5 text-primary" />}
                  <div className="flex flex-col">
                    <span className="font-medium text-sm text-foreground">{node.name}</span>
                    <span className="text-xs text-muted-foreground">{node.description}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
