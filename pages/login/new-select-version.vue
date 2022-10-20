<template>
	<view class="main" v-if="showSelect">
		<view class="mask" @touchmove.stop.prevent="()=>{}" @click="maskClick"></view>
		<view class="select">
			<view class="uni-list">当前版本：{{version}}</view>
			<view class="uni-list">最新版本：{{newVersion}}</view>
			<button @click="query" class="btn" :disabled="version===newVersion">更新</button>
		</view>
	</view>
</template>

<script>
import  Api from '../../service/api'
export default{
	data() {
		return {
			showSelect:false,
			api:'',
			version:"",
			versionCode:"",
			newVersion:"",
			fileUrl:""
		}
	},
	mounted() {
		Api.changeVersoin({softwareName:'PDA'}).then(res=>{
			if (res.code === 0) {
				this.newVersion=res.data.versionNo
				this.fileUrl=res.data.fileUrl
			}else {
				uni.showToast({
					title: '获取版本失败',
					icon: 'error',
					duration: 3000
				})
			} 
		})
		// 判断本地是否有账号密码，自动填充
		plus.runtime.getProperty(plus.runtime.appid, (info) => {
			this.version = info.version;
			this.versionCode = info.versionCode;
		});
	},
	methods:{
		 maskClick(){
			this.showSelect = false
		},
		query(){
			uni.showLoading({
				title: '下载中'
			});
			//下载文件
			let that = this
			uni.downloadFile({
			  url: this.fileUrl , //下载地址，后端接口获取的链接
			  success: (data) => {
				uni.hideLoading();
				if (data.statusCode === 200) {
				  uni.saveFile({ //文件保存到本地
					tempFilePath: data.tempFilePath, //临时路径
					success: function(res) {
					  uni.showToast({
						icon: 'none',
						mask: true,
						title: '文件已保存!', 
						duration: 3000,
					  });
					  uni.openDocument({
						fileType: 'docx',
						filePath: res.savedFilePath,
						success: function(res) {
						  console.log('打开文档成功');
						}
					  });
					}
				  });
				}
			  },
			  fail: (err) => {
				uni.showToast({
				  icon: 'none',
				  mask: true,
				  title: '失败请重新下载',
				});
			  },
			});
			  that.showSelect = false
			}
	}
}
</script>

<style lang="less">
.select{
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 2;
	background-color: #FFFFFF;
	width: 500rpx;
	height: 350rpx;
	font-size: 22px;
	border-radius: 20rpx;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
}
.uni-list{
    font-size: 54rpx;
    line-height: 110rpx;
    text-align: center;
    color: #aaa;
}
.mask {
	z-index: 1;
	position: fixed;
	top: 0;
	left:0;
	right: 0;
	bottom: 0;
	background-color: rgba(0,0,0, 0.6);
}
.input{
	margin-top: 20rpx;
	width: 100%;
	height: 100rpx;
	background-color: #eee;
	text-align: center;
}
.btn{
	width: 80%;
	height:100rpx;
	background-color: #0c99f2;
	margin: 10rpx 0;
	font-size: 40rpx;
	color: #FFFFFF;
	line-height: 100rpx;
	border-radius: 50rpx;
}
</style>
