import React from "react";
import './style.less'
import HomePic1 from '@/assets/images/home/home_1_1.png'
import HomePic2 from '@/assets/images/home/home_1_2.png'
import HomePic3 from '@/assets/images/home/home_1_3.png'
const Home1 = () => {
  

    return (
      <div className="section-1">
        <div className="container-1">
            <div className="column-1">
                <h1 className="heading">Show</h1>
                <h1 className="heading">Creativity in</h1>
                <h1 className="heading">Collabaration</h1>
            </div>
            <div className="column-2">
                <div className="flex content-center">
                    <img src={HomePic1} loading="lazy" className="image-3"/>
                </div>
                
                <div className="flex content-center">
                    <img src={HomePic2} loading="lazy" className="image-2"/>
                    <img src={HomePic3} loading="lazy" className="image"/>
                </div>
            </div>
        </div>
      </div>
      
    );
  };
  
  export default Home1;