"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { NodePanel } from '@/components/workflow/NodePanel';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { PropertiesPanel } from '@/components/workflow/PropertiesPanel';
import { AiSuggestion } from '@/components/workflow/AiSuggestion';
import { AVAILABLE_NODES, DEFAULT_WORKFLOW } from '@/lib/constants';
import type { NodeConfig, Workflow } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { nanoid } from 'nanoid'; // Simple unique ID generator

// Helper function to get unique ID, can be replaced with a robust library if needed
const generateNodeId = () => `node_${nanoid(8)}`;

export default function WorkflowDesignerPage() {
  const [workflow, setWorkflow] = useState<Workflow>(DEFAULT_WORKFLOW);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const { toast } = useToast();

  // Load workflow from localStorage if available
  useEffect(() => {
    const savedWorkflow = localStorage.getItem('autoFlowWorkflow');
    if (savedWorkflow) {
      try {
        setWorkflow(JSON.parse(savedWorkflow));
      } catch (e) {
        console.error("Failed to parse saved workflow from localStorage", e);
        localStorage.removeItem('autoFlowWorkflow'); // Clear corrupted data
      }
    }
  }, []);

  // Save workflow to localStorage on change
  useEffect(() => {
    localStorage.setItem('autoFlowWorkflow', JSON.stringify(workflow));
  }, [workflow]);


  const handleAddNode = useCallback((nodeType: string) => {
    const nodeDetails = AVAILABLE_NODES.find(n => n.type === nodeType);
    if (!nodeDetails) return;

    const newNode: NodeConfig = {
      id: generateNodeId(),
      type: nodeDetails.type,
      name: nodeDetails.name, // Default name from type
      position: { x: Math.random() * 400, y: Math.random() * 200 + 50 * workflow.nodes.length }, // Basic positioning
      data: { ...nodeDetails.defaultData },
    };

    setWorkflow(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      lastModified: new Date().toISOString(),
    }));
    setSelectedNodeId(newNode.id);
    toast({ title: "Node Added", description: `${nodeDetails.name} added to the workflow.` });
  }, [workflow.nodes.length, toast]);

  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      connections: prev.connections.filter(c => c.sourceNodeId !== nodeId && c.targetNodeId !== nodeId),
      lastModified: new Date().toISOString(),
    }));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
    toast({ title: "Node Deleted", description: `Node removed from the workflow.` });
  }, [selectedNodeId, toast]);

  const handleUpdateNodeData = useCallback((nodeId: string, data: Record<string, any>) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => (n.id === nodeId ? { ...n, data } : n)),
      lastModified: new Date().toISOString(),
    }));
  }, []);

  const handleUpdateNodeName = useCallback((nodeId: string, name: string) => {
    setWorkflow(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => (n.id === nodeId ? { ...n, name } : n)),
      lastModified: new Date().toISOString(),
    }));
  }, []);
  
  const selectedNode = workflow.nodes.find(n => n.id === selectedNodeId) || null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-[calc(100vh-8rem)] md:h-[calc(100vh-9rem)] max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-9rem)]">
      {/* Left Panel: Node Palette & AI Suggestions */}
      <div className="md:col-span-3 flex flex-col gap-4 md:gap-6 h-full max-h-full">
        <div className="flex-1 min-h-0"> {/* Allow NodePanel to grow and scroll */}
          <NodePanel availableNodes={AVAILABLE_NODES} onAddNode={handleAddNode} />
        </div>
        <div className="min-h-0"> {/* AI Suggestions can take remaining space or fixed */}
           <AiSuggestion 
            currentNodes={workflow.nodes} 
            availableNodes={AVAILABLE_NODES}
            onAddSuggestedNode={handleAddNode}
          />
        </div>
      </div>

      {/* Middle Panel: Workflow Canvas */}
      <div className="md:col-span-6 h-full max-h-full min-h-0">
        <WorkflowCanvas
          nodes={workflow.nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={handleSelectNode}
          onDeleteNode={handleDeleteNode}
          workflowName={workflow.name}
        />
      </div>

      {/* Right Panel: Properties */}
      <div className="md:col-span-3 h-full max-h-full min-h-0">
        <PropertiesPanel
          selectedNode={selectedNode}
          onUpdateNodeData={handleUpdateNodeData}
          onUpdateNodeName={handleUpdateNodeName}
        />
      </div>
    </div>
  );
}
