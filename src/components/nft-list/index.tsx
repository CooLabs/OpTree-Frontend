import { useEffect, useState } from 'react';
import { Row, Col, Spin, Image } from 'antd';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import ColletionCard from '@/components/collection-card';
import collectionStore from '@/store/modules/collectionStore';
import './style.less';
import GridList from '@/components/grid-list';
import { getPageIndicator } from '@/components/page-indictor';
import NftCard from '../nft-card';
import sanitizeDStorageUrl from '@/utils/functions/sanitizeDStorageUrl';
import { DoubleRightOutlined, InfoCircleOutlined } from '@ant-design/icons';
import AddNft from './add-nft';

interface Props {
  id: string
  collectionId: string,
}

function NFTList(props: Props) {
  const {id, collectionId} = props
  const nftLoading = collectionStore.nftLoading;
  const nftList = collectionStore.nftList;
  const collectionList = collectionStore.collectionList;
  const collectionInfo = collectionList?.find((item)=>item.collectionId === collectionId)
  const pageCount = 20;
  const pageIndictor = getPageIndicator({
    pageCount,
    dataLength: nftList?.length || 0,
  });
  const curPage = pageIndictor.curPage;
  const [collapseBlurb, setCollapseBlurb] = useState(false);
  const [isBlurbOpen, setIsBlurbOpen] = useState(false);
  const [blurbElement, setBlurbElement] = useState<any>();

  useEffect(() => {
    if (blurbElement?.clientHeight > 110) {
      setCollapseBlurb(true);
    }
  }, [blurbElement]);

  const handleRefresh = ()=>{
    collectionStore.requestNFTsByCollectionId(collectionId, curPage,pageCount)
  }

  useEffect(() => {
    handleRefresh();
  }, [curPage]);

  useEffect(() => {
    if (!collectionInfo)
      collectionStore.requestCollection(0,0)
  }, [])

  const handleChange = () => {
    console.log('handleChange', handleChange);
  };

  return (
    <div className="collection-list-wrapper">
      <div className='collection-list-wrapper-header '>
        {collectionInfo && <Image className='featured'
          src={sanitizeDStorageUrl(collectionInfo?.detailJson?.image)}
          preview={false}/>}
        {collectionInfo && <div>
            <h3>{collectionInfo.detailJson.name}</h3>
            <h4>{collectionInfo.detailJson.description}</h4>
            <div className='margin-top-10'
              ref={(e) => {
                setBlurbElement(e);
              }}
              style={{
                ...(collapseBlurb && !isBlurbOpen
                  ? {
                      maxHeight: 110,
                      wordBreak: 'break-word',
                      WebkitMask: 'linear-gradient(rgb(255, 255, 255) 45%, transparent)',
                    }
                  : {}),
                overflow: 'hidden',
                fontSize: '1.2em',
              }}
              dangerouslySetInnerHTML={{ __html: collectionInfo.detailJson.content }}
            ></div>
            {collapseBlurb ? <DoubleRightOutlined rotate={isBlurbOpen ? 270 : 90} onClick={() => setIsBlurbOpen(!isBlurbOpen)} /> : ''}

          </div>}
      </div>
      <div className="margin-top-40">
        {nftLoading ? (
          <Row wrap={true} gutter={[20, 32]} justify={'center'}>
            <Col span={1}>
              <Spin />
            </Col>
          </Row>
        ) : (nftList?.length === 0 ?  <AddNft id={id} collectionId={collectionId}/> :
          <GridList className="list" itemWidth={260}>
            {nftList?.map((item, index) => {
              return (
                <Link
                  to={`/paint/${item.collectionId}/${item.tokenId}/${item.detailJson.image.replace('ipfs://','')}/${item.id}`}
                  key={index}
                >
                  <NftCard data={item} />
                </Link>
              );
            })}
          </GridList>
        )}
        {pageIndictor.content}
      </div>
    </div>
  );
}

export default observer(NFTList);
