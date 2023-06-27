import React, { useEffect } from "react";
import './style.less'
import collectionStore from "@/store/modules/collectionStore";
import sanitizeDStorageUrl from "@/utils/functions/sanitizeDStorageUrl";
import bg from '@/assets/images/collections/defaultColl.png';
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
const Home3 = () => {
    const collectionList = collectionStore.collectionList
    useEffect(()=>{
      if (!collectionList){
        collectionStore.requestCollection(0, 0)
      }
    },[])

    return (
      collectionList?.length ? <div className="section-3 margin-top-100">
        <h1 className="margin-top-20">Ongoing Collection</h1>
        <div className="margin-top-60 flex">
          {
            collectionList?.slice(0,4).map((item, index) => {
              return <Link
                className="flex1"
                to={`/collections/${item.id}/${item.collectionId}`}
                key={index}>
                  <div >
                    <img  
                      src={item.detailJson.image ? sanitizeDStorageUrl(item.detailJson.image): bg}>
                    </img>
                  </div>
                </Link>
              
            })
          }
        </div>
      </div>:<></>
      
    );
  };
  
  export default observer(Home3);