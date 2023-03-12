import { Operation } from 'shared/interface';

export const RELATION_LIST = [
  {
    label: '本人',
    value: 'self',
  },
  {
    label: '配偶',
    value: 'spouse',
  },
  {
    label: '父亲',
    value: 'father',
  },
  {
    label: '母亲',
    value: 'mother',
  },
  {
    label: '儿子',
    value: 'son',
  },
  {
    label: '女儿',
    value: 'daughter',
  },
];

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
    label: '文本输入-姓名',
    value: Operation.TypeName,
  },
  {
    label: '文本输入-身份证号',
    value: Operation.TypeCertNo,
  },
  {
    label: '等待请求响应',
    value: Operation.WaitForResponse,
  },
];
