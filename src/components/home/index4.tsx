import React from "react";
import './style.less'
import HomePic1 from '@/assets/images/home/home_4_1.svg'
import HomePic2 from '@/assets/images/home/home_4_2.png'
import HomePic3 from '@/assets/images/home/home_4_3.png'
import HomePic4 from '@/assets/images/home/home_4_4.png'
import HomePic5 from '@/assets/images/home/home_4_5.svg'
import HomePic6 from '@/assets/images/home/home_4_6.png'

const Home4 = () => {

    const data2 = [{icon: HomePic4, title: 'Ownership', des: 'Each participant are author of the collection.Have the rights of collection.'},
    {icon: HomePic5, title: 'Auto intergrate opensea', des: 'All collections will be luanched on opensea automaticlly. And all royalty send to the collection contract, All authors can withdraw fees from contracts according to their contributes'},
    {icon: HomePic6, title: 'Simple creation tool', des: 'Simple online creation tool, and intergrate many AIGC tools(Midjourney/Chatgpt/...)'}]

    const data1 = [{icon: HomePic1, title: 'Permissionless', des: 'Anyone can initiate a new collection.'},
    {icon: HomePic2, title: 'Various Configuration', des: 'Lens Follows/Anyone/Change Fee/Free/Limit Amount/End Timestamp/...'},
    {icon: HomePic3, title: 'Intergrate Lens Protocol', des: 'Intergrate lens protocol,All works be recorded though lens protocol.'}]

    return (
      <div className="section-4 margin-top-100">
        <h1 className="margin-top-20">Features for everyone need</h1>
        <div className="margin-top-40">
           <div className="align-start">
            {
              data1.map((item, index)=>{
                return <div key={`1-`+index} className="flex-column-center flex1">
                  <img src={item.icon}></img>
                  <h4>{item.title}</h4>
                  <h5>{item.des}</h5>
                </div>
              })
            }
           </div>
           <div className="align-start margin-top-40">
            {
              data2.map((item, index)=>{
                return <div key={`2-`+index} className="flex-column-center flex1">
                  <img src={item.icon}></img>
                  <h4>{item.title}</h4>
                  <h5>{item.des}</h5>
                </div>
              })
            }
           </div>
        </div>
      </div>
      
    );
  };
  
  export default Home4;