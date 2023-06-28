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
import Lenster from '@/assets/images/lenster-logo.svg'
import Opensea from '@/assets/images/opensea-logo.svg'
import AddNft from './add-nft';
import useChannelStore from '@/lib/store/channel';
import { Profile } from '@/lens';
import { OPTREE_PROXY_ADDRESS, POLYGON_CHAIN_ID } from '@/utils/constants';
import { Address, useBalance } from 'wagmi';

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
  const selectedChannel = useChannelStore(
    (state) => state.selectedChannel as Profile
  )

  const { data: userBalance } = useBalance({
    address: collectionInfo?.derivedCollectionAddr as Address,
    chainId: POLYGON_CHAIN_ID,
    watch: true
  })
  

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
    <div className="nft-list-wrapper">
      <div className='nft-list-wrapper-header '>
        {collectionInfo && <Image className='featured'
          src={sanitizeDStorageUrl(collectionInfo?.detailJson?.image)}
          preview={false}/>}
        {collectionInfo && <div className='flex1'>
            <div className='width100 space-between'>
              <h3>{collectionInfo.detailJson.name}</h3>
              <h4>{`Balance: ${userBalance?.formatted} ${userBalance?.symbol}`}</h4>
            </div>
            
            <h4 className='margin-top-10'>{collectionInfo.detailJson.description}</h4>
            {/* <div className='margin-top-10'
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
            {collapseBlurb ? <DoubleRightOutlined rotate={isBlurbOpen ? 270 : 90} onClick={() => setIsBlurbOpen(!isBlurbOpen)} /> : ''} */}
            <div className='flex-20 margin-top-10'>
              <a href={`https://testnet.lenster.xyz/posts/0x${parseInt(collectionInfo.profileId).toString(16)}-0x${(Array(2).join('0') + parseInt(collectionInfo.pubId).toString(16)).slice(-2)}`} target='_blank'>
                <img className='lenster' src={Lenster}></img>
              </a>
              <a href={`https://testnets.opensea.io/assets/mumbai/${collectionInfo.derivedCollectionAddr}`} target='_blank'>
                <img className='lenster' src={Opensea}></img>
              </a>
            </div>
            
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
                  <NftCard key={index} data={item} />
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
