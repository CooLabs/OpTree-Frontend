import NftList from '@/components/nft-list';
import './style.less';
import { observer } from 'mobx-react';

function Collections(props) {
  const params = props.match.params;
  const { id, collectionId } = params;

  return <NftList id={id} collectionId={collectionId}/>
}

export default observer(Collections);
