import { action, observable, computed, runInAction, makeObservable } from 'mobx'
import { enableStaticRendering } from 'mobx-react-lite'

enableStaticRendering(typeof window === 'undefined')

export class Store {
  accountAddr = ''

  constructor() {
    makeObservable(this, {
      accountAddr: observable,
      updateState: action,
      hydrate: action,
    })
  }

  updateState = (addr) => {
    this.accountAddr = addr;
  }


  hydrate = (data) => {
    if (!data) return

    this.accountAddr = data.accountAddr !== null ? data.accountAddr : '';
  }
}
