import type { AvailableNode } from './types';
import { Play, Terminal, Send, Settings2, MessageCircle, HelpCircle, Filter, Shuffle, GitFork } from 'lucide-react';

export const AVAILABLE_NODES: AvailableNode[] = [
  {
    type: 'trigger:manual',
    name: 'Manual Trigger',
    description: 'Starts the workflow manually.',
    icon: Play,
    defaultData: {},
    outputs: [{ id: 'output', name: 'Output', type: 'any' }],
  },
  {
    type: 'action:log',
    name: 'Log Message',
    description: 'Logs a message to the execution logs.',
    icon: Terminal,
    defaultData: { message: 'Hello from AutoFlow!' },
    configFields: [
      { id: 'message', label: 'Message', type: 'string', placeholder: 'Enter log message' },
    ],
    inputs: [{ id: 'input', name: 'Input', type: 'any' }],
  },
  {
    type: 'action:httpRequest',
    name: 'HTTP Request',
    description: 'Makes an HTTP request to a URL.',
    icon: Send,
    defaultData: { url: 'https://api.example.com', method: 'GET', headers: '{}', body: '{}' },
    configFields: [
      { id: 'url', label: 'URL', type: 'string', placeholder: 'https://api.example.com' },
      { id: 'method', label: 'Method', type: 'string', placeholder: 'GET, POST, etc.' },
      { id: 'headers', label: 'Headers (JSON)', type: 'textarea', placeholder: '{"Content-Type":"application/json"}' },
      { id: 'body', label: 'Body (JSON)', type: 'textarea', placeholder: '{"key":"value"}' },
    ],
    inputs: [{ id: 'payload', name: 'Payload', type: 'json' }],
    outputs: [{ id: 'response', name: 'Response', type: 'json' }],
  },
  {
    type: 'action:customCode',
    name: 'Custom Code',
    description: 'Executes custom JavaScript code.',
    icon: Settings2,
    defaultData: { code: 'return { data: "processed" };' },
    configFields: [
      { id: 'code', label: 'JavaScript Code', type: 'textarea', placeholder: 'Enter your code here' },
    ],
    inputs: [{ id: 'inputData', name: 'Input Data', type: 'any' }],
    outputs: [{ id: 'result', name: 'Result', type: 'any' }],
  },
  {
    type: 'action:sendEmail',
    name: 'Send Email',
    description: 'Sends an email.',
    icon: MessageCircle,
    defaultData: { to: '', subject: '', body: '' },
    configFields: [
      { id: 'to', label: 'To', type: 'string', placeholder: 'recipient@example.com' },
      { id: 'subject', label: 'Subject', type: 'string', placeholder: 'Email Subject' },
      { id: 'body', label: 'Body', type: 'textarea', placeholder: 'Email content' },
    ],
    inputs: [{ id: 'emailDetails', name: 'Email Details', type: 'json' }],
  },
  {
    type: 'logic:conditional',
    name: 'Conditional Logic',
    description: 'Routes data based on a condition.',
    icon: HelpCircle, // GitFork might be better but HelpCircle is fine.
    defaultData: { condition: 'data.value > 10' },
     configFields: [
      { id: 'condition', label: 'Condition (e.g., data.value > 10)', type: 'string', placeholder: 'data.value > 10' },
    ],
    inputs: [{ id: 'input', name: 'Input Data', type: 'any' }],
    outputs: [
        { id: 'truePath', name: 'True', type: 'any' },
        { id: 'falsePath', name: 'False', type: 'any' }
    ],
  },
  {
    type: 'transform:filterData',
    name: 'Filter Data',
    description: 'Filters an array of items based on a condition.',
    icon: Filter,
    defaultData: { filterLogic: 'item.isActive === true' },
    configFields: [
      { id: 'filterLogic', label: 'Filter Logic (e.g., item.value > 10)', type: 'string', placeholder: 'item.isActive === true' },
    ],
    inputs: [{ id: 'arrayInput', name: 'Array Input', type: 'array' }],
    outputs: [{ id: 'filteredArray', name: 'Filtered Array', type: 'array' }],
  },
  {
    type: 'transform:mapData',
    name: 'Map Data',
    description: 'Transforms each item in an array.',
    icon: Shuffle, // Using Shuffle as a placeholder for map/transform
    defaultData: { mapLogic: '{...item, newValue: item.oldValue * 2}' },
     configFields: [
      { id: 'mapLogic', label: 'Mapping Logic (e.g., { ...item, newField: item.oldField })', type: 'string', placeholder: '{...item, newValue: item.oldValue * 2}' },
    ],
    inputs: [{ id: 'arrayInput', name: 'Array Input', type: 'array' }],
    outputs: [{ id: 'mappedArray', name: 'Mapped Array', type: 'array' }],
  },
];

export const DEFAULT_WORKFLOW: Workflow = {
  id: 'default-workflow',
  name: 'My First Workflow',
  nodes: [
    { id: '1', type: 'trigger:manual', name: 'Start', position: { x: 50, y: 50 }, data: {} },
    { id: '2', type: 'action:log', name: 'Log Output', position: { x: 250, y: 50 }, data: { message: "Workflow started!" } },
  ],
  connections: [],
  lastModified: new Date().toISOString(),
};
