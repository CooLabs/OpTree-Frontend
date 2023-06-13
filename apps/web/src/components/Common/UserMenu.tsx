import DropMenu, { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import useAuthPersistStore, { signOut } from '@lib/store/auth'
import useChannelStore from '@lib/store/channel'
import { t, Trans } from '@lingui/macro'
import clsx from 'clsx'
import type { Profile } from 'lens'
import { useAllProfilesLazyQuery } from 'lens'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import useSWR from 'swr'
import type { CustomErrorWithData } from 'utils'
import {
  ADMIN_IDS,
  Analytics,
  HEALTH_URL,
  IS_MAINNET,
  OPTREE_STATUS_PAGE,
  TRACK
} from 'utils'
import getProfilePicture from 'utils/functions/getProfilePicture'
import { useAccount, useDisconnect } from 'wagmi'

import ChannelOutline from './Icons/ChannelOutline'
import CheckOutline from './Icons/CheckOutline'
import ChevronLeftOutline from './Icons/ChevronLeftOutline'
import CogOutline from './Icons/CogOutline'
import GraphOutline from './Icons/GraphOutline'
import HandWaveOutline from './Icons/HandWaveOutline'
import MoonOutline from './Icons/MoonOutline'
import PlusOutline from './Icons/PlusOutline'
import SunOutline from './Icons/SunOutline'
import SwitchChannelOutline from './Icons/SwitchChannelOutline'

const UserMenu = () => {
  const { theme, setTheme } = useTheme()
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)

  const setChannels = useChannelStore((state) => state.setChannels)
  const setShowCreateChannel = useChannelStore(
    (state) => state.setShowCreateChannel
  )
  const channels = useChannelStore((state) => state.channels)
  const setSelectedChannel = useChannelStore(
    (state) => state.setSelectedChannel
  )
  const selectedChannel = useChannelStore(
    (state) => state.selectedChannel as Profile
  )
  const setSelectedChannelId = useAuthPersistStore(
    (state) => state.setSelectedChannelId
  )

  const { data: statusData } = useSWR(
    IS_MAINNET ? HEALTH_URL : null,
    (url: string) => fetch(url).then((res) => res.json()),
    { revalidateOnFocus: true }
  )

  const [getChannels] = useAllProfilesLazyQuery()
  const { address } = useAccount()
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message || error?.message)
    }
  })

  const isAdmin = ADMIN_IDS.includes(selectedChannel?.id)

  const onSelectChannel = (channel: Profile) => {
    setSelectedChannel(channel)
    setSelectedChannelId(channel.id)
    setShowAccountSwitcher(false)
    Analytics.track(TRACK.CHANNEL.SWITCH)
  }

  const onSelectSwitchChannel = async () => {
    try {
      setShowAccountSwitcher(true)
      const { data } = await getChannels({
        variables: {
          request: { ownedBy: [address] }
        },
        fetchPolicy: 'no-cache'
      })
      const allChannels = data?.profiles?.items as Profile[]
      setChannels(allChannels)
    } catch {}
  }

  return (
    <DropMenu
      trigger={
        <button
          onClick={() => Analytics.track(TRACK.CLICK_USER_MENU)}
          className="btn-primary flex-none ring-gray-200 hover:ring-4 dark:ring-gray-800"
        >
          <img
            className="dark:bg-theme h-8 w-8 rounded-full bg-white object-cover md:h-9 md:w-9"
            src={getProfilePicture(selectedChannel)}
            alt={selectedChannel.handle}
            draggable={false}
          />
        </button>
      }
    >
      <div className="mt-2 w-56 overflow-hidden rounded-xl border bg-gray-100 shadow dark:border-gray-800 dark:bg-black">
        <div className="dark:bg-theme m-1.5 overflow-hidden rounded-xl bg-white">
            <>             
              <div className="text-sm">
                <button
                  type="button"
                  className="flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    const selected = theme === 'dark' ? 'light' : 'dark'
                    setTheme(selected)
                    Analytics.track(TRACK.SYSTEM.TOGGLE_THEME, {
                      selected_theme: selected
                    })
                  }}
                >
                  {theme === 'dark' ? (
                    <SunOutline className="h-4 w-4" />
                  ) : (
                    <MoonOutline className="h-4 w-4" />
                  )}
                  <span className="truncate whitespace-nowrap">
                    {theme === 'light' ? t`Switch to Dark` : t`Switch to Light`}
                  </span>
                </button>
                <button
                  type="button"
                  className="flex w-full items-center space-x-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    disconnect?.()
                    signOut()
                    Analytics.track(TRACK.AUTH.SIGN_OUT)
                  }}
                >
                  <HandWaveOutline className="h-4 w-4" />
                  <span className="truncate whitespace-nowrap">
                    <Trans>Sign out</Trans>
                  </span>
                </button>
              </div>
            </>
        </div>
        {IS_MAINNET && (
          <Link
            className="m-0.5 flex items-center space-x-2 px-5 pb-3 pt-2"
            href={OPTREE_STATUS_PAGE}
            target="_blank"
            onClick={() => Analytics.track(TRACK.SYSTEM.MORE_MENU.STATUS)}
          >
            <span
              className={clsx(
                'h-2 w-2 rounded-full',
                statusData?.ok ? 'bg-green-500' : 'bg-red-500'
              )}
            />
            <span className="text-xs">
              {statusData?.ok
                ? t`All services are online`
                : t`Some services are offline`}
            </span>
          </Link>
        )}
      </div>
    </DropMenu>
  )
}

export default UserMenu
