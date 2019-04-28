async function main(){
	var swc;
	try{
		swc = await require("./server/models/swc/init")();
		swc = await require('./server/controllers/access')(swc, {});
		swc.startup(swc);
	}catch(e){
		console.log(e)
	}
}

main();