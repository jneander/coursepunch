import React from 'react'
import {render} from 'react-dom'

import UI from './UI'

export default class App {
  constructor(dependencies) {
    this.dependencies = dependencies
  }

  start() {
    this.dependencies.datastore.initialize()

    const $app = document.getElementById('app')
    const element = <UI {...this.dependencies} />
    render(element, $app)
  }

  stop() {
    this.dependencies.datastore.uninitialize()
  }
}
