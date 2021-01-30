import { Lightning } from '@lightningjs/sdk'

export default class Letter extends Lightning.Component {

  _init() {
    this.tag('LetterMain').patch({ color: this.color, text: { text: this.buttonText, color: this.textColor, textAlign: this.textAlign } })
  }

  static _template() {
    return {
      Text: {
        LetterMain: {
          rect: true, w: 50, h: 50, color: '', x: '', y: '', text: {
            text: '', color: '', textAlign: '', fontSize: 30
          }
        }
      }
    }
  }
};
