import Head from 'next/head'
import { useRouter } from 'next/router'
import type { FC } from 'react'
import React from 'react'
import {
  OPTREE_API_URL,
  OPTREE_APP_DESCRIPTION,
  OPTREE_APP_NAME,
  OPTREE_EMBED_URL,
  OPTREE_TWITTER_HANDLE,
  OG_IMAGE
} from 'utils'

type Props = {
  title?: string
  description?: string
  image?: string
}

const MetaTags: FC<Props> = (props) => {
  const { description, title, image } = props
  const router = useRouter()

  const meta = {
    title: title ?? OPTREE_APP_NAME,
    description: description ?? OPTREE_APP_DESCRIPTION,
    image: image ?? OG_IMAGE,
    type: 'website'
  }

  return (
    <Head>
      <title>{meta.title}</title>
      <meta name="robots" content="follow, index" />
      <meta content={meta.description} name="description" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
      />
      <link rel="canonical" href={`https://optree.xyz${router.asPath}`} />
      <meta property="og:url" content={`https://optree.xyz${router.asPath}`} />
      <meta property="og:type" content={meta.type} />
      <meta property="og:site_name" content="OpTree" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:image" content={meta.image} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:image:width" content="400" />
      <meta property="twitter:image:height" content="400" />
      <meta name="twitter:site" content="@OpTreeClub" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta property="twitter:image" content={meta.image} />
      <meta property="twitter:creator" content={OPTREE_TWITTER_HANDLE} />
      <link rel="preconnect" href="https://static.optree.xyz" />
      <link rel="dns-prefetch" href="https://static.optree.xyz" />
    </Head>
  )
}

export default MetaTags
