import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import '../style.less';
import { useHistory } from 'react-router-dom';
import { userHooks } from '@/components/hooks';
import { observer } from 'mobx-react';
import themeStore from '@/store/modules/themeStore';
import { FormType, layout, renderFormItemContent, validateMessages } from '../var';
import { useEnabledModuleCurrrenciesQuery } from '@/lens';
import useChannelStore from '@/lib/store/channel';
import { WMATIC_TOKEN_ADDRESS } from '@/utils/constants';
import useAppStore from '@/lib/store';


type Props = {
  onConfirm: () => void
}

const CollectionSetting = (props: Props) => {
  const uploadedImage = useAppStore((state) => state.uploadedImage)
  const [isFree, setIsFree] = useState(false)
  const setUploadedImage = useAppStore((state) => state.setUploadedImage)
  const settingForm: React.MutableRefObject<any> = React.useRef();
  const defaultValue = {
    isFree: !!uploadedImage.collectModule.amount || false,
    royalty: uploadedImage.royalty || 0,
    collectLimit: uploadedImage.collectModule.collectLimit || '5000',
    timeLimit: uploadedImage.collectModule.timeLimit || 1,
    amount: uploadedImage.collectModule.amount || 0,
    currency: uploadedImage.collectModule.currency || WMATIC_TOKEN_ADDRESS
  }
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const { data: enabledCurrencies } = useEnabledModuleCurrrenciesQuery({
    variables: { request: { profileIds: selectedChannel?.id } },
    skip: !selectedChannel?.id
  })

  const onFieldsChange = ()=> {
    const fieldsValue = settingForm?.current?.getFieldsValue();
    for (let key in fieldsValue){
      if (key === 'royalty'){
        uploadedImage.royalty = fieldsValue[key]
      } else{
        uploadedImage.collectModule[key] = fieldsValue[key]
      }
    }
    setUploadedImage({...uploadedImage})
  }

  const onFinish = ()=>{
    props.onConfirm()
  }
  const collectionSetting: Array<FormType> = [
    {
        type: 'inputNumber',
        title: 'Royalty',
        des: '',
        formParams: {
          name: 'royalty',
          initialValue: defaultValue.royalty,
        },
        contentParams: {
          min: 0,
          max: 100,
          precision: 1,
          placeholder: 'Percentage fee e.g.1000',
          addonAfter: `max ${100}`,
        },
        isRequired: true,
    },
    {
        type: 'inputNumber',
        title: 'Collect limit',
        des: '',
        formParams: {
          name: 'collectLimit',
          initialValue: defaultValue.collectLimit,
        },
        contentParams: {
          min: 0,
          max: 100000,
          precision: 0,
          placeholder: 'Percentage fee e.g.1000',
          addonAfter: `max ${100000}`,
        },
        isRequired: true,
      },
    {
      type: 'switch',
      title: 'Charge for collecting',
      des: "Get paid whenever someone collects your post",
      formParams: {name: 'isFree', initialValue: isFree },
      contentParams: { },
      isRequired: true,
      child: {
        show: isFree,
        onChange: (res)=>setIsFree(res),
        childContent: [{
        type: 'select',
        title: 'Select Currency',
        des: "",
        formParams: {name: 'currency', initialValue : defaultValue.currency},
        contentParams: {options: enabledCurrencies?.enabledModuleCurrencies},
        isRequired: false,
        },
        {
            type: 'inputNumber',
            title: 'Price',
            des: '',
            formParams: {
              name: 'amount',
              initialValue: defaultValue.amount
            },
            contentParams: {
                min: 0,
                controls:false,
                precision: 2,
                placeholder: 0,
                addonAfter: ``,
            },
            isRequired: false,
        },
        {
          type: 'input',
          title: 'Recipient address',
          des: '',
          formParams: { name: 'recipient', rules: [{ required: true }] },
          contentParams: { },
          isRequired: true,
        }
      ]}
    },
    {
      type: 'inputNumber',
      title: 'Time limit',
      des: 'Limit collecting to few days',
      formParams: {
        name: 'limitTime',
        initialValue: 1,
      },
      contentParams: {
        min: 1,
        max: 30,
        precision: 0,
        placeholder: 'Percentage fee e.g.1',
        addonAfter: `max ${30}`,
      },
      isRequired: true,
    },
    {
      type: 'switch',
      title: 'Who can collect',
      des: "Only followers can collect",
      formParams: {name: 'followerOnlyCollect', initialValue: !!uploadedImage.collectModule.followerOnlyCollect },
      contentParams: { },
      isRequired: true,
      child: {
        show: !!uploadedImage.collectModule.followerOnlyCollect,
        onChange: (res)=>{
          uploadedImage.collectModule.followerOnlyCollect = res
          setUploadedImage({...uploadedImage})
        },
      }
    },
    {
      title: '',
      des: '',
      isRequired: true,
      formParams: {},
      contentParams: { name: 'Save' },
      type: 'submit',
    },
  ];

  

  return (
    <Form
      className='create-wrapper'
      {...layout}
      name="nest-messages"
      ref={settingForm}
      onFinish={onFinish}
      validateMessages={validateMessages}
      onFieldsChange={onFieldsChange}
    >
      {collectionSetting.map((item) => renderFormItemContent(item))}      
    </Form>
  );
};

export default observer(CollectionSetting);
