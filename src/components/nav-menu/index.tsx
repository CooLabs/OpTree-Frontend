import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './style.less';

const MenuConfig = [
  {
    title: 'Explore',
    key: '/explore/',
    path: '/explore/collectibles',
    icon: '',
  },
  {
    title: 'Create',
    key: '/create',
    path: '/create',
    icon: '',
  }
];
export default () => {
  const location = useLocation();
  const pathName = location.pathname;
  const onMenuItemClick = (e, key) => {
    // if (key === '/create') {
    //   e.stopPropagation();
    //   Dialog.createAndShowDialog(<CreateAll />, 0);
    // }
  };
  const myIcon = (icon) => React.createElement('img', { src: icon });

  return (
    <div className="menu-nav">
      {MenuConfig.map((item) => {
        return (
          <NavLink
            activeClassName="selected-link"
            className="nav-link"
            to={item.path}
            key={item.key}
            isActive={() => {
              if (pathName.startsWith(item.key)) return true;
              return false;
            }}
          >
            <>
              {myIcon(item.icon)}
              <span style={{ marginLeft: 4 }}>{item.title}</span>
            </>
          </NavLink>
        );
      })}
    </div>
  );
};
