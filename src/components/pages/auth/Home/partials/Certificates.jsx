import React from 'react'
import { Dialog } from '@mui/material'

export const Certificates = ({ data = [] }) => {
  const [selected, setSelected] = React.useState(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 h-full">
        { data?.length > 0 ? data?.map(certificate => (
          <div
            key={certificate.id}
            onClick={() => setSelected(certificate)}
            className="flex flex-col gap-2 cursor-pointer hover:brightness-75"
          >
            <div
              className="clip-angle h-32 flex flex-col justify-end"
              style={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundImage: 'url(' + certificate.image + ')'
              }}
            />
            <div className="flex justify-start text-left">
              <h3 className="text-lg font-semibold">
                {certificate.title}
              </h3>
            </div>
          </div>
        )) : 'No Data' }
      </div>

      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="md"
        fullWidth
      >
        { selected && (
          <img
            src={selected.image}
            alt={selected.title}
            className="w-full h-auto"
          />
        )}
      </Dialog>
    </>
  )
}
