import React from 'react'

export default function Layout(props) {
  const {routing} = props

  const currentView = routing.getCurrentView()

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
      </header>

      <main className="layout-main">{props.children}</main>
    </div>
  )
}
