import React from 'react'

import {useRouting} from '../Routing'
import Draw from './Draw'
import Layout from './Layout'
import Press from './Press'

export default function UI(props) {
  const {routing} = props

  const {currentView} = useRouting(routing)

  return (
    <Layout {...props}>
      {currentView === "press" ? <Press /> : <Draw />}
    </Layout>
  )
}
