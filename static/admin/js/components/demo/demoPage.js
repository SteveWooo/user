Vue.component('demo', {
	data : function(){
		return {
			data : vue.global.pages.demo, //数据流载入
			ctrl : vue.global.common.controllers.actions, //工具注入
		}
	},
	methods : {
		getData : function(){
			var scope = vue.global.pages[this.data.config.name];
			var that = this;
			scope.datas.loading = true;
			that.ctrl.ajax({
				url : keke.config.baseUrl + '/api/m/' + that.data.config.pathName + '/get?page=' + scope.datas.pageNow
					+ '&item_per_page=' + scope.datas.itemPerPage,
				successFunction : function(res){
					scope.datas.loading = false;
					if(res.status != '2000'){
						that.ctrl.alert({
							message : res.error_message
						})
						return ;
					}

					scope.datas.list = res.data.rows;
					scope.datas.count = res.data.count;
				},
				errorFunction : function(){
					scope.datas.loading = true;
					that.ctrl.alert({
						message : '网络错误'
					})
				}
			})
		},
		refresh : function(){
			this.getData();
		},
		init : function(){
			vue.global.common.initHandle();
			this.getData();
		},
		/*
		* 提交数据到服务端
		*/
		addDataSubmit : function(){
			var scope = vue.global.pages[this.data.config.name];
			var that = this;
			//转换图片为base64
			var onloadCallback = function(fileResult){
				scope.datas.loading = true;
				//提交表单
				var form = scope.panels.add.form;
				//获取封面图
				if(fileResult){
					form.cover_image = fileResult.result;
				}
				
				//获取富媒体内容
				if(scope.panels.add.editor){
					form.content = scope.panels.add.editor.txt.html();
				}
				
				that.ctrl.ajax({
					url : keke.config.baseUrl + '/api/m/' + that.data.config.pathName + '/add',
					headers : {
						'Content-Type' : 'Application/json'
					},
					method : "post",
					data : JSON.stringify(form),
					successFunction : function(res){
						scope.datas.loading = false;
						res = vue.global.common.resHandle(res);
						if(res.status != '2000'){
							that.ctrl.alert({
								message : res.error_message
							})
							return ;
						}
						that.ctrl.alert({
							message : '创建成功'
						})
						that.switchAddDataPanel();
						that.refresh();
					},
					errorFunction : function(){
						scope.datas.loading = false;
						that.ctrl.alert({
							message : '网络错误'
						})
					}
				})
			}

			var coverDom = '#'+that.data.config.name+'AddCover';
			var file;
			var reader;

			//检查输入,todo
			if(false){
				alert('请填写完整信息')
				return ;
			}
			if(!confirm('确定新增内容？')){
				return ;
			}

			if($(coverDom).length > 0){
				file = $(coverDom).get(0).files[0];
				reader = new FileReader();
				reader.onload = function(){
					var base64 = this.result;
					//回调base64
					onloadCallback({
						result : base64
					})
				}
				try{
					reader.readAsDataURL(file);
				}catch(e){
					console.log(e);
					alert('文件读取失败');
				}
			} else {
				onloadCallback()
			}
		},
		//打开|关闭新增数据的对话框
		switchAddDataPanel : function(){
			var scope = vue.global.pages[this.data.config.name];
			var that = this;
			var editorDom = '#'+that.data.config.name+'AddContent'; //富媒体编辑器dom
			var coverDom = '#'+that.data.config.name+'AddCover';

			//检查富媒体dom是否存在
			if($(editorDom).length != 0){
				if(scope.panels.add.editor === undefined){
					scope.panels.add.editor = new window.wangEditor(editorDom);
					scope.panels.add.editor.create();
				}
				scope.panels.add.editor.txt.html('');
			}

			//检查封面图
			if($(coverDom).length != 0){
				$(coverDom).val('');
			}

			this.data.panels.add.show = !this.data.panels.add.show;
			for(var i in this.data.panels.add.form){
				this.data.panels.add.form[i] = '';
			}
		},

		//删除
		deleteDataSubmit : function(item){
			var scope = vue.global.pages[this.data.config.name];
			var that = this;
			if(!confirm('确定删除数据？')){
				return ;
			}

			scope.datas.loading = true;
			//提交表单
			var form = {};
			form[that.data.config.idName] = item[that.data.config.idName]; //设置id
			that.ctrl.ajax({
				url : keke.config.baseUrl + '/api/m/' + that.data.config.pathName + '/delete',
				headers : {
					'Content-Type' : 'Application/json'
				},
				data : JSON.stringify(form),
				method : "post",
				successFunction : function(res){
					scope.datas.loading = false;
					res = vue.global.common.resHandle(res);
					if(res.status != '2000'){
						that.ctrl.alert({
							message : res.error_message
						})
						return ;
					}
					that.ctrl.alert({
						message : '删除成功'
					})
					that.refresh();
				},
				errorFunction : function(){
					scope.datas.loading = false;
					that.ctrl.alert({
						message : '网络错误'
					})
				}
			})
		},

		//提交更新数据操作
		updateDataSubmit : function(){
			var scope = vue.global.pages[this.data.config.name];
			var that = this;

			var onloadCallback = function (fileResult){
				var form = scope.panels.update.form;
				form[that.data.config.idName] = scope.panels.update[that.data.config.idName];
				if(fileResult !== undefined){
					form.cover_image = fileResult.result;
				}

				//获取富媒体内容
				if(scope.panels.update.editor){
					form.content = scope.panels.update.editor.txt.html();
				}

				that.ctrl.ajax({
					url : keke.config.baseUrl + '/api/m/' + that.data.config.pathName + '/update',
					headers : {
						'Content-Type' : 'Application/json'
					},
					method : "post",
					data : JSON.stringify(form),
					successFunction : function(res){
						scope.datas.loading = false;
						res = vue.global.common.resHandle(res);
						if(res.status != '2000'){
							that.ctrl.alert({
								message : res.error_message
							})
							return ;
						}
						that.ctrl.alert({
							message : '修改成功'
						})
						that.switchUpdateDataPanel();
						that.refresh();
					},
					errorFunction : function(){
						scope.datas.loading = false;
						that.ctrl.alert({
							message : '网络错误'
						})
					}
				})
			}
			if(!confirm('确定更新该分类数据吗？')){
				return ;
			}

			//获取图片，如果没有图片，则上传一个空数据，不更新
			var coverDom = '#' + that.data.config.name + 'UpdateCover';
			//如果有封面图dom的话：
			if($(coverDom).length > 0){
				var file = $(coverDom).get(0).files[0];
				if(file == undefined){
					onloadCallback();
					return ;
				}

				var reader = new FileReader();
				reader.onload = function(){
					onloadCallback({
						result : this.result
					});
				}

				try{
					reader.readAsDataURL(file);
				}catch(e){
					alert('文件读取失败')
				}

			} else {
				onloadCallback();
			}
		},
		//更新分类内容操作
		switchUpdateDataPanel : function(item){
			var scope = vue.global.pages[this.data.config.name];
			var that = this;
			var editorDom = '#'+that.data.config.name+'UpdateContent'; //富媒体编辑器dom
			var coverDom = '#' + that.data.config.name + 'UpdateCover';

			//检查富媒体编辑器
			if($(editorDom).length != 0){
				if(scope.panels.update.editor === undefined){
					scope.panels.update.editor = new window.wangEditor(editorDom);
					scope.panels.update.editor.create();
				}
				scope.panels.update.editor.txt.html('');

				if(item){
					scope.panels.update.editor.txt.html(item.content);
				}
			}

			//检查封面图
			if($(coverDom).length != 0){
				$(coverDom).val('');
			}

			//设置正在操作的id
			if(item){
				this.data.panels.update[that.data.config.idName] = item[that.data.config.idName];
			}
			this.data.panels.update.show = !this.data.panels.update.show;
			for(var i in this.data.panels.update.form){
				this.data.panels.update.form[i] = item ? item[i] : '';
			}
		},
		changePage : function(page){
			var scope = vue.global.pages[this.data.config.name];
			scope.datas.pageNow = page;
			this.refresh();
		},
	},
	mounted : function(){
		this.init();
	},
	template : 
`
<v-container>
	<v-layout row wrap>
		<v-flex xs5>
			<v-btn color="white"
			@click="">
				返回
			</v-btn>
		</v-flex>
		<v-flex xs7 class="text-xs-right">
			<v-btn color="white"
			@click="refresh()">
				刷新
			</v-btn>
			<v-btn color="white"
			@click="switchAddDataPanel()">
				创建自助服务
			</v-btn>
		</v-flex>
		<v-flex xs12>
			<v-data-table
				dark
				hide-actions
				rows-per-page-items="10"
				:headers="data.datas.itemHeader" 
				:items="data.datas.list"
				:total-items="data.datas.count"
				:loading=data.datas.loading>
				<v-progress-linear slot="progress" color="red" indeterminate></v-progress-linear>
				<template slot="items" slot-scope="props">
					<td>
						<v-img 
							@click="switchUpdateDataPanel(props.item)"
							style="width:80px;margin:10px 10px 10px 10px;"
							:src="keke.config.baseResUrl + '/' + props.item.cover_url">
						</v-img>
					</td>
					<td>
						{{props.item.title}}
					</td>
					<td>
						{{props.item.description}}
					</td>
					<td>
						<v-btn
							color="red"
							@click="deleteDataSubmit(props.item)">
							删除
						</v-btn>
					</td>
				</template>
			</v-data-table>
		</v-flex>
		<v-flex xs12>
			<div class="text-xs-right">
				<v-pagination
					v-model="data.datas.pageNow"
					dark
					@input="changePage"
					:total-visible="9"
					:length="Math.ceil(data.datas.count / data.datas.itemPerPage)"
				></v-pagination> 当前：{{data.datas.pageNow}}
			</div>
		</v-flex>
	</v-layout>

	<v-dialog
		data-app="true"
		dark
		hide-overlay="true"
		scrollable=true
		v-model="data.panels.add.show"
		width=1000
		>
		<v-card>
			<v-card-title
			  class="headline blue lighten-1"
			  primary-title
			>
				新增数据
			</v-card-title>

			<v-form
				style="padding:16px 16px 16px 16px">
				<v-text-field
					required
					v-model=data.panels.add.form.title
					label="标题">
				</v-text-field>
				<v-text-field
					required
					v-model=data.panels.add.form.description
					label="描述">
				</v-text-field>
				<div :id="data.config.name + 'AddContent'"></div>
				<label>
					封面图：
				</label>
				<input :id="data.config.name + 'AddCover'" type="file"/>
			</v-form>
			<v-divider></v-divider>
			<v-card-actions>
				<v-btn
					@click="switchAddDataPanel">
					取消
				</v-btn>
				<v-btn
					v-if="!data.datas.loading"
					@click="addDataSubmit"
					color="blue">
					确定
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>

	<v-dialog 
		dark
		scrollable=true
		hide-overlay="true"
		v-model="data.panels.update.show"
		width=1000
		>
		<v-card>
			<v-card-title
			  class="headline blue lighten-1"
			  primary-title
			>
				修改自助维修
			</v-card-title>

			<v-form
				style="padding:16px 16px 16px 16px">
				<v-text-field
					required
					v-model=data.panels.update.form.title
					label="标题">
				</v-text-field>
				<v-text-field
					required
					v-model=data.panels.update.form.description
					label="描述">
				</v-text-field>
				<div :id="data.config.name + 'UpdateContent'"></div>
				<label>
					封面图：
				</label>
				<input :id="data.config.name + 'UpdateCover'" type="file"/>
			</v-form>
			<v-divider></v-divider>
			<v-card-actions>
				<v-btn
					@click="switchUpdateDataPanel">
					取消
				</v-btn>
				<v-btn
					v-if="!data.datas.loading"
					@click="updateDataSubmit"
					color="blue">
					确定
				</v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</v-container>
`
})