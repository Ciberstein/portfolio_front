import React from 'react'

export const Step3 = ({ setDialog, data }) => {

  const trigger = (res) => {

    if(data.status === 200) {
      location.reload()
    }

    else if(data.status === 201) {
      // navigate("/register", { state: { data: res.data } })
    }

    else if(res.status === 202) {
      setAccount(res.data.account)
    }
  };

  return (
    <div>Step3</div>
  )
}
