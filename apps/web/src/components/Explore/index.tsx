import MetaTags from '@components/Common/MetaTags'
import { t } from '@lingui/macro'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'

const Explore = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.EXPLORE })
  }, [])

  return (
    <>
      <MetaTags title={t`Explore`} />
      <h1>explore</h1>
    </>
  )
}

export default Explore
