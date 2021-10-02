import * as React from "react";
// @ts-ignore
import {Graph} from "react-d3-graph";
import {usePrim} from "./usePrims";
import {colorTheme} from "../config";

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
        strokeWidth: 8,
    },
    link: {
        strokeWidth: 16,
        highlightColor: colorTheme.primary.DEFAULT,
        fontSize: 16,
        labelProperty: "label",
        renderLabel: true,
        labelPosition: "center"
    },
    d3: {
        gravity: -300,
        alphaTarget: 0.75,
        linkLength: 100,
    }
}

export default function PrimComponent() {

    const [graphData, nextStep, clickLink, reset] = usePrim()

    return <div className={"w-full p-4 h-3/6 flex flex-col gap-4"}>
        <div className={"w-full text-center text-3xl"}>
            Prims Algorithm
        </div>
        <div className={"w-full text-left text-sm"}>
            <strong>This paragraph can be an explanation of Prims Algorithm or we can put your lecture here</strong> ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        </div>
        <div className={"w-full text-left text-xl"}>
Test your understanding - Just click the Links in the right order:
            </div>
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

        <div className={"flex flex-row flex-end justify-end gap-3"}>
            <button className={"bg-warning rounded px-3 py-2 w-2/12 "} onClick={reset}>Reset</button>
            <button className={"bg-primary rounded px-3 py-2 w-2/12 "} onClick={nextStep}>Next</button>
        </div>

    </div>

}