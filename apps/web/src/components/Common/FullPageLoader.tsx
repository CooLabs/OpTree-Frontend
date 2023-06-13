import React from 'react'
import { LOGO_ASSETS, STATIC_ASSETS } from 'utils'
import imageCdn from 'utils/functions/imageCdn'

import MetaTags from './MetaTags'

const FullPageLoader = () => {
  return (
    <div className="grid h-screen place-items-center">
      <MetaTags />
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
