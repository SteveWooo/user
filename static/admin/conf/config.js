/**
* 初次加载
*/
var keke = {};
keke.config = {
	components : [
		'hello', 
		'login',
		'demo',
	],
	menu : [{
		text : "登陆",
		icon: 'history',
		router : "login"
	},{
		text : "hello",
		icon: 'history',
		router : "hello"
	},{
		text : "demo",
		icon: 'history',
		router : "demo"
	}],

	baseUrl : location.origin, //根目录路径
	baseResUrl : location.origin + "/res", //资源根目录路径
}

function loadInitFile(mode){
	var dom = document.createElement("script");
	dom.src = 'js/init.js';
	document.body.appendChild(dom);
}

$.ajax({
	url : keke.config.baseUrl + "/keke/api/p/mode/get",
	success : function(res){
		loadInitFile(res.mode);
	},
	error : function(e){
		alert('网络错误！')
	}
})