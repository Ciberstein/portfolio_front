import React from 'react'
import { PreAuthLayout } from '../layouts/PreAuthLayout'
import { Earth } from '../Earth'
import { Textarea } from '../elements/Textarea'
import { WindowCard } from '../elements/WindowCard'
import { Input } from '../elements/Input'
import { PrimaryButton } from '../elements/PrimaryButton'
import { EmailIcon, EnvelopIcon, TitleIcon } from '../../../public/icons/Svg'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { setLoad } from '../../store/slices/loader.slice'
import apiConfig from '../../utils/apiConfig'
import axios from 'axios'
import Swal from 'sweetalert2'

export const ContactPage = () => {

  const darkMode = useSelector((state) => state.darkMode);

  const { register, handleSubmit, watch, reset, formState: { errors }} = useForm();

  const dispatch = useDispatch()

  const submit = async (data) => {

    dispatch(setLoad(false))

    const url = `${apiConfig().endpoint}/contact/`

    await axios.post(url, data)
      .then(res => {
        reset()
        Swal.fire({
          toast: true,
          position: 'bottom-right',
          icon: 'success',
          text: res.data.message,
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        })
      })
      .catch(err => {
        Swal.fire({
          toast: true,
          position: 'bottom-right',
          icon: 'error',
          text: err.response.data.message,
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        })
      })
      .finally(() => dispatch(setLoad(true)))

  }

  return (
    <PreAuthLayout className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="col-span-3 hidden md:flex justify-center items-center">
      <Earth />
      </div>
      <form className="col-span-2 flex flex-col justify-center items-center p-4 gap-4" onSubmit={handleSubmit(submit)}>
        <WindowCard title="Contact me" containerClass=" sm:w-3/4" className="flex flex-col gap-4">
          <Input 
            icon={
              <EmailIcon 
                color={darkMode ? "#00ffff" : "#292929"} 
              />
            } 
            id="email"
            name="email"
            autoComplete="off" 
            placeholder="Email" 
            type="email"
            register={{
              function: register,
              errors: {
                function: errors,
                rules: {
                  required:
                  'Email is required',
                },
              },
            }}
          />
          <Input 
            icon={
              <TitleIcon 
                color={darkMode ? "#00ffff" : "#292929"} 
              />
            }
            id="subject"
            name="subject"
            autoComplete="off" 
            placeholder="Subject"
            register={{
              function: register,
              errors: {
                function: errors,
                rules: {
                  required:
                  'Subject is required',
                },
              },
            }}
          />
          <Textarea 
            rows="5" 
            placeholder="Write message..."
            id="message"
            name="message"
            register={{
              function: register,
              errors: {
                function: errors,
                rules: {
                  required:
                  'Message is required',
                },
              },
            }}  
          />
          <PrimaryButton type="submit">
            Send message
          </PrimaryButton> 
        </WindowCard>
      </form>
    </PreAuthLayout>
  )
}
