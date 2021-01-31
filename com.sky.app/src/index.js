import { Lightning, Utils } from '@lightningjs/sdk'
import Letter from './Letter';

export default class App extends Lightning.Application {

  _handleLeft() {
    this._setState('HandleLeftKeyClick');
    this.handleLeft();
  }

  _handleRight() {
    this._setState('HandleRightKeyClick')
    this.handleRight();
  }

  _handleUp() {
    console.log()
  }

  static _states() {
    return [
      class HandleLeftKeyClick extends this {
        _getFocused() {
          return this.tag('HandleLeftKeyClick');
        }
      },

      class HandleRightKeyClick extends this {
        _getFocused(event) {
          return this.tag('HandleRightKeyClick');
        }
      }
    ]
  }

  /**
   * @method _init
   */
  _init() {
    console.clear();
    console.log('Starting Sky App...')

  }

  /**
   * @method handleClick
   * @returns {int} elemPosX
   */
  handleClick() {
    let elemPosX = this.tag('LetterList').getSmooth('x');
    return elemPosX
  }

  /**
   * @method handleLeft - deals with the left arrow click
   */
  handleLeft() {
    let elemPosX = Math.ceil(this.handleClick() - 50);
    this.tag('LetterList').setSmooth("x", elemPosX);
    this.currentXPos = elemPosX;
    this.getLetter();
  }

  /**
   * @method handleRight - deals with the right arrow click
   */
  handleRight() {
    let elemPosX = Math.ceil(this.handleClick() + 50);
    this.tag('LetterList').setSmooth("x", elemPosX);
    this.currentXPos = elemPosX;
    this.getLetter();
  }

  /**
   * @method handleLeft - deals with the left arrow click
   */
  static _captureKey(key) {
    return this.tag(this.state)
  }

  /**
   * @method getLetter - gets letter on the left arrow click
   * @returns {string} this.letterSelected
   */
  getLetter() {
    const lettersArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    if (this.currentXPos < 0) {
      this.currentXPos = this.currentXPos * -1;
      console.log(this.currentXPos);
      let arrayIndex = lettersArr[this.currentXPos / 50];
      this.letterSelected = arrayIndex;
      console.log('arrayIndex: ' + this.letterSelected);
      return this.letterSelected
    }
    else {
      // prevent from overscrolling 
      this.tag('LetterList').setSmooth("x", 0)
    }

  }

  static _template() {
    this.y = 120;
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
          type: Letter, buttonText: 'a', color: this.textColor, textAlign: this.textAlign, x: 0, y: 120
        },
        B: {
          type: Letter, buttonText: 'b', color: this.textColor, textAlign: this.textAlign, x: 50, y: this.y
        },
        C: {
          type: Letter, buttonText: 'c', color: this.textColor, textAlign: this.textAlign, x: 100, y: this.y
        },
        D: {
          type: Letter, buttonText: 'd', color: this.textColor, textAlign: this.textAlign, x: 150, y: this.y
        },
        E: {
          type: Letter, buttonText: 'e', color: this.textColor, textAlign: this.textAlign, x: 200, y: this.y
        },
        F: {
          type: Letter, buttonText: 'f', color: this.textColor, textAlign: this.textAlign, x: 250, y: this.y
        },
        G: {
          type: Letter, buttonText: 'g', color: this.textColor, textAlign: this.textAlign, x: 300, y: this.y
        },
        H: {
          type: Letter, buttonText: 'h', color: this.textColor, textAlign: this.textAlign, x: 350, y: this.y
        },
        I: {
          type: Letter, buttonText: 'i', color: this.textColor, textAlign: this.textAlign, x: 400, y: this.y
        },
        J: {
          type: Letter, buttonText: 'j', color: this.textColor, textAlign: this.textAlign, x: 450, y: this.y
        },
        K: {
          type: Letter, buttonText: 'k', color: this.textColor, textAlign: this.textAlign, x: 500, y: this.y
        },
        L: {
          type: Letter, buttonText: 'l', color: this.textColor, textAlign: this.textAlign, x: 550, y: this.y
        },
        M: {
          type: Letter, buttonText: 'm', color: this.textColor, textAlign: this.textAlign, x: 600, y: this.y
        },
        N: {
          type: Letter, buttonText: 'n', color: this.textColor, textAlign: this.textAlign, x: 650, y: this.y
        },
        O: {
          type: Letter, buttonText: 'o', color: this.textColor, textAlign: this.textAlign, x: 700, y: this.y
        },
        P: {
          type: Letter, buttonText: 'p', color: this.textColor, textAlign: this.textAlign, x: 750, y: this.y
        },
        Q: {
          type: Letter, buttonText: 'q', color: this.textColor, textAlign: this.textAlign, x: 800, y: this.y
        },
        R: {
          type: Letter, buttonText: 'r', color: this.textColor, textAlign: this.textAlign, x: 850, y: this.y
        },
        S: {
          type: Letter, buttonText: 's', color: this.textColor, textAlign: this.textAlign, x: 900, y: this.y
        },
        T: {
          type: Letter, buttonText: 't', color: this.textColor, textAlign: this.textAlign, x: 950, y: this.y
        },
        U: {
          type: Letter, buttonText: 'u', color: this.textColor, textAlign: this.textAlign, x: 1000, y: this.y
        },
        V: {
          type: Letter, buttonText: 'v', color: this.textColor, textAlign: this.textAlign, x: 1050, y: this.y
        },
        W: {
          type: Letter, buttonText: 'w', color: this.textColor, textAlign: this.textAlign, x: 1100, y: this.y
        },
        X: {
          type: Letter, buttonText: 'x', color: this.textColor, textAlign: this.textAlign, x: 1150, y: this.y
        },
        Y: {
          type: Letter, buttonText: 'y', color: this.textColor, textAlign: this.textAlign, x: 1200, y: this.y
        },
        Z: {
          type: Letter, buttonText: 'z', color: this.textColor, textAlign: this.textAlign, x: 1250, y: this.y
        }
      }
    }
  };

}

// to deal with key pressing we must add stagingn options to the
const options = { stage: { w: window.innerWidth, h: window.innerHeight, useImageWorker: false } }
// options.keys = {
//     38: "Up",
//     40: "Down"
// };
const app = new App(options);
document.body.appendChild(app.stage.getCanvas());

// by default is sets h: 1920 w:1080