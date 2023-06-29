import { LENSHUB_PROXY_ABI } from '@/abis/LensHubProxy'
import { ERROR_MESSAGE, LENS_HUB_ADDRESS, OPTREE_PROXY_ADDRESS } from '@/utils/constants'
import { useContractRead, useContractWrite } from 'wagmi'
import { CustomErrorWithData } from '@/utils/custom-types'

function userDispatcher( profileId, successFunc, errorFunc) {

  const {data: dispatcher} = useContractRead({
      address: LENS_HUB_ADDRESS,
      abi: LENSHUB_PROXY_ABI,
      functionName: 'getDispatcher',
      args: [profileId||0]
  })
    
  const { isLoading, write: setDispatcher } = useContractWrite({
    address: LENS_HUB_ADDRESS,
    abi: LENSHUB_PROXY_ABI,
    functionName: 'setDispatcher',
    mode: 'recklesslyUnprepared',
    onSuccess: (data) => {
      console.log('onSuccess data', data) 
      successFunc && successFunc()
    },
    onError: (error: CustomErrorWithData)=>{
      errorFunc && errorFunc(error)
    }
  })

  const toSetDispatcher =  ()=>{
    if (dispatcher !== OPTREE_PROXY_ADDRESS){
      setDispatcher?.({ recklesslySetUnpreparedArgs: [profileId, OPTREE_PROXY_ADDRESS]})
      return true
    }
    return false
  }

  return { toSetDispatcher }
}

export default userDispatcher
