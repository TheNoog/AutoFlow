"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Wand2, Loader2 } from 'lucide-react';
import { suggestNextNode, SuggestNextNodeInput, SuggestNextNodeOutput } from '@/ai/flows/suggest-next-node';
import type { NodeConfig, AvailableNode } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '../ui/scroll-area';

interface AiSuggestionProps {
  currentNodes: NodeConfig[];
  availableNodes: AvailableNode[];
  onAddSuggestedNode: (nodeType: string) => void;
}

export function AiSuggestion({ currentNodes, availableNodes, onAddSuggestedNode }: AiSuggestionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestNextNodeOutput | null>(null);
  const [userQuery, setUserQuery] = useState('');
  const { toast } = useToast();

  const handleSuggestNodes = async () => {
    setIsLoading(true);
    setSuggestions(null);

    const currentWorkflowForAI = JSON.stringify(currentNodes.map(n => ({ type: n.type, name: n.name, data: n.data })));
    const availableNodesForAI = JSON.stringify(availableNodes.map(n => ({ type: n.type, name: n.name, description: n.description })));

    const input: SuggestNextNodeInput = {
      currentWorkflow: currentWorkflowForAI,
      availableNodes: availableNodesForAI,
    };
    if (userQuery.trim()) {
      input.userQuery = userQuery.trim();
    }

    try {
      const result = await suggestNextNode(input);
      setSuggestions(result);
    } catch (error) {
      console.error("AI suggestion failed:", error);
      toast({
        variant: "destructive",
        title: "AI Suggestion Error",
        description: "Could not fetch suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-lg flex items-center">
          <Wand2 className="mr-2 h-5 w-5 text-primary" />
          AI Node Suggestions
        </CardTitle>
        <CardDescription>Get AI-powered recommendations for your next workflow step.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Optional: What are you trying to achieve? (e.g., 'send data to API then notify user')"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            className="min-h-[60px]"
          />
        </div>
        <Button onClick={handleSuggestNodes} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Getting Suggestions...' : 'Suggest Next Nodes'}
        </Button>

        {suggestions && (
          <div className="mt-4 space-y-3">
            <h4 className="font-semibold text-md">Suggested Nodes:</h4>
            {suggestions.suggestedNodes.length > 0 ? (
              <ScrollArea className="max-h-[150px] pr-3">
                <ul className="space-y-2">
                  {suggestions.suggestedNodes.map((nodeNameOrType, index) => {
                    const suggestedNodeDetail = availableNodes.find(
                      (an) => an.name === nodeNameOrType || an.type === nodeNameOrType
                    );
                    return (
                      <li key={index} className="p-2.5 border border-border rounded-md bg-card flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{suggestedNodeDetail ? suggestedNodeDetail.name : nodeNameOrType}</p>
                          {suggestedNodeDetail && <p className="text-xs text-muted-foreground">{suggestedNodeDetail.description}</p>}
                        </div>
                        {suggestedNodeDetail && (
                           <Button size="sm" variant="outline" onClick={() => onAddSuggestedNode(suggestedNodeDetail.type)}>
                             Add
                           </Button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            ) : (
              <p className="text-sm text-muted-foreground">No specific nodes suggested based on current input.</p>
            )}
            <div>
              <h4 className="font-semibold text-md mt-3">Reasoning:</h4>
              <p className="text-sm text-muted-foreground bg-card p-2.5 border border-border rounded-md">{suggestions.reasoning}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
