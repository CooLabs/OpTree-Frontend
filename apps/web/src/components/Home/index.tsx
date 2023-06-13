import MetaTags from '@components/Common/MetaTags'
import { t } from '@lingui/macro'
import type { NextPage } from 'next'
import React, { useEffect } from 'react'
import { Analytics, TRACK } from 'utils'

const Home: NextPage = () => {
  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.HOME })
  }, [])
  return (
    <>
      <MetaTags title={t`Home`} />
      <h1>home</h1>
    </>
  )
}

export default Home
