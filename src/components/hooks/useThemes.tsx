/** @format */

import themeStore from '@/store/modules/themeStore';
import { useEffect, useState } from 'react';

interface PropsThemes {
  onChange: (type: boolean) => void;
}

export const useThemes = () => {
  // let media = window.matchMedia('(prefers-color-scheme: dark)');
  // const [theme, setTheme] = useState(media.matches ? 'dark' : 'light');
  // const theme = themeStore.theme;

  useEffect(() => {
    if (themeStore.theme === 'light') {
      document.documentElement.setAttribute('theme', 'light');
    } else {
      document.documentElement.setAttribute('theme', 'dark');
    }
  }, [themeStore.theme]);

  // useEffect(() => {
  //   if (media.matches) {
  //     //深色模式
  //     document.documentElement.setAttribute('theme', 'dark');
  //   } else {
  //     document.documentElement.setAttribute('theme', 'light');
  //   }
  //   let callback = (e) => {
  //     let prefersDarkMode = e.matches;
  //     setTheme(prefersDarkMode ? 'dark' : 'light');
  //     if (prefersDarkMode) {
  //       // 深色模式
  //       document.documentElement.setAttribute('theme', 'dark');
  //     } else {
  //       document.documentElement.setAttribute('theme', 'light');
  //     }
  //   };
  //   if (typeof media.addEventListener === 'function') {
  //     media.addEventListener('change', callback);
  //   }
  //   return () => {
  //     if (typeof media.removeEventListener === 'function') {
  //       media.removeEventListener('change', callback);
  //     }
  //   };
  // }, [theme]);
  return {theme: themeStore.theme, setTheme: themeStore.changeTheme};
};
