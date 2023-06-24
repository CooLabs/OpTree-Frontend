import { Avatar, Button } from 'antd'
import React from 'react'
import { LOGO_ASSETS } from '@/utils/constants'
import imageCdn from '@/utils/functions/imageCdn'
export default function Custom500() {
  return (
    <>
      <title>500 - Server Error</title>
      <div className="margin-top-40 flex-column">
        <Avatar
          src={imageCdn(LOGO_ASSETS)}
          alt="OpTree"
          draggable={false}
          size={100}
        />
        <h1 className='margin-top-40'>
          Looks like something went wrong!
        </h1>
        <h4 className='margin-top-20'>
          We track these errors automatically, but if the problem persists
          feel free to contact us. In the meantime, try refreshing.
        </h4>
        <a className='margin-top-20' href="/"> 
          <Button className='confirm-btn margin-top-20'>Go Home</Button>
        </a> 
      </div>
    </>
  )
}
