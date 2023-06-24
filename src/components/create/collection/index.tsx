import { LENSHUB_PROXY_ABI, OPTREE_PROXY_ABI } from '@/abis/LensHubProxy'
import useAppStore, { UPLOADED_IMAGE_FORM_DEFAULTS } from '@/lib/store'
import useChannelStore from '@/lib/store/channel'
import { ethers } from 'ethers'
import {
  MetadataAttributeInput,
  PublicationMetadataMediaInput,
  PublicationMetadataV2Input} from '@/lens'
import {
  PublicationMainFocus,
  ReferenceModules} from '@/lens'
import { useEffect } from 'react'
import {CustomErrorWithData} from '@/utils/custom-types'
import { COLLECT_MODULE, FEE_DERIVIED_MODULE_ADDRESS, FREE_DERIVIED_MODULE_ADDRESS, LENS_HUB_ADDRESS, OPTREE_APP_ID, ZERO_ADDRESS } from '@/utils/constants'
import {
  ERROR_MESSAGE,
  OPTREE_PROXY_ADDRESS,
  LENSTER_APP_ID,
  OPTREE_WEBSITE_URL,
} from '@/utils/constants'
import getUserLocale from '@/utils/functions/getUserLocale'
import trimify from '@/utils/functions/trimify'
import {storeBlob, storeCar} from '@/utils/functions/uploadToStorage'
import { v4 as uuidv4 } from 'uuid'
import {
  useContractWrite} from 'wagmi'

import Details, { CollectionFormData } from './detail'
import { getTimeAddedFewDays, getTimeAddedOneDayTime } from '@/utils/functions/formatTime'
import { useHistory } from 'react-router'
import useOpenNotification from '@/components/hooks/useNotification'

