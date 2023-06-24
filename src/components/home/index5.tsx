import React from "react";
import './style.less'
import HomePic1 from '@/assets/images/home/home_5_1.svg'
import HomePic2 from '@/assets/images/home/home_5_2.svg'
import HomePic3 from '@/assets/images/home/home_5_3.svg'
import HomePic4 from '@/assets/images/home/home_5_4.svg'
import HomePic5 from '@/assets/images/home/home_5_5.svg'

const Home4 = () => {

    const info = [{icon:HomePic1, title: 'Virtual booths'},
      {icon:HomePic2, title: 'Access to dashboard'},
      {icon:HomePic3,title: 'Lead retrieval'},
      {icon:HomePic4, title: 'Lead scoring'}, 
      {icon:HomePic5, title: 'Sponsored sections'}]
   
    return (
      <div className="section-5 margin-top-100">
        <div className="column-1 ">
          <h2>Featured Drops</h2>
          {info.map((item, index)=>{
            return <h3 className="margin-top-20" key={index}>{item.title}</h3>
          })}
          
        </div>
        <div className="column-2">
           <div className="">
            {info.map((item, index)=>{
              return <div className={`${index !== 0 ? `margin-top-20`: ''} position-relative`}>
                <img key={index} src={item.icon} ></img>
                <h3 className="left-bottom">{item.title}</h3>
              </div>
              
            })}
           </div>
        </div>
      </div>
      
    );
  };
  
  export default Home4;