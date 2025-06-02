"use client";

import type { NodeConfig, AvailableNode } from '@/lib/types';
import { AVAILABLE_NODES } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch'; // Assuming Switch is needed for boolean fields

interface PropertiesPanelProps {
  selectedNode: NodeConfig | null;
  onUpdateNodeData: (nodeId: string, data: Record<string, any>) => void;
  onUpdateNodeName: (nodeId: string, name: string) => void;
}

export function PropertiesPanel({ selectedNode, onUpdateNodeData, onUpdateNodeName }: PropertiesPanelProps) {
  if (!selectedNode) {
    return (
      <Card className="h-full flex flex-col items-center justify-center shadow-xl">
        <CardContent className="text-center text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
          <p>Select a node to configure its properties.</p>
        </CardContent>
      </Card>
    );
  }

  const nodeTypeDetails = AVAILABLE_NODES.find(n => n.type === selectedNode.type);

  const handleDataChange = (fieldId: string, value: any) => {
    onUpdateNodeData(selectedNode.id, { ...selectedNode.data, [fieldId]: value });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateNodeName(selectedNode.id, event.target.value);
  };

  return (
    <Card className="h-full flex flex-col shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Properties: {selectedNode.name || nodeTypeDetails?.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="nodeName" className="text-sm font-medium">Node Name</Label>
              <Input
                id="nodeName"
                value={selectedNode.name || ''}
                onChange={handleNameChange}
                placeholder={nodeTypeDetails?.name || "Enter node name"}
                className="mt-1"
              />
            </div>

            {nodeTypeDetails?.configFields?.map(field => (
              <div key={field.id}>
                <Label htmlFor={field.id} className="text-sm font-medium">{field.label}</Label>
                {field.type === 'string' && (
                  <Input
                    id={field.id}
                    value={selectedNode.data[field.id] || ''}
                    onChange={(e) => handleDataChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="mt-1"
                  />
                )}
                {field.type === 'number' && (
                  <Input
                    id={field.id}
                    type="number"
                    value={selectedNode.data[field.id] || ''}
                    onChange={(e) => handleDataChange(field.id, parseFloat(e.target.value))}
                    placeholder={field.placeholder}
                    className="mt-1"
                  />
                )}
                {field.type === 'boolean' && (
                  <div className="flex items-center space-x-2 mt-1">
                    <Switch
                      id={field.id}
                      checked={selectedNode.data[field.id] || false}
                      onCheckedChange={(checked) => handleDataChange(field.id, checked)}
                    />
                    <Label htmlFor={field.id} className="text-sm">
                      {selectedNode.data[field.id] ? 'Enabled' : 'Disabled'}
                    </Label>
                  </div>
                )}
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.id}
                    value={selectedNode.data[field.id] || ''}
                    onChange={(e) => handleDataChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    className="mt-1 min-h-[100px] font-code text-xs"
                  />
                )}
              </div>
            ))}
            {(!nodeTypeDetails?.configFields || nodeTypeDetails.configFields.length === 0) && (
              <p className="text-sm text-muted-foreground">This node has no configurable properties.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
