import CryptoJS from 'crypto-js';

const DES_FUN = () => {
  const KEY = 'platform';
  const IV = 'platform';
  const keyHex = CryptoJS.enc.Utf8.parse(KEY);
  const ivHex = CryptoJS.enc.Utf8.parse(IV);
  return {
    /**
     * 加密
     * @param text
     * @returns {string}
     */
    encrypt(text) {
      let encrypted = CryptoJS.DES.encrypt(text, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return encrypted.toString();
    },

    /**
     * 解密
     * @param text
     * @returns {string}
     */
    decrypt(text) {
      if (text){
        let decrypted = CryptoJS.DES.decrypt({
          ciphertext: CryptoJS.enc.Base64.parse(text)
        }, keyHex, {
          iv: ivHex,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
      }

    }
  }
}
const DES = DES_FUN();

export default DES;
