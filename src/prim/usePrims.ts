import { useCallback, useEffect, useState } from "react";
import { colorTheme } from "../config";
import { ComponentData, Link, LinkState, Node, NodeState } from "../models";
import {
  DEFAULT_NODES,
  getDefaultLinks,
  getRandomGraph,
} from "./default.config";

class Graph {
  nodes: Node[];
  links: Link[];

  constructor(nodes: Node[], links: Link[]) {
    this.nodes = nodes;
    this.links = links;

    if (
      this.nodes.findIndex((node) => node.state === NodeState.VISITED) === -1
    ) {
      this.nodes[Math.floor(Math.random() * this.nodes.length)].state =
        NodeState.VISITED;
    }
  }

  getNode(id: string): Node | null {
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].id === id) {
        return this.nodes[i];
      }
    }

    return null;
  }

  getNodes(comparator: (node: Node) => boolean) {
    return this.nodes.filter(comparator);
  }

  getComponentData(): ComponentData {
    const componentData: ComponentData = { nodes: [], links: [] };

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      componentData.nodes.push({
        x: node.x,
        y: node.y - 50,
        id: node.id,
        color:
          node.state === NodeState.VISITED
            ? colorTheme.primary.DEFAULT
            : colorTheme.primary.lightest,
      });
    }

    for (let i = 0; i < this.links.length; i++) {
      const link = this.links[i];

      let color: string = colorTheme.primary.lightest;

      switch (link.state) {
        case LinkState.POSSIBLE:
          color = colorTheme.primary.darker;
          break;
        case LinkState.VISITED:
          color = colorTheme.primary.DEFAULT;
          break;
        case LinkState.ERROR:
          color = colorTheme.error;
          break;
      }

      link.connection.sort();

      componentData.links.push({
        source: link.connection[0],
        target: link.connection[1],
        label: "" + link.weight,
        color: color,
      });
    }

    return componentData;
  }

  getVisitedNodes(): Node[] {
    const visitedNodes: Node[] = [];
    for (let i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].state === NodeState.VISITED) {
        visitedNodes.push(this.nodes[i]);
      }
    }
    return visitedNodes;
  }

  getConnectedLinks(visitedNodes: Node[]): Link[] {
    const res: Link[] = [];

    for (let i = 0; i < this.links.length; i++) {
      const link = this.links[i];

      for (let j = 0; j < visitedNodes.length; j++) {
        const node = visitedNodes[j];
        if (link.connection.includes(node.id)) {
          res.push(link);
          break;
        }
      }
    }

    return res;
  }

  refresh() {
    for (let li = 0; li < this.links.length; li++) {
      if (this.links[li].state !== LinkState.VISITED) {
        this.links[li].state = LinkState.DEFAULT;
      }
    }

    for (let ni = 0; ni < this.nodes.length; ni++) {
      if (this.nodes[ni].state !== NodeState.VISITED) {
        this.nodes[ni].state = NodeState.DEFAULT;
      }
    }
  }
}

