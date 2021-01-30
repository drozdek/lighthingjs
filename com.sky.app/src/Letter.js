import { Lightning } from '@lightningjs/sdk'

export default class Letter extends Lightning.Component {

  _init() {
    this.tag('LetterMain').patch({ text: { text: this.buttonText } })
  }

  static _template() {
    return {
      Text: {
        LetterMain: {
          rect: true, w: 50, h: 50, color: 0xff005500, x: 150, y: 70, text: {
            text: 'd', color: 0xaaaaaaaa, textAlign: 'center', fontSize: 30
          }
        }
      }
    }
  }
};
