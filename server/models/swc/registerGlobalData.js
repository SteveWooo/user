/**
* @param options.globalData 需要初始化的全局参数的model
*/
module.exports = async function(swc, options){
	global.swc = options.globalData;
	swc.log.info('载入:全局缓存变量');
	return swc;
}