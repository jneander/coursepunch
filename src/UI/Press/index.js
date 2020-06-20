import React from 'react'

import useDatastore from '../../Datastore/useDatastore'
import PressListItem from './PressListItem'

export default function Press(props) {
  const {datastore} = props

  useDatastore(datastore)
  const presses = datastore.getPresses()

  return (
    <>
      <h1>Press</h1>

      <ul className="press-list" role="list">
        {presses.map((press) => (
          <PressListItem key={press.id}
            onToggle={() => datastore.setPressed(press.id, !press.pressed)}
            pressed={press.pressed}
          />
        ))}
      </ul>
    </>
  )
}
