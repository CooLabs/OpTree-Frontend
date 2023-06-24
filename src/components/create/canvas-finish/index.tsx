import { useState } from 'react';
import { Button } from 'antd';
import '../style.less';
import { observer } from 'mobx-react';
import ConfirmModal from '@/components/confirm-modal';
import NftForkForm from './nftForkForm';

/* eslint-enable no-template-curly-in-string */
export type ForkNFTFormData = {
  title: string
  description: string
}

type Props = {
  onUpload: (data: ForkNFTFormData) => void,
  buttonState: {text: string, loading: boolean}
}
const CanvasFinish = (props:Props) => {
  
  const [confirmCount, setConfirmCount] = useState(0)
  const changeFormShow = ()=>setConfirmCount(confirmCount + 1)

  const confirmFunc = (data)=>{
    changeFormShow()
    props.onUpload(data)
  }
  
  return (
    <div className='canvas-right-header flex-5'>
      <Button className='create-btn' 
        onClick={changeFormShow}
        loading={props.buttonState.loading}>
        {props.buttonState.text}
      </Button>
      <ConfirmModal
        title={'NFT Info'}
        onModalClose={changeFormShow}
        width={600}
        hiddenCancel={true}
        hiddenConfirm={true}
        onModalConfirm={confirmFunc}
        modalVisible={confirmCount % 2 !== 0}
      >
        <NftForkForm onUpload={confirmFunc}/>
      </ConfirmModal>
    </div>
    
  );
};

export default observer(CanvasFinish);
