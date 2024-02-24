'use client'

import { useState, useEffect } from 'react'
import Modal from './Modal'
import useUploadModal from '@/hooks/useUploadModal'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Input from './Input'
import Button from './Button'
import { toast } from 'react-hot-toast'
import { User } from '@supabase/gotrue-js/src/lib/types'
import uniqid from 'uniqid'
import { createClient } from '@/lib/client/client'
import { useRouter } from 'next/navigation'

interface UploadModalProps {
  user: User | null
}

const UploadModal = ({ user }: UploadModalProps) => {
  const supabase = createClient()
  const router = useRouter()
  const { isOpen, onClose } = useUploadModal()
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: '',
      title: '',
      song: null,
      image: null,
    },
  })
  const onChange = (open: boolean) => {
    if (!open) {
      reset()
      onClose()
    }
  }
  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true)
      const imageFile = values.image?.[0]
      const songFile = values.song?.[0]
      if (!imageFile || !songFile || !user) {
        toast.error('Missing fields')
        return
      }
      const uniqueID = uniqid()
      const { data: songData, error: songError } = await supabase.storage
        .from('songs')
        .upload(`song-${values.title}-${uniqueID}`, songFile, {
          cacheControl: '3600',
          upsert: false,
        })
      if (songError) {
        console.log('song storage error', songError)
        return toast.error('Failed to upload song')
      }
      console.log('uploaded songData', songData)
      const { data: imageData, error: imageError } = await supabase.storage
        .from('images')
        .upload(`image-${values.title}-${uniqueID}`, imageFile, {
          cacheControl: '3600',
          upsert: false,
        })
      if (imageError) {
        console.log('image storage error', imageError)
        return toast.error('Failed to upload image')
      }
      console.log('uploaded imageData', imageData)
      const { error: insertSongError } = await supabase.from('songs').insert({
        user_id: user.id,
        title: values.title,
        author: values.author,
        image_path: imageData.path,
        song_path: songData.path,
      })
      if (insertSongError) {
        console.log('insert song error', insertSongError)
        return toast.error(insertSongError.message)
      }
      toast.success('Song uploaded!')
      reset()
      onClose()
      router.refresh()
    } catch (error) {
      toast.error('Something went wrong')
      console.log('error uploading song', error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    setIsMounted(true)
  }, [])
  if (!isMounted) return null
  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register('author', { required: true })}
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register('song', { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register('image', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  )
}

export default UploadModal
