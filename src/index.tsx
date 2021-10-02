import * as React from "react";
import * as ReactDom from "react-dom";
import PrimComponent from "./prim/PrimComponent";

ReactDom.render(<App/>, document.getElementById("app"));

function App() {

    return <div className={"w-full p-12 flex flex-row justify-center h-auto"}>
        <div className={"w-8/12 bg-white rounded-md shadow-md"}>
            <PrimComponent/>
        </div>
    </div>

}