<!--
    /**
     *  系统标题栏
     */
-->
<template>
  <div class="vheader">
      <span class="logo-content">
       <img class="logo" src="../../assets/logo.png" alt="logo">
        <span class="headline">{{projectName}}</span>
      </span>
    <el-menu :default-active="defaultActive"
             class="header-menu"
             mode="horizontal"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b"
             @select="handleSelect">
      <template v-for="(menu,index) in menus">
        <template v-if="menu.childrenList && menu.childrenList.length>0">
          <el-submenu v-if="menu.funcKey != null" :index="menu.funcKey" :key="index">
            <template slot="title">
              <i :class="menu.icon"></i>
              <span slot="title">{{menu.menuName}}</span>
            </template>

            <template v-for="(submenu,subindex) in menu.childrenList">
              <el-menu-item v-if="menu.funcKey != null" :index="submenu.funcKey" :key="subindex">
                <i :class="submenu.icon"></i>
                <span slot="title">{{submenu.menuName}}</span>
              </el-menu-item>
            </template>

          </el-submenu>
        </template>

        <template v-else>
          <el-menu-item v-if="menu.funcKey != null" :index="menu.funcKey" :key="index">
            <i :class="menu.icon"></i>
            <span slot="title">{{menu.menuName}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'header',
    props: {
      defaultActive: {
        required: true,
        type: String,
        default() {
          return ''
        }
      },
      menus: {
        type: Array,
        default(){
          return []
        }
      }
    },
    data() {
      return {
        projectName:'统一平台'
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        this.$router.push({
          name: key,
          query: {}
        })
      }
    }
  }
</script>
<style lang="stylus" scoped>
  .vheader {
    position: absolute;
    min-width: 1200px;
    top: 0;
    z-index: 1020;
    box-sizing: border-box;
    padding: 0 20px;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: #545c64;
    .logo-content {
      position: relative;
      display: inline-block;
      font-size: 20px;
      color: #a3a3a3;
      text-decoration: none;
      float: left;
      .logo {
        position: absolute;
        top: 12px;
        left: 10px;
        margin-right: 5px;
        width: 35px;
        height: 35px;
      }
      .headline {
        color: #f7f7f7;
        margin-left: 50px;
        text-decoration: none;
      }
    }
    .header-menu {
      display: inline-block;
      float: left;
      margin-left: 100px;
      height: 100%;
      border-bottom: none;
      background: #1f2e49;
      li {
        height: 100%;
      }
    }

  }

</style>
