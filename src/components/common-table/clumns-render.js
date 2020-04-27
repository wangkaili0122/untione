// 公共table组件的列渲染函数，当表格column数据需要特殊处理时，在引用table组件的组件中配置columns->formatter, 其中formatter字段需与本配置文件中的函数名称一致
// 如：
// columns: [
// {prop: 'loginName',label: '登录名', sortable: true},
// { prop: 'userName',label: '昵称'},
// {prop: 'sex',label: '性别',formatter: 'sexRender'},
// {prop: 'phoneNumber',label: '手机号码'},
// {prop: 'email',label: '邮箱'},
// {prop: 'status',label: '帐号状态',formatter: 'statusRender' },
// {prop: 'remark', label: '备注'}
// ]
const clumnsRender = {
  sexRender: (row, column, cellValue, index) => {
    // let rowData = row['sex'];
    if(!cellValue) return;
    const renderMap = {
      '0': '男',
      '1': '女',
      '2': '未知'
    }
    return renderMap[cellValue];
  },
  statusRender: (row, column, cellValue, index) => {
    // let rowData = row['status'];
    if(!cellValue) return;
    const renderMap = {
      '0': '启用',
      '1': '禁用'
    }
    return renderMap[cellValue];
  },
  deptIdRender: (row, column, cellValue, index) => {
    // let rowData = row['status'];
    if(!cellValue) return;
    const renderMap = {
      100: '研发系统部',
      101: '应用开发'
    }
    return renderMap[cellValue];
  }
}
export default clumnsRender
