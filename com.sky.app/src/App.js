import { Lightning, Utils } from '@lightningjs/sdk'
import  Letter  from './Letter';

export default class App extends Lightning.Component {

  _handleLeft() {
    this.handleLeft();

    // call state    
    // this._setState('HandleLeftKeyClick');
  }

  _handleRight() {
    this.handleRight();

    // call state
    // this._setState('HandleRightKeyClick')
  }

  // _captureKey(key){

  // }

//   _handleInsert(key){
// alert('handlekey' + key)
//   }

  // code dealing with the states - this doesn't allow to perform repetative operations
  // ie: pressing the same key multiple times
  // therfore a 'normal' js solution is being applied

  // static _states() {
  //   return [
  //     class HandleLeftKeyClick extends this {
  //       $enter(event) {
  //         console.log('on left enter...')
  //         let elem = this.tag('LetterList');
  //         let elemPosX = Math.ceil(elem.getSmooth('x') - 50);
  //         elem.setSmooth("x", elemPosX);
  //         this.currentXPos = elemPosX;      
  //         this.getLetter();    
  //       }
  //       $exit(event) {
  //       }
  //     },

  //     class HandleRightKeyClick extends this {
  //       $enter(event) {
  //         console.log('on right enter...')
  //         let elem = this.tag('LetterList');
  //         let elemPosX = Math.ceil(elem.getSmooth('x') + 50);
  //         elem.setSmooth("x", elemPosX);
  //         this.currentXPos = elemPosX;          
  //         this.getLetter();
  //       }
  //       $exit(event) {
  //       }
  //     }
  //   ]
  // }

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
        A:{ 
          type: Letter, buttonText: 'a', color: this.textColor, textAlign: this.textAlign, x: 0, y: 120 
        }
        // A: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 0, y: this.y, text: { text: 'a', color: this.textColor, textAlign: this.textAlign, fontSize: 30 }
        // },
        // B: {
        //   rect: true, w: 50, h: 50, color: this.color, border: true, x: 50, y: this.y, text: {
        //     text: 'b', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // C: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 100, y: this.y, text: {
        //     text: 'c', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // D: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 150, y: this.y, text: {
        //     text: 'd', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // E: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 200, y: this.y, text: {
        //     text: 'e', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // F: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 250, y: this.y, text: {
        //     text: 'f', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // G: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 300, y: this.y, text: {
        //     text: 'g', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // H: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 350, y: this.y, text: {
        //     text: 'h', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // I: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 400, y: this.y, text: {
        //     text: 'i', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // J: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 450, y: this.y, text: {
        //     text: 'j', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // K: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 500, y: this.y, text: {
        //     text: 'k', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // L: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 550, y: this.y, text: {
        //     text: 'l', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // M: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 600, y: this.y, text: {
        //     text: 'm', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // N: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 650, y: this.y, text: {
        //     text: 'n', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // O: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 700, y: this.y, text: {
        //     text: 'o', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // P: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 750, y: this.y, text: {
        //     text: 'p', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // Q: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 800, y: this.y, text: {
        //     text: 'q', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // R: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 850, y: this.y, text: {
        //     text: 'r', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // S: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 900, y: this.y, text: {
        //     text: 's', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // T: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 950, y: this.y, text: {
        //     text: 't', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // U: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 1000, y: this.y, text: {
        //     text: 'u', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // V: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 1050, y: this.y, text: {
        //     text: 'v', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // W: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 1100, y: this.y, text: {
        //     text: 'w', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // X: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 1150, y: this.y, text: {
        //     text: 'x', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // Y: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 1200, y: this.y, text: {
        //     text: 'y', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
        // Z: {
        //   rect: true, w: 50, h: 50, color: this.color, x: 1250, y: this.y, text: {
        //     text: 'z', color: this.textColor, textAlign: this.textAlign, fontSize: 30
        //   }
        // },
      }

    }
  };

}

// to deal with key pressing we must add stagingn options to the
// const options = {stage: {w: window.innerWidth, h: window.innerHeight, useImageWorker: false}}
// options.keys = {
//     38: "Up",
//     40: "Down"
// };
// const app = new BasicUsageExample(options);
// document.body.appendChild(app.stage.getCanvas());

// by default is sets h: 1920 w:1080