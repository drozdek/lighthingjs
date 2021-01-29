import { Lightning } from '@lightningjs/sdk'

export class Letter extends Lightning.Component {

  _construct(letter){
    // super();
    this.letter = letter
  }

  static _template() {
    return {      
      y: 50,
      x: 50,
      Text: {
        text: {
          text: 'Letter',
          textColor: 0xffff00ff,
          textAlign: 'left',
          fontSize: 30
        }
      }
    }
  }
};

// const options = {stage: {w: window.innerWidth, h: window.innerHeight, useImageWorker: false}};
