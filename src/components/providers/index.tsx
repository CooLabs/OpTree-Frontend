import { ApolloProvider } from '@apollo/client'
import apolloClient from '@/lib/apollo'
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  RainbowKitProvider
} from '@rainbow-me/rainbowkit'
import type { ThemeOptions } from '@rainbow-me/rainbowkit/dist/themes/baseTheme'
import {
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  rainbowWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import type { ReactNode } from 'react'
import React, { useEffect } from 'react'
import { IS_MAINNET, OPTREE_APP_NAME, POLYGON_RPC_URL } from '@/utils/constants'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { publicProvider } from 'wagmi/providers/public'
import * as mobxStores from '@/store/store';
import { Provider } from 'mobx-react';
import ErrorBoundary from '../ErrorBoundary'
import { useThemes } from '../hooks'

const { chains, provider } = configureChains(
  [IS_MAINNET ? polygon : polygonMumbai],
  [
    jsonRpcProvider({
      rpc: () => ({
        http: POLYGON_RPC_URL
      })
    }),
    publicProvider()
  ],
  { targetQuorum: 1 }
)

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      injectedWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ chains }),
      ledgerWallet({ chains }),
      coinbaseWallet({ appName: OPTREE_APP_NAME, chains }),
      walletConnectWallet({ chains })
    ]
  }
])

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

// Enables usage of theme in RainbowKitProvider
const RainbowKitProviderWrapper = ({ children }: { children: ReactNode }) => {
  const { theme } = useThemes()
  const themeOptions: ThemeOptions = {
    fontStack: 'system',
    overlayBlur: 'small',
    accentColor: '#6366f1'
  }
  return (
    <RainbowKitProvider
      modalSize="compact"
      chains={chains}
      theme={
        theme === 'dark' ? darkTheme(themeOptions) : lightTheme(themeOptions)
      }
    >
      {children}
    </RainbowKitProvider>
  )
}

const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
  }, [])

  return (
    <Provider {...mobxStores}>
        <ErrorBoundary>
          <WagmiConfig client={wagmiClient}>
                <RainbowKitProviderWrapper>
                  <ApolloProvider client={apolloClient}>
                    {children}
                  </ApolloProvider>
                </RainbowKitProviderWrapper>
            </WagmiConfig> 
        </ErrorBoundary>
    </Provider>
   
  )
}

export default Providers
