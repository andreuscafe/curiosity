import React, { useEffect, useMemo } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Edge,
  OnConnect,
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
      question: QuestionNode,
    }),
    []
  );

  useEffect(() => {
    const initializeNodesAndEdges = () => {
      const nodeExists = (id) => nodes.some((node) => node.id === id);
      const edgeExists = (source, target) =>
        edges.some((edge) => edge.source === source && edge.target === target);

      if (!nodeExists("node-1")) {
        console.log(addNode)
        addNode({ id: "node-1", type: "prompt", position: { x: 0, y: 0 }, data: { label: "Node 1" } });
      }
      if (!edgeExists("node-1", "node-2")) {
        addEdge({ id: "edge-1", source: "node-1", target: "node-2" });
      }
    };

    initializeNodesAndEdges();
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
          padding: 1.5,
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
