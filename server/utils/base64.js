/**
* @param base64String 加密字符串
* @return string
*/
exports.decode = async (swc, options)=>{
	var buf = Buffer.from(options.base64String, 'base64');
	var string = buf.toString();
	return string;
}

/**
* @param string 原文字符串
* @return base64String 加密字符串
*/

exports.encode = async (swc, options)=>{
	var buf = Buffer.from(options.string);
	var base64String = buf.toString('base64');
	return base64String;
}