import type { Publication } from '@/lens'

import {
  LENSTER_WEBSITE_URL,
  OPTREE_APP_NAME,
  OPTREE_TWITTER_HANDLE,
  OPTREE_WEBSITE_URL
} from '../constants'
import getLensHandle from './getLensHandle'

const getViewUrl = (nft: Publication) => {
  return `${OPTREE_WEBSITE_URL}/watch/${nft.id}`
}

type Link = 'lenster' | 'twitter' | 'reddit' | 'linkedin'

export const getSharableLink = (link: Link, nft: Publication) => {
  if (link === 'lenster') {
    return `${LENSTER_WEBSITE_URL}/?url=${getViewUrl(nft)}&text=${
      nft.metadata?.name as string
    } by @${getLensHandle(
      nft.profile?.handle
    )}&hashtags=OpTree&preview=true`
  } else if (link === 'twitter') {
    return encodeURI(
      `https://twitter.com/intent/tweet?url=${getViewUrl(nft)}&text=${
        nft.metadata?.name as string
      } by @${getLensHandle(
        nft.profile?.handle
      )}&via=${OPTREE_TWITTER_HANDLE}`
    )
  } else if (link === 'reddit') {
    return `https://www.reddit.com/submit?url=${getViewUrl(nft)}&title=${
      nft.metadata?.name as string
    } by @${getLensHandle(nft.profile?.handle)}`
  } else if (link === 'linkedin') {
    return `https://www.linkedin.com/shareArticle/?url=${getViewUrl(
      nft
    )} by @${getLensHandle(nft.profile?.handle)}&title=${
      nft.metadata?.name as string
    }&summary=${
      nft.metadata?.description as string
    }&source=${OPTREE_APP_NAME}`
  }
  return ''
}
