import React from "react";
import './style.less'
import Arrow from '@/assets/images/home/home_6_1.svg'
import Twitter from '@/assets/images/home/twitter.svg'
import { Link } from "react-router-dom";
import { Input } from "antd";
import { OPTREE_TWITTER_HANDLE } from "@/utils/constants";
const Home5 = () => {

    
    return (
      <div className="section-6 margin-top-100">
          <div className="row-1">
            <h3 className="flex1">OpTree</h3>
            <div className="flex1">
              <div>
                <Link to='/'><h4>How it works</h4></Link>
              </div>
             
              <div className="margin-top-20">
                <Link to='/'><h4>Docs</h4></Link>
              </div>
            </div>
            <div className="flex1">
              <h4>Subscribe</h4>
              <div className="margin-top-20">
                <Input addonAfter={<img src={Arrow}></img>} placeholder="Get product updates" />
              </div>             
            </div>
          </div>
          <div className="margin-top-40 divider"></div>
          <div className="margin-top-40 space-between">
            <h4>© 2023 OpTree. All rights reserved</h4>
            <a href={`https://twitter.com/${OPTREE_TWITTER_HANDLE}`} target="_blank" rel="noopener noreferrer">
              <img src={Twitter}></img>
            </a>
          </div>
      </div>
      
    );
  };
  
  export default Home5;