export function usePrim() {
  const [stateGraph, setGraph] = useState<Graph>(
    new Graph(...getRandomGraph())
  );
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean>(false);
  const [chancesLeft, setChancesLeft] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    console.log("use effect: ", chancesLeft);

    if (chancesLeft === 0) {
      console.log("ZERO");
      const graph: Graph = new Graph(stateGraph.nodes, stateGraph.links);

      graph.links.forEach((link) => link.state === LinkState.ERROR);

      setGraph(graph);
      setGameOver(true);
    }
  }, [chancesLeft]);

  const clickLink = useCallback(
    (source: string, target: string) => {
      if (gameOver) {
        alert("GAME OVER. RESET");
        return;
      }

      const graph: Graph = new Graph(stateGraph.nodes, stateGraph.links);
      if (error === null) {
        setChancesLeft(3);
      }

      //remove errors and highlights
      graph.refresh();

      const visitedNodes = graph.getVisitedNodes();

      const connectedLinks: Link[] = graph.getConnectedLinks(visitedNodes);

      const clickedLink =
        graph.links[
          graph.links.findIndex(
            (link) =>
              link.connection.includes(source) &&
              link.connection.includes(target)
          )
        ];

      if (clickedLink.state === LinkState.VISITED) {
        setError("You already visited this Link");
        return;
      }

      const index = connectedLinks.findIndex(
        (link) =>
          link.connection.includes(source) && link.connection.includes(target)
      );
      if (index === -1) {
        clickedLink.state = LinkState.ERROR;
        setGraph(graph);
        setError("The Link is not connected to any of the visited Nodes");
        setChancesLeft(chancesLeft - 1);

        return;
      }

      const connectedLinksPossible: Link[] = [];
      for (let i = 0; i < connectedLinks.length; i++) {
        const link = connectedLinks[i];

        let sourceInside = false;
        let targetInside = false;

        for (let i = 0; i < visitedNodes.length; i++) {
          if (visitedNodes[i].id === link.connection[0]) {
            sourceInside = true;
          }
          if (visitedNodes[i].id === link.connection[1]) {
            targetInside = true;
          }

          if (targetInside && sourceInside) {
            break;
          }
        }

        if (!(targetInside && sourceInside)) {
          connectedLinksPossible.push(link);
        }
      }

      if (
        connectedLinksPossible.findIndex(
          (link) =>
            link.connection.includes(source) && link.connection.includes(target)
        ) === -1
      ) {
        clickedLink.state = LinkState.ERROR;
        setGraph(graph);
        setChancesLeft(chancesLeft - 1);
        setError("The Link is not connected to an unvisited Node");
        return;
      }

      const smallestPossible = connectedLinksPossible.sort(
        (a, b) => a.weight - b.weight
      )[0].weight;

      if (clickedLink.weight > smallestPossible) {
        clickedLink.state = LinkState.ERROR;
        setGraph(graph);
        setChancesLeft(chancesLeft - 1);
        setError("This Link does not have the smallest weight");
        return;
      }

      clickedLink.state = LinkState.VISITED;

      for (let i = 0; i < graph.nodes.length; i++) {
        if (clickedLink.connection.includes(graph.nodes[i].id)) {
          graph.nodes[i].state = NodeState.VISITED;
        }
      }

      if (visitedNodes.length === graph.nodes.length - 1) {
        setSolved(true);
      }

      setError(null);
      setGraph(graph);
      return;
    },
    [error, chancesLeft, gameOver, stateGraph]
  );

  const nextStep = useCallback(function () {
    const graph: Graph = new Graph(stateGraph.nodes, stateGraph.links);

    graph.links.forEach((link) => {
      if (link.state === LinkState.POSSIBLE) {
        link.state = LinkState.DEFAULT;
      }
    });

    const visited: Node[] = graph.nodes.filter((node) => {
      return node.state === NodeState.VISITED;
    });

    if (visited.length === graph.nodes.length) {
      alert("Solved!");
    }

    if (visited.length === 0) {
      const randomNode =
        graph.nodes[Math.floor(Math.random() * graph.nodes.length)];
      randomNode.state = NodeState.VISITED;
      visited.push(randomNode);
    }

    const possibleConnections: Link[] = getPossible(graph, visited);

    console.log("pos: ", possibleConnections);

    possibleConnections[0].state = LinkState.VISITED;
    possibleConnections[0].connection.forEach((id: string) => {
      const node = graph.getNode(id);
      if (node) {
        node.state = NodeState.VISITED;
      }
    });

    console.log(graph);

    setGraph(graph);
  }, []);

  const reset = useCallback(function () {
    const graph = new Graph(...getRandomGraph());

    graph.nodes.forEach((node) => {
      node.state = NodeState.DEFAULT;
    });

    graph.links.forEach((link) => {
      link.state = LinkState.DEFAULT;
    });

    setGraph(graph);
    setSolved(false);
    setError(null);
    setChancesLeft(3);
    setGameOver(false);
  }, []);

  return [
    stateGraph,
    nextStep,
    clickLink,
    reset,
    error,
    solved,
    chancesLeft,
    gameOver,
  ];
}

function getPossible(graph: Graph, visited: Node[]): Link[] {
  const possible: Link[] = [];

  for (let i = 0; i < visited.length; i++) {
    const node: Node = visited[i];

    const notVisitedLinks = graph.links.filter(
      (link) => link.state !== LinkState.VISITED
    );
    for (let k = 0; k < notVisitedLinks.length; k++) {
      const link = notVisitedLinks[k];

      if (link.connection[0] === node.id) {
        const node = graph.getNode(link.connection[1]);
        if (node?.state !== NodeState.VISITED) {
          possible.push(link);
        }
      } else if (link.connection[1] === node.id) {
        const node = graph.getNode(link.connection[0]);
        if (node?.state !== NodeState.VISITED) {
          possible.push(link);
        }
      }
    }
  }

  possible.sort((a, b) => a.weight - b.weight);

  return possible.filter((a) => a.weight <= possible[0].weight);
}
