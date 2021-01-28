import { Router, Navigation } from '@lightningjs/sdk';

export default class _Router extends Router.App {
  _setup () {
    Router.startRouter(routes);
  }
}