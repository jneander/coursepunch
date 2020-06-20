import {useEffect, useState} from 'react'

export default function useDatastore(datastore) {
  const [_, setState] = useState({})

  useEffect(() => {
    // Link the datastore lifecycle with the React lifecycle. When the store
    // updates, trigger a re-render of whichever components are using this hook.
    return datastore.onStateChange(() => {
      setState({})
    })
  }, [])

  return datastore
}
