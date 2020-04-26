/**
 * 读取public下所有icon图标
 */
function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);
  var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
  var dataURL = canvas.toDataURL("image/"+ext);
  return dataURL;
}

const requireContext = require.context('../../public/img/app', true, /^\.\/.*\.(png|jpg|jpeg)$/);
let iconImages = [];
requireContext.keys().map(req => {
  let iconName = req.split('./')[1];
  let iconNameObj = {};
  iconNameObj.fileName = iconName;
  // iconNameObj.file = require(`../../public/img/icon/${iconName}`); 直接用这个，webpack会在打包的时候，比较小的图片是base64，大的图片是路径，所以要处理为base64
  var image = new Image();
  image.src = require(`../../public/img/app/${iconName}`);
  image.onload = function(){
    iconNameObj.file = getBase64Image(image);
  };
  iconImages.push(iconNameObj);
});

export default iconImages;
