<!--
     /**
      * 用户信息抽取的数据源配置
      * @desc 组件描述
      * @example 调用示例
      *  <email-setting></email-setting>
      */
       -->
<template>
  <el-form ref="form" :model="formData" size="small" label-width="100px" :rules="rules" :disabled="this.optType==='view'">
    <el-form-item label="数据源名称" prop="dataSourceName">
      <el-input v-model="formData.dataSourceName"></el-input>
    </el-form-item>
    <el-form-item label="数据源引擎" prop="dataSourceType">
      <el-select v-model="formData.dataSourceType" @change="dsTypeChange">
        <el-option v-for="(type ,index) in Object.keys(dataSourceType)" :label="type" :value="type" :key="index"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="驱动程序">
      <el-input v-model="formData.driverClassName" disabled></el-input>
    </el-form-item>
    <el-form-item label="URL" prop="dataSourceUrl">
      <el-input v-model="formData.dataSourceUrl"></el-input>
    </el-form-item>
    <el-form-item label="数据表" prop="dataSourceTableName">
      <el-input v-model="formData.dataSourceTableName"></el-input>
    </el-form-item>
    <el-form-item label="用户名" prop="dataSourceUsername">
      <el-input v-model="formData.dataSourceUsername" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="dataSourcePassword">
      <el-input v-model="formData.dataSourcePassword" type="password" autocomplete="new-password"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
  import commonForm from 'mixins/common-form'
  export default {
    name: 'data-source',
    mixins:[commonForm],
    props:{
      rules: {
        type: Object,
        default () {
          return {
            dataSourceName:[
              {required:true,trigger:'blur',message: '请输入数据源名称'},
              {min:2,max:30,trigger:'change',message: '数据源长度为2-30'},
            ],
            dataSourceType:[
              {required:true,trigger:'change',message: '请选择数据源类型'},
            ],
            dataSourceUrl:[
              {required:true,trigger:'change',message: '请输入数据源URL'},
            ],
            dataSourceUsername:[
              {required:true,trigger:'blur',message: '请输入数据源用户名'},
            ],
            dataSourcePassword:[
              {required:true,trigger:'blur',message: '请输入数据源密码'},
            ],
            dataSourceTableName:[
              {required:true,trigger:'blur',message: '请输入数据源表名称'},
              {min:2,max:30,trigger:'change',message: '数据源表名称长度为2-30'},
            ]
          }
        }
      },
      labelWidth: {
        type: Number,
        default () {
          return 100
        }
      },
    },
    data(){
      return{
        dataSourceType:{
          mysql:'jdbc:mysql://[machine-ip]:[port(3306)]/[database-name]',
          oracle:'jdbc:oracle:thin:@[machine-ip]:[port(1521)]:ORCL',
          // postgresql:'jdbc:postgresql://[machine-ip]:[port(5432)]/[database-name]',
          // sqlserver:'jdbc:jtds:sqlserver://[machine-ip]:[port(1433)];DatabaseName=[database-name]'
        },
        driverClassNames:{
          mysql:'com.mysql.jdbc.Driver',
          oracle:'oracle.jdbc.OracleDriver'
        }
      }
    },
    methods:{
      testLink(){
        this.validate(valid=>{
          if(valid){
            this.$alert('测试通过','提示',{type:'success'})
          }else{
            this.$alert('测试未通过','提示',{type:'error'})
          }
        })
      },
      dsTypeChange(selected){
        this.formData.dataSourceUrl =this.dataSourceType[selected]
        this.formData.driverClassName=this.driverClassNames[selected]
      }
    }
  }
</script>

<style scoped>

</style>
