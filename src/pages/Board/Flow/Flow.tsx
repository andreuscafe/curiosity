import React, { useEffect, useMemo } from "react";
import ReactFlow, { MiniMap, Controls, Background } from "reactflow";
import "reactflow/dist/style.css";
import "tailwindcss/tailwind.css";
import PromptNode from "./PromptNode";
import useStore from "../../../store/useStore";
import "./custom.css";

const Flow = () => {
  const nodes = useStore((state) => state.nodes);
  const edges = useStore((state) => state.edges);
  const onNodesChange = useStore((state) => state.onNodesChange);
  const onEdgesChange = useStore((state) => state.onEdgesChange);
  const onConnect = useStore((state) => state.onConnect);
  const addEdge = useStore((state) => state.addEdge);

  const nodeTypes = useMemo(
    () => ({
      prompt: PromptNode
    }),
    []
  );

  useEffect(() => {
    setTimeout(() => {
      addEdge({
        source: "node-1",
        target: "node-2"
      });
    }, 3000);
  }, []);

  return (
    <div className="w-screen h-screen bg-black text-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <MiniMap
          nodeColor={() => "#242424"}
          nodeStrokeWidth={3}
          maskColor="#181818"
          className="bg-black"
        />
        <Controls />
        <Background color="#333" gap={24} />
      </ReactFlow>
    </div>
  );
};

export default Flow;
