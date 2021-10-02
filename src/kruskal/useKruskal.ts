import { useCallback, useEffect, useState } from "react";
import { colorTheme } from "../config";
import { ComponentData, Link, LinkState, Node, NodeState } from "../models";
import { getRandomGraph } from "../prim/default.config";

let treeCounter = 0;

class Graph {
  nodes: Node[];
  links: Link[];

  constructor(nodes: Node[], links: Link[]) {
    this.nodes = nodes;
    this.links = links;
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

  getComponentData(): any {
    const componentData: any = { nodes: [], links: [] };

    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];

      componentData.nodes.push({
        x: node.x,
        y: node.y - 50,
        id: node.id,
        label: node.id,
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

  visitLink(link: Link) {
    link.state = LinkState.VISITED;

    const nodeLeft: Node = this.getNode(link.connection[0]) as Node;
    const nodeRight: Node = this.getNode(link.connection[1]) as Node;
    const treeLeft: string = "" + nodeLeft.treeId;
    const treeRight: string = "" + nodeRight.treeId;

    console.log("nodes (before):", this.nodes);

    if (
      nodeLeft.state === NodeState.VISITED &&
      nodeRight.state === NodeState.VISITED
    ) {
      console.log("both visited", treeLeft, treeRight);
      const treeId = "tree" + treeCounter;
      treeCounter++;
      this.nodes.forEach((node) => {
        if (node.treeId == treeLeft || node.treeId == treeRight) {
          node.treeId = treeId;
        } else {
          console.log(
            "no match for ",
            node.treeId,
            nodeLeft.treeId,
            nodeRight.treeId
          );
        }
      });
    } else if (
      nodeLeft.state === NodeState.VISITED ||
      nodeRight.state === NodeState.VISITED
    ) {
      console.log("one visited");
      const treeId = nodeRight.treeId || nodeLeft.treeId;
      nodeRight.treeId = treeId;
      nodeLeft.treeId = treeId;
    } else {
      console.log("none visited");
      const treeId = "tree" + treeCounter;
      treeCounter++;
      nodeRight.treeId = treeId;
      nodeLeft.treeId = treeId;
    }

    (this.getNode(link.connection[0]) as Node).state = NodeState.VISITED;
    (this.getNode(link.connection[1]) as Node).state = NodeState.VISITED;

    console.log("nodes (after):", this.nodes);
  }

  getClickedLink(source: string, target: string): Link {
    return this.links[
      this.links.findIndex(
        (link) =>
          link.connection.includes(source) && link.connection.includes(target)
      )
    ];
  }

  getErrorMessageFor(link: Link): string | null {
    if (link.state === LinkState.VISITED) {
      return "Link already visited";
    }

    const nodeLeft = this.getNode(link.connection[0]) as Node;
    const nodeRight = this.getNode(link.connection[1]) as Node;

    if (
      nodeLeft.state !== NodeState.VISITED ||
      nodeRight.state !== NodeState.VISITED
    ) {
      return null;
    }

    if (nodeLeft.treeId === nodeRight.treeId) {
      return "Can't connect two already connected subtrees";
    }

    return null;
  }

  isOneTree(): boolean {
    const visitedLinks = this.links.filter(
      (link) => link.state === LinkState.VISITED
    );
    if (visitedLinks.length === this.nodes.length - 1) {
      return true;
    }
    return false;
  }
}

export function useKruskal() {
  const [stateGraph, setGraph] = useState<Graph>(
    new Graph(...getRandomGraph())
  );
  const [error, setError] = useState<string | null>(null);
  const [solved, setSolved] = useState<boolean>(false);
  const [chancesLeft, setChancesLeft] = useState<number>(3);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    if (chancesLeft === 0) {
      const graph: Graph = new Graph(stateGraph.nodes, stateGraph.links);

      graph.links.forEach((link) => link.state === LinkState.ERROR);

      setGraph(graph);
      setGameOver(true);
    }
  }, [chancesLeft]);

  const clickLink = useCallback(
    (source: string, target: string) => {
      console.log("CLICK");

      if (gameOver) {
        alert("GAME OVER. RESET");
        return;
      }

      const graph: Graph = new Graph(stateGraph.nodes, stateGraph.links);
      console.log(graph);
      //remove errors and highlights
      graph.refresh();

      const possibleLinks = graph.links.filter((link: Link) => {
        const errorMessage: string | null = graph.getErrorMessageFor(link);
        if (errorMessage) {
          return false;
        }
        return true;
      });
      const sortedLinks: Link[] = possibleLinks.sort(
        (a: Link, b: Link) => a.weight - b.weight
      );

      const minimumLinks = sortedLinks.filter((link) => {
        return link.weight <= sortedLinks[0].weight;
      });

      const clickedLink = graph.getClickedLink(source, target);
      const errorMessage: string | null = graph.getErrorMessageFor(clickedLink);
      if (errorMessage) {
        setError(errorMessage);
        setChancesLeft(chancesLeft - 1);
        return;
      }

      for (let i = 0; i < minimumLinks.length; i++) {
        const curLink = minimumLinks[i];
        if (
          curLink.connection.includes(source) &&
          curLink.connection.includes(target)
        ) {
          graph.visitLink(curLink);

          const visitedNodes = graph.getVisitedNodes();
          if (visitedNodes.length === graph.nodes.length && graph.isOneTree()) {
            setSolved(true);
          }

          setError(null);
          setGraph(graph);
          return;
        }
      }

      clickedLink.state = LinkState.ERROR;
      setError("The clicked link does not have the smallest possible weight");
      setChancesLeft(chancesLeft - 1);
      setGraph(graph);
      return;
    },
    [error, chancesLeft, gameOver, stateGraph]
  );

  const reset = useCallback(
    function () {
      const graph = new Graph(...getRandomGraph());

      setGraph(graph);
      setSolved(false);
      setError(null);
      setChancesLeft(3);
      setGameOver(false);
    },
    [stateGraph, setGraph]
  );

  return [stateGraph, clickLink, reset, error, solved, chancesLeft, gameOver];
}
