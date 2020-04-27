<!--
     /**
      * 富文本编辑器
      * @desc 在quill-editor基础上增加了图片上传和缩放插件
      * @example 调用示例
      * <editor v-model="content"></editor>  双向绑定
      * <editor :content="content" @change="changeHandle"></editor> 单项绑定，可以侦听change事件
      * 建议该模块使用异步组件引入,以减少主包的大小，加快主页显示速度
      */
       -->
<template>
  <div>
    <!-- bidirectional data binding（双向数据绑定） -->
    <quill-editor :content="text_content"
                  v-on="$listeners"
                  v-bind="$attrs"
                  ref="myQuillEditor"
                  :options="editorOption"
                  @change="change"
                  @input="input"
                  @blur="onEditorBlur($event)"
                  @focus="onEditorFocus($event)"
                  @ready="onEditorReady($event)">
    </quill-editor>

    <!-- Or manually control the data synchronization（或手动控制数据流） -->
    <!--<quill-editor :content="content"-->
    <!--:options="editorOption"-->
    <!--@change="onEditorChange($event)">-->
    <!--</quill-editor>-->
    <div class="ql-snow" v-if="linkShow">
      <div class="ql-tooltip ql-editing" data-mode="link" :style="linkStyle" @click.stop="linkClick">
        <input type="text" data-formula="e=mc^2" data-link="https://quilljs.com" v-model="href" placeholder="请输入链接地址">
        <a class="ql-action" @click="saveLink"></a>
      </div>
    </div>
  </div>
</template>

