import { Dropdown, Avatar} from 'antd'
import useAuthPersistStore, { signOut } from '@/lib/store/auth'
import useChannelStore from '@/lib/store/channel'
import type { Profile } from 'lens'
import { useAllProfilesLazyQuery } from '@/lens'
import { useState } from 'react'
import useSWR from 'swr'
import type { CustomErrorWithData } from '@/utils/custom-types'
import {
  HEALTH_URL,
  IS_MAINNET,
} from '@/utils/constants'
import getProfilePicture from '@/utils/functions/getProfilePicture'
import { useAccount, useDisconnect } from 'wagmi'

import CheckOutline from './icons/CheckOutline'
import ChevronLeftOutline from './icons/ChevronLeftOutline'
import HandWaveOutline from './icons/HandWaveOutline'
import SwitchChannelOutline from './icons/SwitchChannelOutline'
import { useThemes } from './hooks'
import useOpenNotification from './hooks/useNotification'

const UserMenu = () => {
  const { theme, setTheme } = useThemes()
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false)
  const {contextHolder, openNotificationWithIcon} = useOpenNotification()

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
      openNotificationWithIcon('error', 'Error', error?.data?.message || error?.message)
    }
  })


  const onSelectChannel = (channel: Profile) => {
    setSelectedChannel(channel)
    setSelectedChannelId(channel.id)
    setShowAccountSwitcher(false)
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

  const dropContent = <div className="user-menu">
      <div className="">
        {contextHolder}
        {showAccountSwitcher ? (
          <>
            <div className="line flex-10"
              onClick={() => setShowAccountSwitcher(false)}
            >
              <ChevronLeftOutline className="width12 height12" />
              <span className="font-16 SemiRegular">Channels</span>
            </div>
            <div className="">
              {channels?.map((channel, index) => (
                <div key={channel.id}>
                  {index !== 0 && <div className='divider'></div>}
                  <div className="flex-10 line"
                    
                    onClick={() => onSelectChannel(channel)}
                  >
                    
                    <span className="flex-10">
                      <Avatar size={32} src={getProfilePicture(channel)}/>
                      <span className="font-16 SemiRegular">
                        {channel.handle}
                      </span>
                    </span>
                    {selectedChannel?.id === channel.id && (
                      <CheckOutline className="width12 height12" />
                    )}
                  </div>
                </div>
                
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex-10">
                <Avatar
                  size={32}
                  src={getProfilePicture(selectedChannel, 'AVATAR')}
                  alt={selectedChannel.handle}
                  draggable={false}
                />
                <div className="grid">
                  <span className="font-16 SemiRegular">
                    Connected as
                  </span>
                  <h6 title={selectedChannel?.handle}
                    >
                      {selectedChannel?.handle}
                    </h6>
                </div>
              </div>
            <div className="text-sm">
              {selectedChannel && (
                <>
                  <div className="flex-10 line"
                    onClick={() => onSelectSwitchChannel()}
                  >
                    <SwitchChannelOutline className="width16 height16" />
                    <span className="font-16 SemiRegular">
                      Switch channel
                    </span>
                  </div>
                </>
              )}
              <div className='divider'></div>
              <div className="flex-10 line"
                onClick={() => {
                    disconnect?.()
                    signOut()
                  }}
              >
                <HandWaveOutline className="width16 height16" />
                <span className="font-16 SemiRegular">
                  Sign out
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  return (
    <Dropdown overlayClassName='drop-menu'
      dropdownRender={(menu)=>{
      return dropContent
    }}>
      <Avatar
        size={32}
        src={getProfilePicture(selectedChannel, 'AVATAR')}
        alt={selectedChannel.handle}
        draggable={false}
      />
    </Dropdown>
  )
}

export default UserMenu
