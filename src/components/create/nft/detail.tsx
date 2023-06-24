import React, { useState } from 'react';
import { Form } from 'antd';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import themeStore from '@/store/modules/themeStore';
import { FormType, layout, renderFormItemContent, validateMessages } from '../var';
import useAppStore from '@/lib/store';

/* eslint-enable no-template-curly-in-string */
export type NFTFormData = {
  title: string
  description: string,
  featured: any
}

type Props = {
  onUpload: (data: NFTFormData) => void
  buttonState: {text: string, loading: boolean}
}
const CreateNFT = (props:Props) => {
  const theme = themeStore.theme;
  const [confirmCount, setConfirmCount] = useState(0)
  const collectionForm: React.MutableRefObject<any> = React.useRef();
  const [featured, setFeatured] = useState(null);
  const [config] = useState({
    maxSupply: 10000,
    maxRoyaltyRatio: 50,
    maxForkRoyaltyRatio: 75,
    maxForkFee: 20000000, //
    maxNameSize: 50, //
    maxDescSize: 2000, //
    maxCategorySize: 20,
    createFee: 100000000,
  });
  const [submitEnable, setSubmitEnable] = useState(false);


  const handleSelectImage = async (info, func, field) => {
    const { fileList } = info;
    const file = fileList[fileList.length - 1];
    if (file?.originFileObj) {
      // Get this url from response in real world.
      if (file.percent < 100) return;
      let path = window.URL.createObjectURL(file.originFileObj);
      func(path);
      const value = {};
      value[field] = file.originFileObj;
      collectionForm?.current?.setFieldsValue(value);
    }
  };

  const confirmFunc = ()=>{
    setConfirmCount(confirmCount + 1)
    
  }
  const collectionSetting: Array<FormType> = [
    {
      type: 'uploadPic',
      title: 'Upload image',
      des: "",
      formParams: { fieldName: 'featured', fieldName1: 'featured1' },
      contentParams: { picture: featured, updataFunc: setFeatured, handleSelectImage },
      isRequired: true,
    },
    {
      type: 'input',
      title: 'Name',
      des: '',
      formParams: { name: 'title', rules: [{ required: true }] },
      contentParams: { showCount: true, maxLength: config.maxNameSize },
      isRequired: true,
    },
    {
      type: 'textarea',
      title: 'Description',
      des: '',
      formParams: { name: 'description', rules: [{ required: true }] },
      contentParams: { maxLength: config.maxDescSize },
      isRequired: true,
    },
    {
      title: '',
      des: '',
      isRequired: true,
      formParams: {},
      contentParams: { disabled: !submitEnable, name: props.buttonState.text, loading: props.buttonState.loading },
      type: 'submit',
    },
  ];


  const onFinish = (value) => {
    if (confirmCount === 0){
      confirmFunc()
      return
    }
    props.onUpload(value)
  };

  const onFieldsChange = () => {
    const fieldsValue = collectionForm?.current?.getFieldsValue();
    const required = ['featured1', 'title', 'description'];
    for (let key of required) {
      if (!fieldsValue[key]) {
        setSubmitEnable(false);
        return;
      }
    }
    setSubmitEnable(true);
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
        onFieldsChange={onFieldsChange}
      >
        <h2>{'Commit a NFT'}</h2>
        <div className="required-field tip">Required fields</div>
        {collectionSetting.map((item) => renderFormItemContent(item))}
        
      </Form>
    </div>
    
  );
};

export default observer(CreateNFT);
