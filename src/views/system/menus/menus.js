import TreeTable from 'components/tree-table';
import TreeSelect from 'components/tree-select.vue';
import PicSelect from 'components/form-input/pic-select'
import DictRadio from 'components/form-input/dict-radio'
import DictSelect from 'components/form-input/dict-select'
import {GetMenu, GetMenus, AddMenu, UpdateMenu, DeleteMenu, HideMenus, ShowMenus} from 'request/services/menu.js'
import {checkSpecialWord, checkSortNum} from 'utils/validate/validateRules.js'
import {GetFuncList} from 'request/services/func.js'
import iconfontList from 'assets/iconfont/class_list.js'
import recursion from 'utils/recursion.js'
import basePage from 'mixins/base-page'

export default {
  name: 'sys_menus',
  mixins: [basePage],
  components: {
    TreeTable,
    TreeSelect,
    PicSelect,
    DictRadio,
    DictSelect
  },
  data() {
    return {
      emptyText: '数据加载中...',
      menusList: [],
      searchShow: true,
      // 查询条件
      formInlineData: {
        menuName: '',
        // menuType: ''
      },
      // treeTable表头及列字段配置
      columns: [
        {
          label: '菜单名称',
          key: 'menuName',
          showOverflow: true,
          expand: true
        },
        {
          label: '菜单路由',
          key: 'webUrl',
          showOverflow: true
        },
        {
          label: '权限标识',
          key: 'funcIdArr',
          showOverflow: true,
          width: 300
        },
        {
          label: '菜单类型',
          key: 'menuType'
        },
        {
          label: '状态',
          key: 'visible',
          showOverflow: true
        },
        {
          label: '菜单图片',
          key: 'menuIcon'
        },
        {
          label: '操作',
          key: 'operation',
          width: 240
        }
      ],
      expandAll: true,
      indent: 20,
      childrenKey: 'childrenList', // treeTable 的子节点字段名
      authorityData: {
        webUrl: null
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogTextMap: {
        edit: '编辑菜单',
        add: '新增菜单',
        view: '查看详情'
      },
      // 父菜单树
      parentTreeData: [], // 存储父菜单树
      defaultProps: {
        children: 'childrenList',
        label: 'menuName'
      },
      menuNodeKey: 'menuId',
      defaultCheckedKeys: [],
      // 菜单路由
      routesDefaultProps: {
        children: 'children',
        label: 'name'
      },
      routesNodeKey: 'name',
      routesCheckedKeys: [],
      multipleSelection: [],
      batchVisible: false,
      batchHide: false,
      // 权限标识
      permsOptions: [],
      editPermsOptions: [], // 存储编辑时的权限标识
      permsDefaultProps: {
        children: 'apiList',
        label: 'funcPerm'
      },
      permsNodeKey: 'funcId',
      permsCheckedKeys: [],
      rules: {
        menuType: [
          {required: true, message: '请选择类型', trigger: 'change'}
        ],
        menuName: [
          {required: true, message: '请输入名称', trigger: 'blur'},
          {min:1, max: 20, message: '请输入1-20个字符', trigger: 'blur'},
          {validator: checkSpecialWord, trigger: 'blur'}
        ],
        id: [
          {required: true, message: '请输入菜单ID', trigger: 'blur'}
        ],
        parentId: [
          {required: true, message: '请选择父级菜单', trigger: 'change'},
        ],
        webUrl: [
          {required: true, message: '请选择菜单路由', trigger: 'change'},
          {min:1, max: 20, message: '最多输入1-20个字符', trigger: 'change'},
        ],
        status: [
          {required: true, message: '请选择菜单状态', trigger: 'change'}
        ],
        funcIdArr: [
          {required: true, message: '请选择权限标识', trigger: 'change'},
        ],
        orderNum: [
          {required: true, message: '请输入排序值(0-10000的整数)', trigger: 'blur'},
          {type: 'number', message: '排序值必须为0-10000整数'},
          {validator: checkSortNum, trigger: 'blur'}
        ],
        menuIcon: [
          {required: true, trigger: 'change', message: '请选择菜单图片'}
        ],
        // icon: [
        //   {required: true, message: '请选择图标', trigger: 'change'}
        // ],
        remark: [
          {max: 150, message: '最多输入150个字符', trigger: 'blur'},
        ],
      },
      iconOptions: iconfontList
    };
  },
  methods: {
    // 菜单列表真实接口数据
    getTableData() {
      var data = Object.assign({}, this.formInlineData)
      GetMenus(data).then(res => {
        this.menusList = res.data.data;
        this.parentTreeData = JSON.parse(JSON.stringify(res.data.data));  // 防止被treeTable组件改造数据
        this.emptyText = null
      }).catch(error => {
        this.emptyText = '暂无数据'
      })
    },
    // 获取权限标识
    getFuncPerm() {
      GetFuncList().then(res => {
        this.permsOptions = res.data.data
      })
    },
    // 菜单上传图片
    menuIconChange(val) {
      if (val) {
        this.$refs['add-menu-form-ref'].validateField('menuIcon')
      }
    },
    // 菜单类型改变时，重置权限标识，清空默认选中
    menuTypeChange(val) {
      // this.authorityData.funcIdArr = ''
    },
    // 图标选中
    iconActiveHandle(icon) {
      this.authorityData.icon = icon
    },
    handleInputChange(val) {
      this.getTableData();
    },
    handleSelectChange(val) {
      this.getTableData();
    },
    // 多选操作
    handleSelectionChange(val) {
      this.multipleSelection = val;
      var batchVisible = true
      var batchHide = true
      val.map(item => {
        batchVisible = batchVisible && (item.visible === '1')
        batchHide = batchHide && (item.visible === '0')
      })
      this.batchVisible = val.length && batchVisible
      this.batchHide = val.length && batchHide
    },
    // 新增菜单操作模态框
    addHandle() {
      this.initDialogForm('add');
    },
    // 更新权限模态框
    updateHandle(row) {
      this.initDialogForm('edit', row);
    },
    // 权限详情
    viewHandle(row) {
      this.initDialogForm('view', row);
    },
    initDialogForm(type, row) {
      if (type === 'view' || type === 'edit') {
        var temp = {
          menuId: null,
          menuName: null,
          parentId: null,
          orderNum: null,
          webUrl: null,
          menuType: null,
          visible: null,
          funcIdArr: null,
          icon: null,
          remark: null,
          menuIcon: null
        }
        Object.keys(temp).forEach(key => {
          temp[key] = (row[key] || row[key] === 0) ? row[key] : ''
        })
        this.authorityData = temp;
      } else if (type === 'add') {
        this.authorityData = {
          menuType: 'C',
          orderNum: 0,
          icon: '',
          parentId: null,
          funcIdArr: null,
          webUrl: null
        };
      }
      this.dialogStatus = type
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['add-menu-form-ref'].clearValidate()
      })
    },
    deleteHandle(row) {
      this.$confirm('确定删除被选中的数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        DeleteMenu(row.menuId).then(res => {
          if (res.data.code === '0') {
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success'
            });
            this.getTableData()
          }
        })
      })
    },
    // 确定保存
    saveData() {
      if (this.dialogStatus === 'view') {
        this.dialogClose();
        return
      }
      this.$refs['add-menu-form-ref'].validate((valid) => {
        if (valid) {
          // tree-select 多选时组件传出的为数组，需转成字符串传给后台
          this.authorityData.funcIdArr = this.authorityData.funcIdArr.toString()
          // 如果菜单类型是按钮，就把weburl自动置空，
          // 避免菜单类型切换时没有清除上次选中，导致和已有的菜单路径冲突，以致权限判断错误
          if (this.authorityData.menuType == 'F') {
            this.authorityData.webUrl = ''
            this.authorityData.menuIcon = ''
          }

          if (this.dialogStatus === 'add') {
            this.addMenusData(this.authorityData);
          } else if (this.dialogStatus === 'edit') {
            this.editMenusData(this.authorityData);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 存储数据-新增项目信息
    addMenusData(data) {
      AddMenu(data).then(res => {
        this.$notify({
          title: '成功',
          message: '新增菜单成功',
          type: 'success'
        });
        this.dialogClose();
        // TODO 将刷新列表变成插入数据
        this.getTableData();
      })
    },
    // 编辑菜单接口
    editMenusData(data) {
      if (data.menuIcon && data.menuIcon.indexOf('base64,') < 0) {
        delete data.menuIcon
      }
      UpdateMenu(data).then(res => {
        this.$notify({
          title: '成功',
          message: '编辑菜单成功',
          type: 'success'
        });
        this.dialogClose();
        // TODO 将刷新列表变成插入数据
        this.getTableData();

      })
    },
    editDataTree(val, row) {
      if (!val) return;
      var newData = (val, row) => {
        val.map((item, index) => {
          if (item.menuId === row.menuId) {
            val.splice(index, 1, row);
          }
        })
        return val
      }
      newData.forEach(item => item.childrenList && (item.childrenList = this.editDataTree(item.childrenList, row)))
      return newData
    },
    // 显示
    handleBatchVisiable() {
      this.$confirm('确定显示被选中的菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        var params = {}
        params.menuIds = this.multipleSelection.map(item => {
          return item.menuId
        })
        ShowMenus(params).then(res => {
          this.$refs.MenuTable.clearSelection();
          this.getTableData();
        })
      })
    },
    // 隐藏
    handleBatchHide() {
      this.$confirm('确定隐藏被选中的菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        var params = {}
        params.menuIds = this.multipleSelection.map(item => {
          return item.menuId
        })
        HideMenus(params).then(res => {
          this.$refs.MenuTable.clearSelection();
          this.getTableData();
        })
      })
    },
    dialogClose() {
      this.authorityData = {}
      this.dialogFormVisible = false
      this.$refs['add-menu-form-ref'].resetFields()
    },
    getRulesProp: function (prop) {
      if (this.authorityData.menuType !== 'F') {
        return prop;
      }
      ;
      return '';
    }
  },
  computed: {
    treeData() {
      // 过滤出菜单树中的目录和菜单
      var filiterTreeMenu = (val, type) => {
        if (!val) return;
        var newData = val.filter(item => item.menuType !== type)
        newData.forEach(item => item.childrenList && (item.childrenList = filiterTreeMenu(item.childrenList, type)))
        return newData
      }
      var treeData = filiterTreeMenu(this.parentTreeData, 'F')
      treeData = [{childrenList: treeData, parentId: -1, visible: '0', menuName: '根节点', menuId: 0, menuType: 'C'}]
      return treeData
    },
    menusOptions() {
      let routes = recursion.recursionAll(this.$router.options.routes, 'children', () => true);
      routes = routes.map(route => route.name)
      return routes;
    },
    permsTreeOptions() {
      let permsOptions = JSON.parse(JSON.stringify(this.permsOptions))
      this.editPermsOptions = this.editPermsOptions.length > 0 ? this.editPermsOptions : recursion.resetTreeList(this, permsOptions, 'funcType', 'MENU', 'disabled', true, 'apiList')
      return this.authorityData.menuType !== 'F' ? this.permsOptions : this.editPermsOptions
    }
  },
  mounted() {
    this.getTableData();
    this.getFuncPerm();
  },
  watch: {}
};
