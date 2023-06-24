import { Storage } from '@/utils/storages';
import { makeObservable, observable } from 'mobx';

class ThemeStore {
  theme: string = Storage.get('theme') || 'light';
  constructor() {
    makeObservable(this, {
      theme: observable,
    });
  }

  changeTheme(theme: string) {
    this.theme = theme;
    Storage.set('theme', this.theme);
  }
}

const themeStore = new ThemeStore();

export default themeStore;
