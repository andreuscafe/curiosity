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
  NodeChange
} from "reactflow";

// store type
type Store = {
  nodes: Node[];
  edges: Edge[];
  addEdge: (params: Edge) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (params: Edge) => void;
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
  onSent: (prompt: string) => Promise<void>;
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
      data: { label: "¿Qué te gustaría saber?" }
    },
    {
      id: "node-2",
      type: "question",
      position: { x: 300, y: -100 },
      data: { label: "Pregunta 1" },
      parentId: "node-1"
    },
    {
      id: "node-3",
      type: "question",
      position: { x: 300, y: 0 },
      data: { label: "Pregunta 2" },
      parentId: "node-1"
    },
    {
      id: "node-4",
      type: "question",
      position: { x: 300, y: 100 },
      data: { label: "Pregunta 3" },
      parentId: "node-1"
    },
    {
      id: "node-5",
      type: "question",
      position: { x: 200, y: -50 },
      data: { label: "Pregunta 4" },
      parentId: "node-2"
    },
    {
      id: "node-6",
      type: "question",
      position: { x: 200, y: 50 },
      data: { label: "Pregunta 5" },
      parentId: "node-2"
    }
  ],
  edges: [],

  addEdge: (params) => {
    console.log("addEdge -> params", params);

    set({
      edges: addEdge(params, get().edges) as Edge[]
    });
  },

  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes) as Node[]
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges) as Edge[]
    });
  },
  onConnect: (params: Edge | Connection) => {
    set({
      edges: addEdge(params, get().edges) as Edge[]
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
      messages: [...state.messages, { ...message, id: Date.now() }]
    })),

  setSuggestions: (suggestions) => set({ suggestions }),
  setLoading: (loading) => set({ loading }),
  setShowResult: (showResult) => set({ showResult }),
  setInput: (input) => set({ input }),
  setFullResponse: (response) => set({ fullResponse: response }),

  onSent: async (prompt) => {
    // set({ loading: true, showResult: true, suggestions: [] });
    // const {
    //   // messages,
    //   addMessage,
    //   setSuggestions,
    //   setLoading,
    //   setInput,
    //   setFullResponse
    // } = get();
    // // const updatedHistory = [...messages, { role: "user", content: prompt }];
    // try {
    //   const response = await runChat(prompt);
    //   const truncatedResponse =
    //     response.length > 200
    //       ? `${response.substring(0, 190)}... ¿Queres saber más?`
    //       : response;
    //   addMessage({ role: "assistant", content: truncatedResponse });
    //   setFullResponse(`\`\`\`javascript\n${truncatedResponse}\n\`\`\``);
    //   const additionalResponses = [];
    //   for (let i = 0; i < 3; i++) {
    //     const additionalResponse = await runChat(prompt);
    //     const truncatedAdditionalResponse =
    //       additionalResponse.length > 200
    //         ? `${truncatedAdditionalResponse.substring(
    //             0,
    //             190
    //           )}... ¿Queres saber más?`
    //         : additionalResponse;
    //     additionalResponses.push(truncatedAdditionalResponse);
    //   }
    //   setSuggestions(additionalResponses);
    // } catch (error) {
    //   console.error("Error occurred in onSent:", error);
    //   addMessage({
    //     role: "assistant",
    //     content: "An error occurred while fetching the response."
    //   });
    // } finally {
    //   setLoading(false);
    //   setInput("");
    // }
  }
}));

export default useStore;
