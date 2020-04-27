
<template>
  <div class="monitor-wrapper">
    <el-row :gutter="15">
      <el-col :xs="24" :sm="12" :lg="12">
        <div class="content-div">
          <div class="title">
            <i class="iconfont icon-yingyong2 title-icon"></i>
            <span>应用中心接入类型统计</span>
          </div>
          <access-type height="300px" :manageTypeId="manageTypeId"></access-type>
        </div>
      </el-col>
      <!-- <el-col :xs="24" :sm="12" :lg="12">
         <div class="content-div">
           <div class="title">
             <i class="iconfont icon-yingyong2 title-icon"></i>
             <span>应用类型统计</span>
           </div>
           <app-type height="250px"></app-type>
         </div>
       </el-col>-->
      <el-col :xs="24" :sm="24" :lg="12">
        <div class="content-div">
          <div class="title">
            <i class="iconfont icon-yingyong2 title-icon"></i>
            <span>第三方应用访问TOP10用户</span>
          </div>
          <user-top height="300px"  :manageTypeId="manageTypeId"></user-top>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :lg="24">
        <div class="content-div">
          <div class="title">
            <i class="iconfont icon-yingyong2 title-icon"></i>
            <span>第三方应用访问次数</span>
          </div>
          <app-hits height="300px" width="100%"  :manageTypeId="manageTypeId"></app-hits>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="15">
      <el-col :xs="24" :sm="12" :lg="12">
        <div class="content-div">
          <div class="title">
            <i class="iconfont icon-yingyong2 title-icon"></i>
            <span>周应用访问趋势</span>
          </div>
          <app-visited-trend height="300px" :manageTypeId="manageTypeId"></app-visited-trend>

        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="12">
        <div class="content-div">
          <div class="title">
            <i class="iconfont icon-yingyong2 title-icon"></i>
            <span>周站点访问趋势</span>
          </div>
          <websit-weekly-trend height="300px"></websit-weekly-trend>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
  const AccessType = () => import('./components/access-type.vue')
  const AppType = () => import('./components/app-type.vue')
  const UserTop = () => import('./components/user-top10.vue')
  const AppHits = () => import('./components/app-hits.vue')

  const AppVisitedTrend = () => import('./components/app-visited-trend.vue')
  const WebsitWeeklyTrend = () => import('./components/websit-weekly-trend.vue')

  export default {
    name: 'sys_app_statistics',
    components: { AccessType, AppType, UserTop, AppHits ,AppVisitedTrend,WebsitWeeklyTrend},
    data() {
      return {
        manageTypeId: 1
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .monitor-wrapper {
    .content-div {
      border: 1px solid #ccc
      border-radius: 4px
      margin-bottom: 15px
      padding: 0 20px 20px;
      overflow-y: auto;
      .title {
        width 100%
        height: 40px;
        line-height: 40px;
        font-size 16px;
        display: flex;
        display: -webkit-flex;
        justify-content: flex-start;
        /*border-bottom: 1px solid #ccc*/
        .title-icon{
          padding-right: 8px;
          color: #409EFF;
          font-size: 18px;
        }
      }
    }
  }
</style>
