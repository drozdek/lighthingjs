import { Lightning, Utils } from '@lightningjs/sdk'
import Letter from './Letter';

export default class App extends Lightning.Component {

  _construct() {
  }

  // _onActive(){
  //   console.log('I am visible');
  // }

  _handleLeft() {
    this.handleLeft();
  }

  _handleRight() {
    this.handleRight();
  }

  _init() {
    console.clear();
    console.log('Starting Sky App...')
  }

  handleLeft() {
    let elem = this.tag('LetterList');
    let elemPosX = Math.ceil(elem.getSmooth('x') - 50);
    elem.setSmooth("x", elemPosX);
    this.currentPosX = elemPosX;
    console.log('left' + elemPosX)
  }

  handleRight() {
    let elem = this.tag('LetterList');
    let elemPosX = Math.ceil(elem.getSmooth('x') + 50);
    elem.setSmooth("x", elemPosX);
    this.currentPosX = elemPosX;
    console.log('right' + elemPosX)
  }

  getLetter(){

  }

  static _template() {
    this.y = 70;
    this.color= 0xff005500;
    this.textColor = 0xaaaaaaaa;
    this.textAlign = 'center'
    return {
      Header: {
        y: 20, text: { text: 'Press an arrow key to select a letter...', textColor: 0xaa000000, textAlign: 'left', fontSize: 30 }
      },      
      LetterList: {
        A: {
          rect: true, w: 50, h: 50, color: this.color, x: 0, y: this.y, text: { text: 'a', color: this.textColor, textAlign: this.textAlign, fontSize: 30 }
        },
        B: {
          rect: true, w: 50, h: 50, color: this.color, border: true, x: 50, y: this.y, text: {
            text: 'b', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        C: {
          rect: true, w: 50, h: 50, color: this.color, x: 100, y: this.y, text: {
            text: 'c', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        D: {
          rect: true, w: 50, h: 50, color: this.color, x: 150, y: this.y, text: {
            text: 'd', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        E: {
          rect: true, w: 50, h: 50, color: this.color, x: 200, y: this.y, text: {
            text: 'e', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        F: {
          rect: true, w: 50, h: 50, color: this.color, x: 250, y: this.y, text: {
            text: 'f', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        G: {
          rect: true, w: 50, h: 50, color: this.color, x: 300, y: this.y, text: {
            text: 'g', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        H: {
          rect: true, w: 50, h: 50, color: this.color, x: 350, y: this.y, text: {
            text: 'h', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        I: {
          rect: true, w: 50, h: 50, color: this.color, x: 400, y: this.y, text: {
            text: 'i', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        J: {
          rect: true, w: 50, h: 50, color: this.color, x: 450, y: this.y, text: {
            text: 'j', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
      }
    }
  };

}