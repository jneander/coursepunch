import qs from 'qs'

const DEFAULT_VIEW = "press"

function viewFromLocation({search}) {
  const query = qs.parse(search.replace(/^\?/, ''))
  return query.view || DEFAULT_VIEW
}

export default class Routing {
  constructor({history}) {
    this._history = history
  }

  getCurrentView() {
    return viewFromLocation(this._history.location)
  }

  setCurrentView(view) {
    if (this.getCurrentView() !== view) {
      this._history.push(`?view=${view}`)
    }
  }

  subscribe(callback) {
    return this._history.listen(location => {
      const state = {currentView: viewFromLocation(location)}
      callback(state)
    })
  }
}
