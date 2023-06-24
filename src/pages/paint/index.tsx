/** @format */
import { observer } from 'mobx-react';
import ForkPaintNFT from '@/components/create/fork-nft';

const Paint = (props) => {
  return (
    <>
      <ForkPaintNFT {...props}/>
    </>
  );
};

export default observer(Paint);
