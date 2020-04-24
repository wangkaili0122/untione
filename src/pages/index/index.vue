<!--
/**
  * @desc 组件描述
  * @author 21086
  * @data 2020/4/24
  * @example 调用示例
  * <index></index>
  */
-->
<template>
  <div id="app" :class="this.$store.status.theme.theme">
    <router-view></router-view>
  </div>
</template>

<script>
    export default {
        name: "index",
      data(){
          return{

          }
      },
      mounted(){
        // 解决在IE11上无法用router-link和a标签跳转问题，主要是当url的hash change的时候浏览器没有做出反应。里面主要是做了一个兼容。
        // 这个兼容就是当检测到浏览器为IE的时候，手动给url加一个hashchange事件。
        function checkIE(){
          return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
        }
        if (checkIE()) {
          window.addEventListener('hashchange', () => {
            var currentPath = window.top.location.hash.slice(1);
            if (this.$route.path !== currentPath) {
              this.$router.push(currentPath)
            }
          }, false)
        }
      },
      methods:{

      },
      created() {
      }
    }
</script>

<style lang="stylus" scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100%;
    height: 100%;
    min-width 1400px
    min-height 745px
    overflow auto
  }

</style>
