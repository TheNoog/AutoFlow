"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  MarkerType,
} from 'reactflow';
import { NodePanel } from '@/components/workflow/NodePanel';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { PropertiesPanel } from '@/components/workflow/PropertiesPanel';
import { AiSuggestion } from '@/components/workflow/AiSuggestion';
import { AVAILABLE_NODES, DEFAULT_WORKFLOW } from '@/lib/constants';
import type { NodeConfig, Workflow, AppNode, AppEdge, AppConnection, CustomNodeData, AvailableNode } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { nanoid } from 'nanoid';

const generateNodeId = () => `node_${nanoid(8)}`;

// Helper to map our NodeConfig to React Flow's AppNode
const mapToAppNode = (nodeConfig: NodeConfig): AppNode => ({
  id: nodeConfig.id,
  type: nodeConfig.type,
  position: nodeConfig.position,
  data: { config: nodeConfig }, // Store original config in data for custom node component
});

// Helper to map our AppNode back to NodeConfig for saving/properties panel
const mapToNodeConfig = (appNode: AppNode): NodeConfig => ({
  id: appNode.id,
  type: appNode.type || 'unknown', // Ensure type is always string
  position: appNode.position,
  name: appNode.data.config.name,
  data: appNode.data.config.data,
});


function WorkflowDesignerInnerPage() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<CustomNodeData>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition, getIntersectingNodes } = useReactFlow();
  const [workflowName, setWorkflowName] = useState<string>(DEFAULT_WORKFLOW.name);
  const [selectedNodeConfig, setSelectedNodeConfig] = useState<NodeConfig | null>(null);
  const { toast } = useToast();

  // Load workflow
  useEffect(() => {
    const savedWorkflowJson = localStorage.getItem('autoFlowWorkflow');
    let loadedWorkflow: Workflow = DEFAULT_WORKFLOW;
    if (savedWorkflowJson) {
      try {
        loadedWorkflow = JSON.parse(savedWorkflowJson);
      } catch (e) {
        console.error("Failed to parse saved workflow", e);
        localStorage.removeItem('autoFlowWorkflow');
      }
    }
    setWorkflowName(loadedWorkflow.name);
    setNodes(loadedWorkflow.nodes.map(mapToAppNode));
    setEdges(loadedWorkflow.connections.map(edge => ({...edge, markerEnd: { type: MarkerType.ArrowClosed }})));
  }, [setNodes, setEdges]);

  // Save workflow
  useEffect(() => {
    const currentWorkflow: Workflow = {
      id: 'current-workflow', // Or manage IDs properly
      name: workflowName,
      nodes: nodes.map(mapToNodeConfig),
      connections: edges,
      lastModified: new Date().toISOString(),
    };
    localStorage.setItem('autoFlowWorkflow', JSON.stringify(currentWorkflow));
  }, [nodes, edges, workflowName]);


  const onConnect = useCallback(
    (params: AppConnection | AppEdge) => {
      setEdges((eds) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, eds));
      toast({ title: "Connection Added", description: "Nodes connected successfully." });
    },
    [setEdges, toast]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData('application/reactflow-type');
      const nameFromPanel = event.dataTransfer.getData('application/reactflow-name');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      const nodeDetails = AVAILABLE_NODES.find(n => n.type === type) as AvailableNode | undefined;
      if (!nodeDetails) return;

      const newNodeConfig: NodeConfig = {
        id: generateNodeId(),
        type,
        name: nameFromPanel || nodeDetails.name, // Use name from panel or default
        position,
        data: { ...nodeDetails.defaultData },
      };
      
      const newAppNode = mapToAppNode(newNodeConfig);
      setNodes((nds) => nds.concat(newAppNode));
      toast({ title: "Node Added", description: `${newNodeConfig.name} added to the workflow.` });
    },
    [screenToFlowPosition, setNodes, toast]
  );
  
  const handleNodeClick = useCallback((event: React.MouseEvent, node: AppNode) => {
    setSelectedNodeConfig(mapToNodeConfig(node));
  }, []);
  
  const handlePaneClick = useCallback(() => {
    setSelectedNodeConfig(null);
  }, []);

  const onNodesDelete = useCallback(
    (deleted: AppNode[]) => {
      toast({ title: "Node Deleted", description: `${deleted.length} node(s) removed.` });
      if (selectedNodeConfig && deleted.some(n => n.id === selectedNodeConfig.id)) {
        setSelectedNodeConfig(null);
      }
      // onNodesChange and onEdgesChange handle state updates for deletion
    },
    [toast, selectedNodeConfig]
  );


  const handleUpdateNodeData = useCallback((nodeId: string, data: Record<string, any>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedConfig = { ...node.data.config, data };
          return { ...node, data: { ...node.data, config: updatedConfig } };
        }
        return node;
      })
    );
    if (selectedNodeConfig && selectedNodeConfig.id === nodeId) {
      setSelectedNodeConfig(prev => prev ? {...prev, data} : null);
    }
  }, [setNodes, selectedNodeConfig]);

  const handleUpdateNodeName = useCallback((nodeId: string, name: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          const updatedConfig = { ...node.data.config, name };
          return { ...node, data: { ...node.data, config: updatedConfig } };
        }
        return node;
      })
    );
     if (selectedNodeConfig && selectedNodeConfig.id === nodeId) {
      setSelectedNodeConfig(prev => prev ? {...prev, name} : null);
    }
  }, [setNodes, selectedNodeConfig]);

  // AI Suggestion - map AppNode to NodeConfig for AI
   const currentNodesForAI = nodes.map(mapToNodeConfig);

  const handleAddSuggestedNodeByAI = useCallback((nodeType: string) => {
    const nodeDetails = AVAILABLE_NODES.find(n => n.type === nodeType);
    if (!nodeDetails) return;

    const newNodeConfig: NodeConfig = {
      id: generateNodeId(),
      type: nodeDetails.type,
      name: nodeDetails.name,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 200 + 50 }, // Basic positioning
      data: { ...nodeDetails.defaultData },
    };
    const newAppNode = mapToAppNode(newNodeConfig);
    setNodes((nds) => nds.concat(newAppNode));
    setSelectedNodeConfig(newNodeConfig); // Select the newly added node
    toast({ title: "Node Added", description: `${nodeDetails.name} added from AI suggestion.` });
  }, [setNodes, toast]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-[calc(100vh-8rem)] md:h-[calc(100vh-9rem)] max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-9rem)]">
      <div className="md:col-span-3 flex flex-col gap-4 md:gap-6 h-full max-h-full">
        <div className="flex-1 min-h-0">
          <NodePanel availableNodes={AVAILABLE_NODES} />
        </div>
        <div className="min-h-0">
           <AiSuggestion 
            currentNodes={currentNodesForAI} 
            availableNodes={AVAILABLE_NODES}
            onAddSuggestedNode={handleAddSuggestedNodeByAI}
          />
        </div>
      </div>

      <div className="md:col-span-6 h-full max-h-full min-h-0">
        <WorkflowCanvas
          reactFlowWrapperRef={reactFlowWrapper}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePaneClick}
          onNodesDelete={onNodesDelete}
          workflowName={workflowName}
        />
      </div>

      <div className="md:col-span-3 h-full max-h-full min-h-0">
        <PropertiesPanel
          selectedNode={selectedNodeConfig}
          onUpdateNodeData={handleUpdateNodeData}
          onUpdateNodeName={handleUpdateNodeName}
        />
      </div>
    </div>
  );
}

export default function WorkflowDesignerPage() {
  return (
    <ReactFlowProvider>
      <WorkflowDesignerInnerPage />
    </ReactFlowProvider>
  );
}
