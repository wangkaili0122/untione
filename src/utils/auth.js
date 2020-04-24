import Cookies from 'js-cookie';
let keyExtention = parseInt(window.location.port === '' ? '80' : window.location.port).toString(16)
const authToken = {
  // 当Token超时后采取何种策略
  // jumpAuthPage  每次请求时判断Token是否超时，若超时则跳转到授权页面
  // getNewToken  每次请求时判断Token是否超时，若超时则获取新Token (推荐)

  // 当前没有使用该配置项
  tokenTimeoutMethod: 'getNewToken',
  // 在Cookie中记录登录状态的key
  loginKey: 'isLogin-' + keyExtention,
  // 在cookie中记录token的key
  tokenKey: 'access-token-' + keyExtention,
  refreshTokenKey: 'refresh-token-' + keyExtention,
  /**
   * 当前是否有token，token超时或未登录都返回null
   * @return {String|null}
   */
  hasToken: function () {
    return Cookies.get(this.tokenKey);
  },
  /**
   * 当前是否有Refresh token，token超时或未登录都返回null
   * @return {String|null}
   */
  hasRefreshToken: function () {
    return Cookies.get(this.refreshTokenKey);
  },
  /**
   * 当前是否是登录状态
   *  @return {Boolen}
   */
  isLogin: function () {
    return Cookies.get(this.loginKey);
  },

  /**
   * 设置Token
   * @param {string} token token值
   * @param {Date} expireTime token超期时间
   */
  setToken: function (token, expireTime) {
    if (!(expireTime instanceof Date)) {
      expireTime = new Date(expireTime);
    }
    // 设置token，并填写有效期
    Cookies.set(this.tokenKey, token, {
      expires: expireTime
    });
  },
  /**
   * 设置RefreshToken
   * @param {string} token token值
   * @param {Date} expireTime token超期时间
   */
  setRefreshToken: function (token, expireTime) {
    if (!(expireTime instanceof Date)) {
      expireTime = new Date(expireTime);
    }
    // 设置token，并填写有效期
    Cookies.set(this.refreshTokenKey, token, {
      expires: expireTime
    });
  },
  /**
   * 设置登录状态
   * @param {Date} expireTime 超期时间
   */
  setLoginStatus: function (expireTime) {
    if (!(expireTime instanceof Date)) {
      expireTime = new Date(expireTime);
    }
    // 设置超时登录时间，在该时间范围内没有任何请求操作则自动删除
    Cookies.set(this.loginKey, 'true', {
      expires: expireTime
    });
  },

  // 重新设置token的过期时间
  freshTokenExpires: function () {
    if (this.isLogin()) {
      this.setToken(Cookies.get('token'));
      this.setLoginStatus();
    }
  },

  /**
   * 清理token
   */
  clear: function () {
    this.removeToken();
    this.removeLoginStatus();
  },

  // 移除Token
  removeToken: function () {
    Cookies.remove(this.tokenKey);
    Cookies.remove(this.refreshTokenKey);
  },

  // 移除登录状态
  removeLoginStatus: function () {
    Cookies.remove(this.loginKey);
  },

};

export default authToken;
