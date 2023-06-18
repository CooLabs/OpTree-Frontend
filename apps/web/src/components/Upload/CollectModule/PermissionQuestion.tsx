import CheckOutline from '@components/Common/Icons/CheckOutline'
import { Trans } from '@lingui/macro'
import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'
import type { CollectModuleType, UploadedImage } from 'utils'

type Props = {
  uploadedImage: UploadedImage
  setCollectType: (data: CollectModuleType) => void
}

const PermissionQuestion: FC<Props> = ({ uploadedImage, setCollectType }) => {
  return (
    <div className="space-y-2">
      <h6>
        <Trans>Who can collect this video?</Trans>
      </h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isSimpleCollect: true,
              isRevertCollect: false,
              followerOnlyCollect: false
            })
          }
          className={clsx(
            'flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none dark:border-gray-700',
            {
              '!border-indigo-500':
                !uploadedImage.collectModule.followerOnlyCollect &&
                !uploadedImage.collectModule.isRevertCollect
            }
          )}
        >
          <span>
            <Trans>Anyone</Trans>
          </span>
          {!uploadedImage.collectModule.followerOnlyCollect &&
            !uploadedImage.collectModule.isRevertCollect && (
              <CheckOutline className="h-3 w-3" />
            )}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isSimpleCollect: true,
              followerOnlyCollect: true,
              isRevertCollect: false
            })
          }
          className={clsx(
            'flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-1 text-sm focus:outline-none dark:border-gray-700',
            {
              '!border-indigo-500':
                uploadedImage.collectModule.followerOnlyCollect &&
                !uploadedImage.collectModule.isRevertCollect
            }
          )}
        >
          <span>
            <Trans>Subscribers</Trans>
          </span>
          {uploadedImage.collectModule.followerOnlyCollect &&
            !uploadedImage.collectModule.isRevertCollect && (
              <CheckOutline className="h-3 w-3" />
            )}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isSimpleCollect: false,
              isRevertCollect: true
            })
          }
          className={clsx(
            'flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-1 text-sm focus:outline-none dark:border-gray-700',
            {
              '!border-indigo-500': uploadedImage.collectModule.isRevertCollect
            }
          )}
        >
          <span>
            <Trans>None</Trans>
          </span>
          {uploadedImage.collectModule.isRevertCollect && (
            <CheckOutline className="h-3 w-3" />
          )}
        </button>
      </div>
    </div>
  )
}

export default PermissionQuestion
