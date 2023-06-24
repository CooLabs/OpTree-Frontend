import React from 'react';
import { observer } from 'mobx-react';
import CollectionList from '@/components/collection-list';

function Explore() {
  return <CollectionList />;
}

export default observer(Explore);
