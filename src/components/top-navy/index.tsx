import React, { useEffect, useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import './style.less';
import { observer } from 'mobx-react';
import Logo from '@/assets/images/logo.png';
import { Drawer, Switch } from 'antd';
import { getSvgIcon } from '@/svgUtils';
import themeStore from '@/store/modules/themeStore';
import Login from '../auth/Login';
import NavMenu from '../nav-menu';

export default withRouter(
  observer((props: any) => {
    const isTestNet = true;
    const history = useHistory();
    const [scrollClass, setClass] = useState('');
    const [cartShow, setCartShow] = useState(false);
    const CartIcon = getSvgIcon('cartIcon');

    useEffect(() => {
      
    }, []);

    useEffect(() => {
      window.addEventListener('scroll', (e) => {
        if (scrollClass == '' && document.documentElement.scrollTop > 0) {
          setClass('scrollPage');
        } else if (scrollClass !== '' && document.documentElement.scrollTop === 0) {
          setClass('');
        }
      });
      return () => {
        window.removeEventListener('scroll', () => {});
      };
    }, [scrollClass]);

    const handleChange = (e) => {
      themeStore.changeTheme(themeStore.theme !== 'dark' ? 'dark' : 'light');
    };

    const changeDrawerState = () => {
      setCartShow(!cartShow);
    };
    return (
      <div className={`top-header-wrapper ${scrollClass}`}>
        <div className="header-content">
          <h1>OpTree</h1>
          <div
            className="logo"
            onClick={() => {
              history.push('/');
            }}
          >
            <div className="logo-detail flex-10">
              <img alt="" src={Logo} className="one" />
              <h4>OpTree</h4>
              {/* <img alt="" src={LogoC} className="two" /> */}
              <div className="three">
                {process.env.REACT_APP_MODE === 'production' ? 'Beta' : process.env.REACT_APP_MODE}
              </div>
            </div>
          </div>
          <div className="menu-auth">
            <div className="auth">
              <Login />
            </div>
            {/* <div className="switch-theme" onClick={handleChange}>
              {themeStore.theme === 'dark' ? getSvgIcon('sunSvg') : getSvgIcon('moonSvg')}
            </div> */}
            <div className="menu SemiBold">
              <NavMenu />
            </div> 
          </div>
        </div>
      </div>
    );
  })
);