<script>
  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import Auth from 'utils/auth'
  import {quillEditor, Quill} from 'vue-quill-editor'
  import {container, ImageExtend, QuillWatch} from 'quill-image-extend-module'
  import {ImageDrop} from 'quill-image-drop-module'
  import ImageResize from 'quill-image-resize-module'
  import BoldStyle from './plugins/boldstyle'
  import HeaderStyle from './plugins/headerstyle'

  Quill.register('modules/imageExtend', ImageExtend)
  Quill.register('modules/imageDrop', ImageDrop)
  Quill.register('modules/imageResize', ImageResize)


  Quill.register("formats/bold", BoldStyle, true);
  Quill.register("formats/header", HeaderStyle, true);
  export default {
    name: 'editor',
    components: {
      quillEditor
    },
    props: {
      content: {
        type: String
      },
      value: {
        type: String
      }
    },
    data() {
      var that=this
      return {
        text_content: this.content || this.value,
        linkShow: false,
        href: '',
        linkStyle: '',
        clickLink: false,
        editorOption: {
          theme: 'snow',
          boundary: document.body,
          modules: {
            imageDrop: true,
            imageExtend: {
              loading: true,
              name: 'file',
              // size: 2,
              action: this.$project.serverUrl + '/platform/file/add',
              response: (res) => {
                // console.log(res)
                return this.$project.serverUrl + '/' + res.data.filePath
              },
              headers: (xhr) => {
                // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
                var token = Auth.hasToken()
                if (token) { // 在这个地方如果使用store.getters获取不到token
                  xhr.setRequestHeader('access-token', token)
                } else {
                  console.warn('您尚未登录')
                }
              }, // 可选参数 设置请求头部
              start: () => {
              }, // 可选参数 自定义开始上传触发事件
              end: () => {
              }, // 可选参数 自定义上传结束触发的事件，无论成功或者失败
              error: (error) => {
                console.error(error)
              }, // 可选参数 自定义网络错误触发的事件
              change: (xhr, formData) => {
                formData.append('fileType', '1');
              } // 可选参数 选择图片触发，也可用来设置头部，但比headers多了一个参数，可设置formData
            },
            imageResize: {
              modules: ['Resize', 'DisplaySize', 'Toolbar']
            },
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{'header': 1}, {'header': 2}],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                [{'script': 'sub'}, {'script': 'super'}],
                [{'indent': '-1'}, {'indent': '+1'}],
                [{'direction': 'rtl'}],
                [{'size': ['small', false, 'large', 'huge']}],
                [{'header': [1, 2, false]}],
                [{'color': []}, {'background': []}],
                [{'font': []}],
                [{'align': []}],
                ['clean'],
                ['link', 'image', 'table']
              ],
              handlers: {
                'image': function () { // 劫持原来的图片点击按钮事件
                  QuillWatch.emit(this.quill.id)
                },
                'link': function(value) {
                  that.clickLink = true;
                  if (value) {
                    if (this.quill.getSelection() && this.quill.getSelection().length > 0) {
                      that.href = this.quill.getText().substr(this.quill.getSelection().index, this.quill.getSelection().length);
                      that.linkShow = true;
                    }
                  } else {
                    this.quill.format('link', false);
                  }
                }
              }
            }
          },
          placeholder: '请输入正文......',
          readOnly: false
        }
      }
    },
    // manually control the data synchronization
    // 如果需要手动控制数据同步，父组件需要显式地处理changed事件
    methods: {
      linkClick () {
        return false;
      },
      saveLink () {
        var href = this.href;
        if (href && href.indexOf('http://') != 0 && href.indexOf('https://') != 0 && href.indexOf('ftp://') != 0) {
          href = 'http://' + href;
        }
        this.$refs.myQuillEditor.quill.format('link', href);
        this.linkShow = false;
        this.href = '';
      },
      change({html, text, quill}) {
        // console.log(html, text, quill)
        this.$emit('change', {html, text, quill})
      },
      input(text) {
        // console.log('text', text)
        this.$emit('input', text)
      },
      onEditorBlur(quill) {
        // console.log('editor blur!', quill)
      },
      onEditorFocus(quill) {
        // console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        // console.log('editor ready!', quill)
      },
      onEditorChange({quill, html, text}) {
        // console.log('editor change!', quill, html, text)
        this.content = html
      }

    },
    mounted() {
      console.log('this is current quill instance object', this.editor)
      // 图片先上传到服务器再插入的方法
      // var toolbar = this.editor.getModule('toolbar')
      // toolbar.addHandler('image', function () {
      //   QuillWatch.emit(this.quill.id)
      // })
      var that=this
      this.$refs.myQuillEditor.quill.on('selection-change',function (range, oldRange, source) {
        var position = that.$refs.myQuillEditor.quill.getBounds(that.$refs.myQuillEditor.quill.selection.savedRange);
        var clientWidth = document.body.clientWidth || window.innerWidth;
        if (clientWidth - position.right > 320) {
          that.linkStyle = 'left:'+(position.left-140)+'px; top:'+(position.top+70)+'px;';
        } else {
          that.linkStyle = 'right: -20px; top:'+(position.top+70)+'px;';
        }
      });
      document.body.onclick = function() {
        if (that.clickLink) {
          that.clickLink = false;
          return false;
        }
        that.linkShow = false;
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      }
    },
    watch: {
      'value': function (newVal, oldVal) {
        this.text_content = newVal
      }
    }
  }
</script>

