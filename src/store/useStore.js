import { create } from "zustand";
import runChat from "../config/gemini";
import { applyNodeChanges, applyEdgeChanges, addEdge } from "reactflow";

const useStore = create((set, get) => ({
  // REACT FLOW
  nodes: [
    {
      id: "node-1",
      type: "prompt",
      position: { x: 0, y: 0 },
      data: { label: "QuestionNode 1" }
    },
    {
      id: "node-2",
      type: "prompt",
      position: { x: 300, y: -100 },
      data: { label: "node 2" }
    },
    {
      id: "node-3",
      type: "prompt",
      position: { x: 300, y: 0 },
      data: { label: "sub-node 1" }
    },
    {
      id: "node-4",
      type: "prompt",
      position: { x: 300, y: 100 },
      data: { label: "sub-node 1" }
    }
  ],
  edges: [],

  addEdge: (params) => {
    set({
      edges: addEdge(params, get().edges)
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes)
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges)
    });
  },
  onConnect: (params) => {
    set({
      edges: addEdge(params, get().edges)
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
    set({ loading: true, showResult: true, suggestions: [] });
    const {
      // messages,
      addMessage,
      setSuggestions,
      setLoading,
      setInput,
      setFullResponse
    } = get();
    // const updatedHistory = [...messages, { role: "user", content: prompt }];

    try {
      const response = await runChat(prompt);
      const truncatedResponse =
        response.length > 200
          ? `${response.substring(0, 190)}... ¿Queres saber más?`
          : response;

      addMessage({ role: "assistant", content: truncatedResponse });
      setFullResponse(`\`\`\`javascript\n${truncatedResponse}\n\`\`\``);

      const additionalResponses = [];
      for (let i = 0; i < 3; i++) {
        const additionalResponse = await runChat(prompt);
        const truncatedAdditionalResponse =
          additionalResponse.length > 200
            ? `${truncatedAdditionalResponse.substring(
                0,
                190
              )}... ¿Queres saber más?`
            : additionalResponse;
        additionalResponses.push(truncatedAdditionalResponse);
      }
      setSuggestions(additionalResponses);
    } catch (error) {
      console.error("Error occurred in onSent:", error);
      addMessage({
        role: "assistant",
        content: "An error occurred while fetching the response."
      });
    } finally {
      setLoading(false);
      setInput("");
    }
  }
}));

export default useStore;
