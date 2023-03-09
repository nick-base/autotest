export enum Operation {
  GOTO = 'goto',
  Click = 'click',
  Focus = 'focus',
  Type = 'type',
}

export interface Step {
  type: Operation;
  url?: string;
  selector?: string;
  typeData?: string;
}

export interface Simulator {
  steps: Step[];
}
