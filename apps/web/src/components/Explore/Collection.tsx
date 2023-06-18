import { useQuery } from '@apollo/client'
import Timeline from './Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import useAppStore from '@lib/store'
import { t } from '@lingui/macro'
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { NewCollectionCreateds, getNewCollectionCreated, newCollectionCreateds } from 'src/api/collection'

const HomeFeed = () => {
  

  const [data, setData] = useState<NewCollectionCreateds[]>()
  const [loading, setLoding] = useState(false)
  useEffect(()=>{
    getNewCollectionCreated(0,0).then((res)=>setData(res))
  }, [])
  //const { data, loading, error, fetchMore } = useQuery(newCollectionCreateds)
  //const videos = data?.newCollectionCreateds as NewCollectionCreateds[]


  if (data?.length === 0) {
    return <NoDataFound isCenter withImage text={t`No collection found`} />
  }

  return (
    <div>
      {loading && <TimelineShimmer />}
      { !loading && data && (
        <>
          <Timeline collection={data} />
          {/* {pageInfo?.next && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )} */}
        </>
      )}
    </div>
  )
}

export default HomeFeed
