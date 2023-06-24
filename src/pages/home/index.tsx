/** @format */
import { observer } from 'mobx-react';
import Home1 from '@/components/home/index1';
import Home2 from '@/components/home/index2';
import Home3 from '@/components/home/index3';
import Home4 from '@/components/home/index4';
import Home5 from '@/components/home/index5';
import Home6 from '@/components/home/index6';

const Home = () => {

  return (
    <>
      <Home1 />
      <Home2 />
      <Home3 />
      <Home4 />
      <Home5 />
      <Home6 />
    </>
  );
};

export default observer(Home);
