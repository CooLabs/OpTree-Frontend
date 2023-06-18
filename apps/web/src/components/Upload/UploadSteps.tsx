import { OPTREE_PROXY_ABI } from '@abis/LensHubProxy'
import MetaTags from '@components/Common/MetaTags'
import useAppStore, { UPLOADED_IMAGE_FORM_DEFAULTS } from '@lib/store'
import useChannelStore from '@lib/store/channel'
import usePersistStore from '@lib/store/persist'
import { t } from '@lingui/macro'
import { utils } from 'ethers'
import type {
  CreateDataAvailabilityPostRequest,
  CreatePostBroadcastItemResult,
  CreatePublicPostRequest,
  MetadataAttributeInput,
  PublicationMetadataMediaInput,
  PublicationMetadataV2Input
} from 'lens'
import {
  PublicationMainFocus,
  ReferenceModules,
  useBroadcastDataAvailabilityMutation,
  useBroadcastMutation,
  useCreateDataAvailabilityPostTypedDataMutation,
  useCreateDataAvailabilityPostViaDispatcherMutation,
  useCreatePostTypedDataMutation,
  useCreatePostViaDispatcherMutation
} from 'lens'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import toast from 'react-hot-toast'
import type { CustomErrorWithData } from 'utils'
import {
  Analytics,
  BUNDLR_CONNECT_MESSAGE,
  ERROR_MESSAGE,
  OPTREE_PROXY_ADDRESS,
  LENSTER_APP_ID,
  OPTREE_APP_NAME,
  OPTREE_WEBSITE_URL,
  REQUESTING_SIGNATURE_MESSAGE,
  TRACK
} from 'utils'
import { getCollectModule } from 'utils/functions/getCollectModule'
import getUserLocale from 'utils/functions/getUserLocale'
import omitKey from 'utils/functions/omitKey'
import trimify from 'utils/functions/trimify'
import {storeBlob, storeCar} from 'utils/functions/uploadToStorage'
import logger from 'utils/logger'
import { v4 as uuidv4 } from 'uuid'
import {
  useAccount,
  useContractWrite,
  useSigner,
  useSignTypedData
} from 'wagmi'

import type { NFTFormData } from './Details'
import Details from './Details'

