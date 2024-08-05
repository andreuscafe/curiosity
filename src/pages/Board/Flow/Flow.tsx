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
    setTimeout(() => {
      console.log("adding edge");

      addEdge({
        source: "node-1",
        target: "node-2"
      } as Edge);
      addEdge({
        source: "node-1",
        target: "node-3"
      } as Edge);
      addEdge({
        source: "node-1",
        target: "node-4"
      } as Edge);
      addEdge({
        source: "node-2",
        target: "node-5"
      } as Edge);
      addEdge({
        source: "node-2",
        target: "node-6"
      } as Edge);

      addNode({
        id: "node-10",
        type: "question",
        position: { x: 200, y: -50 },
        data: { label: "Dynamic Node 1" },
        parentId: "node-6"
      });
      addNode({
        id: "node-11",
        type: "question",
        position: { x: 200, y: 50 },
        data: { label: "Dynamic Node 2" },
        parentId: "node-6"
      });

      addEdge({
        source: "node-6",
        target: "node-10"
      } as Edge);
      addEdge({
        source: "node-6",
        target: "node-11"
      } as Edge);
    }, 1000);
  }, []);

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
