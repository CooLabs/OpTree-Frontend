import type { WebBundlr } from '@bundlr-network/client'
import type {
  AaveFeeCollectModuleSettings,
  Attribute,
  FeeCollectModuleSettings,
  FreeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  MultirecipientFeeCollectModuleSettings,
  RecipientDataInput,
  RevertCollectModuleSettings,
  SimpleCollectModuleSettings,
  TimedFeeCollectModuleSettings
} from '@/lens'

export type VideoDraft = {
  preview: string
  title: string
  description: string
}

export type BundlrDataState = {
  instance: WebBundlr | null
  balance: string
  estimatedPrice: string
  deposit: string | null
  depositing: boolean
  showDeposit: boolean
}

export type FileReaderStreamType = NodeJS.ReadableStream & {
  name: string
  size: number
  type: string
  lastModified: string
}

export type CollectModuleType = {
  isRevertCollect?: boolean
  isSimpleCollect?: boolean
  isFeeCollect?: boolean
  isMultiRecipientFeeCollect?: boolean
  currency?: string
  amount?: string 
  referralFee?: number
  collectLimitEnabled?: boolean
  collectLimit?: string
  timeLimit?: number
  followerOnlyCollect?: boolean
  recipient?: string
  multiRecipients?: RecipientDataInput[]
}

export type ReferenceModuleType = {
  followerOnlyReferenceModule: boolean
  degreesOfSeparationReferenceModule?: {
    commentsRestricted: boolean
    mirrorsRestricted: boolean
    degreesOfSeparation: number
  } | null
}

export type UploadedImage = {
  stream: FileReaderStreamType | null
  preview: string
  imageType: string
  royalty: number
  file: File | null
  title: string
  description: string
  thumbnail: string
  thumbnailType: string
  percent: number
  loading: boolean
  uploadingThumbnail: boolean
  imageSource: string
  buttonText: string
  durationInSeconds: string | null
  collectModule: CollectModuleType
  referenceModule: ReferenceModuleType
}

export type IPFSUploadResult = {
  url: string
  type: string
}

export type VideoUploadForm = {
  videoThumbnail: IPFSUploadResult | null
  videoSource: string | null
  title: string
  description: string
  adultContent: boolean
}

export type ProfileMetadata = {
  version: string
  metadata_id: string
  name: string | null
  bio: string | null
  cover_picture: string | null
  attributes: Attribute[]
}

type MultiRecipientFeeCollectModuleSettings =
  MultirecipientFeeCollectModuleSettings & {
    optionalEndTimestamp?: string
    optionalCollectLimit?: string
  }


export interface CustomErrorWithData extends Error {
  data?: {
    message: string
  }
}

export interface ProfileInterest {
  category: { label: string; id: string }
  subCategories: Array<{ label: string; id: string }>
}

export type QueuedVideoType = {
  thumbnailUrl: string
  title: string
  txnId?: string
  txnHash?: string
}

export type QueuedCommentType = {
  comment: string
  pubId: string
  txnId?: string
  txnHash?: string
}

export enum CustomCommentsFilterEnum {
  RELEVANT_COMMENTS = 'RelevantComments',
  NEWEST_COMMENTS = 'NewestComments'
}

export enum CustomNotificationsFilterEnum {
  HIGH_SIGNAL = 'HighSignal',
  ALL_NOTIFICATIONS = 'AllNotifications'
}
