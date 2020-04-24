/**
 * 表单验证规则的正则表达式
 * @author ljj-17773
 * @date 2019-01-25
 */

var regexpRules = {
  phone: (value) => {
    return (new RegExp(/^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[5-6])|(17[0,1,3,4,5,6,7,8])|(18[0-9])|(19[1,8,9]))\d{8}$/im)).test(value);
  },
  telPhone: (value) => {
    return RegExp(/^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$/).test(value);
  },
  email: (value) => {
    return RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/im).test(value);
  },
  age: (value) => {
    // return RegExp(/^[1-9][0-9]{0,2}$/im).test(value);
    return RegExp(/^[1-9]\d?$|^1[01]\d$|^120$/im).test(value);
  },
  url: (value) => {
    return RegExp(/^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.{0,1}[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/im).test(value);
  },
  cname: (value) => {
    let reg = /^([\u4e00-\u9fa5]){2,7}$/; //只能是中文，长度为2-7位
    return RegExp(reg).test(value);
  },
  name: (value) => {
    let reg = /^([\u4e00-\u9fa5,a-zA-Z]){2,7}$/; //姓名只包含中英文，长度为2-7位
    return RegExp(reg).test(value);
  },
  account: (value) => {
    //只能包含数字和字母
    let structRight = RegExp(/^[a-zA-Z,0-9]{1,20}$/).test(value);
    if (structRight) {
      return true;
    } else {
      return false;
    }
  },
  companyName: (value) => {
    return RegExp(/^[\u4e00-\u9fa5\s,a-zA-Z\.]{2,50}$/).test(value);
  },
  creditCode: (value) => {
    return RegExp(/^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/).test(value);
  },
  password: (value) => {
    //只能包含数字和字母，必须包含字母和数字
    let structRight = RegExp(/^[a-zA-Z,0-9]{6,20}$/).test(value);
    let contaiNumb = RegExp(/[0-9]{1,}/).test(value);
    let containChar = RegExp(/[a-zA-Z]{1,}/).test(value);
    if (structRight && containChar && contaiNumb) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 密码校验-强
   * 必须包含字母、数字和特殊字符，且长度为6-30
   */
  strongPassword:(value) => {
    let reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_!@#$%^&*`~()-+=]+$)(?![a-z0-9]+$)(?![a-z\W_!@#$%^&*`~()-+=]+$)(?![0-9\W_!@#$%^&*`~()-+=]+$)[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{6,30}$/;
    return RegExp(reg).test(value);
  },
  roleKey: (value) => {
    //只能包含英文字母、短横线、下划线
    let structRight = RegExp(/^[a-zA-Z_\-]{1,64}$/).test(value);
    if (structRight) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 表单校验-特殊字符校验1  (建议使用)
   * 只能输入中文、英文、数字、空格、下划线和连接线，且首部不能为空格，字符串中间可以为空格
   */
  specialWordValidateHead: (val) => {
    let reg = /^[\w\u4e00-\u9fa5\-_][\s\w\u4e00-\u9fa5\-_]*(?!\s)$/;
    return reg.test(val);
  },
  /**
   * 表单校验-特殊字符校验2  (建议使用)
   * 只能输入中文、英文、数字、空格、下划线和连接线，且首部和尾部不能为空格，字符串中间可以为空格
   */
  specialWordValidateHeadTail: (val) => {
    let reg = /^[\w\u4e00-\u9fa5\-_][\s\w\u4e00-\u9fa5\-_]*(?!\s)[\w\u4e00-\u9fa5\-_]$/;
    return reg.test(val);
  },
  /**
   * 表单校验-非汉字、特殊字符
   * 只能输入数字、26个英文字母、连接线或者下划线
   */
  nonChineseValidate: (val) => {
    let reg = /^[0-9a-zA-Z_\-]{1,}$/;
    return reg.test(val);
  },
  /**
   * 表单密码
   * 只能由6-15位的字母、数字和至少一个特殊符号组成
   */
  pwdValidate: (val) => {
    let reg=/([a-zA-Z0-9]){1,}([`~!@#$%^&*()_+<>?:"{},.\/;'[\]]){1,}/im;
    return reg.test(val);
  },
  /**
   * 表单校验-字母
   * 只能输入26个英文字母
   */
  alphabetic: (val) => {
    let reg = /^[a-zA-Z]{1,}$/;
    return reg.test(val);
  },
};

export default regexpRules;
