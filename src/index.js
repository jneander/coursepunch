import {createBrowserHistory} from 'history'

import App from './App'
import {Routing} from './Routing'

const routing = new Routing({history: createBrowserHistory()})

const app = new App({routing})
app.start()
