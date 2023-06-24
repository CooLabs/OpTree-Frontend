import React, { memo } from 'react';
import { Image, Avatar, Card } from 'antd';
import './style.less';
import { ErrorBase64 } from '@/contants';
import bg from '@/assets/images/collections/defaultColl.png';
import { NewCollectionCreateds } from '@/api/collection';
import sanitizeDStorageUrl from '@/utils/functions/sanitizeDStorageUrl';

interface PropsData {
  item: NewCollectionCreateds;
}

const ColletionCard = memo((props: PropsData) => {
  const {
    item
  } = props;

  return (
    <Card className="collection-card-wrapper" hoverable>
      <div className="pic">
        <Image
          src={sanitizeDStorageUrl(item.detailJson.image) || bg}
          fallback={ErrorBase64}
          preview={false}
        />
      </div>
      <div className="info">
        {/* <Avatar className="nft-avatar" src={getCollectionAvatarUrl(metadata_uri)} size={45} /> */}
        <div className="">
            <h4>{item.detailJson.name}</h4>
            <h5 className='limit-lines limit-lines-1'>{item.detailJson.description}</h5>
        </div>
      </div>
    </Card>
  );
});

export default ColletionCard;
