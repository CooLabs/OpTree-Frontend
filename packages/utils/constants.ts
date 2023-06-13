export const OPTREE_APP_NAME = 'OpTree'
export const OPTREE_APP_DESCRIPTION =
  'Show your Creativity in Collaboration'

export const LENS_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'sandbox'
export const IS_MAINNET = LENS_ENV === 'mainnet'
export const IS_STAGING = LENS_ENV === 'staging'
export const IS_SANDBOX = LENS_ENV === 'sandbox'

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION = !IS_DEVELOPMENT

export const LOGO_ASSETS = 'https://ik.imagekit.io/lens/media-snapshot/tr:w-100,h-100/012d476257426acb9c58837246cdba25c42488618cc8b3cdd10bcb3a6e7d569e.png'
export const STATIC_ASSETS = 'https://static.optree.xyz'
export const OPTREE_WEBSITE_URL = IS_MAINNET
  ? 'https://optree.xyz'
  : 'https://testnet.optree.xyz'
export const FALLBACK_COVER_URL = `${STATIC_ASSETS}/images/fallbackThumbnail.png`
export const OG_IMAGE = `${STATIC_ASSETS}/images/seo/og.png`
export const SCROLL_ROOT_MARGIN = '60% 0px'
export const LENS_IMAGEKIT_SNAPSHOT_URL =
  'https://ik.imagekit.io/lens/media-snapshot'

export const IMAGE_TRANSFORMATIONS = {
  AVATAR: 'tr:w-60,h-60',
  AVATAR_LG: 'tr:w-300,h-300',
  THUMBNAIL: 'tr:w-720,h-404',
  THUMBNAIL_V: 'tr:w-404,h-720',
  SQUARE: 'tr:w-200,h-200'
}

// lens
export const MAINNET_API_URL = 'https://api.lens.dev'
export const TESTNET_API_URL = 'https://api-mumbai.lens.dev'
export const STAGING_API_URL =
  'https://staging-api-social-mumbai.lens.crtlkey.com'
export const LENS_API_URL = IS_MAINNET
  ? MAINNET_API_URL
  : IS_STAGING
  ? STAGING_API_URL
  : TESTNET_API_URL

// API urls
export const OPTREE_MAINNET_API_URL = 'https://api.optree.xyz'
export const OPTREE_TESTNET_API_URL = 'https://api-testnet.optree.xyz'
export const OPTREE_EMBED_URL = IS_MAINNET
  ? 'https://embed.optree.xyz'
  : 'https://embed-testnet.optree.xyz'

export const OPTREE_API_URL = IS_MAINNET
  ? OPTREE_MAINNET_API_URL
  : OPTREE_TESTNET_API_URL

// contracts
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// polygon
export const POLYGON_RPC_URL = IS_MAINNET
  ? 'https://rpc.ankr.com/polygon'
  : 'https://rpc.ankr.com/polygon_mumbai'
export const POLYGONSCAN_URL = IS_MAINNET
  ? 'https://polygonscan.com'
  : 'https://mumbai.polygonscan.com'
export const POLYGON_CHAIN_ID = IS_MAINNET ? 137 : 80001

// ipfs
export const IPFS_FREE_UPLOAD_LIMIT = IS_MAINNET ? 5000 : 100 // in MB
export const IPFS_GATEWAY_URL = 'https://gateway.ipfscdn.io/ipfs'
export const EVER_ENDPOINT = 'https://endpoint.4everland.co'
export const EVER_REGION = 'us-west-2'

// livepeer
export const LIVEPEER_STUDIO_API_KEY = 'b13fd43e-d0d6-4abc-a5df-93592a0c5124'

// workers
export const BUNDLR_METADATA_UPLOAD_URL = 'https://metadata.optree.xyz'
export const OPTREE_TAIL_INGEST_URL = 'https://tail.optree.xyz'
export const STS_TOKEN_URL = 'https://sts.optree.xyz'
export const HEALTH_URL = 'https://health.optree.xyz'

// bundlr
export const BUNDLR_NODE_URL = IS_MAINNET
  ? 'https://node1.bundlr.network'
  : 'https://devnet.bundlr.network'
export const BUNDLR_CURRENCY = 'matic'
export const BUNDLR_WEBSITE_URL = 'https://bundlr.network'
export const ARWEAVE_GATEWAY_URL = 'https://arweave.net'
export const BUNDLR_CONNECT_MESSAGE = 'Estimating video upload cost...'
export const REQUESTING_SIGNATURE_MESSAGE = 'Requesting signature...'

// error messages
export const ERROR_MESSAGE = 'Oops, something went wrong!'

// App Ids
export const OPTREE_APP_ID = 'optree'
export const ALLOWED_APP_IDS = ['orb', 'lenster', 'buttrfly']

// official
export const OPTREE_TWITTER_HANDLE = 'OpTreeClub'
export const OPTREE_GITHUB_HANDLE = 'CooLabs'
export const OPTREE_STATUS_PAGE = ''
export const TALLY_VERIFICATION_FORM_URL = ''
export const OPTREE_ROADMAP_URL = ''

// admin
export const ADMIN_IDS = IS_MAINNET ? ['0x2d'] : ['0x2f']
export const MOD_IDS = IS_MAINNET ? [...ADMIN_IDS, '0x24'] : ['0x2f']
export const OPTREE_DONATION_ADDRESS = ''

// lens
export const LENS_CUSTOM_FILTERS = []

// i18n
export const SUPPORTED_LOCALES: Record<string, string> = {
  en: 'English'
}
export const DEFAULT_LOCALE = 'en'

// other apps
export const LENSTER_WEBSITE_URL = IS_MAINNET
  ? 'https://lenster.xyz'
  : 'https://testnet.lenster.xyz'
export const OPENSEA_MARKETPLACE_URL = IS_MAINNET
  ? 'https://opensea.io'
  : 'https://testnets.opensea.io'
export const RARIBLE_MARKETPLACE_URL = IS_MAINNET
  ? 'https://rarible.com'
  : 'https://testnet.rarible.com'

// analytics
export const MIXPANEL_API_HOST = '/collect'
export const MIXPANEL_TOKEN = ''
export const MUX_DATA_KEY = ''

// vercel
export const GIT_DEPLOYED_COMMIT_SHA =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA
export const GIT_DEPLOYED_BRANCH = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF
export const VERCEL_DEPLOYED_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV
