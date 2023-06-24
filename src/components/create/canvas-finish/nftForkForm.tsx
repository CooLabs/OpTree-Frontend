import React, { useState } from 'react';
import { Form } from 'antd';
import '../style.less';
import { observer } from 'mobx-react';
import { FormType, layout, renderFormItemContent, validateMessages } from '../var';

/* eslint-enable no-template-curly-in-string */
export type CollectionFormData = {
  title: string
  description: string
}

type Props = {
  onUpload: (data: CollectionFormData) => void
}
const NFTForkForm = (props:Props) => {
  const collectionForm: React.MutableRefObject<any> = React.useRef();

  const collectionSetting: Array<FormType> = [
    {
      type: 'input',
      title: 'Name',
      des: '',
      formParams: { name: 'title', rules: [{ required: true }] },
      contentParams: { showCount: true, maxLength: 20 },
      isRequired: true,
    },
    {
      type: 'textarea',
      title: 'Description',
      des: '',
      formParams: { name: 'description', rules: [{ required: true }] },
      contentParams: { maxLength: 2000 },
      isRequired: true,
    },
    {
      title: '',
      des: '',
      isRequired: true,
      formParams: {},
      contentParams: { name: 'Post Image' },
      type: 'submit',
    },
  ];


  const onFinish = (value) => {
    props.onUpload(value)
  };

  return (
    <div>
      <Form
        className="create-wrapper"
        {...layout}
        name="nest-messages"
        onFinish={onFinish}
        validateMessages={validateMessages}
        ref={collectionForm}
      >
        {collectionSetting.map((item) => renderFormItemContent(item))}
      </Form>
    </div>
    
  );
};

export default observer(NFTForkForm);
