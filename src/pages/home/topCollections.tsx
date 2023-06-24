import { ErrorBase64 } from '@/contants';
import { Radio, RadioChangeEvent, Image } from 'antd';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import title from '@/assets/images/collections/title.webp';
import { getCollectionAvatarUrl, getValueDivide8 } from '@/utils/utils';
const { Button, Group } = Radio;

const tabsList = [
  { label: '24h', key: '24h' },
  { label: '7d', key: '7d' },
  { label: '30d', key: '30d' },
];

interface propsData {
  collectionData: any[];
}
export default (props: propsData) => {
  const [radio, setRadio] = useState('24h');
  const { collectionData = [] } = props;
  const history = useHistory();
  return (
    <>
      {/* <Group
        defaultValue="24h"
        className="collection-timer"
        value={radio}
        onChange={(e: RadioChangeEvent) => {
          setRadio(e.target.value);
        }}
      >
        {tabsList.map((tabItem) => {
          return (
            <Button value={tabItem.key} key={tabItem.key} className="name">
              {tabItem.label}
            </Button>
          );
        })}
      </Group> */}
      <div className="list SemiMedium ">
        {collectionData.map((item, index) => {
          let uri = getCollectionAvatarUrl(item.metadata_uri);
          return (
            <Link
              key={index}
              className="item-card"
              to={`/collections/tokens/${encodeURIComponent(
                item.creator_address + '::' + item.collection_name
              )}`}
            >
              <span className="SemiBold font-16 font-index">{index + 1}</span>
              <Image
                className="colltion-avator"
                src={uri || title}
                fallback={ErrorBase64}
                preview={false}
              />
              <div className="right">
                <h5 className="limit-lines limit-lines-1">{item.collection_name}</h5>
                {/* <div className="font-14 price">+134%</div> */}

                <div className="right-item floor-Price">
                  <div>
                    {' '}
                    {`Floor price: ${
                      item?.floor_price && item?.floor_price !== '0'
                        ? getValueDivide8(item?.floor_price)
                        : '--'
                    } `}
                    APT
                  </div>
                  <div>
                    {item?.total_volume ? `${getValueDivide8(item?.total_volume)} APT` : ''}{' '}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {collectionData.length > 14 && (
        <p
          className="seeAll"
          onClick={() => {
            history.push('/stats/ranking');
          }}
        >
          See All Collection {'>'}
        </p>
      )}
    </>
  );
};