const UploadSteps = () => {
  const history = useHistory()
  var abiCoder = new ethers.utils.AbiCoder() 
  const getBundlrInstance = useAppStore((state) => state.getBundlrInstance)
  const setBundlrData = useAppStore((state) => state.setBundlrData)
  const bundlrData = useAppStore((state) => state.bundlrData)
  const uploadedImage = useAppStore((state) => state.uploadedImage)
  const setUploadedImage = useAppStore((state) => state.setUploadedImage)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  const degreesOfSeparation = uploadedImage.referenceModule
    ?.degreesOfSeparationReferenceModule?.degreesOfSeparation as number
  const enabledReferenceModule = uploadedImage.referenceModule
    ?.degreesOfSeparationReferenceModule
    ? ReferenceModules.DegreesOfSeparationReferenceModule
    : uploadedImage.referenceModule.followerOnlyReferenceModule
    ? ReferenceModules.FollowerOnlyReferenceModule
    : null

  // Dispatcher
  const canUseRelay = selectedChannel?.dispatcher?.canUseRelay
  const isSponsored = selectedChannel?.dispatcher?.sponsor
  const {contextHolder, openNotificationWithIcon} = useOpenNotification()

  const redirectToExplore = () => {
    history.push('/explore')
  }

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    if (txn?.txnId) {
    }
    console.error('setToQueue txn', txn)
    redirectToExplore()
  }

  const resetToDefaults = () => {
    setUploadedImage(UPLOADED_IMAGE_FORM_DEFAULTS)
  }

  useEffect(() => {
  }, [])

  const onError = (error: CustomErrorWithData) => {
    openNotificationWithIcon('error', 'Error', error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setUploadedImage({
      buttonText: `Post Image`,
      loading: false
    })
  }


  const { write: writePostContract } = useContractWrite({
    address: OPTREE_PROXY_ADDRESS,
    abi: OPTREE_PROXY_ABI,
    functionName: 'createNewCollection',
    mode: 'recklesslyUnprepared',
    onSuccess: (data) => {
      console.log('onSuccess data', data)
      setUploadedImage({
        buttonText: 'Post Image',
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
    imageSource
  }: {
    imageSource: string
  }) => {
    try {
      //setDispatcher?.({ recklesslySetUnpreparedArgs: [selectedChannel?.id, OPTREE_PROXY_ADDRESS] })
      setUploadedImage({
        buttonText: `Storing metadata`,
        loading: true
      })
      uploadedImage.imageSource = imageSource
      const media: Array<PublicationMetadataMediaInput> = [
        {
          item: uploadedImage.imageSource,
          type: uploadedImage.imageType,
          cover: uploadedImage.imageSource
        }
      ]
      const attributes: MetadataAttributeInput[] = []
      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: uuidv4(),
        description: trimify(uploadedImage.description),
        content: trimify(
          `I'm create a fantasitic collection on OpTree(A decentralized co-create platform).\nShow your creativity in collaboration.\nLet's jump in...\n${OPTREE_WEBSITE_URL}/${trimify(uploadedImage.title)}`
        ),
        locale: getUserLocale(),
        mainContentFocus: PublicationMainFocus.Image,
        external_url: `${OPTREE_WEBSITE_URL}/${trimify(uploadedImage.title)}`,
        image: uploadedImage.imageSource,
        name: trimify(uploadedImage.title),
        attributes,
        media,
        appId: OPTREE_APP_ID
      }
      console.log('metadata',metadata)
      let metadataUri = await await storeBlob(JSON.stringify(metadata))
      metadataUri = 'ipfs://' + metadataUri
      console.log('metadataUri', metadataUri)
      setUploadedImage({
        buttonText: `Posting image`,
        loading: true
      })
      
      let isFee = uploadedImage.collectModule.amount && parseFloat(uploadedImage.collectModule.amount) > 0
      let derivedRuleModule = isFee ? FEE_DERIVIED_MODULE_ADDRESS: FREE_DERIVIED_MODULE_ADDRESS
      let derivedRuleModuleInitData = isFee ? abiCoder.encode(['uint256','uint256','uint256','address' ,'address' ,'bool'],[
        uploadedImage.collectModule.collectLimit, 
        getTimeAddedFewDays(uploadedImage.collectModule.timeLimit) , 
        uploadedImage.collectModule.amount,
        uploadedImage.collectModule.currency, 
        uploadedImage.collectModule.recipient,
        uploadedImage.collectModule.followerOnlyCollect]) : abiCoder.encode(['uint256','uint256','bool'],[
          uploadedImage.collectModule.collectLimit, 
          getTimeAddedFewDays(uploadedImage.collectModule.timeLimit) ,
          uploadedImage.collectModule.followerOnlyCollect])     
      // collInfoURI: metadataUri,
      //   royalty: uploadedImage.royalty,
      //   collName: uploadedImage.title,
      //   collSymbol: uploadedImage.title,
      //   derivedRuleModule,
      //   derivedRuleModuleInitData,              
      const args = {
        profileId: selectedChannel?.id,
        // contentURI: metadataUri,
        collInfoURI: metadataUri,
        royalty: uploadedImage.royalty,
        collName: uploadedImage.title,
        collSymbol: uploadedImage.title,
        derivedRuleModule,
        derivedRuleModuleInitData,
        collectModule: COLLECT_MODULE,
        collectModuleInitData: abiCoder.encode(['bool'], [true]),
        referenceModule: ZERO_ADDRESS,
        referenceModuleInitData: []
      }
      console.log('writePostContract args', args)
      setDispatcher?.({ recklesslySetUnpreparedArgs: [selectedChannel?.id, OPTREE_PROXY_ADDRESS] })
      return  writePostContract?.({ recklesslySetUnpreparedArgs: [args] })
    } catch (e){
      console.error('e',e) 
      setUploadedImage({
        buttonText: `Post image`,
        loading: false
      })
    }
  }

  const uploadImageToIpfs = async () => {
    if (uploadedImage.file){
      setUploadedImage({
        buttonText: `Uploading to IPFS`,
        loading: true
      })
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        if (reader.result){
          const result = await storeCar(new Blob([reader.result]))
          const url = 'ipfs://' + result
          setUploadedImage({
            percent: 100,
            imageSource: url
          })
          return await createPublication({
            imageSource: url
          })
        }
        
      });
      reader.readAsArrayBuffer(uploadedImage.file);
    }
  }

  
  const onUpload = async (data: CollectionFormData) => {
    uploadedImage.title = data.title
    uploadedImage.description = data.description
    setUploadedImage({ ...uploadedImage })
    // Upload video directly from source without uploading again
    if (
      uploadedImage.imageSource.length &&
      (uploadedImage.imageSource.includes('ar://') ||
        uploadedImage.imageSource.includes('ipfs://'))
    ) {
      return await createPublication({
        imageSource: uploadedImage.imageSource
      })
    }
    await uploadImageToIpfs()
  }

  return (
    <div >
      {contextHolder}
      <Details onCancel={()=>{}} onUpload={onUpload} />
    </div>
  )
}

export default UploadSteps
