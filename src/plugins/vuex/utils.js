/**
 * 遍历对象
 * @param {对象} obj 
 * @param {回调函数} callback 
 */
export const forEachValue = (obj, callback) => {
  Object.keys(obj).forEach(key => callback(obj[key], key))
}