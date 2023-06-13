import usePersistStore from '@lib/store/persist'
import { Trans } from '@lingui/macro'
import Link from 'next/link'
import React from 'react'
import {
  Analytics,
  OPTREE_GITHUB_HANDLE,
  OPTREE_TWITTER_HANDLE,
  TRACK
} from 'utils'

const Footer = () => {
  

  return (
    <div className='h-full'>
      <div className='text-[48px] font-semibold'>Contact</div>
      <div className='text-[48px] font-semibold'>Information</div>
      <div className="w-full grid grid-cols-3 text-sm">
            <Link
              className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
              href={`https://github.com/${OPTREE_GITHUB_HANDLE}`}
              onClick={() => {
                Analytics.track(TRACK.SYSTEM.MORE_MENU.GITHUB)
              }}
              target="_blank"
            >
              Github
              <div>https://github.com/CooLabs</div>
            </Link>
            <Link
              className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
              href={`https://twitter.com/${OPTREE_TWITTER_HANDLE}`}
              onClick={() => {
                Analytics.track(TRACK.SYSTEM.MORE_MENU.TWITTER)
              }}
              target="_blank"
            >
              Twitter
              <div>@OpTreeClub</div>
            </Link>
            <Link
              className="rounded-lg px-2.5 py-1.5 opacity-80 hover:opacity-100"
              href="/email"
              onClick={() => {
                Analytics.track(TRACK.SYSTEM.MORE_MENU.DISCORD)
              }}
              target="_blank"
            >
              Email
              <div>contract@optree.xyz</div>
            </Link>
            
      </div>
    </div>
    
  )
}

export default Footer
