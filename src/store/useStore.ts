import { create } from "zustand";
import runChat from "../config/gemini";
import {
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Connection,
  EdgeChange,
  Node,
  Edge,
  NodeChange,
} from "reactflow";

type Store = {
  nodes: Node[];
  edges: Edge[];
  addEdge: (params: Edge) => void;
  addNode: (params: Node) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Edge) => void;
  updateNodeType: (id: string, type: string, response: string) => void;
  updateNodeLabel: (id: string, label: string) => void;
  messages: Message[];
  suggestions: string[];
  input: string;
  loading: boolean;
  showResult: boolean;
  fullResponse: string;
  addMessage: (message: Message) => void;
  setSuggestions: (suggestions: string[]) => void;
  setLoading: (loading: boolean) => void;
  setShowResult: (showResult: boolean) => void;
  setInput: (input: string) => void;
  setFullResponse: (response: string) => void;
  onSent: (prompt: string, nodeId: string) => Promise<string>;
};

type Message = {
  role: string;
  content: string;
};

const useStore = create<Store>((set, get) => ({
  // REACT FLOW
  nodes: [
    {
      id: "node-1",
      type: "prompt",
      position: { x: 0, y: 0 },
      data: { label: "¿Qué te gustaría saber?" },
    },
  ],
  edges: [],
  addEdge: (params) => {
    set({ edges: addEdge(params, get().edges) as Edge[] });
  },
  addNode: (params) => {
    set({ nodes: [...get().nodes, params] });
  },
  onNodesChange: (changes: NodeChange[]) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node[] });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({ edges: applyEdgeChanges(changes, get().edges) as Edge[] });
  },
  onConnect: (params: Edge | Connection) => {
    set({ edges: addEdge(params, get().edges) as Edge[] });
  },
  updateNodeType: (id: string, newType: string, response: string) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            type: newType,
            data: {
              ...node.data,
              label: node.data.label,
              response,
              isCompleted: true,
              isEditable: false,
            },
          };
        }
        return node;
      });
      return { nodes: updatedNodes };
    });
  },
  updateNodeLabel: (id: string, label: string) => {
    set((state) => {
      const updatedNodes = state.nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label,
            },
          };
        }
        return node;
      });
      return { nodes: updatedNodes };
    });
  },

  // GEMINI
  messages: [],
  suggestions: [],
  input: "",
  loading: false,
  showResult: false,
  fullResponse: "",
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, id: Date.now() }],
    })),
  setSuggestions: (suggestions) => set({ suggestions }),
  setLoading: (loading) => set({ loading }),
  setShowResult: (showResult) => set({ showResult }),
  setInput: (input) => set({ input }),
  setFullResponse: (response) => set({ fullResponse: response }),

  onSent: async (prompt: string, nodeId: string): Promise<string> => {
    set({ loading: true, showResult: true, suggestions: [] });
    const {
      addMessage,
      setSuggestions,
      setLoading,
      setInput,
      setFullResponse,
      addNode,
      addEdge,
    } = get();

    try {
      const briefPrompt = `${prompt}\n\nNota: Por favor, responde de manera breve y concisa, limita la respuesta a 200 caracteres.`;
      const response = await runChat(briefPrompt);
      const truncatedResponse =
        response.length > 200 ? `${response.substring(0, 200)}...` : response;

      addMessage({ role: "assistant", content: truncatedResponse });
      setFullResponse(`\`\`\`javascript\n${truncatedResponse}\n\`\`\``);

      const additionalResponses: string[] = [];
      for (let i = 0; i < 3; i++) {
        const newNodeId = `node-${Date.now()}-${i}`;
        const additionalResponse = await runChat(`${prompt}\n\nNota: Genera una pregunta relacionada con el tema. No repitas la pregunta anterior ni su respuesta, solo la pregunta relacionada.`);
        
        additionalResponses.push(additionalResponse);

        addNode({
          id: newNodeId,
          type: "question",
          position: { x: 300, y: (i - 1) * 100 },
          data: { label: additionalResponse },
          parentId: nodeId,
        });

        addEdge({
          id: `edge-${nodeId}-${newNodeId}`,
          source: nodeId,
          target: newNodeId,
        });
      }

      setSuggestions(additionalResponses);
      return truncatedResponse;
    } catch (error) {
      console.error("Error occurred in onSent:", error);
      addMessage({
        role: "assistant",
        content: "An error occurred while fetching the response.",
      });
      return "An error occurred while fetching the response.";
    } finally {
      setLoading(false);
      setInput("");
    }
  },
}));

export default useStore;