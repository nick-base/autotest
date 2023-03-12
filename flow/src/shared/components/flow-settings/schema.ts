import { ISchema } from '@formily/json-schema';
import { OPETATION_TPYE, RELATION_LIST } from './data';

export const schema: ISchema = {
  definitions: {
    steps: {
      type: 'array',
      required: true,
      title: '步骤',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      'x-decorator-props': {
        style: {
          height: '65vh',
          overflow: 'auto',
          background: '#eee',
        },
      },
      items: {
        type: 'object',
        'x-component': 'ArrayItems.Item',
        'x-component-props': {
          style: {
            border: '1px solid #999',
            paddingBottom: '10px',
          },
        },
        properties: {
          sort: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayItems.SortHandle',
          },
          step: {
            type: 'void',
            'x-component': 'FormLayout',
            'x-component-props': {
              layout: 'horizontal',
              wrapperWidth: 400,
              labelWidth: 100,
              labelAlign: 'left',
            },
            properties: {
              title: {
                title: '{{"步骤" + ($self.index + 1)}}',
                'x-component': 'FormItem',
                'x-component-props': {
                  labelStyle: {
                    color: 'red',
                    fontWeight: 'blod',
                  },
                },
              },
              type: {
                type: 'string',
                title: '操作类型',
                required: true,
                enum: OPETATION_TPYE,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  showSearch: true,
                },
              },
              url: {
                type: 'string',
                title: '链接地址',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-reactions': {
                  dependencies: ['.type'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0] === "goto"}}',
                    },
                  },
                },
              },
              selector: {
                type: 'string',
                title: '选择器 ',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-reactions': {
                  dependencies: ['.type'],
                  fulfill: {
                    state: {
                      visible: '{{["click", "type", "focus", "typeName", "typeCertNo"].includes($deps[0])}}',
                    },
                  },
                },
              },
              typeData: {
                type: 'string',
                title: '输入内容',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-reactions': {
                  dependencies: ['.type'],
                  fulfill: {
                    state: {
                      visible: '{{["type"].includes($deps[0])}}',
                    },
                  },
                },
              },
              requestUrlRegExp: {
                type: 'string',
                title: '地址正则',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-reactions': {
                  dependencies: ['.type'],
                  fulfill: {
                    state: {
                      visible: '{{["waitForResponse"].includes($deps[0])}}',
                    },
                  },
                },
              },
              relation: {
                type: 'string',
                title: '家庭关系',
                required: true,
                enum: RELATION_LIST,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-reactions': {
                  dependencies: ['.type'],
                  fulfill: {
                    state: {
                      visible: '{{["typeName", "typeCertNo"].includes($deps[0])}}',
                    },
                  },
                },
              },
            },
          },
          remove: {
            type: 'void',
            'x-decorator': 'FormItem',
            'x-component': 'ArrayItems.Remove',
          },
        },
      },
      properties: {
        addition: {
          type: 'void',
          title: '新增',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
  type: 'object',
  properties: {
    id: {
      type: 'string',
      title: '流程ID',
      required: false,
      'x-disabled': true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        style: {
          width: 400,
        },
      },
    },
    name: {
      type: 'string',
      title: '流程名称',
      required: true,
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      'x-component-props': {
        style: {
          width: 400,
        },
      },
    },
    steps: {
      $ref: '#/definitions/steps',
    },
  },
};
