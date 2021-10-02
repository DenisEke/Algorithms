import * as React from "react";
// @ts-ignore
import { Graph } from "react-d3-graph";
import { useKruskal } from "./useKruskal";
import { colorTheme } from "../config";

const graphConfig = {
  linkHighlightBehavior: true,
  automaticRearrangeAfterDropNode: true,
  staticGraph: true,
  width: "100%",
  height: 350,
  node: {
    size: 1024,
    fontSize: 16,
    highlightFontSize: 16,
    labelPosition: "center",
    labelProperty: "label",
    strokeWidth: 8,
  },
  link: {
    strokeWidth: 16,
    highlightColor: colorTheme.primary.DEFAULT,
    fontSize: 16,
    labelProperty: "label",
    renderLabel: true,
    labelPosition: "center",
  },
  d3: {
    gravity: -300,
    alphaTarget: 0.75,
    linkLength: 100,
  },
};

export default function KruskalComponent() {
  const [graphData, clickLink, reset, error, solved, chancesLeft, gameOver] =
    useKruskal();

  return (
    <div className={"w-full p-4 h-3/6 flex flex-col gap-4"}>
      <div className={"w-full text-center text-3xl"}>Kruskal Algorithm</div>
      <div className={"w-full text-left"}>
        <div className={"w-full text-xl font-medium"}>
          How to use this tool?
        </div>
        Click the connections between the nodes in the order of kruskals
        algorithm. You can make 3 mistakes.
        <br />
        <br />
        <span className="bg-primary font-bold ml-4">Dark green</span> indicates
        visited Nodes and Links.
        <br />
        <span className="bg-primary-lightest font-bold ml-4">
          Light green
        </span>{" "}
        indicates not visited Nodes and Links.
        <br />
        <span className="bg-error font-bold ml-4">Red</span> indicates mistakes.
        <br />
      </div>
      {gameOver ? (
        <div
          className={
            "w-full p-8 border-8 border-red-300 rounded-lg text-red-800 font-bold"
          }
        >
          No more chances left. Reset (Reason: {error})
        </div>
      ) : (
        <div className={"text-center"}>
          You have {chancesLeft} mistakes left.
        </div>
      )}
      <Graph
        className={"flex-grow"}
        id="graph-id" // id is mandatory
        data={graphData.getComponentData()}
        config={graphConfig}
        onClickNode={(link: any) => {
          console.log(link);
        }}
        onClickLink={clickLink}
      />
      {!gameOver && error ? (
        <div
          className={
            "w-full p-8 border-8 border-red-300 rounded-lg text-red-800 font-bold"
          }
        >
          {error}
        </div>
      ) : null}
      {solved ? (
        <div
          className={
            "w-full p-8 border-8 border-primary rounded-lg text-primary font-bold"
          }
        >
          Solved! Congratulations!
        </div>
      ) : null}

      <div className={"flex flex-row flex-end justify-end gap-3"}>
        <button
          className={"bg-warning rounded px-3 py-2 w-2/12 "}
          onClick={() => {
            window.location.reload();
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
