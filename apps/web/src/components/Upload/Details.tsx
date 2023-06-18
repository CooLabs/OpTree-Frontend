import { Button } from '@components/UIElements/Button'
import EmojiPicker from '@components/UIElements/EmojiPicker'
import InputMentions from '@components/UIElements/InputMentions'
import RadioInput from '@components/UIElements/RadioInput'
import { zodResolver } from '@hookform/resolvers/zod'
import useAppStore from '@lib/store'
import { t, Trans } from '@lingui/macro'
import clsx from 'clsx'
import { FC, useEffect, useState } from 'react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { z } from 'zod'

import Category from './Category'
import CollectModule from './CollectModule'
import ReferenceModule from './ReferenceModule'
import DropZone from './DropZone'

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: t`Title should be atleast 5 characters` })
    .max(100, { message: t`Title should not exceed 100 characters` }),
  description: z
    .string()
    .trim()
    .max(5000, { message: t`Description should not exceed 5000 characters` }),
  isSensitiveContent: z.boolean()
})

export type NFTFormData = z.infer<typeof formSchema>

type Props = {
  onUpload: (data: NFTFormData) => void
  onCancel: () => void
}

const Details: FC<Props> = ({ onUpload, onCancel }) => {
  const uploadedImage = useAppStore((state) => state.uploadedImage)
  const setUploadedImage = useAppStore((state) => state.setUploadedImage)
  const [imageData, setImageData] = useState('')

  const {
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    watch,
    clearErrors
  } = useForm<NFTFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isSensitiveContent: uploadedImage.isSensitiveContent ?? false,
      title: uploadedImage.title,
      description: uploadedImage.description
    }
  })

  const onSubmitForm = (data: NFTFormData) => {
    onUpload(data)
  }

  useEffect(()=>{
    if (uploadedImage?.file){
      setImageData(URL.createObjectURL(uploadedImage?.file))
    }
  },[uploadedImage?.file])
 
  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="grid h-full gap-5 md:grid-cols-2">
        <div className="flex flex-col justify-between">
          <div>
            {uploadedImage?.file ? (<img 
                src={imageData}
                draggable={false}
              />) : <DropZone />}
          </div>
        </div>
        <div className="flex flex-col  justify-between">
        <div className="relative mt-4">
              <InputMentions
                label={t`Title`}
                placeholder={t`Title that describes your image`}
                autoComplete="off"
                validationError={errors.title?.message}
                value={watch('title')}
                onContentChange={(value:any) => {
                  setValue('title', value)
                  clearErrors('title')
                }}
                mentionsSelector="input-mentions-single"
              />
              <div className="absolute right-1 top-0 mt-1 flex items-center justify-end">
                <span
                  className={clsx('text-[10px] opacity-50', {
                    'text-red-500 !opacity-100': watch('title')?.length > 100
                  })}
                >
                  {watch('title')?.length}/100
                </span>
              </div>
            </div>
            <div className="relative mt-4">
              <InputMentions
                label={t`Description`}
                placeholder={t`Describe more about your image, can be @channels, #hashtags or chapters (00:20 - Intro)`}
                autoComplete="off"
                validationError={errors.description?.message}
                value={watch('description')}
                onContentChange={(value) => {
                  setValue('description', value)
                  clearErrors('description')
                }}
                rows={5}
                mentionsSelector="input-mentions-textarea"
              />
              <div className="absolute bottom-1.5 right-1.5">
                <EmojiPicker
                  onEmojiSelect={(emoji) =>
                    setValue(
                      'description',
                      `${getValues('description')}${emoji}`
                    )
                  }
                />
              </div>
              <div className="absolute right-1 top-0 mt-1 flex items-center justify-end">
                <span
                  className={clsx(
                    'text-[10px]',
                    watch('description')?.length > 5000
                      ? 'text-red-500'
                      : 'opacity-50'
                  )}
                >
                  {watch('description')?.length}/5000
                </span>
              </div>
            </div>
            <div className="mt-4">
              <CollectModule />
            </div>
            {/* <div className="mt-4">
              <Category />
            </div> */}
            <div className="mt-4">
              <ReferenceModule />
            </div>
            {/* <div className="mt-4">
              <RadioInput
                checked={watch('isSensitiveContent')}
                onChange={(checked) => {
                  setValue('isSensitiveContent', checked)
                }}
                question={
                  <span>
                    <Trans>
                      Does this image contain sensitive information that targets
                      an adult audience?
                    </Trans>
                  </span>
                }
              />
            </div> */}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-start space-x-2">
        <Button
          loading={uploadedImage.loading }
          type="submit"
        >
          {uploadedImage.buttonText}
        </Button>
      </div>
    </form>
  )
}

export default Details
