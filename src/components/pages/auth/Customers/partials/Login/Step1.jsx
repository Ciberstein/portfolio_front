import clsx from 'clsx';
import React from 'react'
import { useForm } from 'react-hook-form';
import isEmailValid from '../../../../../../utils/isEmailValid';
import api from '../../../../../../api/axios';
import appError from '../../../../../../utils/appError';
import { API_ROUTES } from '../../../../../../api/routes';


export const Step1 = () => {

  const { register, handleSubmit } = useForm();

  const submit = async (data) => {

    const url = `${API_ROUTES.AUTH}/login`;

    await api.post(url, data)
      .then(res => console.log(res.data))
      .catch(err => appError(err));
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col">
      <label htmlFor="email" className="flex flex-col sm:flex-row sm:items-center gap-1">
        <span className="text-green-600">
          [insert your email]
        </span>
        <div className="flex items-center gap-1 grow">
          <span>$</span>
          <input
            className="focus-visible:outline-none grow"
            { ...register("email")}
            id="email"
            type="text"
          />
        </div>
      </label>

      <label htmlFor="password" className="flex flex-col sm:flex-row sm:items-center gap-1">
        <span className="text-green-600">
          [insert your password]
        </span>
        <div className="flex items-center gap-1 grow">
          <span>$</span>
          <input
            className="focus-visible:outline-none grow"
            { ...register("password")}
            id="password"
            type="password"
          />
        </div>
      </label>
      <button type="submit" className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">Login</button>
    </form>
  )
}
