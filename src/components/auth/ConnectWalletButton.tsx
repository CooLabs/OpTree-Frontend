import { Button, Tooltip } from 'antd'
import useAuthPersistStore from '@/lib/store/auth'
import useChannelStore from '@/lib/store/channel'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import type { CustomErrorWithData } from '@/utils/custom-types'
import { POLYGON_CHAIN_ID } from '@/utils/constants'
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'

import UserMenu from '../UserMenu'
import { getSvgIcon } from '@/svgUtils'
import useOpenNotification from '../hooks/useNotification'

type Props = {
  handleSign: () => void
  signing?: boolean
}

const ConnectWalletButton = ({ handleSign, signing }: Props) => {
  const selectedChannelId = useAuthPersistStore(
    (state) => state.selectedChannelId
  )
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const LogoutIcon = getSvgIcon('logoutIcon');
  const {contextHolder, openNotificationWithIcon} = useOpenNotification()
  
  const { connector, isConnected } = useAccount()
  const { switchNetwork } = useSwitchNetwork({
    onError(error: CustomErrorWithData) {
      openNotificationWithIcon('error', 'Error', error?.data?.message ?? error?.message)
    }
  })
  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      openNotificationWithIcon('error', 'Error', error?.data?.message ?? error?.message)
    }
  })
  const { chain } = useNetwork()

  const { openConnectModal } = useConnectModal()

  return <>
    {contextHolder}
    {connector?.id && isConnected ? (
      chain?.id === POLYGON_CHAIN_ID ? (
        selectedChannelId && selectedChannel ? (
          <UserMenu />
        ) : (
          <div className="flex-10">
            <Button
              className='confirm-btn padding10'
              loading={signing}
              onClick={() => handleSign()}
              disabled={signing}
            >
              Sign In  with Lens
            </Button>
            <Tooltip title="Disconnect Wallet">
              <div className="svg-icon" onClick={() => disconnect?.()}>
                {LogoutIcon}
              </div>
            </Tooltip>
          </div>
        )
      ) : (
        <Button
          className='confirm-btn padding10'
          onClick={() => switchNetwork && switchNetwork(POLYGON_CHAIN_ID)}
        >
            Switch network
        </Button>
      )
    ) : (
      <Button
        className='confirm-btn padding10'
        onClick={() => {
          openConnectModal?.()
        }}
      >
        Connect Wallet
      </Button>
    )}
  </>
  
}

export default ConnectWalletButton
