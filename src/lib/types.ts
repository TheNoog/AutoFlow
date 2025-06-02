import type React from 'react';

export interface NodeConfig {
  id: string;
  type: string;
  name: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface Connection {
  id: string;
  sourceNodeId: string;
  sourceHandle: string;
  targetNodeId: string;
  targetHandle: string;
}

export interface Workflow {
  id: string;
  name: string;
  nodes: NodeConfig[];
  connections: Connection[];
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
  type: string;
  name: string;
  description: string;
  icon?: React.ElementType;
  defaultData: Record<string, any>;
  configFields?: Array<{ id: string; label: string; type: 'string' | 'number' | 'boolean' | 'textarea'; placeholder?: string }>;
  inputs?: Array<{ id: string; name: string; type: string }>;
  outputs?: Array<{ id: string; name: string; type: string }>;
}
