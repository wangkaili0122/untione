/**
 * 短横线分隔命名转为驼峰式命名
 */
function kebab2camel(kabab) {
  var words = kabab.split('-');

  return words[0] + words.slice(1).map(word => {
    return word.charAt(0).toUpperCase() + word.split('').slice(1).join('');
  }).join('');
}

export default kebab2camel;
