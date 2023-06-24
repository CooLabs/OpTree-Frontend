import { lazy } from 'react';
import { RouteModel } from '@/models/RouteModel';

const RouterPath = {
  home: '/',
  explore: '/explore/:type?',
  stats: '/stats/:type?',
  create: '/create/:type?/:id?/:collectionId?',
  tokens: '/tokens/:tokenHash?/:propertyVersion?',
  launchpad: '/launchpad/:tab?',
  launchpadDetail: '/launchpadItem/:launchpadId?/:active?',
  error: '/error',
  profiles: '/profiles/:tab?',
  collection: '/collections/:id?/:collectionId?',
  paint: '/paint/:collectionId?/:nftId?/:picId?/:id?'
};



const Routes: RouteModel[] = [
  {
    name: 'Home',
    path: RouterPath.home,
    auth: false,
    component: lazy(() => import('@/pages/home')),
  },
  {
    name: 'Explore',
    path: RouterPath.explore,
    auth: false,
    component: lazy(() => import('@/pages/explore')),
  },
  {
    name: 'Create',
    path: RouterPath.create,
    auth: true,
    component: lazy(() => import('@/pages/create')),
  },
  {
    name: '404',
    path: RouterPath.error,
    auth: false,
    component: lazy(() => import('@/404')),
  },
  {
    name: 'paint',
    path: RouterPath.paint,
    auth: false,
    component: lazy(() => import('@/pages/paint')),
  },
  {
    name: 'collection',
    path: RouterPath.collection,
    auth: false,
    component: lazy(() => import('@/pages/collections')),
  }
];


export { RouterPath, Routes, };
