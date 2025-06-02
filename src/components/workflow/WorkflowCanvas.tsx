"use client";

import type { NodeConfig } from '@/lib/types';
import { NodeComponent } from './NodeComponent';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkflowCanvasProps {
  nodes: NodeConfig[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  workflowName: string;
}

export function WorkflowCanvas({ nodes, selectedNodeId, onSelectNode, onDeleteNode, workflowName }: WorkflowCanvasProps) {
  return (
    <Card className="h-full flex flex-col shadow-xl">
       <CardHeader>
        <CardTitle className="font-headline text-lg">{workflowName}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4 bg-background rounded-b-lg">
          {nodes.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
              <p className="text-center">Empty workflow.</p>
              <p className="text-center text-sm">Add nodes from the left panel to get started.</p>
            </div>
          )}
          {nodes.map((node) => (
            <NodeComponent
              key={node.id}
              node={node}
              isSelected={node.id === selectedNodeId}
              onSelectNode={onSelectNode}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
