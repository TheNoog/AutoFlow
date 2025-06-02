"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ExecutionLogEntry } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format, parseISO } from 'date-fns';

const MOCK_LOGS: ExecutionLogEntry[] = [
  {
    id: 'log_1',
    workflowId: 'wf_abc',
    workflowName: 'Daily Data Sync',
    startTime: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    endTime: new Date(Date.now() - 3600000 * 1.8).toISOString(), // 1.8 hours ago
    status: 'Completed',
    logs: [
      { timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), message: 'Workflow started' },
      { timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString(), message: 'Fetched 100 records from API' },
      { timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(), message: 'Data processed and stored. Workflow completed.' },
    ],
  },
  {
    id: 'log_2',
    workflowId: 'wf_def',
    workflowName: 'User Signup Notification',
    startTime: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
    endTime: new Date(Date.now() - 3600000 * 0.9).toISOString(), // 0.9 hours ago
    status: 'Failed',
    logs: [
      { timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), message: 'Workflow started for user test@example.com' },
      { timestamp: new Date(Date.now() - 3600000 * 0.95).toISOString(), message: 'Preparing to send email...' },
      { timestamp: new Date(Date.now() - 3600000 * 0.9).toISOString(), message: 'Error: SMTP server connection failed. Node: Send Email' },
    ],
  },
  {
    id: 'log_3',
    workflowId: 'wf_ghi',
    workflowName: 'Scheduled Report Generation',
    startTime: new Date(Date.now() - 60000 * 5).toISOString(), // 5 minutes ago
    status: 'Running',
    logs: [
      { timestamp: new Date(Date.now() - 60000 * 5).toISOString(), message: 'Workflow started' },
      { timestamp: new Date(Date.now() - 60000 * 2).toISOString(), message: 'Aggregating sales data...' },
    ],
  },
];

const StatusBadge: React.FC<{ status: ExecutionLogEntry['status'] }> = ({ status }) => {
  switch (status) {
    case 'Completed':
      return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Completed</Badge>;
    case 'Failed':
      return <Badge variant="destructive">Failed</Badge>;
    case 'Running':
      return <Badge variant="secondary" className="bg-blue-500 hover:bg-blue-600 text-white animate-pulse">Running</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ExecutionLogsPage() {
  const [logs, setLogs] = useState<ExecutionLogEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<ExecutionLogEntry | null>(null);

  useEffect(() => {
    // In a real app, fetch logs from an API
    setLogs(MOCK_LOGS);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    try {
      return format(parseISO(timestamp), "MMM d, yyyy, hh:mm:ss a");
    } catch {
      return timestamp; // fallback if parsing fails
    }
  };


  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-8rem)] md:h-[calc(100vh-9rem)] max-h-[calc(100vh-8rem)] md:max-h-[calc(100vh-9rem)]">
      <Card className="md:w-2/3 h-full flex flex-col shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-xl">Execution Logs</CardTitle>
          <CardDescription>View the history and status of your workflow executions.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Workflow Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} onClick={() => setSelectedLog(log)} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{log.workflowName}</TableCell>
                    <TableCell><StatusBadge status={log.status} /></TableCell>
                    <TableCell>{formatTimestamp(log.startTime)}</TableCell>
                    <TableCell>{log.endTime ? formatTimestamp(log.endTime) : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="md:w-1/3 h-full flex flex-col shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-lg">Log Details</CardTitle>
          {selectedLog && <CardDescription>Details for: {selectedLog.workflowName}</CardDescription>}
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-0">
          <ScrollArea className="h-full p-4">
            {selectedLog ? (
              <div className="space-y-3">
                {selectedLog.logs.map((entry, index) => (
                  <div key={index} className="text-xs p-2 rounded-md bg-background border border-border">
                    <p className="font-mono text-muted-foreground mb-0.5">[{formatTimestamp(entry.timestamp)}]</p>
                    <p className="font-mono text-foreground">{entry.message} {entry.nodeId && `(Node: ${entry.nodeId})`}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Select a log entry to view details.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
