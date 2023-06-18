import CheckOutline from '@components/Common/Icons/CheckOutline'
import SplitOutline from '@components/Common/Icons/SplitOutline'
import { Button } from '@components/UIElements/Button'
import Modal from '@components/UIElements/Modal'
import Tooltip from '@components/UIElements/Tooltip'
import useAppStore from '@lib/store'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import { useEnabledModuleCurrrenciesQuery } from 'lens'
import React, { useState } from 'react'
import type { CollectModuleType } from 'utils'

import ChargeQuestion from './ChargeQuestion'
import FeeCollectForm from './FeeCollectForm'
import LimitDurationQuestion from './LimitDurationQuestion'
import LimitQuestion from './LimitQuestion'
import PermissionQuestion from './PermissionQuestion'

const CollectModule = () => {
  const [showModal, setShowModal] = useState(false)
  const uploadedImage = useAppStore((state) => state.uploadedImage)
  const setUploadedImage = useAppStore((state) => state.setUploadedImage)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  const setCollectType = (data: CollectModuleType) => {
    setUploadedImage({
      collectModule: { ...uploadedImage.collectModule, ...data }
    })
  }

  const { data: enabledCurrencies } = useEnabledModuleCurrrenciesQuery({
    variables: { request: { profileIds: selectedChannel?.id } },
    skip: !selectedChannel?.id
  })

  const getSelectedCollectType = () => {
    const followerOnlyCollect = uploadedImage.collectModule.followerOnlyCollect
    const timeLimitEnabled = uploadedImage.collectModule.timeLimitEnabled
    const collectLimitEnabled = uploadedImage.collectModule.collectLimitEnabled
    const isFeeCollect = uploadedImage.collectModule.isFeeCollect
    const collectLimit = uploadedImage.collectModule.collectLimit
    const multiRecipients = uploadedImage.collectModule.multiRecipients
    if (uploadedImage.collectModule.isRevertCollect) {
      return t`No one can collect this publication`
    }
    return (
      <div className="flex items-center space-x-1">
        <span>
          {followerOnlyCollect ? t`Subscribers` : t`Anyone`}{' '}
          <Trans>can collect</Trans>{' '}
          {collectLimitEnabled ? `maximum of ${collectLimit}` : ''}{' '}
          {isFeeCollect ? t`for given fees` : t`for free`}{' '}
          {timeLimitEnabled ? t`within 24hrs` : ''}
        </span>
        {uploadedImage.collectModule.isMultiRecipientFeeCollect && (
          <Tooltip
            content={`Split revenue enabled with ${multiRecipients?.length} recipients`}
          >
            <span>
              <SplitOutline
                className="mr-2 h-5 w-5 rotate-90"
                outline={false}
              />
            </span>
          </Tooltip>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="mb-1 flex items-center space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">
          <Trans>Collect Type</Trans>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="flex w-full items-center justify-between rounded-xl border border-gray-300 px-4 py-2.5 text-left text-sm focus:outline-none dark:border-gray-700"
      >
        <span>{getSelectedCollectType()}</span>
        <CheckOutline className="h-3 w-3" />
      </button>
      <Modal
        title={t`Select collect type`}
        panelClassName="max-w-lg"
        show={showModal}
      >
        <div className="no-scrollbar mt-2 max-h-[80vh] space-y-4 overflow-y-auto p-0.5">
          <PermissionQuestion
            setCollectType={setCollectType}
            uploadedImage={uploadedImage}
          />
          {!uploadedImage.collectModule.isRevertCollect && (
            <LimitDurationQuestion
              setCollectType={setCollectType}
              uploadedImage={uploadedImage}
            />
          )}
          {!uploadedImage.collectModule.isRevertCollect && (
            <LimitQuestion
              setCollectType={setCollectType}
              uploadedImage={uploadedImage}
            />
          )}
          {!uploadedImage.collectModule.isRevertCollect && (
            <ChargeQuestion
              setCollectType={setCollectType}
              uploadedImage={uploadedImage}
            />
          )}
          {(uploadedImage.collectModule.isFeeCollect ||
            uploadedImage.collectModule.collectLimitEnabled) &&
          !uploadedImage.collectModule.isRevertCollect &&
          enabledCurrencies ? (
            <FeeCollectForm
              setCollectType={setCollectType}
              uploadedImage={uploadedImage}
              setShowModal={setShowModal}
              enabledCurrencies={enabledCurrencies}
            />
          ) : (
            <div className="flex justify-end">
              <Button type="button" onClick={() => setShowModal(false)}>
                <Trans>Set Collect Type</Trans>
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default CollectModule
