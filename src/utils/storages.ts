export const Storage = {
  set(key: string, value: any) {
    if (window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  },
  get(key: string) {
    if (window.localStorage) {
      const res = window.localStorage.getItem(key);
      if (res) return JSON.parse(res);
    }
  },
  remove(key: string) {
    if (window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
};
