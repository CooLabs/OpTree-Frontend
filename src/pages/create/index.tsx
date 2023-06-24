import React, { memo } from 'react';
import CreateCollection from '@/components/create/collection'
import CreateNFT from '@/components/create/nft'

function Create(props) {
  const params = props.match.params;
  const { type } = params;
  const getCreateContent = () => {
     if (type === 'collection') {
      return <CreateCollection  />;
    } else if (type === 'nft') {
      return <CreateNFT  {...props}/>;
    } else {
      return <CreateCollection  />;
    }
  };
  return getCreateContent();
}

export default memo(Create);
