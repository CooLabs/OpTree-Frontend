import { Buffer } from 'buffer';
import BigNumber from 'bignumber.js';
import { useCalcTime } from '@/components/hooks';
import { ethers } from 'ethers';
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';

export const base64toBuff = (data) => {
  var arr = data.split(',');
  var buffer = Buffer.from(arr[1], 'base64');
  // new Blob(buffer)
  let array = new Uint8Array(buffer, 0, buffer.length);
  return Array.from(array);
};

export const toArray = (str: string) => {
  const buffer: Array<number> = [];
  for (let i of str) {
    const _code = i.charCodeAt(0);
    if (_code < 0x80) {
      buffer.push(_code);
    } else if (_code < 0x800) {
      buffer.push(0xc0 + (_code >> 6));
      buffer.push(0x80 + (_code & 0x3f));
    } else if (_code < 0x10000) {
      buffer.push(0xe0 + (_code >> 12));
      buffer.push(0x80 + ((_code >> 6) & 0x3f));
      buffer.push(0x80 + (_code & 0x3f));
    }
  }
  return buffer.map((number) => Number(number.toString(8)));
};

export const toUint8Arr = (str: string) => {
  const buffer: Array<number> = [];
  for (let i of str) {
    const _code = i.charCodeAt(0);
    if (_code < 0x80) {
      buffer.push(_code);
    } else if (_code < 0x800) {
      buffer.push(0xc0 + (_code >> 6));
      buffer.push(0x80 + (_code & 0x3f));
    } else if (_code < 0x10000) {
      buffer.push(0xe0 + (_code >> 12));
      buffer.push(0x80 + ((_code >> 6) & 0x3f));
      buffer.push(0x80 + (_code & 0x3f));
    }
  }
  return Uint8Array.from(buffer);
};

export const payloadStr = (payload: Record<string, any>): string => {
  let str = '';
  if (payload && Object.keys(payload).length > 0) {
    Object.keys(payload).forEach((key) => {
      str = str + `&${key}=${payload[key]}`;
    });
  }
  return str;
};

/* 防抖默认1秒 */
export function debounce<T>(fn: (data: T) => void, delay: number = 1000) {
  let timeout: NodeJS.Timeout | null = null;
  return function (data: T) {
    if (timeout !== null) clearTimeout(timeout);
    timeout = setTimeout(fn.bind({}, data), delay);
  };
}

export function handleScroll(event, callback?: Function) {
  let divEl = event.target as HTMLDivElement;
  if (divEl.scrollTop + divEl.clientHeight === divEl.scrollHeight) {
    console.log('===到底了---');
    if (callback) {
      callback();
    }
  }
}

export function hexToStr(hex, encoding = 'utf-8') {
  var trimedStr = hex.trim();
  var rawStr = trimedStr.substr(0, 2).toLowerCase() === '0x' ? trimedStr.substr(2) : trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    alert('Illegal Format ASCII Code!');
    return '';
  }
  var curCharCode: number;
  var resultStr: Array<number> = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16);
    resultStr.push(curCharCode);
  }
  // encoding为空时默认为utf-8
  var bytesView = new Uint8Array(resultStr);
  var str = new TextDecoder(encoding).decode(bytesView);
  return str;
}

const bignumberFormat = (num) => {
  return num.toFormat(1, { groupSeparator: '', decimalSeparator: '.' }).split('.')[0];
};

const bignumberToInt = (num) => {
  return Number(bignumberFormat(num));
};

export function getValueDivide8(num: number) {
  let res = new BigNumber(num || 0).dividedBy(Math.pow(10, 8));
  return res.toFixed();
}

export function getValueMultiplied8(num: number) {
  return bignumberToInt(new BigNumber(num).multipliedBy(Math.pow(10, 8)));
}

