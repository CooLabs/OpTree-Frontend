import { LENSHUB_PROXY_ABI, OPTREE_PROXY_ABI } from '@/abis/LensHubProxy'
import useChannelStore from '@/lib/store/channel'
import { ethers } from 'ethers'
import {
  MetadataAttributeInput,
  PublicationMetadataMediaInput,
  PublicationMetadataV2Input} from '@/lens'
import {PublicationMainFocus} from '@/lens'
import { useEffect, useRef, useState } from 'react'
import {CustomErrorWithData} from '@/utils/custom-types'
import { COLLECT_MODULE, LENS_HUB_ADDRESS, OPTREE_APP_ID, ZERO_ADDRESS } from '@/utils/constants'
import {
  ERROR_MESSAGE,
  OPTREE_PROXY_ADDRESS,
  OPTREE_WEBSITE_URL,
} from '@/utils/constants'
import getUserLocale from '@/utils/functions/getUserLocale'
import trimify from '@/utils/functions/trimify'
import {storeBlob, storeCar} from '@/utils/functions/uploadToStorage'
import { v4 as uuidv4 } from 'uuid'
import {useContractWrite} from 'wagmi'
import CreatNFT, { NFTFormData } from './detail'
import { useHistory } from 'react-router'
import useOpenNotification from '@/components/hooks/useNotification'

const CreateNewNFT = (props) => {
  const params = props.match.params;
  const history = useHistory()
  const { collectionId, id } = params;
  var abiCoder = new ethers.utils.AbiCoder() 
  const [buttonState, setButtonState] = useState({text: 'Post Image', loading: false})
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const {contextHolder, openNotificationWithIcon} = useOpenNotification()
 
  const redirectToCollection = () => {
    //router.push('/explore')
    history.push(`/collections/${id}/${collectionId}`)
  }

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    if (txn?.txnId) {
    }
    console.error('setToQueue txn', txn)
    redirectToCollection()
  }


  useEffect(() => {
  }, [])

  const onError = (error: CustomErrorWithData) => {
    openNotificationWithIcon('error', 'Error', error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setButtonState({
      text: `Post Image`,
      loading: false
    })
  }


  const { write: writePostContract } = useContractWrite({
    address: OPTREE_PROXY_ADDRESS,
    abi: OPTREE_PROXY_ABI,
    functionName: 'commitNewNFTIntoCollection',
    mode: 'recklesslyUnprepared',
    onSuccess: (data) => {
      console.log('onSuccess data', data)
      setButtonState({
        text: 'Post Image',
        loading: false
      })
      if (data.hash) {
        setToQueue({ txnHash: data.hash })
      }
    },
    onError,
    onMutate: (data) => {
      console.log('onMutate data', data)
    },
    onSettled: (data) =>{
      console.log('onSettled data', data)
    }
  })

  const { write: setDispatcher } = useContractWrite({
    address: LENS_HUB_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setDispatcher',
    mode: 'recklesslyUnprepared',
    onSuccess: (data) => {
      console.log('onSuccess data', data) 
    },
    onError: (error: CustomErrorWithData)=>{
      openNotificationWithIcon('error', 'Error', error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    }
  })
 
  const createPublication = async ({
    imageSource, data
  }: {
    imageSource: string,
    data: NFTFormData
  }) => {
    try {
      //setDispatcher?.({ recklesslySetUnpreparedArgs: [selectedChannel?.id, OPTREE_PROXY_ADDRESS] })
      setButtonState({
        text: `Storing metadata`,
        loading: true
      })
      const media: Array<PublicationMetadataMediaInput> = [
        {
          item: imageSource,
          type: 'image/png',
          cover: imageSource
        }
      ]
      const attributes: MetadataAttributeInput[] = []
      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: uuidv4(),
        description: trimify(data.description),
        content: trimify(
          `**I'm particpating a fantasitic collection on OpTree.**\n**This is my work.**\n${OPTREE_WEBSITE_URL}/collections/${id}/${collectionId}`
        ),
        locale: getUserLocale(),
        mainContentFocus: PublicationMainFocus.Image,
        external_url: `${OPTREE_WEBSITE_URL}/${trimify(data.title)}`,
        image: imageSource,
        name: trimify(data.title),
        attributes,
        media,
        appId: OPTREE_APP_ID
      }
      console.log('metadata',metadata)
      let metadataUri = await await storeBlob(JSON.stringify(metadata))
      metadataUri = 'ipfs://' + metadataUri
      console.log('metadataUri', metadataUri)
      setButtonState({
        text: `Posting image`,
        loading: true
      })
      //let mintInfo = await getNewCollectionMintInfo(id)          
      const args = {
        collectionId,
        profileId: selectedChannel?.id,
        nftInfoURI: metadataUri,
        derivedFrom: "0",
        derivedModuleData: abiCoder.encode(['bool'], [false]),
        proof: [],
        referenceModuleData: abiCoder.encode(['bool'], [false]),
        collectModule: COLLECT_MODULE,
        collectModuleInitData: abiCoder.encode(['bool'], [true]),
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: [],
      }
      console.log('writePostContract args', args)
      setDispatcher?.({ recklesslySetUnpreparedArgs: [selectedChannel?.id, OPTREE_PROXY_ADDRESS] })
      return  writePostContract?.({ recklesslySetUnpreparedArgs: [args] })
    } catch (e){
      console.error('e',e) 
      setButtonState({
        text: `Post image`,
        loading: false
      })
    }
  }

  const uploadImageToIpfs = async ( data: NFTFormData) => {
    setButtonState({
      text: `Uploading to IPFS`,
      loading: true
    })
    if (data.featured){
      setButtonState({
        text: `Uploading to IPFS`,
        loading: true
      })
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        if (reader.result){
          const result = await storeCar(new Blob([reader.result]))
          const url = 'ipfs://' + result
          return await createPublication({
            imageSource: url,
            data
          })
        }
        
      });
      reader.readAsArrayBuffer(data.featured);
    }
  }
  
  const onUpload = async (data: NFTFormData) => {
    await uploadImageToIpfs( data)
  }

  return (
    <>
     {contextHolder}
     <CreatNFT onUpload={onUpload} buttonState={buttonState}/>
    </>
  )
}

export default CreateNewNFT
