import { Lightning } from '@lightningjs/sdk'

export default class Letter extends Lightning.Component {

  _init() {
    this.tag('LetterMain').patch({ text: {  color: this.color, text: this.buttonText, color: this.textColor, textAlign: this.textAlign } })
  }

  static _template() {
    return {
      Text: {
        LetterMain: {
          rect: true, w: 50, h: 50, color: 0xff005500, x: '', y: '', text: {
            text: '', color: 0xaaaaaaaa, textAlign: 'center', fontSize: 30
          }
        }
      }
    }
  }
};
