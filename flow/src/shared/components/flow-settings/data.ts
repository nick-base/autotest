import { Operation } from 'shared/interface';

export const OPETATION_TPYE = [
  {
    label: '开始节点（忽略节点前操作）',
    value: Operation.Start,
  },
  {
    label: '结束节点（忽略节点后操作）',
    value: Operation.End,
  },
  {
    label: '打开链接',
    value: Operation.GOTO,
  },
  {
    label: '元素点击',
    value: Operation.Click,
  },
  {
    label: '获取焦点',
    value: Operation.Focus,
  },
  {
    label: '文本输入',
    value: Operation.Type,
  },
  {
    label: '等待请求响应',
    value: Operation.WaitForResponse,
  },
];
