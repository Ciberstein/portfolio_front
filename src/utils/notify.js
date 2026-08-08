// Bridge between the axios interceptor and the toast host.
//
// A plain module rather than the redux store on purpose: api/axios would have
// to import the store, the store imports the slices, and the slices import
// api/axios — a cycle. This file imports nothing, so there is none.

let handler = null

// Called once by <Toasts /> when it mounts.
export const setNotifyHandler = (fn) => {
  handler = fn
  return () => { if (handler === fn) handler = null }
}

export const notify = (message, type = 'error') => {
  if (handler && message) handler(message, type)
}

export default notify
