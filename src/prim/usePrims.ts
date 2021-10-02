import {useCallback, useState} from "react";
import {colorTheme} from "../config";

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

    getNodes(comparator: ((node: Node) => boolean)) {

        return this.nodes.filter(comparator);

    }

    getComponentData(): ComponentData {

        const componentData: ComponentData = {nodes: [], links: []};

        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];

            componentData.nodes.push({
                x: node.x,
                y: node.y-50,
                id: node.id,
                color: node.state === NodeState.VISITED ? colorTheme.primary.DEFAULT : colorTheme.primary.lightest
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

}

interface ComponentData {

    nodes: ComponentNode[];
    links: ComponentLink[];

}

interface ComponentLink {
    source: string;
    target: string;
    label: string;
    color: string;
}

interface ComponentNode {
    x: number;
    y: number;
    id: string;
    color: string;
}

interface Node {
    x: number;
    y: number;
    id: string;
    state?: NodeState;
}

interface Link {
    weight: number;
    connection: [string, string];
    state?: LinkState
}

enum LinkState {
    POSSIBLE,
    VISITED,
    DEFAULT,
    ERROR
}

enum NodeState {

    VISITED,
    DEFAULT

}

enum ConnectionState {
    POSSIBLE,
    VISITED
}

interface Connection {

    target: string;
    weight: number;
    state?: ConnectionState

}


const DEFAULT_NODES: Node[] = [
    {
        x: 100,
        y: 100,
        id: "A"
    },
    {
        x: 200,
        y: 100,
        id: "B",
    },
    {
        x: 500,
        y: 100,
        id: "C"
    },
    {
        x: 200,
        y: 200,
        id: "D"
    },
    {
        x: 300,
        y: 200,
        id: "E"
    },
    {
        x: 700,
        y: 200,
        id: "F",
    },
    {
        x: 100,
        y: 300,
        id: "G",
    },
    {
        x: 300,
        y: 250,
        id: "H",
    },
    {
        x: 300,
        y: 350,
        id: "J",
    },
    {
        x: 300,
        y: 250,
        id: "F",
    },
    {
        x: 500,
        y: 300,
        id: "I",
    }
]

const DEFAULT_LINKS: Link[] = [
    {
        connection: ["A", "G"],
        weight: 5,
    },
    {
        connection: ["A", "B"],
        weight: 10,
    },
    {
        connection: ["B", "E"],
        weight: 15,
    },
    {
        connection: ["B", "C"],
        weight: 25,
    },
    {
        connection: ["C", "I"],
        weight: 15,
    },
    {
        connection: ["C", "H"],
        weight: 10,
    },
    {
        connection: ["D", "E"],
        weight: 5,
    },
    {
        connection: ["G", "D"],
        weight: 15,
    },
    {
        connection: ["H", "J"],
        weight: 10,
    },
    {
        connection: ["I", "J"],
        weight: 10,
    },
    {
        connection: ["H", "G"],
        weight: 20,
    },
]


export function usePrim() {
    const [stateGraph, setGraph] = useState<Graph>(new Graph(DEFAULT_NODES, DEFAULT_LINKS));

    const clickLink = useCallback((source: string, target: string) => {

        const graph: Graph = new Graph(stateGraph.nodes, stateGraph.links);

        const visited: Node[] = graph.getNodes(node => node.state === NodeState.VISITED);

        if (visited.length === 0) {

            graph.links.forEach((link) => {
                if (link.connection.includes(source) && link.connection.includes(target)) {
                    link.state = LinkState.VISITED;
                    graph.getNodes(node => node.id === source || node.id === target).forEach(node => node.state = NodeState.VISITED);
                }
            })

            setGraph(graph);
            return;

        }

        const possible: Link[] = getPossible(graph, visited);

        for (let i = 0; i < possible.length; i++) {

            const current = possible[i];

            if (current.connection.includes(source) && current.connection.includes(target)) {
                current.state = LinkState.VISITED;
                graph.getNodes(node => node.id === source || node.id === target).forEach(node => node.state = NodeState.VISITED);
                setGraph(graph);
                return;
            }

        }

        possible.forEach((link) => {
            link.state = LinkState.POSSIBLE;
        })

        graph.links.forEach((link) => {
            if (link.connection.includes(source) && link.connection.includes(target)) {
                link.state = LinkState.ERROR;
            }
        })


        setGraph(graph);

    }, [])


    const nextStep = useCallback(function () {

        const graph: Graph = new Graph(stateGraph.nodes, stateGraph.links);

        graph.links.forEach((link) => {
            if (link.state === LinkState.POSSIBLE) {
                link.state = LinkState.DEFAULT
            }
        });

        const visited: Node[] = graph.nodes.filter((node) => {
            return node.state === NodeState.VISITED;
        });

        if (visited.length === graph.nodes.length) {
            alert("Solved!")
        }

        if (visited.length === 0) {

            const randomNode = graph.nodes[Math.floor(Math.random() * graph.nodes.length)];
            randomNode.state = NodeState.VISITED;
            visited.push(randomNode)

        }

        const possibleConnections: Link[] = getPossible(graph, visited);

        console.log("pos: ",possibleConnections)

        possibleConnections[0].state = LinkState.VISITED;
        possibleConnections[0].connection.forEach((id: string) => {
            const node = graph.getNode(id)
            if (node) {
                node.state = NodeState.VISITED
            }

        })

        console.log(graph);

        setGraph(graph);


    }, []);

    const reset = useCallback(function () {

        const graph = new Graph(DEFAULT_NODES, DEFAULT_LINKS);

        graph.nodes.forEach((node) => {
            node.state = NodeState.DEFAULT;
        })

        graph.links.forEach((link) => {
            link.state = LinkState.DEFAULT;
        })

        setGraph(graph);

    }, []);

    return [stateGraph, nextStep, clickLink, reset];
}

function getPossible(graph: Graph, visited: Node[]): Link[] {

    const possible: Link[] = [];

    for (let i = 0; i < visited.length; i++) {

        const node: Node = visited[i];

        const notVisitedLinks = graph.links.filter((link) => link.state !== LinkState.VISITED)
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

    possible.sort((a,b)=>a.weight-b.weight);

    return possible.filter((a)=>a.weight<=possible[0].weight);

}