import React, { useEffect } from "react";
import './style.less'
import collectionStore from "@/store/modules/collectionStore";
import sanitizeDStorageUrl from "@/utils/functions/sanitizeDStorageUrl";
import bg from '@/assets/images/collections/defaultColl.png';
import { observer } from "mobx-react";
const Home3 = () => {
    const collectionList = collectionStore.collectionList
    useEffect(()=>{
      if (!collectionList){
        collectionStore.requestCollection(0, 0)
      }
    },[])

    return (
      <div className="section-3 margin-top-100">
        <h1 className="margin-top-20">Ongoing Collection</h1>
        <div className="margin-top-40 flex">
          {
            collectionList?.map((item, index) => {
              return <div className="flex1" key={index}>
                <img  
                  src={item.detailJson.image ? sanitizeDStorageUrl(item.detailJson.image): bg}>
                </img>
              </div>
              
            })
          }
        </div>
      </div>
      
    );
  };
  
  export default observer(Home3);