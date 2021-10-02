import { Link, Node } from "../models";

const GRAPHS: any[] = [
  {
    links: [
      ["A", "G"],
      ["A", "B"],
      ["B", "E"],
      ["B", "C"],
      ["C", "F"],
      ["C", "J"],
      ["D", "E"],
      ["G", "D"],
      ["H", "J"],
      ["F", "H"],
      ["I", "J"],
      ["I", "H"],
      ["H", "G"],
    ],
    nodes: [
      {
        x: 100,
        y: 100,
        id: "A",
      },
      {
        x: 200,
        y: 100,
        id: "B",
      },
      {
        x: 500,
        y: 100,
        id: "C",
      },
      {
        x: 200,
        y: 200,
        id: "D",
      },
      {
        x: 300,
        y: 200,
        id: "E",
      },
      {
        x: 400,
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
        id: "I",
      },
      {
        x: 500,
        y: 300,
        id: "J",
      },
    ],
  },
  {
    links: [
      ["A", "B"],
      ["A", "E"],
      ["B", "C"],
      ["B", "F"],
      ["C", "D"],
      ["C", "G"],
      ["D", "H"],
      ["E", "F"],
      ["E", "I"],
      ["F", "G"],
      ["F", "J"],
      ["G", "H"],
      ["G", "K"],
      ["H", "L"],
      ["I", "J"],
      ["I", "M"],
      ["J", "K"],
      ["J", "N"],
      ["K", "L"],
      ["K", "O"],
      ["M", "N"],
      ["N", "O"],
      ["O", "P"],
      ["P", "L"],
    ],
    nodes: [
      {
        x: 100,
        y: 100,
        id: "A",
      },
      {
        x: 200,
        y: 100,
        id: "B",
      },
      {
        x: 300,
        y: 100,
        id: "C",
      },
      {
        x: 400,
        y: 100,
        id: "D",
      },
      {
        x: 150,
        y: 175,
        id: "E",
      },
      {
        x: 250,
        y: 175,
        id: "F",
      },
      {
        x: 350,
        y: 175,
        id: "G",
      },
      {
        x: 450,
        y: 175,
        id: "H",
      },
      {
        x: 100,
        y: 250,
        id: "I",
      },
      {
        x: 200,
        y: 250,
        id: "J",
      },
      {
        x: 300,
        y: 250,
        id: "K",
      },
      {
        x: 400,
        y: 250,
        id: "L",
      },
      {
        x: 150,
        y: 325,
        id: "M",
      },
      {
        x: 250,
        y: 325,
        id: "N",
      },
      {
        x: 350,
        y: 325,
        id: "O",
      },
      {
        x: 450,
        y: 325,
        id: "P",
      },
    ],
  },
];

export function getRandomGraph(): [Node[], Link[]] {
  const graph = { ...GRAPHS[Math.floor(Math.random() * GRAPHS.length)] };
  console.log(graph);
  return [
    graph.nodes,
    graph.links.map((link: any) => {
      return {
        connection: link,
        weight: getRandomWeight(),
      };
    }),
  ];
}

export function getDefaultLinks(): Link[] {
  return [
    {
      connection: ["A", "G"],
      weight: getRandomWeight(),
    },
    {
      connection: ["A", "B"],
      weight: getRandomWeight(),
    },
    {
      connection: ["B", "E"],
      weight: getRandomWeight(),
    },
    {
      connection: ["B", "C"],
      weight: getRandomWeight(),
    },
    {
      connection: ["C", "F"],
      weight: getRandomWeight(),
    },
    {
      connection: ["C", "J"],
      weight: getRandomWeight(),
    },
    {
      connection: ["D", "E"],
      weight: getRandomWeight(),
    },
    {
      connection: ["G", "D"],
      weight: getRandomWeight(),
    },
    {
      connection: ["H", "J"],
      weight: getRandomWeight(),
    },
    {
      connection: ["F", "H"],
      weight: getRandomWeight(),
    },
    {
      connection: ["I", "J"],
      weight: getRandomWeight(),
    },
    {
      connection: ["I", "H"],
      weight: getRandomWeight(),
    },
    {
      connection: ["H", "G"],
      weight: getRandomWeight(),
    },
  ];
}

function getRandomWeight() {
  return (1 + Math.floor(Math.random() * 4)) * 5;
}
