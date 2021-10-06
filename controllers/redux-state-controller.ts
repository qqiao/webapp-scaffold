import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Store, Unsubscribe } from 'redux';

export interface ReduxStateController<S> extends ReactiveController {
  stateChanged(state: S): void;
}

export const ReduxStateController = <S>(store: Store) =>
  class implements ReduxStateController<S> {
    host: ReactiveControllerHost;

    #unsubscribe?: Unsubscribe;

    constructor(host: ReactiveControllerHost) {
      this.host = host;
      this.host.addController(this);
    }

    stateChanged(_state: S): void {
      throw new Error('Method not implemented.');
    }

    hostConnected() {
      this.#unsubscribe = store.subscribe(() => {
        this.stateChanged(store.getState());
      });

      this.stateChanged(store.getState());
    }

    hostDisconnected() {
      this.#unsubscribe?.();
    }
  };