<style>
  .ql-snow .ql-picker-label::before {
    vertical-align: top;
  }

  .ql-picker-label svg {
    vertical-align: top;
  }

  .ql-snow .ql-tooltip::before {
    content: "链接地址:";
  }

  .ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
  }

  .ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
  }

  .ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
    position: relative;
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
  }

  .ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
  .ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
    position: relative;
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
  }

  .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
  .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';

  }

  .ql-snow .ql-picker.ql-font .ql-picker-label::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
    position: relative;
  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';

  }

  .ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
  .ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
  }

  /*按钮悬浮提示*/

  .ql-snow .ql-bold,
  .ql-snow .ql-italic,
  .ql-underline,
  .ql-strike,
  .ql-blockquote,
  .ql-code-block,
  .ql-header,
  .ql-list,
  .ql-script,
  .ql-indent,
  .ql-direction,
  .ql-color > .ql-picker-label,
  .ql-background > .ql-picker-label,
  .ql-align > .ql-picker-label,
  .ql-clean, .ql-link, .ql-image, .ql-video {
    position: relative;
  }

  .ql-snow .ql-bold:hover:before,
  .ql-snow .ql-italic:hover:before,
  .ql-underline:hover:before,
  .ql-strike:hover:before,
  .ql-blockquote:hover:before,
  .ql-code-block:hover:before,
  .ql-header:hover:before,
  .ql-list:hover:before,
  .ql-script:hover:before,
  .ql-indent:hover:before,
  .ql-direction:hover:before,
  .ql-color > .ql-picker-label:hover:before,
  .ql-background > .ql-picker-label:hover:before,
  .ql-align > .ql-picker-label:hover:before,
  .ql-clean:hover:before, .ql-link:hover:before, .ql-image:hover:before, .ql-video:hover:before {
    position: absolute;
    top: 25px;
    width: 30px;
    margin-left: -20px;
    background-color: black;
    color: white;
    font-size: 12px;
    padding: 5px;
    z-index: 1000;
    line-height: 20px;
  }

  .ql-snow .ql-bold:hover:before {
    content: '加粗';
  }

  .ql-snow .ql-italic:hover:before {
    content: '斜体';
  }

  .ql-snow .ql-underline:hover:before {
    content: '下划线';
    width: 40px;
    margin-left: -25px;
  }

  .ql-snow .ql-strike:hover:before {
    content: '删除线';
    width: 40px;
    margin-left: -25px;
  }

  .ql-snow .ql-blockquote:hover:before {
    content: '引用';
  }

  .ql-snow .ql-code-block:hover:before {
    content: '代码';
  }

  .ql-snow .ql-header[value='1']:hover:before {
    content: '一级标题';
    width: 50px;
    margin-left: -30px;
  }

  .ql-snow .ql-header[value='2']:hover:before {
    content: '二级标题';
    width: 50px;
    margin-left: -30px;
  }

  .ql-snow .ql-header[value='3']:hover:before {
    content: '三级标题';
    width: 50px;
    margin-left: -30px;
  }

  .ql-snow .ql-list[value='ordered']:hover:before {
    content: '编号';
  }

  .ql-snow .ql-list[value='bullet']:hover:before {
    content: '项目符号';
    width: 50px;
    margin-left: -30px;
  }

  .ql-snow .ql-script[value='sub']:hover:before {
    content: '下标';
  }

  .ql-snow .ql-script[value='super']:hover:before {
    content: '上标';
  }

  .ql-snow .ql-indent[value='-1']:hover:before {
    content: '减少缩进';
    width: 50px;
    margin-left: -30px;
  }

  .ql-snow .ql-indent[value='+1']:hover:before {
    content: '增加缩进';
    width: 50px;
    margin-left: -30px;
  }

  .ql-snow .ql-direction[value='rtl']:hover:before {
    content: '文本方向';
    width: 50px;
    margin-left: -30px;
  }

  .ql-snow .ql-color > .ql-picker-label:hover:before {
    content: '文本颜色';
    width: 50px;
    top: 25px;
    top: 24px;

  }

  .ql-snow .ql-background > .ql-picker-label:hover:before {
    content: '背景颜色';
    width: 50px;
    top: 24px;

  }

  .ql-align > .ql-picker-label:hover:before {
    content: '文本对齐';
    width: 50px;
    top: 24px;
  }

  .ql-snow .ql-clean:hover:before {
    content: '清除格式';
    width: 50px;
    margin-left: -30px;
  }

  .ql-snow .ql-link:hover:before {
    content: '超链接';
    width: 40px;
    margin-left: -25px;
  }

  .ql-snow .ql-image:hover:before {
    content: '插入图片';
    width: 50px;
    margin-left: -30px;
  }

  .ql-snow .ql-video:hover:before {
    content: '插入视频';
    width: 50px;
    margin-left: -30px;
  }

  .quill-editor .ql-container.ql-snow .ql-tooltip a.ql-action:after {
    content: '保存';
  }

  .quill-editor .ql-container.ql-snow .ql-tooltip a.ql-remove:before {
    content: '删除';
  }
  .quill-editor .ql-tooltip{
    z-index: 1;
  }
  .quill-editor .ql-tooltip  a.ql-preview{
    vertical-align: middle;
  }

</style>
