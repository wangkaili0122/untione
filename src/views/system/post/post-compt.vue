<!--
     /**
      * 岗位组件，提供岗位选择的功能
      * @desc 组件描述
      * @example 调用示例
      *  <post-compt></post-compt>
      */
       -->
<template>
  <div class="postCompt">
    <el-checkbox-group v-model="checkedPosts" @change="handleCheckedPostsChange">
      <el-checkbox v-for="post in posts" :label="post.postId" :key="post.postId">{{post.postName}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
  export default {
    name: 'post-compt',
    data () {
      return {
        posts: [],
        checkedPosts: []
      }
    },
    created () {
      this.getPosts()
    },
    methods: {
      getPosts () {
        this.posts = [{
          postId: 1,
          postName: '董事长'
        }, {
          postId: 2,
          postName: '项目经理'
        }, {
          postId: 3,
          postName: '人力资源'
        }, {
          postId: 4,
          postName: '普通员工'
        }]
      },
      handleCheckedPostsChange (value) {

      },
      getCheckedPosts () {
        return JSON.parse(JSON.stringify( this.checkedPosts))
      },
      setCheckedPosts (checkedPosts) {
        this.checkedPosts = checkedPosts
      },
      reset () {
        this.checkedPosts = []
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .postCompt{

  }
</style>
