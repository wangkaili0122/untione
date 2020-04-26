/**
 * 日期格式化
 */


/**
 * 将标准格式的时间转换为YY-MM-DD
 * @param {String|Number} format
 * @return {String}
 */
function dateFormat(format) {
  var str = /-/g.test(format) ? format.replace(/-/g,"/") : format; // 解决浏览器兼容性，对默认的日期格式进行了转换， 将-替换为/,斜杠通用于各个浏览器,-只适用于Chrome
  var d = new Date(str);
  var month = d.getMonth() + 1;
  var day = d.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  var val = d.getFullYear() + '-' + month + '-' + day;
  return val;
};

/**
 * 格式化为时分秒
 * @param {String|Number} value
 * @return {String}
 */
function timeFormat(value) {
  var format = /-/g.test(value) ? value.replace(/-/g,"/") : value;
  var d = new Date(format);
  return dateFormat(value) + ' ' +
    (d.getHours()>9?d.getHours():('0'+d.getHours())) + ':' +
    (d.getMinutes()>9?d.getMinutes():('0'+d.getMinutes())) + ':' +
    (d.getSeconds()>9?d.getSeconds():('0'+d.getSeconds()));
}

/**
 * 获取今年年初标准时间
 * @return {Date}
 */
function getStartYearTime() {
  var date = new Date();
  var y = date.getFullYear();
  return new Date(y, 0, 1);
};

/**
 * 获取当前时间点标准时间
 * @return {Date}
 */
function getPresentTime() {
  var date = new Date();
  var y = date.getFullYear();
  var m = date.getMonth();
  var d = date.getDate();
  return new Date(y, m, d);
}

let dataFormatFnList = {
  dateFormat,
  timeFormat,
  getStartYearTime,
  getPresentTime
}
export default dataFormatFnList;
