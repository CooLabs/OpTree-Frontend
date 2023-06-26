import { ApolloClient, InMemoryCache, gql } from '@apollo/client'
import sanitizeDStorageUrl from '@/utils/functions/sanitizeDStorageUrl';
import { getReq } from './server/abstract';
import { InputMaybe, Scalars } from '@/lens';

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

export type NewNFTCreateds = {
  id: string
  nftInfoURI: string
  collectionId: string
  derivedFrom: string
  tokenId: string
  profileId: string
  detailJson: DetailJson
}

export type CollectionIdQueryRequest = {
  /** The collection id */
  collectionId: InputMaybe<Scalars['ID']['input']>
}

/* define a GraphQL query  */
export const newCollectionCreatedsDoc = gql`
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



export const newNFTCreatedsDoc = gql`
  query getNewNFTCreateds ($collectionId: String!){
    newNFTCreateds(where: {collectionId: $collectionId}) {
      id
      nftInfoURI
      collectionId
      derivedFrom
      profileId
      tokenId
    }    
  }
`

export const newCollectionMintInfosDoc = gql`
  query newCollectionMintInfos ($id: String!){
    newCollectionMintInfos(id: $id) {
      id
      mintExpired
      mintLimit
      mintPrice
    }    
  }
`

export const getNewCollectionCreated = async (size:number, offset:number)=>{
  let response: {data: {newCollectionCreateds: NewCollectionCreateds[]}} = await client.query({query: newCollectionCreatedsDoc})
  console.log('getNewCollectionCreated response',response)
  let collections = await Promise.all(response.data.newCollectionCreateds.map(async (collection: NewCollectionCreateds) => {
    if(parseInt(collection.collectionId) < 4) return
    let url = sanitizeDStorageUrl(collection.collInfoURI);
    let json: any = await getReq(url)
    return {...collection, detailJson: json}
  }))
  console.log('collections',collections, collections.filter((item)=>!!item))
  return collections.filter((item)=>!!item)
}

export const getNewNFTCreateds = async( collectionId: string, size:number, offset:number)=>{
  let response: {data: {newNFTCreateds: NewNFTCreateds[]}} = await client.query({
      query: newNFTCreatedsDoc, 
      variables: { collectionId }
    })
  console.log('getNewNFTCreateds response',response, collectionId)
  let collections = await Promise.all(response.data.newNFTCreateds.map(async (collection: NewNFTCreateds) => {
    let url = sanitizeDStorageUrl(collection.nftInfoURI);
    let json: any = await getReq(url)
    return {...collection, detailJson: json}
  }))
  return collections
}

export const getNewCollectionMintInfo = async( id: string)=>{
  let response: {data: {newCollectionMintInfos: {}}} = await client.query({
      query: newCollectionMintInfosDoc, 
      variables: { id }
    })
  console.log('getNewCollectionMintInfo response',response) 
  return response
}