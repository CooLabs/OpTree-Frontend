import { NewCollectionCreateds, NewNFTCreateds, getNewCollectionCreated, getNewNFTCreateds } from '@/api/collection';
import { makeObservable, observable, runInAction } from 'mobx';

class CollectionStore {
  loading: boolean = false;
  nftLoading: boolean = false;
  collectionList: Array<NewCollectionCreateds> | null = null;
  nftList: Array<NewNFTCreateds> | null = null;

  constructor() {
    makeObservable(this, {
      loading: observable,
      collectionList: observable,
      nftList: observable
    });
  }

  async requestCollection(
    offset: number,
    size: number,
    callback?: Function
  ) {
    this.loading = true;
    getNewCollectionCreated(size, offset).then((res)=>{
      runInAction(() => {
        this.collectionList = res;
        this.loading = false
      });
    })
  }

  async requestNFTsByCollectionId(
    collectionId: string,
    offset: number,
    size: number,
    callback?: Function
  ) {
    this.nftLoading = true;
    getNewNFTCreateds(collectionId, size, offset).then((res)=>{
      runInAction(() => {
        this.nftList = res;
        this.nftLoading = false
      });
    })
  }

}

const collectionStore = new CollectionStore();

export default collectionStore;
