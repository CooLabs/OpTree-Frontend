import type { CollectModuleParams, RecipientDataInput } from '@/lens'

import type { CollectModuleType } from '../custom-types'
import { getTimeAddedFewDays } from './formatTime'

export const getCollectModule = (
  selectedCollectModule: CollectModuleType
): CollectModuleParams => {
  const {
    amount,
    currency,
    referralFee,
    collectLimit,
    followerOnlyCollect,
    recipient,
    timeLimit,
    isFeeCollect,
    isMultiRecipientFeeCollect,
    collectLimitEnabled
  } = selectedCollectModule

  if (amount && currency) {
    return {
      feeCollectModule: {
        followerOnly: selectedCollectModule.followerOnlyCollect as boolean,
        mintLimit: collectLimitEnabled&&collectLimit ? collectLimit : '5000',
        endTime: getTimeAddedFewDays(timeLimit) ,
        amount,
        currency,
        recipient
      }
    }
  }
  // Post is free to collect
  return {
    freeCollectModule: {
      followerOnly: selectedCollectModule.followerOnlyCollect as boolean,
      mintLimit: collectLimitEnabled&&collectLimit ? collectLimit : '5000',
      endTime: getTimeAddedFewDays(timeLimit)
    }
  }
}

export const getCollectModuleConfig = (collectModule: string) => {
  switch (collectModule) {
    case 'FeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication by paying fees specified.'
      }
    case 'TimedFeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication within the time limit specified.'
      }
    case 'LimitedFeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication with the collect limit specified.'
      }
    case 'LimitedTimedFeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication with the time and collect limit specified.'
      }
    case 'MultirecipientFeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication which splits collect revenue with multiple recipients.'
      }
    case 'AaveFeeCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication which deposit its revenue to AAVE v3 pool.'
      }
    case 'SimpleCollectModule':
      return {
        type: 'collectModule',
        description:
          'Allow you to collect any publication including paid collects, limited and timed free collects and more!'
      }
    case 'FeeFollowModule':
      return {
        type: 'followModule',
        description:
          'Allows you to join any channel by paying a fee specified by the channel owner.'
      }
    default:
      return {
        type: '',
        description: ''
      }
  }
}
