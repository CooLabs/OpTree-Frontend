import React, { useState } from 'react';
import { Form } from 'antd';
import '../style.less';
import { useHistory } from 'react-router-dom';
import { userHooks } from '@/components/hooks';
import { observer } from 'mobx-react';
import themeStore from '@/store/modules/themeStore';
import { FormType, layout, renderFormItemContent, validateMessages } from '../var';
import ConfirmModal from '@/components/confirm-modal';
import Setting from './setting';
import useAppStore from '@/lib/store';

/* eslint-enable no-template-curly-in-string */
export type CollectionFormData = {
  title: string
  description: string
}

type Props = {
  onUpload: (data: CollectionFormData) => void
  onCancel: () => void
}
const CreateCollection = (props:Props) => {
  const theme = themeStore.theme;
  const history = useHistory();
  const uploadedImage = useAppStore((state) => state.uploadedImage)
  const setUploadedImage = useAppStore((state) => state.setUploadedImage)
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
      uploadedImage.file = file.originFileObj
      setUploadedImage({...uploadedImage})
    }
  };
  const confirmFunc = ()=>{
    setConfirmCount(confirmCount + 1)
    
  }
  const collectionSetting: Array<FormType> = [
    {
      type: 'uploadPic',
      title: 'Featured image',
      des: "This image will be used to showcase your collection on homepage. 626x372 recommended.",
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
      type: 'setting',
      title: 'Collection setting',
      des: '',
      formParams: {},
      contentParams: {func: confirmFunc},
      isRequired: true,
    },
    {
      title: '',
      des: '',
      isRequired: true,
      formParams: {},
      contentParams: { disabled: !submitEnable, name: uploadedImage.buttonText, loading: uploadedImage.loading },
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
        <h2>{'Create a Collection'}</h2>
        <div className="required-field tip">Required fields</div>
        {collectionSetting.map((item) => renderFormItemContent(item))}
        
      </Form>
      <ConfirmModal
        title={'Collection Setting'}
        onModalClose={() => {
          setConfirmCount(confirmCount + 1);
        }}
        width={600}
        hiddenCancel={true}
        hiddenConfirm={true}
        onModalConfirm={confirmFunc}
        modalVisible={confirmCount % 2 !== 0}
      >
          <Setting onConfirm={confirmFunc}/>
      </ConfirmModal>
    </div>
    
  );
};

export default observer(CreateCollection);
