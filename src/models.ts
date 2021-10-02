export interface ComponentData {
  nodes: ComponentNode[];
  links: ComponentLink[];
}

export interface ComponentLink {
  source: string;
  target: string;
  label: string;
  color: string;
}

export interface ComponentNode {
  x: number;
  y: number;
  id: string;
  color: string;
}

export interface Node {
  x: number;
  y: number;
  id: string;
  state?: NodeState;
  treeId?: string;
}

export interface Link {
  weight: number;
  connection: [string, string];
  state?: LinkState;
}

export enum LinkState {
  POSSIBLE,
  VISITED,
  DEFAULT,
  ERROR,
}

export enum NodeState {
  VISITED,
  DEFAULT,
}
