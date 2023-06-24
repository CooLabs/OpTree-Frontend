import React from "react";
import './style.less'
import HomePic1 from '@/assets/images/home/home_2_1.jpg'
import { Button } from "antd";
import { Link } from "react-router-dom";
const Home2 = () => {
  
    

    return (
      <div className="section-2">
        <div className="container-2">
            <div className="column-1">
                <h1 className="subtitle">Collection also can be built in a decentralized way, All rights belongs to all creators,also royalty.</h1>
                <Link to="/create/collection">
                    <Button className="white-btn margin-top-40">Get start</Button>
                </Link> 
            </div>
            <div className="column-2 margin-top-20">
                <div className="flex content-center">
                    <img src={HomePic1} loading="lazy" className="image-3"/>
                </div>
                
                
            </div>
        </div>
      </div>
      
    );
  };
  
  export default Home2;