export function dealWithIpfsShowUri(uri: string | undefined) {
  if (uri?.startsWith('ipfs://')) {
    console.log('avatar ', `https://dweb.link/ipfs/${uri.slice(7)}`);
    return `https://dweb.link/ipfs/${uri.slice(7)}`;
  }
  if (uri === 'https://aptosnames.com') {
    return 'https://bafybeihkaf5s53awrqlfpcpsojk26d2glvfyow5u35eqmy7buzqg2upzl4.ipfs.dweb.link/orign.jpeg';
  }
  return uri;
}

export function getCollectionAvatarUrl(uri: string | undefined) {
  if (uri?.endsWith('/featured')) {
    return uri.replace('featured', 'logo');
  }
  return dealWithIpfsShowUri(uri);
}

export function getShowTime(text) {
  const res = useCalcTime(new Date(text).getTime());
  if (res?.days && res.days > 30) return text;
  if (res?.days) return `${res?.days} ${res.days === 1 ? 'day' : 'days'} ago`;
  if (!res?.days && res?.hours) return `${res.hours} ${res.hours === 1 ? 'hour' : 'hours'} ago`;
  if (!res?.hours && res?.minutes)
    return `${res?.minutes} ${res?.minutes === 1 ? 'minute' : 'minutes'}  ago`;
  if (!res?.minutes && res?.seconds) return 'just now';
}

export function parseCollectionId(collectionId: string) {
  const decodeCollectionId = decodeURIComponent(collectionId);
  const temp = decodeCollectionId.split('::');
  const creator = temp[0];
  const collection_name = decodeCollectionId.substring(creator.length + 2);
  return { creator, collection_name };
}

export function getMerkleTreeRoot(whitelistAddresses: Array<string>) {
  //1.叶子节点数据制作
  let leafNodes: Array<string> = [];
  for (let address of whitelistAddresses) {
    try {
      let leafNode = ethers.utils.keccak256(address);
      leafNodes.push(leafNode);
    } catch (e) {
      //console.log('address ', address, 'is invalid');
    }
  }
  //2.生成树根
  let tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  return { root: Array.from(tree.getRoot()), result: leafNodes };
}

export function testMerkleTree() {
  let whitelistAddresses = [
    '0x626f6456e3a1e0d4bbd8cfdb96dd506fe21b1ef5f35eb607e01f8fdfe8a1c14d',
    '0x7fee4bb13e2551fca3c8ead6ae5532fda5e4d777f458efbea2f12063dc0c3e2d',
    '0x4a17667c94548a635152b0a41e087329e0f9c3ae492a132a06ad24d91df0a8f0',
    '0xc2f9d818b7905fef5cab2032df40669dbfc22c6dbe5e07d7c0df237a4a498e58',
    '0xa7b7c02a55811c9494f24cf0312335e102566a4ffee5bd6946e60377470ef760',
    '0xce606a1301b66aeccb155f6c58bea9eef2234a93d493604e557a21eb81eef7bc',
    '0xc38504a6d5275e49e0210ab4b33e8e6eb1fb8e138c841cba39f313f329b4ef57',
    '0xb57d384eabbb86e3ddce9437b2c5b2fd6f5b996828239609691e7fb5ceff59b1',
    '0xb874c5e7332aa464a539f36393cadb35eac52d7a145cc77e333d8dbe27035364',
    '0xd10086e7ae5f568655b8bb51f37c0f9b68d3feb55f06488dd1542acf07e041e2',
  ];

  //1.叶子节点数据制作
  let leafNodes: any[] = [];
  for (let test in whitelistAddresses) {
    let leafNode = ethers.utils.keccak256(whitelistAddresses[test]);
    leafNodes.push(leafNode);
  }

  //2.生成树根
  let tree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
  console.log('root: ', tree.getHexRoot());

  //3.生成叶子的proof(需要检验的地址)
  console.log(tree.getHexProof(leafNodes[0]));
}

export function getWhiteListSaleName(index: number) {
  if (index === 0) return 'OG Sale';
  if (index === 1) return 'Whitelist Sale';
  return `Whitelist${index - 1} Sale`;
}
