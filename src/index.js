import {createBrowserHistory} from 'history'

import App from './App'
import Datastore from './Datastore'
import {Routing} from './Routing'

const datastore = new Datastore()
const routing = new Routing({history: createBrowserHistory()})

const app = new App({datastore, routing})
app.start()
