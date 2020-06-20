import {Store} from '@jneander/utils-state'
import firebase from 'firebase'
import 'firebase/firebase'

const API_KEY = 'AIzaSyCtN5ObdLrifLEvA-grsDPyzlwTw9snNpQ'
const PROJECT_ID = 'coursepunch-jln'

const FIXED_IDS = Array(24).fill().map((_, index) => `${index + 1}`)

function normalizePresses(snapshot) {
  const dataMap = {}

  snapshot.forEach(doc => {
    dataMap[doc.id] = {...doc.data(), id: doc.id}
  })

  return FIXED_IDS.map(id => dataMap[id] || {id, pressed: false})
}

export default class Datastore {
  constructor() {
    firebase.initializeApp({
      apiKey: API_KEY,
      projectId: PROJECT_ID,
    })

    this.store = new Store({
      presses: []
    })
  }

  initialize() {
    if (this.db) {
      return
    }

    this.db = firebase.firestore()

    this.unlistenSnapshots = this.db
      .collection('presses')
      .onSnapshot(snapshot => {
        this.store.setState({
          presses: normalizePresses(snapshot),
        })
      })
  }

  uninitialize() {
    if (this.unlistenSnapshots) {
      this.unlistenSnapshots()
    }
    this.db = null
  }

  onStateChange(callback) {
    return this.store.subscribe(callback)
  }

  getPresses() {
    return this.store.getState().presses
  }

  setPressed(id, pressed) {
    this.db
      .collection('presses')
      .doc(id)
      .set({
        pressed: pressed,
      })
      .then(() => {
        // No handling required
      })
      .catch(() => {
        // In a real application, address this error.
      })
  }
}
