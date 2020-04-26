import Cookies from 'js-cookie';

// 设置访问状态并设置有效时间
function setItem () {
  var maxAge = new Date(new Date().getTime() + 60 * 60 * 1000);
  //var maxAge = new Date(new Date().getTime()+15 * 1000);
  Cookies.set('isVisit', 'true', {
    expires: maxAge
  });
}

// 判断访问状态是否失效
function getItem () {
  return Cookies.get('isVisit');
}

const visitStatus = {
  setItem,
  getItem
};

export default visitStatus;
