"use client";

import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import type { CustomNodeData, AvailableNode } from '@/lib/types';
import { AVAILABLE_NODES } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Trash2 } from 'lucide-react';

// NodeComponent now receives props from React Flow
export function NodeComponent({ id, data, selected, type }: NodeProps<CustomNodeData>) {
  const { config } = data; // config is our original NodeConfig
  const nodeTypeDetails = AVAILABLE_NODES.find(n => n.type === type) as AvailableNode | undefined;
  const Icon = nodeTypeDetails?.icon;

  // Access onDeleteNode from data if passed (alternative to onNodesDelete in ReactFlow)
  // For this version, we'll rely on React Flow's onNodesDelete for deletion.

  const handleNodeClick = () => {
    // React Flow handles selection. If specific on-click logic is needed:
    // console.log('Node clicked:', id);
  };
  
  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click
    // Deletion will be handled by onNodesDelete in the main page,
    // triggered by React Flow when a node with 'selected = true' has backspace/delete pressed.
    // Or, if we pass a delete callback via `data.onDeleteNode(id)`.
    // For simplicity, we'll let React Flow's default delete mechanism handle it for now.
    // If a direct delete button is essential, `data.onDeleteNode(id)` would be used.
    console.warn(`Delete button on node ${id} clicked. Implement deletion via onNodesDelete or a passed callback.`);
  };


  return (
    <Card 
      className={`shadow-md hover:shadow-lg transition-shadow duration-200 w-64 ${selected ? 'ring-2 ring-primary' : 'border-border'}`}
      onClick={handleNodeClick}
    >
      {nodeTypeDetails?.inputs?.map((input, index) => (
        <Handle
          type="target"
          position={Position.Left}
          id={input.id}
          key={input.id}
          style={{ top: `${40 + index * 25}px`, background: 'hsl(var(--primary))' }}
          isConnectable={true}
        />
      ))}
      <CardHeader className="flex flex-row items-center justify-between p-3">
        <div className="flex items-center gap-2 flex-grow min-w-0">
          <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab flex-shrink-0" />
          {Icon && <Icon className="h-5 w-5 text-primary flex-shrink-0" />}
          <div className="flex-grow min-w-0">
            <CardTitle className="text-sm font-semibold leading-tight truncate" title={config.name || nodeTypeDetails?.name}>
              {config.name || nodeTypeDetails?.name}
            </CardTitle>
            {nodeTypeDetails?.description && (
              <CardDescription className="text-xs text-muted-foreground truncate" title={nodeTypeDetails.description}>
                {nodeTypeDetails.description}
              </CardDescription>
            )}
          </div>
        </div>
        {/* <Button variant="ghost" size="icon" onClick={handleDeleteClick} aria-label="Delete node" className="flex-shrink-0 ml-1">
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button> */}
      </CardHeader>
      {/* CardContent or CardFooter can be added here if nodes need more details visible directly */}
      {nodeTypeDetails?.outputs?.map((output, index) => (
        <Handle
          type="source"
          position={Position.Right}
          id={output.id}
          key={output.id}
          style={{ top: `${40 + index * 25}px`, background: 'hsl(var(--primary))' }}
          isConnectable={true}
        />
      ))}
    </Card>
  );
}
