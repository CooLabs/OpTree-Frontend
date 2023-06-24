import { useEffect } from 'react';
import { Row, Col, Spin } from 'antd';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import ColletionCard from '@/components/collection-card';
import collectionStore from '@/store/modules/collectionStore';
import './style.less';
import GridList from '@/components/grid-list';
import { getPageIndicator } from '@/components/page-indictor';

function CollectionList() {
  const loading = collectionStore.loading;
  const collectionList = collectionStore.collectionList;
  const pageCount = 20;
  const pageIndictor = getPageIndicator({
    pageCount,
    dataLength: collectionList?.length || 0,
  });
  const curPage = pageIndictor.curPage;

  const handleRefresh = ()=>{
    collectionStore.requestCollection(curPage,pageCount)
  }

  useEffect(() => {
    handleRefresh();
  }, [curPage]);

  const handleChange = () => {
    console.log('handleChange', handleChange);
  };

  return (
    <div className="collection-list-wrapper">
      <div className="margin-top-20">
        {loading ? (
          <Row wrap={true} gutter={[20, 32]} justify={loading ? 'center' : 'start'}>
            <Col span={1}>
              <Spin />
            </Col>
          </Row>
        ) : (
          <GridList className="list" itemWidth={335}>
            {collectionList?.map((item, index) => {
              return (
                <Link
                  to={`/collections/${item.id}/${item.collectionId}`}
                  key={index}
                >
                  <ColletionCard item={item} />
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

export default observer(CollectionList);
