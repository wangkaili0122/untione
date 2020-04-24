/**
 * element-ui el-form使用的表单验证规则
 * @author ljj-17773
 * @date 2019-01-25
 */

import regexpRules from './validateRegex'

var checkAge = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入您的年龄'))
  } else if (!regexpRules.age(value)) {
    callback(new Error('请输入正确的年龄，范围在1-120之间'))
  } else {
    callback()
  }
}
/**
 * 验证大陆手机号码  必填校验
 * @param rule
 * @param value
 * @param callback
 */
var checkPhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入您的手机号'))
  } else if (!regexpRules.phone(value)) {
    callback(new Error('请输入11位的手机号码'))
  } else {
    callback()
  }
}
/**
 * 验证大陆手机号码 和固话 必填校验
 * @param rule
 * @param value
 * @param callback
 */
var checkAllPhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入您固话号码或手机号码'))
  } else if (!regexpRules.phone(value) && !regexpRules.telPhone(value)) {
    callback(new Error('请输入正确的固话号码（xxxx-xxxxxxxx）或11位手机号码'))
  } else {
    callback()
  }
}

/**
 * 验证邮箱格式
 * @param rule
 * @param value
 * @param callback
 */
var checkEmail = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入您的email'))
  } else if (!regexpRules.email(value)) {
    callback(new Error('请输入正确的邮箱格式：example@h3c.com'))
  } else {
    callback()
  }
}
/**
 * 验证中文名称  必填校验
 * @param rule
 * @param value
 * @param callback
 */
var checkCName = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入您的姓名'))
  } else if (!regexpRules.name(value)) {
    callback(new Error('请输入正确姓名，只包含中英文，长度2~7位'))
  } else {
    callback()
  }
}
/**
 * 验证账户组成是否合法
 * @param rule
 * @param value
 * @param callback
 */
var checkAccount = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入您的账号'))
  } else if (!regexpRules.account(value)) {
    callback(new Error('账号只能包含数字和字母，长度为1-20位'))
  } else {
    callback()
  }
}
/**
 * 验证公司名称
 * @param rule
 * @param value
 * @param callback
 */
var checkCompanyName = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入企业名称'))
  } else if (/\d/.test(value)) {
    callback(new Error('企业名称不能包含数字和特殊字符'))
  } else if (!regexpRules.companyName(value)) {
    callback(new Error('请输入正确的企业名称(只能包含中文、字母和".")'))
  } else {
    callback()
  }
}
/**
 * 验证企业统一社会信用代码
 * @param rule
 * @param value
 * @param callback
 */
var checkCreditCode = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入企业统一社会信用代码'))
  } else if (!regexpRules.creditCode(value)) {
    callback(new Error('请输入正确的企业统一社会信用代码'))
  } else {
    callback()
  }
}

/**
 * 验证密码格式是否正确
 * @param rule
 * @param value
 * @param callback
 */
function checkPassword (rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入密码'))
    // } else if (!regexpRules.password(value)) {
    //   callback(new Error('密码只能包含字母和数字，且必须包含字母和数字'));
  } else {
    callback()
  }
}
/**
 * 验证新密码格式是否正确
 * @param rule
 * @param value
 * @param callback
 */
const checkNewPassword= (rule, value, callback) => {
  var matchRes = regexpRules.pwdValidate(value);
  if (value === '') {
    callback(new Error('请输入您的新密码'));
  }
  setTimeout(() => {
    if (!matchRes || value.length < 6 || value.length > 30) {
      callback(new Error('请输入您的新密码，由6-30位的字母、数字和至少一个特殊符号组成'));
    } else {
      callback();
    }
  }, 200);
};
/**
 * 验证密码格式是否正确2 复杂度强
 * @param rule
 * @param value
 * @param callback
 */
function checkStrongPassword (rule, value, callback) {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else if (!regexpRules.strongPassword(value)) {
    callback(new Error('密码由6-30位的字母、数字和至少一个特殊符号组成'));
  } else {
    callback()
  }
}

// 特殊字符校验
const checkSpecialWord = (rule, value, callback) => {
  let matchRes = regexpRules.specialWordValidateHead(value)
  matchRes ? callback() : callback(new Error('请输入中文、英文、数字、空格、下划线和连接线，其中首部不能为空格'))
}

//特殊字符校验2
const checkSpecialWordHeadTail = (rule, value, callback) => {
  let matchRes = regexpRules.specialWordValidateHeadTail(value)
  matchRes ? callback() : callback(new Error('请输入中文、英文、数字、空格、下划线和连接线，其中首部和尾部不能为空格'))
}

// 排序值校验
const checkSortNum = (rule, value, callback) => {
  if (!value) {
    return callback()
  }
  setTimeout(() => {
    if (!Number(value)) {
      callback(new Error('排序值必须为0-10000整数'))
    } else {
      if (value / 1 > 10000 || value / 1 < 0) {
        callback(new Error('请输入0--10000的合理排序值'))
      } else {
        callback()
      }
    }
  }, 200)
}
// 手机号校验 非必填
var checkPhoneU = (rule, value, callback) => {
  if (!value) {
    return callback()
  } else if (!regexpRules.phone(value)) {
    callback(new Error('请输入11位的手机号码'))
  } else {
    callback()
  }
}
// 邮箱校验 非必填
var checkEmailU = (rule, value, callback) => {
  if (!value) {
    return callback()
  } else if (!regexpRules.email(value)) {
    callback(new Error('请输入正确的邮箱格式：example@h3c.com'))
  } else {
    callback()
  }
}
// 验证中文名称 非必填
var checkCNameU = (rule, value, callback) => {
  if (!value) {
    return callback()
  } else if (!regexpRules.name(value)) {
    callback(new Error('请输入正确姓名，只包含中英文，长度2~7位'))
  } else {
    callback()
  }
}
// 验证英文名称 只能包含英文字母、短横线、下划线
var checkRoleKey = (rule, value, callback) => {
  if (!value) {
    return callback()
  } else if (!regexpRules.roleKey(value)) {
    callback(new Error('角色key只能包含英文字母、短横线、下划线'))
  } else {
    callback()
  }
}
// 只能输入数字、26个英文字母、连接线或者下划线
const noneChineseRule = (rule, value, callback) => {
  if (!value) {
    return callback()
  } else if (!regexpRules.nonChineseValidate(value)) {
    callback(new Error('请输入英文字母、数字、连接线或者下划线'))
  } else {
    callback()
  }
}

//检验URL
const checkUrlRule = (rule, value, callback) => {
  if (!value) {
    return callback()
  } else if (!regexpRules.url(value)) {
    callback(new Error('请输入正确的URL地址'))
  } else {
    callback()
  }
}

//校验字母
const checkAlphabetic = (rule, value, callback) => {
  if (!regexpRules.alphabetic(value)) {
    callback(new Error('只能输入大小写英文字母'))
  } else {
    callback()
  }
}

export {
  checkAge,
  checkPhone,
  checkAllPhone,
  checkEmail,
  checkCName,
  checkAccount,
  checkCompanyName,
  checkCreditCode,
  checkPassword,
  checkNewPassword,
  checkStrongPassword,
  checkSpecialWord,
  checkSpecialWordHeadTail,
  checkSortNum,
  checkPhoneU,
  checkEmailU,
  checkCNameU,
  checkRoleKey,
  noneChineseRule,
  checkUrlRule,
  checkAlphabetic
}
