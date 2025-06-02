"use client";

import type { NodeConfig, AvailableNode } from '@/lib/types';
import { AVAILABLE_NODES } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';

interface NodeComponentProps {
  node: NodeConfig;
  isSelected: boolean;
  onSelectNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
}

export function NodeComponent({ node, isSelected, onSelectNode, onDeleteNode }: NodeComponentProps) {
  const nodeTypeDetails = AVAILABLE_NODES.find(n => n.type === node.type);
  const Icon = nodeTypeDetails?.icon;

  return (
    <Card 
      className={`mb-4 shadow-md hover:shadow-lg transition-shadow duration-200 ${isSelected ? 'ring-2 ring-primary' : 'border-border'}`}
      onClick={() => onSelectNode(node.id)}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
          {Icon && <Icon className="h-6 w-6 text-primary" />}
          <div>
            <CardTitle className="text-md font-semibold leading-none">{node.name || nodeTypeDetails?.name}</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">{nodeTypeDetails?.description}</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onDeleteNode(node.id); }} aria-label="Delete node">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </CardHeader>
    </Card>
  );
}
