import React from 'react'

export default function PressListItem(props) {
  return (
    <li className={props.pressed ? 'press-list-item--pressed' : 'press-list-item'}>
      <button className="press-button" onClick={props.onToggle}>
        {props.pressed ? '☀️' : '⛈'}
      </button>
    </li>
  )
}
