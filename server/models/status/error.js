/**
* @param message 输入信息
* @param 错误编码，必须存在ERROR_CODE中咯 
* 其实就是根据错误码，带上一个规范的错误信息而已
*
* @return {code, error_message} //考虑到前端也用这套错误编码规范，所以用下划线
*/
const ERROR_CODE = {
	'4004' : '查询不存在',
	'4005' : '参数错误或缺少参数',
	'4006' : '业务不存在',
	'4007' : '缓存过期',
	'5000' : '系统查询错误'
}

module.exports = async (swc, options)=>{
	if(!options || !options.code){
		swc.log.error('参数缺失（错误模型都报错了，我能怎么办？）');
		throw '';
		return ;
	}

	if(!options.code in ERROR_CODE){
		swc.log.error('错误码未定义（错误模型都报错了，我能怎么办？）');
		throw '';
		return ;
	}

	return {
		code : options.code,
		message : options.message,
		error_message : ERROR_CODE[options.code]
	}
}