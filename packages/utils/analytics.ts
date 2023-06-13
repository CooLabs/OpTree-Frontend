import type { Dict } from 'mixpanel-browser'
import mixpanel from 'mixpanel-browser'
import { IS_MAINNET, IS_PRODUCTION } from 'utils/constants'

export const Analytics = {
  track: (eventName: string, payload?: Dict) => {
    if (IS_PRODUCTION && IS_MAINNET) {
      mixpanel.track(eventName, payload)
    }
  }
}

export const TRACK = {
  DISPATCHER: {
    TOGGLE: 'Toggle dispatcher'
  },
  PUBLICATION: {
    NEW_POST: 'New post',
    NEW_COMMENT: 'New comment',
    LIKE: 'Like publication',
    DISLIKE: 'Dislike publication',
    MIRROR: 'Mirror publication',
    PIN: 'Pin publication',
    DELETE: 'Delete publication',
    REPORT: 'Report Publication',
    TIP: {
      OPEN: 'Open Tip Modal',
      SENT: 'Tip Sent'
    },
    PERMALINK: 'Permalink publication',
    SHARE: {
      LENSTER: 'Share to Lenster',
      TWITTER: 'Share to Twitter',
      REDDIT: 'Share to Reddit',
      LINKEDIN: 'Share to LinkedIn'
    },
    COLLECT: 'Collect publication'
  },
  AUTH: {
    CONNECT_WALLET: 'Connect Wallet',
    SIGN_IN_WITH_LENS: 'Sign in with Lens',
    SIGN_OUT: 'Sign Out'
  },
  CHANNEL: {
    CLICK_CHANNEL_VIDEOS: 'Click Channel Videos',
    CLICK_CHANNEL_BYTES: 'Click Channel Bytes',
    CLICK_CHANNEL_COMMENTED: 'Click Channel Commented',
    CLICK_CHANNEL_MIRRORED: 'Click Channel Mirrored',
    CLICK_CHANNEL_NFTS: 'Click Channel NFTs',
    CLICK_OTHER_CHANNELS: 'Click Other Channels',
    CLICK_CHANNEL_STATS: 'Click Channel Stats',
    CLICK_CHANNEL_ABOUT: 'Click Channel About',
    CLICK_CHANNEL_COVER_LINKS: 'Click Channel Cover Links',
    SWITCH: 'Switch Channel',
    UPDATE: 'Update Channel',
    SUBSCRIBE: 'Subscribe Channel',
    JOIN: 'Join Channel',
    UNSUBSCRIBE: 'Unsubscribe Channel'
  },
  DEPOSIT_MATIC: 'Deposit Matic',
  CLICK_USER_MENU: 'Click User Menu',
  SEARCH: 'Search',
  SYSTEM: {
    SELECT_LOCALE: 'Select locale',
    TOGGLE_THEME: 'Toggle Theme',
    MORE_MENU: {
      OPEN: 'Open More Menu',
      GITHUB: 'Click Github',
      DISCORD: 'Click Discord',
      THANKS: 'Click Thanks',
      ROADMAP: 'Click Roadmap',
      TERMS: 'Click Terms',
      PRIVACY: 'Click Privacy',
      STATUS: 'Click Status',
      TWITTER: 'Click Twitter'
    }
  },
  PAGE_VIEW: {
    HOME: 'Home Page',
    EXPLORE: 'Explore Page',
  }
}
