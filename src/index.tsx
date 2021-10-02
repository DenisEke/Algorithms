import * as React from "react";
import * as ReactDom from "react-dom";
import KruskalComponent from "./kruskal/KruskalComponent";
import PrimComponent from "./prim/PrimComponent";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

ReactDom.render(<App />, document.getElementById("app"));

function App() {
  return (
    <Router>
      <div className={"w-full p-12 flex flex-row justify-center h-auto"}>
        <Switch>
          <Route path="/prims">
            <div className={"w-8/12 bg-white rounded-md shadow-md"}>
              <PrimComponent />
            </div>
          </Route>
          <Route path="/kruskal">
            <div className={"w-8/12 bg-white rounded-md shadow-md"}>
              <KruskalComponent />
            </div>
          </Route>
          <Route path="">
            <div className={"w-8/12 bg-white rounded-md shadow-md p-16"}>
              <Link to="/prims" className={"text-blue-600 underline"}>
                Goto Prims Algorithm
              </Link>
              <br />
              <Link to="/kruskal" className={"text-blue-600 underline"}>
                Goto Kruskal Algorithm
              </Link>
            </div>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
