import MetaTags from '@components/Common/MetaTags'
import { t } from '@lingui/macro'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'

import Collection from './Collection'

const Home: NextPage = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.EXPLORE })
  }, [])
  return (
    <>
      <MetaTags title={t`Explore`} />
      <Collection />
    </>
  )
}

export default Home
