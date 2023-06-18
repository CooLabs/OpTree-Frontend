import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React from 'react'


import { NewCollectionCreateds } from 'src/api/collection'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl'

type Props = {
  collection: NewCollectionCreateds
}

const CollectionCard: FC<Props> = ({ collection }) => {
  
  return (
    <div className="group" data-testid="video-card">
      <>
          <div className="py-2">
          <Link href={`/collection/${collection.id}`}>
            <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
              <img
                src={sanitizeDStorageUrl(collection.detailJson.image)}
                className={clsx(
                  'h-full w-full bg-gray-100 object-center dark:bg-gray-900 md:rounded-xl lg:h-full lg:w-full',
                  'object-cover'
                )}
                alt="thumbnail"
                draggable={false}
              />
                      
            </div>
          </Link>
            <div className="flex items-start space-x-2.5">
              <div className="grid flex-1">
                <div className="flex w-full min-w-0 items-start justify-between space-x-1.5 pb-1">
                  <div
                    className="ultrawide:line-clamp-1 ultrawide:break-all line-clamp-2 break-words text-sm font-semibold"
                  >
                    {collection.detailJson?.name}
                  </div>
                 </div>
              </div>
            </div>
          </div>
        </>
    </div>
  )
}

export default CollectionCard
