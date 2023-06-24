import { observer } from 'mobx-react';
import { HashRouter } from 'react-router-dom';
import MRouter from '@/router';
import TopNavy from '@/components/top-navy';
import { useThemes } from '@/components/hooks';
import { useEffect } from 'react';
import { message } from 'antd';
import useOpenNotification from '@/components/hooks/useNotification';


const App = () => {
  useThemes();
  useEffect(() => {
    message.config({ maxCount: 3 });
  }, []);
  return (
    
    <HashRouter >
      <TopNavy />
      <MRouter />
    </HashRouter>
  );
};
export default observer(App);
