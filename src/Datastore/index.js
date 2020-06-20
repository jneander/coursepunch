import {Store} from '@jneander/utils-state'
import firebase from 'firebase'
import 'firebase/firebase'

const API_KEY = 'AIzaSyCtN5ObdLrifLEvA-grsDPyzlwTw9snNpQ'
const PROJECT_ID = 'coursepunch-jln'
const MARKING_DEBOUNCE = 100

const FIXED_IDS = Array(24).fill().map((_, index) => `${index + 1}`)

function normalizePresses(snapshot) {
  const dataMap = {}

  snapshot.forEach(doc => {
    dataMap[doc.id] = {...doc.data(), id: doc.id}
  })

  return FIXED_IDS.map(id => dataMap[id] || {id, pressed: false})
}

function normalizeMarkings(snapshot) {
  const data = []
  snapshot.forEach(doc => {
    doc.data().markings.forEach(marking => {
      data.push({...marking, id: doc.id})
    })
  })
  return data
}

export default class Datastore {
  constructor() {
    firebase.initializeApp({
      apiKey: API_KEY,
      projectId: PROJECT_ID,
    })

    this.store = new Store({
      connected: navigator.onLine,
      markings: [],
      presses: []
    })
  }

  initialize() {
    if (this.db) {
      return
    }

    this.db = firebase.firestore()
    this.unsubscribeFns = []

    this.unsubscribeFns.push(this.db
      .collection('presses')
      .onSnapshot(snapshot => {
        this.store.setState({
          presses: normalizePresses(snapshot),
        })
      }))

    this.unsubscribeFns.push(this.db
      .collection('markings')
      .orderBy('timestamp')
      .onSnapshot(snapshot => {
        this.store.setState({
          markings: normalizeMarkings(snapshot),
        })
      }))

    const updateConnected = () => {
      this.store.setState({connected: navigator.onLine})
    }

    window.addEventListener('online',  updateConnected)
    window.addEventListener('offline', updateConnected)

    this.unsubscribeFns.push(() => window.removeEventListener('online',  updateConnected))
    this.unsubscribeFns.push(() => window.removeEventListener('offline', updateConnected))
  }

  uninitialize() {
    this.unsubscribeFns.forEach(unsubscribeFn => unsubscribeFn())
    this.unsubscribeFns = []
    this.db = null
  }

  onStateChange(callback) {
    return this.store.subscribe(callback)
  }

  getPresses() {
    return this.store.getState().presses
  }

  getMarkings() {
    return this.store.getState().markings
  }

  getConnected() {
    return this.store.getState().connected
  }

  setPressed(id, pressed) {
    this.db
      .collection('presses')
      .doc(id)
      .set({pressed})
      .then(() => {
        // No handling required
      })
      .catch(() => {
        // In a real application, address this error.
      })
  }

  addMarking(position, rgb, dimensions) {
    if (this.__nextBatch) {
      this.__nextBatch.markings.push({position, rgb, dimensions})
    } else {
      this.__createBatchWithMarkings(position, rgb, dimensions)
    }
  }

  // PRIVATE

  __createBatchWithMarkings(position, rgb, dimensions) {
    this.__nextBatch = {
      markings: [{position, rgb, dimensions}]
    }

    this.__nextBatch.timeout = window.setTimeout(this.__submitNextBatch.bind(this), MARKING_DEBOUNCE)
  }

  __submitNextBatch() {
    const {markings} = this.__nextBatch
    this.__nextBatch = null

    this.db
      .collection('markings')
      .add({markings, timestamp: firebase.firestore.FieldValue.serverTimestamp()})
      .then(() => {
        // No handling required
      })
      .catch(() => {
        // In a real application, address this error.
      })
  }
}
