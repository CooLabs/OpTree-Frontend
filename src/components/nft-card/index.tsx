import { ErrorBase64 } from '@/contants';
import { useHistory } from 'react-router';
import { Button, Dropdown, Image, MenuProps, Skeleton } from 'antd';
import './index.less';
import { observer } from 'mobx-react';
import { NewNFTCreateds } from '@/api/collection';
import sanitizeDStorageUrl from '@/utils/functions/sanitizeDStorageUrl';
import { EllipsisOutlined } from "@ant-design/icons";
import { useContractWrite } from 'wagmi';
import { ERROR_MESSAGE, OPTREE_PROXY_ADDRESS } from '@/utils/constants';
import { OPTREE_PROXY_ABI } from '@/abis/LensHubProxy';
import useOpenNotification from '../hooks/useNotification';
import { CustomErrorWithData } from '@/utils/custom-types';
interface PropsData {
  data: NewNFTCreateds;
}

export default observer((props: PropsData) => {
  const { data,  } = props;
  const history = useHistory();
  const {contextHolder, openNotificationWithIcon} = useOpenNotification()

  const { write: writePostContract } = useContractWrite({
    address: OPTREE_PROXY_ADDRESS,
    abi: OPTREE_PROXY_ABI,
    functionName: 'limitBurnTokenByCollectionOwner',
    mode: 'recklesslyUnprepared',
    onSuccess: (data) => {
      console.log('onSuccess data', data)
    },
    onError: (error: CustomErrorWithData) => {
      console.log('onError data', error)
      openNotificationWithIcon('error','Error',error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    },
    onMutate: (data) => {
      console.log('onMutate data', data)
    },
    onSettled: (data) =>{
      console.log('onSettled data', data)
    }
  })

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch(key){
      case '1':
        history.push(`/paint/${data.collectionId}/${data.tokenId}/${data.detailJson.image.replace('ipfs://','')}/${data.id}`)
        break;
      case '2':
        const args = {
          collectionId: data.collectionId,
          tokenId: data.tokenId,
        }
        console.log('writePostContract args', args)
        writePostContract?.({ recklesslySetUnpreparedArgs: [args] })
        break;
    }
  };
  
  const items: MenuProps['items'] = [
    {
      label: 'Fork',
      key: '1',
    },
    {
      label: 'Burn',
      key: '2',
    }
  ];
  
 

  return (
    <>
      {contextHolder}
      <div className={`item-container item-container-normal`}>
        <div className="nft-image">
          <Image
            src={sanitizeDStorageUrl(data.detailJson.image)}
            placeholder={<Skeleton.Image />}
            preview={false}
            fallback={ErrorBase64}
          />        
        </div>

        <div className="item-container-details margin-top-15">
          <div className="details-item space-between">
            <span className="title font-16 SemiRegular limit-lines limit-lines-1">{data.detailJson.name}</span>
            <Dropdown menu={{ items, onClick }}>
                <EllipsisOutlined />
            </Dropdown>
            
          </div>
          
        </div>
      </div>
    </>
  );
});
