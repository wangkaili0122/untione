/**
 * 对当前URLhash值的存储，以及获取缓存中的hash值
 */
export default {
  hashCacheKey: 'LATEST_HASH',
  hrefCacheKey:'LATEST_HREF',

  /**
   * 从当前路径URL里面获取hash值
   */
  getHash(url) {
    if(url){
      try{
        return url.split('#')[1].replace(/^\//,'')
      }catch (e) {
        return '/'
      }
    }else{
      return window.location.hash.replace('#/', '')
    }
  },
  getHref(url){
    if(url){
      return url
    }else{
      return window.location.href
    }
  },
  /**
   * 把当前路径中的hash值存入缓存
   * @param url 可以选择是否使用参数中的URL替代当前页面URL，用于跳转到指定页面
   */
  cacheHash(url) {
    if(!url){
      window.localStorage.setItem(this.hrefCacheKey,this.getHref())
      window.localStorage.setItem(this.hashCacheKey, this.getHash())
    }else{
      window.localStorage.setItem(this.hrefCacheKey,this.getHref(url))
      window.localStorage.setItem(this.hashCacheKey, this.getHash(url))
    }
  },
  /**
   * 取出缓存中的hash值
   * @returns {string | null | string}
   */
  getCacheHash() {
    return window.localStorage.getItem(this.hashCacheKey)||'/'
  },
  getCacheHref(){
    return window.localStorage.getItem(this.hrefCacheKey)||false
  },
  clearCache(){
    window.localStorage.removeItem(this.hashCacheKey)
    window.localStorage.removeItem(this.hrefCacheKey)
  }
}
