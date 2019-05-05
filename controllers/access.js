/**
* 控制器入口
* ）必须注意:先定义好静态路由，再定义api接口
* ）先配置好中间件，再配置http路由
*/
const path = require('path')
module.exports = async (swc, options)=>{
	swc = await swc.registerMysqlDao(swc, {
		servicePath : `${path.resolve()}/services/mysql/defineModel`
	});

	swc = await swc.registerMiddleware(swc, {
		modelName : 'authBussiness',
		path : `${path.resolve()}/middlewares/authBussiness`
	})

	swc = await swc.registerStatic(swc, {
		items : [{
			path : `/${swc.config.server.bussiness_name}/static`,
			staticFilePath : `${path.resolve()}/static`
		}]
	});
	swc = await swc.registerHttpService(swc, {
		httpServiceFilePath : `${path.resolve()}/services/http`
	})

	swc = await swc.registerModel(swc, {
		modelName : "user",
		path : `${path.resolve()}/models/objects/user`
	})

	//错误统一出口
	swc.Error = require(`${path.resolve()}/models/status/error`);

	return swc;
}