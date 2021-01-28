import { Lightning, Utils } from '@lightningjs/sdk'
import Letter from './Letter';

export default class App extends Lightning.Component {

  _construct() {
  }

  _handleLeft() {
    this._setState('shiftLeft')

  }
  _handleRight() {
    this._setState('shiftRight')
  }

  _init() {
    console.clear();
    console.log('Starting Sky App...')
  }

  static _template() {
    this.y = 50

    return {
      Content: {
        Header: {
          y: 20,
          text: {
            text: 'Press an arrow key to select a letter...',
            textColor: 0xaaaaaaaa,
            textAlign: 'left',
            fontSize: 30
          }
        },
        A: {
          rect: true, w: 50, h: 50, color: 0xff005500,
          x: 10,
          y: this.y,
          text: {
            text: 'a',
            textColor: 0xaaaaaaaa,
            textAlign: 'center',
            fontSize: 30
          }
        },
        B: {
          rect: true, w: 50, h: 50, color: 0xff005500,
          border: true,
          x: 60,
          y: this.y,
          text: {
            text: 'b',
            textColor: 0xaaaaaaaa,
            textAlign: 'center',
            fontSize: 30
          }
        },
        C: {
          rect: true, w: 50, h: 50, color: 0xff005500,
          x: 110,
          y: this.y,
          text: {
            text: 'c',
            textColor: 0xaaaaaaaa,
            textAlign: 'center',
            fontSize: 30
          }
        },
        D: {
          rect: true, w: 50, h: 50, color: 0xff005500,
          x: 160,
          y: this.y,
          text: {
            text: 'd',
            textColor: 0xaaaaaaaa,
            textAlign: 'center',
            fontSize: 30
          }
        },
        E: {
          rect: true, w: 50, h: 50, color: 0xff005500,
          x: 210,
          y: this.y,
          text: {
            text: 'e',
            textColor: 0xaaaaaaaa,
            textAlign: 'center',
            fontSize: 30
          }
        },
        F: {
          rect: true, w: 50, h: 50, color: 0xff005500,
          x: 260,
          y: this.y,
          text: {
            text: 'f',
            textColor: 0xaaaaaaaa,
            textAlign: 'center',
            fontSize: 30
          }
        },
        G: {
          rect: true, w: 50, h: 50, color: 0xff005500,
          x: 310,
          y: this.y,
          text: {
            text: 'g',
            textColor: 0xaaaaaaaa,
            textAlign: 'center',
            fontSize: 30
          }
        },
        H: {
          rect: true, w: 50, h: 50, color: 0xff005500,
          x: 360,
          y: this.y,
          text: {
            text: 'h',
            textColor: 0xaaaaaaaa,
            textAlign: 'center',
            fontSize: 30
          }
        },
        I: {
          rect: true, w: 50, h: 50, color: 0xff005500,
          x: 410,
          y: this.y,
          text: {
            text: 'i',
            textColor: 0xaaaaaaaa,
            textAlign: 'center',
            fontSize: 30
          }
        },
        J: {
          rect: true, w: 50, h: 50, color: 0xff005500,
          x: 460,
          y: this.y,
          text: {
            text: 'j',
            textColor: 0xaaaaaaaa,
            textAlign: 'center',
            fontSize: 30
          }
        },                                                        
      }
    }
  };

}