<!--
     /**
      * 权限管理
      * @desc 组件描述
      * @example 调用示例
      *  <menus></menus>
      */
       -->
<template>
  <div class="content-wrapper">
    <transition name="el-zoom-in-top">
      <el-form v-show="searchShow" :inline="true" :model="formInlineData" label-position="right" size="mini" @submit.native.prevent>
        <el-form-item label="菜单名称" class="filter-item-margin">
          <el-input v-model="formInlineData.menuName"
                    placeholder="输入菜单名称检索"
                    clearable
                    @input="handleInputChange">
          </el-input>
        </el-form-item>
        <!--<el-form-item label="状态" class="filter-item-margin">-->
        <!--<dict-select dict-type="sys_menus_status"-->
        <!--v-model="formInlineData.visible"-->
        <!--placeholder="请选择"-->
        <!--filterable clearable  size="mini"-->
        <!--@change="handleSelectChange"-->
        <!--&gt;-->
        <!--</dict-select>-->
        <!--</el-form-item>-->
      </el-form>
    </transition>
    <!-- 操作按钮和控制按钮(控制列的显示和隐藏) -->
    <el-row :gutter="10" class="optBar">
      <el-button icon="el-icon-plus" type="primary" size="mini" @click="addHandle" v-hasPerm="'SYS_MENU_ADD_B'">新增</el-button>
      <el-button icon="iconfont-mini icon-Group-" plain type="primary" size="mini" :disabled="!batchVisible" @click="handleBatchVisiable" v-hasPerm="'SYS_MENU_BATCH_SHOW_B'"> 显示</el-button>
      <el-button icon="iconfont-mini icon-yincang" plain type="primary" size="mini" :disabled="!batchHide" @click="handleBatchHide" v-hasPerm="'SYS_MENU_BATCH_HIDE_B'"> 隐藏</el-button>
      <el-button-group style="float: right">
        <el-button :icon="expandAll ? 'iconfont icon-shouqi1': 'iconfont icon-zhankai1'" size="mini" :title="expandAll ? '收缩列表' :  '展开列表'" @click="expandAll = !expandAll"></el-button>
        <el-button icon="iconfont icon-chaxun" :title="searchShow ? '关闭查询': '打开查询'" size="mini" @click="searchShow = !searchShow"></el-button>
        <el-button icon="iconfont icon-shuaxin2" size="mini" title="刷新" @click="getTableData"></el-button>
        <!--<el-button icon="iconfont icon-ai-list" size="mini" title="选择列"></el-button>-->
      </el-button-group>
    </el-row>
    <!--菜单列表 treeTable-->
    <tree-table align="center"
                size="small"
                ref="MenuTable"
                style="font-size:14px;"
                :expand-on-row-click="true"
                :indent="indent"
                :empty-text="emptyText"
                :data="menusList"
                :default-expand-all="expandAll"
                :columns="columns"
                :default-children="childrenKey"
                @selection-change	="handleSelectionChange">
      <template slot="selection">
        <el-table-column type="selection" align="center" width="55"/>
      </template>
      <template slot="menuType" slot-scope="{scope}">
        <span :style="{'color': scope.row.menuType === 'C' ? 'sandybrown' : 'none'}">{{scope.row.menuType|dictFilter('sys_menu_type')}}</span>
      </template>
      <template slot="visible" slot-scope="{scope}">
        <el-tag :type="scope.row.visible == '0'? 'success' : 'info'" size="mini">{{scope.row.visible|dictFilter('sys_menus_status')}}</el-tag>
      </template>
      <template slot="menuIcon" slot-scope="{scope}">
        <img :src="scope.row.menuIcon ? (scope.row.menuIcon.indexOf('base64')>=0?scope.row.menuIcon:( $project.serverUrl +'/'+ scope.row.menuIcon)) : ''" alt="" class="menuIcon">
      </template>
      <template slot="operation" slot-scope="{scope}">
        <el-button @click="viewHandle(scope.row)" plain type="success" size="mini">详情</el-button>
        <el-button @click="updateHandle(scope.row)" plain type="primary" size="mini" v-hasPerm="'SYS_MENU_UPDATEBYID_B'">编辑</el-button>
        <el-button @click="deleteHandle(scope.row)" plain type="danger" size="mini" v-hasPerm="'SYS_MENU_DELETE_B'">删除</el-button>
      </template>
    </tree-table>

    <el-dialog :close-on-click-modal="false"
               :title="dialogTextMap[dialogStatus]"
               width="40%"
               :before-close="dialogClose"
               :visible.sync="dialogFormVisible"
    >
      <el-form :rules="rules" ref="add-menu-form-ref" :model="authorityData" size="small" label-position="right"
               label-width="120px" :disabled="dialogStatus === 'view'">
        <el-form-item label="类型：" prop="menuType">
          <dict-radio dict-type="sys_menu_type" v-model="authorityData.menuType" @change="menuTypeChange"></dict-radio>
        </el-form-item>
        <el-form-item label="菜单名称：" prop="menuName">
          <el-input placeholder="请输入菜单名称" v-model="authorityData.menuName" class="dialog-input-width"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单：" prop="parentId">
          <tree-select
            :width="200"
            :data="treeData"
            v-model="authorityData.parentId"
            :defaultProps="defaultProps"
            checkStrictly
            :nodeKey="menuNodeKey"
          >
          </tree-select>
        </el-form-item>
        <el-form-item label="菜单路由：" :prop="getRulesProp('webUrl')" v-show="authorityData.menuType !== 'F'">
          <el-select v-model="authorityData.webUrl" :allow-create="true" :filterable="true">
            <el-option
              v-for="item in menusOptions"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
          <span style="color: #ff5139;margin-left: 10px">
            (文件夹的路由可以手写，所有路由不允许重复)
          </span>
        </el-form-item>
        <el-form-item label="权限标识：" prop="funcIdArr">
          <tree-select
            :width="408"
            :data="permsTreeOptions"
            v-model="authorityData.funcIdArr"
            :multiple="true"
            :defaultProps="permsDefaultProps"
            checkStrictly
            :nodeKey="permsNodeKey"
          ><!-- :checkedKeys="permsCheckedKeys"  @popoverHide="permsPopoverHide"-->
          </tree-select>
        </el-form-item>
        <el-form-item label="排序值：" prop="orderNum">
          <el-input-number size="small" v-model.number="authorityData.orderNum"
                           controls-position="right" style="width: 150px;"
                           :min="0" :max="10000" placeholder="请输入排序值">
          </el-input-number>
        </el-form-item>
        <el-form-item v-if="authorityData.menuType !== 'F'" label="菜单图片：" prop="menuIcon">
          <pic-select v-model="authorityData.menuIcon" @change="menuIconChange"></pic-select>
        </el-form-item>
        <el-form-item v-if="authorityData.menuType !== 'F'" label="菜单图标：" prop="icon">
          <el-row>
            <el-col :span="24">
              <el-popover
                ref="iconListPopover"
                placement="bottom-start"
                trigger="click"
                popper-class="mod-menu__icon-popover">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in iconOptions"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === authorityData.icon }">
                    <span><i :class="'iconfont ' + item"></i></span>
                  </el-button>
                </div>
              </el-popover>
              <el-input v-model="authorityData.icon" v-popover:iconListPopover :readonly="true" placeholder="请选择菜单图标" class="icon-list__input dialog-input-width"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" placeholder="请输入备注" v-model="authorityData.remark" class="dialog-input-width"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClose" size="small" plain>取 消</el-button>
        <el-button type="primary" size="small" @click="saveData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import menuManagement from './menus.js';
  export default {
    ...menuManagement
  };
</script>

<style lang="stylus" scoped>
  .mod-menu__icon-list{
    max-height: 180px;
    overflow auto
    padding: 0;
    margin: -8px 0 0 -8px;
    .el-button {
      padding: 7px;
      margin: 8px 0 0 8px;
      span {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .mod-menu__icon-list{
    max-width 405px
  }
  .icon-list__input{
    .el-input__inner {
      cursor: pointer;
    }
  }
  .menuIcon{
    width: 28px;
    height:28px;
    vertical-align: bottom;
  }
</style>
