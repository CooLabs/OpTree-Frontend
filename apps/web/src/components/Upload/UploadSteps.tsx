import { LENSHUB_PROXY_ABI, OPTREE_PROXY_ABI } from '@abis/LensHubProxy'
import MetaTags from '@components/Common/MetaTags'
import useAppStore, { UPLOADED_IMAGE_FORM_DEFAULTS } from '@lib/store'
import useChannelStore from '@lib/store/channel'
import { t } from '@lingui/macro'
import { ethers } from 'ethers'
import {
  CreatePostBroadcastItemResult,
  MetadataAttributeInput,
  PublicationMetadataMediaInput,
  PublicationMetadataV2Input} from 'lens'
import {
  PublicationMainFocus,
  ReferenceModules,
  useBroadcastMutation} from 'lens'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import { COLLECT_MODULE, CustomErrorWithData, FEE_DERIVIED_MODULE_ADDRESS, FREE_DERIVIED_MODULE_ADDRESS, LENS_HUB_ADDRESS, ZERO_ADDRESS } from 'utils'
import {
  Analytics,
  BUNDLR_CONNECT_MESSAGE,
  ERROR_MESSAGE,
  OPTREE_PROXY_ADDRESS,
  LENSTER_APP_ID,
  OPTREE_WEBSITE_URL,
  REQUESTING_SIGNATURE_MESSAGE,
  TRACK
} from 'utils'
import { getCollectModule } from 'utils/functions/getCollectModule'
import getUserLocale from 'utils/functions/getUserLocale'
import omitKey from 'utils/functions/omitKey'
import trimify from 'utils/functions/trimify'
import {storeBlob, storeCar} from 'utils/functions/uploadToStorage'
import { v4 as uuidv4 } from 'uuid'
import {
  useAccount,
  useContractWrite,
  useSigner,
  useSignTypedData
} from 'wagmi'

import type { NFTFormData } from './Details'
import Details from './Details'
import { getTimeAddedOneDay, getTimeAddedOneDayTime } from 'utils/functions/formatTime'

const UploadSteps = () => {
  var abiCoder = new ethers.utils.AbiCoder() 
  const getBundlrInstance = useAppStore((state) => state.getBundlrInstance)
  const setBundlrData = useAppStore((state) => state.setBundlrData)
  const bundlrData = useAppStore((state) => state.bundlrData)
  const uploadedImage = useAppStore((state) => state.uploadedImage)
  const setUploadedImage = useAppStore((state) => state.setUploadedImage)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const router = useRouter()

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

  const redirectToHomePage = () => {
    //router.push('/explore')
  }

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    if (txn?.txnId) {
    }
    console.error('setToQueue txn', txn)
    redirectToHomePage()
  }

  const resetToDefaults = () => {
    setUploadedImage(UPLOADED_IMAGE_FORM_DEFAULTS)
  }

  useEffect(() => {
    Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.UPLOAD.STEPS })
  }, [])

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE)
    setUploadedImage({
      buttonText: t`Post Image`,
      loading: false
    })
  }

  const onCompleted = (__typename?: 'RelayError' | 'RelayerResult') => {
    if (__typename === 'RelayError') {
      return
    }
    Analytics.track(TRACK.PUBLICATION.NEW_POST, {
      image_format: uploadedImage.imageType,
      publication_state: uploadedImage.collectModule.isRevertCollect
        ? 'DATA_ONLY'
        : 'ON_CHAIN',
      image_storage:'IPFS' ,
      publication_collect_module: Object.keys(
        getCollectModule(uploadedImage.collectModule)
      )[0],
      publication_reference_module: enabledReferenceModule,
      publication_reference_module_degrees_of_separation: uploadedImage
        .referenceModule.degreesOfSeparationReferenceModule
        ? degreesOfSeparation
        : null,
      user_id: selectedChannel?.id
    })
    return setUploadedImage({
      buttonText: t`Post Image`,
      loading: false
    })
  }

  const {write: setDispatcher} = useContractWrite({
    address: LENS_HUB_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setDispatcher',
    mode: 'recklesslyUnprepared',
    onSuccess: (data) => {
      console.log('onSuccess data', data)
    },
    onError,
    onMutate: (data) => {
      console.log('onMutate data', data)
    },
    onSettled: (data) =>{
      console.log('onSettled data', data)
    }
  })

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

 
  const createPublication = async ({
    imageSource
  }: {
    imageSource: string
  }) => {
    try {
      //setDispatcher?.({ recklesslySetUnpreparedArgs: [selectedChannel?.id, OPTREE_PROXY_ADDRESS] })
      setUploadedImage({
        buttonText: t`Storing metadata`,
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
        image: uploadedImage.thumbnail,
        name: trimify(uploadedImage.title),
        attributes,
        media,
        appId: LENSTER_APP_ID
      }
      console.log('metadata',metadata)
      let metadataUri = await await storeBlob(JSON.stringify(metadata))
      metadataUri = 'ipfs://' + metadataUri
      console.log('metadataUri', metadataUri)
      setUploadedImage({
        buttonText: t`Posting image`,
        loading: true
      })
      
      console.log('getTimeAddedOneDayTime()', getTimeAddedOneDayTime())
      let isFee = uploadedImage.collectModule.amount && parseFloat(uploadedImage.collectModule.amount) > 0
      let derivedRuleModule = isFee ? FEE_DERIVIED_MODULE_ADDRESS: FREE_DERIVIED_MODULE_ADDRESS
      let derivedRuleModuleInitData = isFee ? abiCoder.encode(['uint256','uint256','uint256','address' ,'address' ,'bool'],[
        uploadedImage.collectModule.collectLimit, 
        uploadedImage.collectModule.timeLimitEnabled ? getTimeAddedOneDayTime() : null , 
        uploadedImage.collectModule.amount,
        uploadedImage.collectModule.currency, 
        uploadedImage.collectModule.recipient,
        uploadedImage.referenceModule.followerOnlyReferenceModule]) : abiCoder.encode(['uint256','uint256','bool'],[
          uploadedImage.collectModule.collectLimit, 
          uploadedImage.collectModule.timeLimitEnabled ? getTimeAddedOneDayTime() : null ,
          uploadedImage.referenceModule.followerOnlyReferenceModule])     
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
      return  writePostContract?.({ recklesslySetUnpreparedArgs: [args] })
    } catch (e){
      console.error('e',e) 
      setUploadedImage({
        buttonText: t`Post image`,
        loading: false
      })
    }
  }

  const uploadImageToIpfs = async () => {
    if (uploadedImage.file){
      setUploadedImage({
        buttonText: t`Uploading to IPFS`,
        loading: true
      })
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        if (reader.result){
          const result = await storeCar(reader.result as string)
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

  
  const onUpload = async (data: NFTFormData) => {
    uploadedImage.title = data.title
    uploadedImage.description = data.description
    uploadedImage.isSensitiveContent = data.isSensitiveContent
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
    <div className="mx-auto my-10 max-w-5xl gap-5">
      <MetaTags title="Image Details" />
      <div className="mt-10">
        <Details onCancel={resetToDefaults} onUpload={onUpload} />
      </div>
    </div>
  )
}

export default UploadSteps
