<!--
    /**
     * 数据备份日志表格
     * 调用示例：
     * <backup-table></backup-table>
     */
-->
<template>
  <div class="backup-cont">
    <transition name="el-zoom-in-top">
      <el-form v-show="searchShow" v-model="queryCondition" :inline="true" size="mini">
        <el-form-item label="备份类型" class="filter-item-margin" v-if="serverInfo.ip=='localhost'">
          <dict-select
            :dict-type="typeOptions"
            v-model="queryCondition.type"
            filterable clearable
            @change="conditionInput">
          </dict-select>
        </el-form-item>
        <el-form-item label="状态" class="filter-item-margin">
          <dict-select :dict-type="statusOptions"
                       v-model="queryCondition.status"
                       filterable clearable
                       @change="conditionInput">
          </dict-select>
        </el-form-item>
        <el-form-item label="日期" class="filter-item-margin">
          <el-date-picker
            v-model="queryCondition.operTime"
            type="daterange"
            align="right"
            unlink-panels
            :default-time="['00:00:00', '23:59:59']"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="conditionInput">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button  icon="el-icon-back" size="mini" @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
    </transition>
    <el-row :gutter="10">
      <el-button-group style="position:absolute;top:-50px;right:7px;">
        <el-button icon="iconfont icon-chaxun" :title="searchShow ? '关闭查询': '打开查询'" size="mini" @click="searchShow = !searchShow"></el-button>
        <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getTableData"></el-button>
      </el-button-group>
    </el-row>
    <div>
      <el-table
        :header-cell-style="getHeaderStyle"
        :data="tableData"
        @sort-change="sortChange"
        @selection-change="selectionChange">
        <el-table-column
          width="55"
          type="selection"
          v-if="false"
        >
        </el-table-column>
        <el-table-column
          prop="backupName"
          label="文件名"
          :show-overflow-tooltip="true"
          min-width="100">
          <template slot-scope="scope">
            {{scope.row.fileName}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="50">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == '0'? 'success' : 'danger'" size="mini" v-if="!(scope.row.status == '2')">{{scope.row.status|dictFilter('sys_backup_status')}}</el-tag>
            <el-progress :percentage="backupPercent" v-else></el-progress>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="备份类型"
          v-if="serverInfo.ip=='localhost'"
          :show-overflow-tooltip="true"
          min-width="50">
          <template slot-scope="scope">
            {{scope.row.type|dictFilter('sys_backup_type')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="operTime"
          label="时间"
          :show-overflow-tooltip="true"
          sortable="custom"
          min-width="120">
        </el-table-column>
        <el-table-column
          min-width="50"
          label="操作"
          prop="id">
          <template slot-scope="scope">
            <div>
              <el-button
                size="mini"
                plain
                type="primary"
                v-if="(!(scope.row.status == '1'))&&serverInfo.ip=='localhost'"
                :disabled="!(scope.row.status == '0')"
                v-hasPerm="'LOG_BACKUP_DOWNFILE_B'|| ''"
                @click="uploadBackup(scope.row.infoId,scope.row.fileName)">
                下载
              </el-button>
              <el-button
                size="mini"
                plain
                type="primary"
                v-if="scope.row.status == '0'&&serverInfo.ip!=='localhost'"
                @click="serverDetail(scope.row)">
                详情
              </el-button>
              <el-button
                size="mini"
                plain
                type="warning"
                v-if="scope.row.status == '1'"
                @click="openErrorLog(scope.row)">
                失败日志
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--翻页组件-->
      <el-pagination style="margin-top: 15px;"
                     :align="pagination.align"
                     :background="pagination.background"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="pagination.current"
                     :page-sizes="pagination.pageSizes"
                     :page-size="pagination.size"
                     :layout="pagination.layout"
                     :total="pagination.totalCount">
      </el-pagination>
      <!--失败日志弹框-->
      <el-dialog
        title="失败日志"
        :visible.sync="dialogVisible"
        width="40%"
      >
        <el-input
          type="textarea"
          v-model="errorLog"
          :readonly="true"
          v-if="dialogVisible">

        </el-input>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="clickCopy">复制日志</el-button>
          </span>
      </el-dialog>
      <!--详情弹框-->
      <el-dialog
        title="备份详情"
        :visible.sync="detailDialogVisible"
        width="30%"
      >
        <div class="detailDialog">
          文件{{fileName}}已从主节点备份到{{serverInfo.ip}},备份路径为：/home/{{fileName}}
          <span @click="skipToDownload" style="color:#409EFF;cursor:pointer">点击前往下载</span>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="detailDialogVisible = false">取消</el-button>
          </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import pagination from 'mixins/pagination.js'
  import DictSelect from 'components/form-input/dict-select'
  import { LogBackupList,BackupFileDownload,BackupFileList} from 'request/services/data-backup.js'
  // import basePage from 'mixins/base-page.js'
  import debounce from 'utils/debounce.js'
  import dataFormatFnList from 'utils/dateFormat.js'
  import { exportFile } from 'request/services/download.js'
  import {forEach} from 'lodash'
  import merge from 'element-ui/src/utils/merge';

  export default {
    name: 'backup-table',
    mixins: [pagination],
    components: { DictSelect },
    props: {
      getTable:{
        type:Boolean,
        default:false
      },
      serverInfo:{
        type:Object,
        default:()=>{
          return {}
        }
      }
    },
    data () {
      return {
        statusOptions: 'sys_backup_status',
        typeOptions: 'sys_backup_type',
        timeOptionRange:'',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = dataFormatFnList.getPresentTime()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 6)
              end.setTime(end.getTime() + 3600 * 1000 * 24  - 1000)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = dataFormatFnList.getPresentTime()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 29)
              end.setTime(end.getTime() + 3600 * 1000 * 24  - 1000)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = dataFormatFnList.getPresentTime()
              const start = new Date()
              start.setTime(end.getTime() - 3600 * 1000 * 24 * 89)
              end.setTime(end.getTime() + 3600 * 1000 * 24  - 1000)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        searchShow: true,
        // 检索条件
        queryCondition: {
          ip:'',
          type: '',
          status: '',
          operTime: []
        },
        // 排序条件
        sortParam: {
          orderDesc: ['operTime'],
          orderAsc: []
        },
        selectionData: [],
        selectionDataIds: [],
        tableData: [],
        errorLog:'',
        dialogVisible:false,
        backupPercent:60,
        inter:null,
        detailDialogVisible:false,
        fileName:''
      }
    },
    watch:{
      getTable(newVal,oldVal){
        if(newVal){
          this.getTableData()
        }
      }
    },
    methods: {
      openErrorLog(data){
        this.dialogVisible = true;
        this.errorLog = data.msg
      },
      getHeaderStyle: function ({ row, rowIndex }) {
        return {
          background: '#F0F2F5'
        }
      },
      getTableData: function () {
        clearInterval(this.inner)
        if(this.serverInfo.ip == 'localhost'){
          var condition = Object.assign({}, this.paginationParams, this.sortParam, this.queryCondition)
          LogBackupList(condition).then(res => {
            this.tableData = res.data.list
            forEach(this.tableData,(item,index)=>{
              if(item.status === '2'){
                this.inter = setTimeout(()=>{
                  this.getTableData()
                },10000)
              }
            })
            this.pagination.totalCount = res.data.totalCount
            this.$emit('over')
          })
        }else{
          this.$set(this.queryCondition,'ip',this.serverInfo.ip)
          this.$delete(this.queryCondition,'type')
          var condition = Object.assign({}, this.paginationParams, this.sortParam, this.queryCondition)
          BackupFileList(condition).then(res => {
            this.tableData = res.data.list
            this.pagination.totalCount = res.data.totalCount
          })
        }
      },
      getPageData () {
        this.getTableData()
      },
      // 查询
      conditionInput: function (e) {
        if (this.queryCondition.operTime && this.queryCondition.operTime.length > 0) {
          this.queryCondition.operTime[0] = dataFormatFnList.timeFormat(this.queryCondition.operTime[0])
          this.queryCondition.operTime[1] = dataFormatFnList.timeFormat(this.queryCondition.operTime[1])
        }

        var that = this
        // 防止每次输入都会触发查询事件
        debounce(function () {
          that.resetCurrentPage()
          that.getTableData()
        }, 500)()
      },
      // 当表格的排序条件发生变化的时候会触发该事件
      sortChange (val) {
        if (!val.prop) {
          return
        }
        this.sortParam.orderDesc = []
        this.sortParam.orderAsc = []
        if (val.order === 'descending') {
          this.sortParam.orderDesc.push(val.prop)
        } else {
          this.sortParam.orderAsc.push(val.prop)
        }
        this.resetCurrentPage()
        this.getTableData()
      },
      selectionChange: function (selections) {
        this.selectionData = selections
        this.selectionDataIds = this.selectionData.map(item => {
          return item.operId
        })
      },
      //下载
      uploadBackup(id,name){
        let _index = name.indexOf('.');
        let fileName = name.slice(0, _index);
        let fileType = name.slice(_index + 1);
        BackupFileDownload(id).then(res => {
          exportFile(res, fileType, fileName);
          return this
        })
      },
      //复制
      copyText(text) {
        var textarea = document.createElement("input");//创建input对象
        var currentFocus = document.activeElement;//当前获得焦点的元素
        document.body.appendChild(textarea);//添加元素
        textarea.value = text;
        textarea.focus();
        if(textarea.setSelectionRange)
          textarea.setSelectionRange(0, textarea.value.length);//获取光标起始位置到结束位置
        else
          textarea.select();
        try {
          var flag = document.execCommand("copy");//执行复制
        } catch(eo) {
          var flag = false;
        }
        document.body.removeChild(textarea);//删除元素
        currentFocus.focus();
        return flag;
      },
      clickCopy(){
        let str= this.errorLog;//获取文本
        let flag = this.copyText(str); //传递文本
        if(flag){
          this.$notify({
            message: '复制成功',
            type: 'success',
            offset: 120
          })
          // this.dialogVisible = false
        }else{
          this.$notify({
            message: '复制失败',
            type: 'error',
            offset: 120
          })
        }
      },
      serverDetail(file){
        this.detailDialogVisible = true
        this.fileName = file.fileName
      },
      skipToDownload(){
        let param = {
          ip:'localhost'
        }
        this.$router.push({name: 'backup-list', query: {serverInfo: JSON.stringify(param)}})
      },
      goBack () {
        this.$router.push({ name: 'data-backup' })
      }
    },
    mounted: function () {
      this.$nextTick(function() {
        this.getTableData()
      })
    },
    beforeDestroy(){
      clearInterval(this.interval)
    }
  }
</script>

<style scoped>
  .backup-cont{
    position: relative;
  }
  .detailDialog{
    line-height:40px;
    text-indent: 20px;
    font-size:15px;
  }
</style>
