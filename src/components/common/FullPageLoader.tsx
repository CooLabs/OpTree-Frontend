import React from 'react'
import { LOGO_ASSETS, STATIC_ASSETS } from '@/utils/constants'
import imageCdn from '@/utils/functions/imageCdn'


const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <div className="animate-bounce">
        <img
          src={imageCdn(`${LOGO_ASSETS}`)}
          draggable={false}
          className="h-12 w-12 md:h-16 md:w-16"
          alt="optree"
        />
      </div>
    </div>
  )
}

export default FullPageLoader
