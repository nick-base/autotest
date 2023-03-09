import { ISchema } from '@formily/json-schema';
import { OPETATION_TPYE } from './data';

export const schema: ISchema = {
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
    steps: {
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
            'x-component': 'FormItem',
            'x-component-props': {
              layout: 'vertical',
            },
            properties: {
              title: {
                title: '{{"步骤" + ($self.index + 1)}}',
                'x-component': 'FormItem',
              },
              type: {
                type: 'string',
                title: '操作类型',
                required: true,
                enum: OPETATION_TPYE,
                'x-decorator': 'FormItem',
                'x-component': 'Select',
                'x-component-props': {
                  style: {
                    width: 400,
                  },
                },
              },
              url: {
                type: 'string',
                title: '链接地址',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  style: {
                    width: 400,
                  },
                },
                'x-reactions': {
                  dependencies: ['.type'],
                  fulfill: {
                    state: {
                      visible: '{{$deps[0] === "goto"}}',
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
  },
};
