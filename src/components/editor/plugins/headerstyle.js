/**
 * quill默认加粗使用strong，但是<strong>的样式被reset.css重写了
 * 所以对bold模块改为使用css样式控制加粗
 */
import { Quill} from 'vue-quill-editor'
let Block = Quill.import('blots/block')
class Header extends Block {
  static formats(domNode) {
    var fontSize='2em'
    switch (this.tagName.indexOf(domNode.tagName)+1) {
      case 1:
        fontSize='2em'
        break
      case 2:
        fontSize='1.5em'
        break
      case 3:
        fontSize='1.2em'
        break
      case 4:
        fontSize='0.9em'
        break
      default :
        fontSize='100%'
        break
    }
    domNode.style.fontSize=fontSize
    return this.tagName.indexOf(domNode.tagName) + 1;
  }
}
Header.blotName = 'header';
Header.tagName = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];


export default Header;
