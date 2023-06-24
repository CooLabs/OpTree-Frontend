/** @format */

import React, { Suspense, useLayoutEffect, useRef } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { RouterPath, Routes } from '@/router/RouterConfig';
import LayoutRouter from '@/layout';
import { useScrollToTop } from '@/components/hooks';
import FullPageLoader from '@/components/common/FullPageLoader'


const MRouter = () => {
  useScrollToTop();

  return (
    <Suspense fallback={<div></div>}>
      <Switch>
        {Routes.map((item, index) => {
          return (
            <LayoutRouter
              exact
              name={item.name}
              path={item.path}
              component={item.component}
              auth={item.auth}
              key={'layout' + index}
            />
          );
        })}
        <Route path={'/*'}>
          <Redirect to={RouterPath.error}></Redirect>
        </Route>
      </Switch>
    </Suspense>
  );
};
export default MRouter;
