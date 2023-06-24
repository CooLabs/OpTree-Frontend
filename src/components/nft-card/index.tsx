import { ErrorBase64 } from '@/contants';
import { useHistory } from 'react-router';
import { Image, Skeleton } from 'antd';
import './index.less';
import { observer } from 'mobx-react';
import { NewNFTCreateds } from '@/api/collection';
import sanitizeDStorageUrl from '@/utils/functions/sanitizeDStorageUrl';

interface PropsData {
  data: NewNFTCreateds;
  
}

export default observer((props: PropsData) => {
  const { data,  } = props;
  const history = useHistory();

  return (
    <>
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
          <div className="details-item">
            <span className="title font-16 SemiRegular limit-lines limit-lines-1">{data.detailJson.name}</span>
          </div>
          <hr className="hr" />
        </div>
      </div>
    </>
  );
});
