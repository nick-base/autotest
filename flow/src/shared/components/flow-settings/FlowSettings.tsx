import React, { useState, useEffect } from 'react';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Form,
  FormItem,
  FormLayout,
  Input,
  Select,
  Cascader,
  DatePicker,
  Submit,
  FormGrid,
  Upload,
  ArrayItems,
  Editable,
  FormButtonGroup,
} from '@/components/formily-antd';
import { action } from '@formily/reactive';
import { Card, Button, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const form = createForm({
  validateFirst: true,
});

const IDUpload = (props) => {
  return (
    <Upload
      {...props}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      headers={{
        authorization: 'authorization-text',
      }}>
      <Button icon={<UploadOutlined />}>上传复印件</Button>
    </Upload>
  );
};

const SchemaField = createSchemaField({
  components: {
    FormItem,
    FormGrid,
    FormLayout,
    Input,
    DatePicker,
    Cascader,
    Select,
    IDUpload,
    ArrayItems,
    Editable,
  },
  scope: {
    fetchAddress: (field) => {
      const transform = (data = {}) => {
        return Object.entries(data).reduce((buf, [key, value]) => {
          if (typeof value === 'string')
            return buf.concat({
              label: value,
              value: key,
            });
          const { name, code, cities, districts } = value;
          const _cities = transform(cities);
          const _districts = transform(districts);
          return buf.concat({
            label: name,
            value: code,
            children: _cities.length ? _cities : _districts.length ? _districts : undefined,
          });
        }, []);
      };

      field.loading = true;
      fetch('//unpkg.com/china-location/dist/location.json')
        .then((res) => res.json())
        .then(
          action.bound((data) => {
            field.dataSource = transform(data);
            field.loading = false;
          })
        );
    },
  },
});

const schema = {
  type: 'object',
  properties: {
    contacts: {
      type: 'array',
      required: true,
      title: '联系人信息',
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
          popover: {
            type: 'void',
            title: '完善联系人信息',
            'x-decorator': 'Editable.Popover',
            'x-component': 'FormLayout',
            'x-component-props': {
              layout: 'vertical',
            },
            'x-reactions': [
              {
                fulfill: {
                  schema: {
                    title: '{{$self.query(".name").value() }}',
                  },
                },
              },
            ],
            properties: {
              name: {
                type: 'string',
                title: '姓名',
                required: true,
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-component-props': {
                  style: {
                    width: 300,
                  },
                },
              },
              email: {
                type: 'string',
                title: '邮箱',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-validator': [{ required: true }, 'email'],
                'x-component-props': {
                  style: {
                    width: 300,
                  },
                },
              },
              phone: {
                type: 'string',
                title: '手机号',
                'x-decorator': 'FormItem',
                'x-component': 'Input',
                'x-validator': [{ required: true }, 'phone'],
                'x-component-props': {
                  style: {
                    width: 300,
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
          title: '新增联系人',
          'x-component': 'ArrayItems.Addition',
        },
      },
    },
  },
};

const FLowSettings = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      form.setInitialValues({});
      setLoading(false);
    }, 100);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        background: '#eee',
        padding: '40px 0',
      }}>
      <Card title="编辑用户" style={{ width: 620 }}>
        <Spin spinning={loading}>
          <Form form={form} labelCol={5} wrapperCol={16} onAutoSubmit={console.log}>
            <SchemaField schema={schema} />
            {/* <FormButtonGroup.FormItem> */}
            <Submit block size="large">
              提交
            </Submit>
            {/* </FormButtonGroup.FormItem> */}
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default FLowSettings;
