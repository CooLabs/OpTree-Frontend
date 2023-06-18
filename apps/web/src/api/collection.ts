import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import sanitizeDStorageUrl from 'utils/functions/sanitizeDStorageUrl';
import { getReq } from './server/abstract';

const API_URL = 'https://api.studio.thegraph.com/query/45480/optree-subgraph-testnet/v0.0.1';

/* create the API client */
export const client = new ApolloClient({
  uri: API_URL,
  cache: new InMemoryCache()
})

export type DetailJson = {
    description: string
    content: string
    external_link: string
    image: string
    name: string,
    attributes: []
}

export type NewCollectionCreateds = {
  id: string
  collInfoURI: string
  collectionId: string
  collectionOwner: string
  derivedRuleModule: string
  derivedCollectionAddr: string
  detailJson: DetailJson
}

/* define a GraphQL query  */
export const newCollectionCreateds = gql`
  query newCollectionCreateds {
    newCollectionCreateds {
      id
      collInfoURI
      collectionId
      collectionOwner
      derivedRuleModule
      derivedCollectionAddr
    }    
  }
`
export const getNewCollectionCreated = async (size:number, offset:number)=>{
  let response: {data: {newCollectionCreateds: NewCollectionCreateds[]}} = await client.query({query: newCollectionCreateds})
  let collections = await Promise.all(response.data.newCollectionCreateds.map(async (collection: NewCollectionCreateds) => {
    let url = sanitizeDStorageUrl(collection.collInfoURI);
    let json: any = await getReq(url)
    return {...collection, detailJson: json}
  }))
  return collections
}
