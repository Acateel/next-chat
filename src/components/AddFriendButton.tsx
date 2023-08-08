'use client'

import { FC, useState } from 'react'
import Button from './ui/Button'
import { addFriendValidator } from '@/lib/validations/add-friend'
import axios, { AxiosError } from 'axios'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

interface AddFriendButtonProps {
  dictionary: {
    [key: string]: string
  }
}

/**
 * type of form's data from zod validator
 */
type FormData = z.infer<typeof addFriendValidator>

const AddFriendButton: FC<AddFriendButtonProps> = ({ dictionary }) => {
  const [showSuccessState, setShowSuccessState] = useState<boolean>(false)

  /**
   * Reach Hook for take response from validator
   */
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(addFriendValidator),
  })

  const addFriend = async (email: string) => {
    try {
      // validate error
      const validatedEmail = addFriendValidator.parse({ email })

      // send request in api for add friend
      await axios.post('/api/friends/add', {
        email: validatedEmail,
      })

      setShowSuccessState(true)
    } catch (error) {
      // validation errors
      if (error instanceof z.ZodError) {
        setError('email', { message: error.message })
        return
      }
      // send request errors
      if (error instanceof AxiosError) {
        setError('email', { message: error.response?.data })
        return
      }
      // other errors
      setError('email', { message: dictionary.something_went_wrong })
    }
  }

  const onSubmit = (data: FormData) => {
    addFriend(data.email)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm">
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300"
      >
        {dictionary.add_friend_by_email}
      </label>
      <div className="mt-2 flex gap-4">
        <input
          // connect validation and input email
          {...register('email')}
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 dark:ring-gray-600 dark:bg-slate-600 dark:placeholder:text-gray-200 dark:text-gray-50"
          placeholder="you@example.com"
        />
        <Button>{dictionary.add}</Button>
      </div>
      <p className="mt-1 text-sm text-red-600">{errors.email?.message && dictionary.invalid_email}</p>
      {showSuccessState ? (
        <p className="mt-1 text-sm text-green-600">
          {dictionary.friend_request_sent}
        </p>
      ) : null}
    </form>
  )
}

export default AddFriendButton
