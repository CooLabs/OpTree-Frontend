import { WebBundlr } from '@bundlr-network/client'
import type { FetchSignerResult } from '@wagmi/core'
import type { BundlrDataState, UploadedImage } from '@/utils/custom-types'
import {
  BUNDLR_CURRENCY,
  BUNDLR_NODE_URL,
  POLYGON_RPC_URL,
  WMATIC_TOKEN_ADDRESS
} from '@/utils/constants'
import logger from '@/utils/logger'
import { create } from 'zustand'

export const UPLOADED_IMAGE_BUNDLR_DEFAULTS = {
  balance: '0',
  estimatedPrice: '0',
  deposit: null,
  instance: null,
  depositing: false,
  showDeposit: false
}

export const UPLOADED_IMAGE_FORM_DEFAULTS = {
  stream: null,
  preview: '',
  imageType: '',
  file: null,
  royalty: 0,
  title: '',
  description: '',
  thumbnail: '',
  thumbnailType: '',
  imageSource: '',
  percent: 0,
  isSensitiveContent: false,
  loading: false,
  uploadingThumbnail: false,
  buttonText: 'Post Image',
  durationInSeconds: null,
  collectModule: {
    type: 'revertCollectModule',
    followerOnlyCollect: false,
    amount: '',
    currency: WMATIC_TOKEN_ADDRESS,
    referralFee: 0,
    timeLimit: 1,
    isFeeCollect: false,
    isRevertCollect: true,
    isMultiRecipientFeeCollect: false,
    collectLimit: '5000',
    collectLimitEnabled: false,
    multiRecipients: []
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
    degreesOfSeparationReferenceModule: null
  }
}

interface AppState {
  uploadedImage: UploadedImage
  bundlrData: BundlrDataState
  activeTagFilter: string
  setUploadedImage: (imageProps: Partial<UploadedImage>) => void
  setActiveTagFilter: (activeTagFilter: string) => void
  setBundlrData: (bundlrProps: Partial<BundlrDataState>) => void
  getBundlrInstance: (signer: FetchSignerResult) => Promise<WebBundlr | null>
}

export const useAppStore = create<AppState>((set) => ({
  activeTagFilter: 'all',
  bundlrData: UPLOADED_IMAGE_BUNDLR_DEFAULTS,
  uploadedImage: UPLOADED_IMAGE_FORM_DEFAULTS,
  setActiveTagFilter: (activeTagFilter) => set({ activeTagFilter }),
  setBundlrData: (bundlrProps) =>
    set((state) => ({ bundlrData: { ...state.bundlrData, ...bundlrProps } })),
  setUploadedImage: (imageProps) =>
    set((state) => ({
      uploadedImage: { ...state.uploadedImage, ...imageProps }
    })),
  getBundlrInstance: async (signer) => {
    try {
      const bundlr = new WebBundlr(
        BUNDLR_NODE_URL,
        BUNDLR_CURRENCY,
        signer?.provider,
        {
          providerUrl: POLYGON_RPC_URL
        }
      )
      await bundlr.utils.getBundlerAddress(BUNDLR_CURRENCY)
      await bundlr.ready()
      return bundlr
    } catch (error) {
      logger.error('[Error Init Bundlr]', error)
      return null
    }
  }
}))

export default useAppStore
