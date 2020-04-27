/**
 * quill默认加粗使用strong，但是<strong>的样式被reset.css重写了
 * 所以对bold模块改为使用css样式控制加粗
 */
import { Quill} from 'vue-quill-editor'
let Parchment = Quill.import('parchment')

class BoldStyleAttributor extends Parchment.Attributor.Style {
  value(domNode) {
    let value = super.value(domNode);
    return value;
  }
  add(node, value) {
    node.style.fontWeight='bold'
    return true;
  }
  remove(node) {
    node.style.fontWeight='normal'
  }
}

let BoldStyle = new BoldStyleAttributor('bold', 'font-weight', {
  scope: Parchment.Scope.INLINE,
  whitelist: [true, false]
});

export default BoldStyle
