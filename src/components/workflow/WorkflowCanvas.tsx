"use client";

import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant, // Corrected: Keep as value import if used as value, or remove if only type was intended
} from 'reactflow';
import type { AppNode, AppEdge } from '@/lib/types';
import { NodeComponent } from './NodeComponent'; // Default custom node
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Define custom node types for React Flow
const nodeTypes = {
  // Add all your custom node types here
  // The key should match the 'type' field in your NodeConfig/AppNode
  'trigger:manual': NodeComponent,
  'action:log': NodeComponent,
  'action:httpRequest': NodeComponent,
  'action:customCode': NodeComponent,
  'action:sendEmail': NodeComponent,
  'logic:conditional': NodeComponent,
  'transform:filterData': NodeComponent,
  'transform:mapData': NodeComponent,
  // Add other types if NodeComponent is generic enough, or create specific components
};


interface WorkflowCanvasProps {
  nodes: AppNode[];
  edges: AppEdge[];
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: any) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onPaneClick?: (event: React.MouseEvent) => void;
  onNodeClick?: (event: React.MouseEvent, node: AppNode) => void;
  onNodesDelete?: (nodes: AppNode[]) => void;
  workflowName: string;
  reactFlowWrapperRef: React.RefObject<HTMLDivElement>;
}

export function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onDrop,
  onDragOver,
  onPaneClick,
  onNodeClick,
  onNodesDelete,
  workflowName,
  reactFlowWrapperRef,
}: WorkflowCanvasProps) {
  return (
    <Card className="h-full flex flex-col shadow-xl overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="font-headline text-lg">{workflowName}</CardTitle>
      </CardHeader>
      <CardContent ref={reactFlowWrapperRef} className="flex-grow p-0 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onPaneClick={onPaneClick}
          onNodeClick={onNodeClick}
          onNodesDelete={onNodesDelete}
          nodeTypes={nodeTypes}
          fitView
          className="bg-background" // Use Tailwind background for consistency
        >
          <Controls className="fill-foreground stroke-foreground text-foreground" />
          <MiniMap nodeColor={(node) => {
            switch (node.type) {
              case 'trigger:manual': return 'hsl(var(--accent))';
              default: return 'hsl(var(--primary))';
            }
          }} nodeStrokeWidth={3} zoomable pannable />
          <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="hsl(var(--border))" />
        </ReactFlow>
      </CardContent>
    </Card>
  );
}
