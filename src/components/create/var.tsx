import themeStore from '@/store/modules/themeStore';
import { Form, InputNumber, Input, Upload, DatePicker, Button, Switch, Select, Tooltip } from 'antd';
import moment from 'moment';
import UnknownLight from '@/assets/images/theme/light/unknown.svg';
import UnknownDark from '@/assets/images/theme/dark/unknown.svg';
import { getSvgIcon } from '@/svgUtils';
import './style.less'

export interface UploadPicType {
  title: string;
  des: string;
  fieldName: string;
  fieldName1: string;
  picture: any;
  updataFunc: Function;
}

export interface FormType {
  type: string;
  title: string;
  des: string;
  isRequired: boolean;
  formParams: {};
  contentParams: {};
  child?: {show: boolean, childContent?: Array<FormType>, onChange?}
}

export const layout = {
  labelCol: {
    span: 2,
  },
  wrapperCol: {
    span: 14,
  },
};

export const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};
/* eslint-enable no-template-curly-in-string */

export const horizonalLayout = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
};

const normFile = (e) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e && e.fileList;
};

export const renderFormItem = (type: string, formParams, contentParams, child) => {
  let content;
  switch (type) {
    case 'inputNumber':
      content = (
        <Form.Item className="margin-top-10" {...formParams}>
          <InputNumber controls={false} {...contentParams} />
        </Form.Item>
      );
      break;
    case 'input':
      content = (
        <Form.Item className="margin-top-10" {...formParams}>
          <Input {...contentParams} />
        </Form.Item>
      );
      break;
    case 'textarea':
      content = (
        <Form.Item className="margin-top-10" {...formParams}>
          <Input.TextArea showCount {...contentParams} />
        </Form.Item>
      );
      break;
    case 'datePicker':
      content = (
        <Form.Item className="margin-top-10" {...formParams}>
          <DatePicker.RangePicker
            style={{ width: '100%' }}
            showTime={{
              hideDisabledOptions: true,
              defaultValue: [moment('00:00:00', 'HH:mm'), moment('23:59:59', 'HH:mm')],
            }}
            placeholder={['Start time', 'End time']}
            format="YYYY-MM-DD HH:mm"
            separator={<span className="font-color">to</span>}
            bordered={false}
          />
        </Form.Item>
      );
      break;
    case 'uploadPic':
      content = (
        <Form.Item name={formParams['fieldName']} className="margin-top-10">
          <Form.Item
            rules={[{ required: true }]}
            name={formParams['fieldName1']}
            valuePropName="fileList"
            getValueFromEvent={normFile}
            noStyle
          >
            <Upload.Dragger
              accept="image/*"
              showUploadList={false}
              onChange={(info) =>
                contentParams.handleSelectImage(
                  info,
                  contentParams['updataFunc'],
                  formParams['fieldName']
                )
              }
            >
              {contentParams['picture'] ? (
                <div className={`picture ${formParams['fieldName']}`}>
                  <img alt="" src={contentParams['picture']} className="select-image"></img>
                  <div className="mask-inner" />
                </div>
              ) : (
                <div className={`picture ${formParams['fieldName']}`}>
                  <div
                    className={`mask-bg ${formParams['fieldName'] === 'logo' ? 'radius-50' : ''}`}
                  />
                  <img
                    alt=""
                    src={themeStore.theme === 'dark' ? UnknownDark : UnknownLight}
                    className="default"
                  ></img>
                </div>
              )}
            </Upload.Dragger>
          </Form.Item>
        </Form.Item>
      );
      break;
    case 'uploadExcel':
      content = (
        <Form.Item className="margin-top-10" {...formParams}>
          <Form.Item required={true} valuePropName="fileList" getValueFromEvent={normFile}>
            <Upload
              name="excel"
              action="/upload.do"
              accept=".xlsx, .xls"
              maxCount={1}
              onChange={(info) => contentParams.handleSelectExcel(info, contentParams['name'])}
            >
              <div className="required-field">
                <a>{contentParams['title']}</a>
              </div>
            </Upload>
          </Form.Item>
        </Form.Item>
      );
      break;
    case 'switch': 
      content = 
      <Form.Item className="margin-top-10" {...formParams}>
        <Switch  checked={child?.show} onChange={child?.onChange} />
      </Form.Item>
      break;
    case 'select':
      content = contentParams.options ? (<Form.Item {...formParams}>
        <Select defaultValue={contentParams.options[0]?.address}>
          {
            contentParams.options?.map((item, index)=>{
              return <Select.Option key={index} value={item.address}>{item.name}</Select.Option>
            })
          }
        </Select>
      </Form.Item>) : <></>
      break;
    case 'links':
      let links = contentParams.links;
      content = links.map((item, index) => (
        <Form.Item
          className={`${index === 0 ? 'margin-top-40' : 'margin-top-10'}`}
          name={item}
          label={contentParams['labels'][index]}
          labelAlign="left"
        >
          <Input />
        </Form.Item>
      ));

      break;
    default:
      content = <></>;
      break;
  }
  return content;
};

export const renderFormItemContent = (item: FormType) => {
  if (item.type === 'submit') {
    return (
      <div key={item.type}>
        <div className="divider margin-top-40"></div>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 0 }} className="margin-top-40">
          <Button className="create-btn" htmlType="submit" {...item.contentParams}>
            {item.contentParams['name']}
          </Button>
        </Form.Item>
      </div>
    );
  }else if (item.type === 'setting'){
    const SettingSvg = getSvgIcon('SettingSvg');
    return (
      <div className=' margin-top-40 flex-20' onClick={() => item.contentParams['func']()}>
        <div className={`${item.isRequired ? 'required-field' : ''} title `}>
          {item.title}
        </div>
        <div className="svg-icon flex-5" >
            {SettingSvg}
        </div>
      </div>
    )
  }
  return (
    <div key={item.title}>
      <div className={`${item.isRequired ? 'required-field' : ''} title margin-top-40`}>
        {item.title}
      </div>
      {item.des && <div className="tip margin-top-10">{item.des}</div>}
      {renderFormItem(item.type, item.formParams, item.contentParams, item.child)}
      {item.child && item.child.show && item.child?.childContent?.map(it=>renderFormItemContent(it))}
    </div>
  );
};
