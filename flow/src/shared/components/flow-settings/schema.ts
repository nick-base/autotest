import { ISchema } from '@formily/json-schema';
import { OPETATION_TPYE } from './data';

export const schema: ISchema = {
  definitions: {
    steps: {
      definitions: 'steps',
      type: 'array',
      required: true,
      title: '步骤',
      'x-decorator': 'FormItem',
      'x-component': 'ArrayItems',
      items: {
        type: 'object',
        'x-component': 'ArrayItems.Item',
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
              labelWidth: 100,
              wrapperWidth: 500,
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
                      visible: '{{["click", "type", "focus"].includes($deps[0])}}',
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
              requestUrl: {
                type: 'string',
                title: '请求地址',
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
