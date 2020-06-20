import React from 'react'

import useDatastore from '../../Datastore/useDatastore'

export default function Layout(props) {
  const {datastore, routing} = props

  useDatastore(datastore)

  const currentView = routing.getCurrentView()
  const connected = datastore.getConnected()

  function handleDrawClick(event) {
    event.preventDefault()
    routing.setCurrentView('draw')
  }

  function handlePressClick(event) {
    event.preventDefault()
    routing.setCurrentView('press')
  }

  function getLinkClassName(view) {
    return view === currentView ? 'navigation-link--current' : 'navigation-link'
  }

  return (
    <div className="layout-container">
      <header className="layout-header">
        <span className="logo--text">Coursepunch</span>

        <nav className="navigation">
          <a className={getLinkClassName('press')} href="/?view=press" onClick={handlePressClick}>
            Press
          </a>

          <a className={getLinkClassName('draw')} href="/?view=draw" onClick={handleDrawClick}>
            Draw
          </a>
        </nav>

        <span className="connection-state">{connected ? 'Connected' : 'No Connection'}</span>
      </header>

      <main className="layout-main">{props.children}</main>
    </div>
  )
}
