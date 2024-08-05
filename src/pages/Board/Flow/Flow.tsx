import React, { useEffect, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Edge,
  OnConnect
} from "reactflow";
import "reactflow/dist/style.css";
import "tailwindcss/tailwind.css";
import PromptNode from "./PromptNode";
import useStore from "../../../store/useStore";
import "./custom.css";
import QuestionNode from "./QuestionNode";

const Flow = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);
  const addEdge = useStore((state) => state.addEdge);
  const addNode = useStore((state) => state.addNode);

  const nodeTypes = useMemo(
    () => ({
      prompt: PromptNode,
      question: QuestionNode
    }),
    []
  );

  useEffect(() => {
    const initializeNodesAndEdges = () => {
      console.log("Adding nodes and edges");

      const nodeExists = (id) => nodes.some(node => node.id === id);
      const edgeExists = (source, target) => edges.some(edge => edge.source === source && edge.target === target);

      // Lista de nodos a agregar
      const nodesToAdd = [
        { id: "node-1", type: "prompt", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
        { id: "node-2", type: "prompt", position: { x: 200, y: 0 }, data: { label: "Node 2" } },
        { id: "node-3", type: "prompt", position: { x: 400, y: 0 }, data: { label: "Node 3" } },
        { id: "node-4", type: "prompt", position: { x: 600, y: 0 }, data: { label: "Node 4" } },
        { id: "node-5", type: "prompt", position: { x: 800, y: 0 }, data: { label: "Node 5" } },
        { id: "node-6", type: "prompt", position: { x: 1000, y: 0 }, data: { label: "Node 6" } },
        { id: "node-10", type: "question", position: { x: 200, y: -50 }, data: { label: "Dynamic Node 1" }, parentId: "node-6" },
        { id: "node-11", type: "question", position: { x: 200, y: 100 }, data: { label: "Dynamic Node 2" }, parentId: "node-6" },
      ];

      // Agregar nodos si no existen
      nodesToAdd.forEach(node => {
        if (!nodeExists(node.id)) {
          addNode(node);
        }
      });

      // Lista de aristas a agregar
      const edgesToAdd = [
        { source: "node-1", target: "node-2" },
        { source: "node-1", target: "node-3" },
        { source: "node-1", target: "node-4" },
        { source: "node-2", target: "node-5" },
        { source: "node-2", target: "node-6" },
        { source: "node-6", target: "node-10" },
        { source: "node-6", target: "node-11" },
      ];

      // Agregar aristas si no existen
      edgesToAdd.forEach(edge => {
        if (!edgeExists(edge.source, edge.target)) {
          addEdge(edge as Edge);
        }
      });
    };

  }, [addEdge, addNode, nodes, edges]);

  return (
    <div className="w-screen h-screen bg-[#181818] text-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect as OnConnect}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{
          padding: 1.5
        }}
      >
        <MiniMap
          nodeColor={() => "#242424"}
          nodeStrokeWidth={3}
          maskColor="#181818"
          className="bg-black"
        />
        <Controls />
        <Background color="#666" gap={24} />
      </ReactFlow>
    </div>
  );
};

export default Flow;