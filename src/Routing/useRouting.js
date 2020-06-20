import {useEffect, useState} from 'react'

export default function useRouting(routing) {
  const [state, setState] = useState({currentView: routing.getCurrentView()})

  useEffect(() => {
    return routing.subscribe(routingState => {
      setState(routingState)
    })
  }, [])

  return state
}