const UploadSteps = () => {
  const getBundlrInstance = useAppStore((state) => state.getBundlrInstance)
  const setBundlrData = useAppStore((state) => state.setBundlrData)
  const bundlrData = useAppStore((state) => state.bundlrData)
  const uploadedImage = useAppStore((state) => state.uploadedImage)
  const setUploadedImage = useAppStore((state) => state.setUploadedImage)
  const selectedChannel = useChannelStore((state) => state.selectedChannel)

  const queuedVideos = usePersistStore((state) => state.queuedVideos)
  const setQueuedVideos = usePersistStore((state) => state.setQueuedVideos)
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
    router.push('/')
  }

  const setToQueue = (txn: { txnId?: string; txnHash?: string }) => {
    if (txn?.txnId) {
      setQueuedVideos([
        {
          thumbnailUrl: uploadedImage.thumbnail,
          title: uploadedImage.title,
          txnId: txn.txnId,
          txnHash: txn.txnHash
        },
        ...(queuedVideos || [])
      ])
    }
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
      buttonText: t`Post Video`,
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
      buttonText: t`Post Video`,
      loading: false
    })
  }

  const { signTypedDataAsync } = useSignTypedData({
    onError
  })
  const [broadcast] = useBroadcastMutation({
    onCompleted: ({ broadcast }) => {
      onCompleted(broadcast.__typename)
      if (broadcast.__typename === 'RelayerResult') {
        const txnId = broadcast?.txId
        setToQueue({ txnId })
      }
    }
  })

  const { write: writePostContract } = useContractWrite({
    address: OPTREE_PROXY_ADDRESS,
    abi: OPTREE_PROXY_ABI,
    functionName: 'postWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: (data) => {
      setUploadedImage({
        buttonText: 'Post Video',
        loading: false
      })
      if (data.hash) {
        setToQueue({ txnHash: data.hash })
      }
    },
    onError
  })

  const getSignatureFromTypedData = async (
    data: CreatePostBroadcastItemResult
  ) => {
    const { typedData } = data
    toast.loading(REQUESTING_SIGNATURE_MESSAGE)
    const signature = await signTypedDataAsync({
      domain: omitKey(typedData?.domain, '__typename'),
      types: omitKey(typedData?.types, '__typename'),
      value: omitKey(typedData?.value, '__typename')
    })
    return signature
  }

  /**
   * DATA AVAILABILITY STARTS
   */
  const [broadcastDataAvailabilityPost] = useBroadcastDataAvailabilityMutation({
    onCompleted: (data) => {
      onCompleted()
      if (data.broadcastDataAvailability.__typename === 'RelayError') {
        return toast.error(ERROR_MESSAGE)
      }
      if (
        data?.broadcastDataAvailability.__typename ===
        'CreateDataAvailabilityPublicationResult'
      ) {
        redirectToHomePage()
      }
    },
    onError
  })

  const [createDataAvailabilityPostTypedData] =
    useCreateDataAvailabilityPostTypedDataMutation({
      onCompleted: async ({ createDataAvailabilityPostTypedData }) => {
        const { id } = createDataAvailabilityPostTypedData
        const signature = await getSignatureFromTypedData(
          createDataAvailabilityPostTypedData
        )
        return await broadcastDataAvailabilityPost({
          variables: { request: { id, signature } }
        })
      }
    })

  const [createDataAvailabilityPostViaDispatcher] =
    useCreateDataAvailabilityPostViaDispatcherMutation({
      onCompleted: ({ createDataAvailabilityPostViaDispatcher }) => {
        if (
          createDataAvailabilityPostViaDispatcher?.__typename === 'RelayError'
        ) {
          return
        }
        if (
          createDataAvailabilityPostViaDispatcher.__typename ===
          'CreateDataAvailabilityPublicationResult'
        ) {
          onCompleted()
          redirectToHomePage()
        }
      },
      onError
    })
  /**
   * DATA AVAILABILITY ENDS
   */

  const [createPostViaDispatcher] = useCreatePostViaDispatcherMutation({
    onError,
    onCompleted: ({ createPostViaDispatcher }) => {
      onCompleted(createPostViaDispatcher.__typename)
      if (createPostViaDispatcher.__typename === 'RelayerResult') {
        setToQueue({ txnId: createPostViaDispatcher.txId })
      }
    }
  })

  const initBundlr = async () => {
    if (signer?.provider && address && !bundlrData.instance) {
      toast.loading(BUNDLR_CONNECT_MESSAGE)
      const bundlr = await getBundlrInstance(signer)
      if (bundlr) {
        setBundlrData({ instance: bundlr })
      }
    }
  }

  const [createPostTypedData] = useCreatePostTypedDataMutation({
    onCompleted: async ({ createPostTypedData }) => {
      const { typedData, id } =
        createPostTypedData as CreatePostBroadcastItemResult
      const {
        profileId,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData
      } = typedData?.value
      try {
        const signature = await getSignatureFromTypedData(createPostTypedData)
        const { v, r, s } = utils.splitSignature(signature)
        const args = {
          profileId,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleInitData,
          sig: { v, r, s, deadline: typedData.value.deadline }
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        })
        if (data?.broadcast?.__typename === 'RelayError') {
          return writePostContract?.({ recklesslySetUnpreparedArgs: [args] })
        }
      } catch {}
    },
    onError
  })

  const createTypedData = async (request: CreatePublicPostRequest) => {
    await createPostTypedData({
      variables: { request }
    })
  }

  const createViaDispatcher = async (request: CreatePublicPostRequest) => {
    const { data } = await createPostViaDispatcher({
      variables: { request }
    })
    if (data?.createPostViaDispatcher.__typename === 'RelayError') {
      await createTypedData(request)
    }
  }

  const createViaDataAvailablityDispatcher = async (
    request: CreateDataAvailabilityPostRequest
  ) => {
    const variables = { request }

    const { data } = await createDataAvailabilityPostViaDispatcher({
      variables
    })

    if (
      data?.createDataAvailabilityPostViaDispatcher?.__typename === 'RelayError'
    ) {
      return await createDataAvailabilityPostTypedData({ variables })
    }

    if (
      data?.createDataAvailabilityPostViaDispatcher.__typename ===
      'CreateDataAvailabilityPublicationResult'
    ) {
      return redirectToHomePage()
    }
  }

  const createPublication = async ({
    imageSource
  }: {
    imageSource: string
  }) => {
    try {
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

      const isRestricted = Boolean(degreesOfSeparation)
      const referenceModuleDegrees = {
        commentsRestricted: isRestricted,
        mirrorsRestricted: isRestricted,
        degreesOfSeparation: degreesOfSeparation
      }

      // Create Data Availability post
      const { isRevertCollect } = uploadedImage.collectModule
      const dataAvailablityRequest = {
        from: selectedChannel?.id,
        contentURI: metadataUri
      }

      const request = {
        profileId: selectedChannel?.id,
        contentURI: metadataUri,
        collectModule: getCollectModule(uploadedImage.collectModule),
        referenceModule: {
          followerOnlyReferenceModule:
            uploadedImage.referenceModule?.followerOnlyReferenceModule,
          degreesOfSeparationReferenceModule: uploadedImage.referenceModule
            ?.degreesOfSeparationReferenceModule
            ? referenceModuleDegrees
            : null
        }
      }

      if (canUseRelay) {
        if (isRevertCollect && isSponsored) {
          return await createViaDataAvailablityDispatcher(
            dataAvailablityRequest
          )
        }

        return await createViaDispatcher(request)
      }

      return await createTypedData(request)
    } catch {}
  }

  const uploadImageToIpfs = async () => {
    if (uploadedImage.file){
      setUploadedImage({
        buttonText: t`Posting image`,
        loading: true
      })
      const reader = new FileReader();
      reader.addEventListener('load', async () => {
        if (reader.result){
          const result = await storeCar(reader.result as string)
          const url = 'ipfs://' + result
          console.log('result', result, url)
          // if (!result) {
          //   result.url = 'ipfs://bafkreienlg3zuid4nqdol7hbaqwppr2f266vr2eyjvcmx3yimfbt5bu3ru'
          //   //return toast.error(t`IPFS Upload failed`)
          // }
          setUploadedImage({
            percent: 100,
            imageSource: url
          })
          // return await createPublication({
          //   imageSource: url
          // })
        }
        
      });
      reader.readAsArrayBuffer(uploadedImage.file);
      
    }
   
  }

  const uploadToBundlr = async () => {
    if (!bundlrData.instance) {
      return await initBundlr()
    }
    if (!uploadedImage.stream) {
      return toast.error(t`Video not uploaded correctly`)
    }
    if (
      parseFloat(bundlrData.balance) < parseFloat(bundlrData.estimatedPrice)
    ) {
      return toast.error(t`Insufficient storage balance`)
    }
    try {
      setUploadedImage({
        loading: true,
        buttonText: t`Uploading to Arweave`
      })
      const bundlr = bundlrData.instance
      const tags = [
        { name: 'Content-Type', value: uploadedImage.imageType || 'image/png' },
        { name: 'App-Name', value: OPTREE_APP_NAME },
        { name: 'Profile-Id', value: selectedChannel?.id }
      ]
      const uploader = bundlr.uploader.chunkedUploader
      const chunkSize = 10000000 // 10 MB
      uploader.setChunkSize(chunkSize)
      uploader.on('chunkUpload', (chunkInfo) => {
        const fileSize = uploadedImage?.file?.size as number
        const lastChunk = fileSize - chunkInfo.totalUploaded
        if (lastChunk <= chunkSize) {
          toast.loading(REQUESTING_SIGNATURE_MESSAGE, { duration: 8000 })
        }
        const percentCompleted = Math.round(
          (chunkInfo.totalUploaded * 100) / fileSize
        )
        setUploadedImage({
          loading: true,
          percent: percentCompleted
        })
      })
      const upload = uploader.uploadData(uploadedImage.stream as any, {
        tags
      })
      const response = await upload
      setUploadedImage({
        loading: false,
        imageSource: `ar://${response.data.id}`
      })
      return await createPublication({
        imageSource: `ar://${response.data.id}`
      })
    } catch (error) {
      toast.error(t`Failed to upload video to Arweave`)
      logger.error('[Error Bundlr Upload Video]', error)
      return setUploadedImage({
        loading: false,
        buttonText: t`Post Video`
      })
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
