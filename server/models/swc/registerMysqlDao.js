/**
* 没有需要传入的参数
* ）但是需要业务在models/mysql/definedModel里面定义数据模型
*/
const path = require('path')
module.exports = async (swc, options)=>{
	swc = await require(`${path.resolve()}/server/dao/init`)(swc);
	swc = await require(`${path.resolve()}/server/models/mysql/defineModel`)(swc, {});
	return swc;
}