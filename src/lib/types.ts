import type React from 'react';
import type { Node as ReactFlowNode, Edge as ReactFlowEdge, Connection as ReactFlowConnection } from 'reactflow';

export interface NodeConfig {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  data: Record<string, any>; // This holds the specific config for the node type
}

// This is our internal representation, which will be mapped to ReactFlowNode
export type CustomNodeData = {
  config: NodeConfig; // Original NodeConfig
  // We can add other metadata here if needed by the NodeComponent itself
};

// React Flow Node type using our custom data
export type AppNode = ReactFlowNode<CustomNodeData>;

// React Flow Edge type
export type AppEdge = ReactFlowEdge;
export type AppConnection = ReactFlowConnection;


export interface Workflow {
  id: string;
  name: string;
  nodes: NodeConfig[]; // Store our internal NodeConfig
  connections: AppEdge[]; // Store React Flow compatible edges
  lastModified: string;
}

export interface ExecutionLogEntry {
  id: string;
  workflowId: string;
  workflowName: string;
  startTime: string;
  endTime?: string;
  status: 'Running' | 'Completed' | 'Failed';
  logs: Array<{ timestamp: string; message: string; nodeId?: string }>;
}

export interface AvailableNode {
  type: string; // Corresponds to NodeConfig.type and ReactFlowNode.type
  name: string;
  description: string;
  icon?: React.ElementType;
  defaultData: Record<string, any>; // For NodeConfig.data
  configFields?: Array<{ id: string; label: string; type: 'string' | 'number' | 'boolean' | 'textarea'; placeholder?: string }>;
  inputs?: Array<{ id: string; name: string; type: string }>; // For Handle type="target"
  outputs?: Array<{ id: string; name: string; type: string }>; // For Handle type="source"
}
