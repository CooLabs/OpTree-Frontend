import { showInfoMessage, showSuccessMessage } from '@/utils/notifyMessage';
import { useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import './style.less';

interface propsData {
  pageCount?: number;
  dataLength: number;
}

export const getPageIndicator = (props: propsData) => {
  const history = useHistory();
  const { pageCount = 20, dataLength } = props;
  const location = useLocation();
  const pathname = location.pathname;
  const searchLocation = location.search;
  const searchParam = useMemo(() => {
    const searchParam = new URLSearchParams(searchLocation);
    return searchParam;
  }, [searchLocation]);

  const curPage = Math.max((searchParam.get('page') ? Number(searchParam.get('page')) : 1) - 1, 0);

  const changePage = (value: number) => {
    if (value > 0 && dataLength < pageCount) {
      showInfoMessage('No more');
      return;
    }
    let page = curPage + value + 1;
    if (page <= 0) {
      return;
    }
    searchParam.set('page', page + '');
    history.push({ pathname, search: searchParam.toString() }); //`${path}?page=${page + 1}`
  };

  const content =
    curPage !== 0 || dataLength >= pageCount ? (
      <div className="page-change-layout margin-top-20">
        <div
          className="icon-change icon-change-pre"
          onClick={() => {
            changePage(-1);
          }}
        />
        <div className="cur-page font-14">{curPage + 1}</div>
        <div
          className="icon-change icon-change-next"
          onClick={() => {
            changePage(1);
          }}
        />
      </div>
    ) : (
      <></>
    );

  return { content, curPage };
};
