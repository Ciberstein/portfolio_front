import { CloseOutlined } from '@mui/icons-material'
import { Card } from '../ui'
import { Tooltip } from '@mui/material'
import MuiModal from '@mui/material/Modal';
import clsx from 'clsx';

export default function Modal({
  children,
  open = false,
  setOpen,
  admin = false,
  title = false,
  header = true,
  className= '',
  as: As = 'div',
  backdrop = true,
  screen = false, 
}) {

  const Container = screen ? 'div' : Card;

  return (
    <MuiModal
      as="div"
      open={open}
      onClose={backdrop ? setOpen : () => null}
      className="relative focus:outline-none"
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 backdrop-blur-2xl">
            <Container
              admin={admin}
              className={clsx(
                'min-w-full sm:min-w-sm max-w-md rounded-3xl',
                screen ? '' : 'max-w-md',
                className
              )}
            >
              <div className="flex flex-col gap-6 dark:text-white">
                { header &&
                  <header className="flex justify-between items-center gap-4">
                    <h3 className="text-base/7 font-medium dark:text-white w-full">
                      {title}
                    </h3>
                    <Tooltip placement="top" title="Close">
                      <button onClick={() => setOpen(false)} >
                        <CloseOutlined />
                      </button>                      
                    </Tooltip>
                  </header>
                }
                <As className={className}>
                  {children}
                </As>
              </div>
            </Container>
        </div>
      </div>
    </MuiModal>
  )
}