import CollectionCard from '@components/Common/CollectionCard'
import type { FC } from 'react'
import React from 'react'
import { NewCollectionCreateds } from 'src/api/collection'

type Props = {
  collection: NewCollectionCreateds[]
  videoType?: 'Post' | 'Mirror' | 'Comment'
}

const Timeline: FC<Props> = ({ collection, videoType = 'Post' }) => {
  return (
    <div
      className="ultrawide:grid-cols-6 laptop:grid-cols-4 grid-col-1 grid gap-x-4 gap-y-2 md:grid-cols-2 md:gap-y-8 2xl:grid-cols-5"
      data-testid="curated-videos"
    >
      {collection?.map((coll: NewCollectionCreateds, i) => {
        return  <CollectionCard key={`${coll?.id}_${i}`} collection={coll} />       
      })}
    </div>
  )
}

export default Timeline
