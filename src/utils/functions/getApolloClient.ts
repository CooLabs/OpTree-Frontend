import { ApolloClient, InMemoryCache } from '@apollo/client'
import { LENS_API_URL } from '@/utils/constants'

const getApolloClient = () => {
  return new ApolloClient({
    uri: LENS_API_URL,
    cache: new InMemoryCache()
  })
}

export default getApolloClient
