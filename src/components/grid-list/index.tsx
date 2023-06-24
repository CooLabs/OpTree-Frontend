import { debounce, handleScroll } from '@/utils/utils';
import { Empty } from 'antd';
import React, { memo, useState, useEffect, useRef, ReactElement } from 'react';
import EmptyDarkImage from '@/assets/images/theme/dark/empty.svg';
import EmptyLightImage from '@/assets/images/theme/light/empty.svg';
import './index.less';
import themeStore from '@/store/modules/themeStore';
import { observer } from 'mobx-react';

interface propsData {
  children: any;
  className?: string;
  itemWidth?: number;
  gap?: number;
  showCol?: number;
  onChange?: (type: string, value?: string | number) => void;
}

function GridList(props: propsData) {
  const { children, onChange, className, gap = 20, showCol, itemWidth = 258 } = props;
  const listRef = useRef<HTMLDivElement>(null);
  const [showItemWidth, setShowItemWidth] = useState(itemWidth);
  const [precent, setPrecent] = useState<number>(25);
  const [windowWidth, setWindowSize] = useState(0);
  const theme = themeStore.theme;
  const onWindowResize = () => {
    setWindowSize(window.innerWidth);
  };

  const updateItemWidthPercent = () => {
    if (listRef && listRef.current) {
      const { width } = listRef.current.getBoundingClientRect();
      let listWidth = width;
      let col = showCol ? showCol : Math.floor(listWidth / itemWidth);
      if (col * itemWidth + col * gap - gap > listWidth) col = Math.max(col - 1, 2);
      let showItemWidth = Math.floor((listWidth - (col - 1) * gap) / col) - 1;
      const utilNum = showItemWidth / listWidth;
      setShowItemWidth(showItemWidth);
      setPrecent(utilNum * 100);
    }
  };

  useEffect(() => {
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  useEffect(() => {
    updateItemWidthPercent();
  }, [windowWidth, showCol, listRef, itemWidth]);

  return (
    <div
      ref={listRef}
      onScroll={() => {
        console.log('onscrol');
      }}
      className={`card-list ${className}`}
      style={{
        gridTemplateColumns: `repeat(auto-fill, ${!children?.length ? '100%' : precent + '%'})`,
        columnGap: `${gap}px`,
        rowGap: `${gap}px`,
      }}
    >
      {children?.length ? (
        children
      ) : (
        <Empty
          image={<img alt="" src={theme === 'dark' ? EmptyDarkImage : EmptyLightImage} />}
          imageStyle={{
            marginTop: '50px',
            height: 100,
          }}
          description=""
        />
      )}
    </div>
  );
}

export default observer(GridList);
