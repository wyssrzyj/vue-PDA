<template>
	<view class="tagController">
		<view class="tagContainer">
			<view  :class="tagItem.flag?'tagItemActive':'tagItem'"  v-bind:key="index" v-for="(tagItem,index) in value">
				<text @tap="tapTag" :data-text="tagItem.partsName">{{tagItem.partsName}}</text>
				<text v-if="isShowDelIcon" class="tagDelIcon" @click.stop="delTag" :data-text="tagItem.partsName" id="x">x</text>
			</view>
		</view>
		<!-- <view class="tagInput" v-if="isShowAdd">
			<input type="text" v-model="tagString" placeholder="输入新的标签,多个标签用逗号间隔" />
			<button type="default" size="mini" @tap="createTags">添加</button>
		</view> -->
	</view>
</template>

<script>
	export default {
		name:'robby-tags',
		props: ['enableDel','bgColorType','value', 'enableAdd'],
		data() {
			return {
				tagString:'',
				isShowDelIcon: this.enableDel || false,
				isShowAdd: this.enableAdd || false
			}
		},
		computed:{
			tagBgColor: function(){
				if(this.bgColorType === null){
					return 'tagBgDefault'
				}else if(this.bgColorType === 'primary'){
					return 'tagBgPrimary'
				}else if(this.bgColorType === 'success'){
					return 'tagBgSuccess'
				}else if(this.bgColorType === 'warn'){
					return 'tagBgWarning'
				}else if(this.bgColorType === 'error'){
					return 'tagBgError'
				}else{
					return 'tagBgDefault'
				}
			}
		},
		methods: {
			createTags: function(){
				let tempTagArr = []
				if(this.tagString.length>0){
					let newvalue = this.tagString.split(/,|，/)
					for(let i=0;i<newvalue.length;i++){
						let newTag = newvalue[i].trim()
						
						if(newTag !== '' && this.value.indexOf(newTag) < 0){
							tempTagArr.push(newTag)
						}
					}
				}
				this.tagString = ''
				this.value.splice(this.value.length,0, ...tempTagArr)
				this.$emit('add', {
					currentTag: tempTagArr,
					allTags: this.value
				})
				this.$emit('input', this.value)
			}, 
			delTag: function(e){
				let delTagText = e.currentTarget.dataset.text
				let delTagIndex = this.value.map(i=>i.partsName).indexOf(delTagText)
				this.value.splice(delTagIndex,1)
				this.$emit("delete", {
					currentTag: delTagText,
					allTags: this.value
				})
				this.$emit('input', this.value)
			},
			tapTag: function(e){
				let selTagText = e.currentTarget.dataset.text
				this.$emit("click", selTagText)
			}
		}
	}
</script>

<style>
	.tagController{
		padding: 10upx;	
	}
	.tagContainer{
		display: flex;
		flex-wrap: wrap;
		flex-direction: row;
		justify-content: flex-start;
		max-height: 360rpx;
		overflow-y: auto;
	}
	.tagItem{
		padding: 4rpx 8rpx;
		border-radius: 4rpx;
		margin: 10upx;
		min-height: 52rpx;
		line-height: 52rpx;
		border: 1px solid rgba(0, 0, 0, 0.5);
		background-color:  white !important;
		color: rgba(0, 0, 0, 0.5) !important;
		min-width:100rpx;
		max-width: 400rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.tagItemActive{
		padding: 4rpx 8rpx;
		border-radius: 8rpx;
		margin: 10upx;
		min-height: 52rpx;
		line-height: 52rpx;
		justify-content: center;
		border: 1px solid #1794D1;
		background-color: #E3F5FE !important;
		color: #1794D1 !important;
		min-width:100rpx;
		max-width: 400rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space:nowrap;
	}
	.tagBgDefault{
		background-color: #cfcfcf;
		color: black;
	}
	.tagBgPrimary{
		background-color: #E3F5FE !important;
	}
	.tagBgSuccess{
		background-color: #1794D1 !important;
	}
	.tagBgWarning{
		background-color: #f0ad4e;
	}
	.tagBgError{
		background-color: #dd524d;
	}
	.tagDelIcon{
		padding-left: 20upx;
	}
	.tagInput{
		padding: 10upx;
	}
	.tagInput input{
		width: 60%;
		display: inline-block;
	}
</style>