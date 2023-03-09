export enum Operation {
  GOTO = 'goto',
}

export interface Step {
  type: Operation;
  url?: string;
}

export interface Simulator {
  steps: Step[];
}
