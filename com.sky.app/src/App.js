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
    this.getLetter();
    // console.log('left' + elemPosX);
  }

  handleRight() {
    let elem = this.tag('LetterList');
    let elemPosX = Math.ceil(elem.getSmooth('x') + 50);
    elem.setSmooth("x", elemPosX);
    this.currentPosX = elemPosX;
    this.getLetter();
    // console.log('right' + elemPosX);
  }

  getLetter() {
    const lettersArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    if (this.currentPosX <= 0) {
      this.currentPosX = this.currentPosX * -1;
      console.log(this.currentPosX);
      let arrayIndex = lettersArr[this.currentPosX / 50];
      this.letterSelected = arrayIndex;
      console.log('arrayIndex: ' + this.letterSelected);
    }
    else {
      let arrayIndex = lettersArr[0];
      this.letterSelected = arrayIndex;
      console.log('arrayIndex A: ' + this.letterSelected);
    }
  }

  static _template() {
    this.y = 70;
    this.color = 0xff005500;
    this.textColor = 0xaaaaaaaa;
    this.textAlign = 'center';
    this.letterSelected = ""
    return {
      Header: {
        y: 20, text: { text: 'Press an arrow key to select a letter...', textColor: 0xaa000000, textAlign: 'left', fontSize: 30 }
      },
      SelectionBox: {
       y: this.y, x: 0, w: 50, h: 50, rect: true, colorTop: 0x4d636EFB, colorBottom: 0x4d1C27bC, zIndex: 1
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
        K: {
          rect: true, w: 50, h: 50, color: this.color, x: 500, y: this.y, text: {
            text: 'k', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        L: {
          rect: true, w: 50, h: 50, color: this.color, x: 550, y: this.y, text: {
            text: 'l', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        M: {
          rect: true, w: 50, h: 50, color: this.color, x: 600, y: this.y, text: {
            text: 'm', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        N: {
          rect: true, w: 50, h: 50, color: this.color, x: 650, y: this.y, text: {
            text: 'n', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        O: {
          rect: true, w: 50, h: 50, color: this.color, x: 700, y: this.y, text: {
            text: 'o', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        P: {
          rect: true, w: 50, h: 50, color: this.color, x: 750, y: this.y, text: {
            text: 'p', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        Q: {
          rect: true, w: 50, h: 50, color: this.color, x: 800, y: this.y, text: {
            text: 'q', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        R: {
          rect: true, w: 50, h: 50, color: this.color, x: 850, y: this.y, text: {
            text: 'r', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        S: {
          rect: true, w: 50, h: 50, color: this.color, x: 900, y: this.y, text: {
            text: 's', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        T: {
          rect: true, w: 50, h: 50, color: this.color, x: 950, y: this.y, text: {
            text: 't', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        U: {
          rect: true, w: 50, h: 50, color: this.color, x: 1000, y: this.y, text: {
            text: 'u', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        V: {
          rect: true, w: 50, h: 50, color: this.color, x: 1050, y: this.y, text: {
            text: 'v', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        W: {
          rect: true, w: 50, h: 50, color: this.color, x: 1100, y: this.y, text: {
            text: 'w', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        X: {
          rect: true, w: 50, h: 50, color: this.color, x: 1150, y: this.y, text: {
            text: 'x', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        Y: {
          rect: true, w: 50, h: 50, color: this.color, x: 1200, y: this.y, text: {
            text: 'y', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
        Z: {
          rect: true, w: 50, h: 50, color: this.color, x: 1250, y: this.y, text: {
            text: 'z', color: this.textColor, textAlign: this.textAlign, fontSize: 30
          }
        },
      }
    }
  };

}