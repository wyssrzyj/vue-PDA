<template>
	<view class="wyh_table">
		<view class="fixed_left" :class="{rightBorder:rightBorder}">
			<view class="th">
				<view class="td tick" v-if="select" v-html="selectStr"></view>
				<template v-for="(th, ind) in thList">
					<view class="td" :class="{active:nSortKey==th.sortKey&&th.sortKey}" v-if="th.fixed" :key="ind" :style="{width: th.width||'220rpx'}"  @click="bindSort(th.sortKey)">
						<view v-html="th.text"></view>
						<view class="ic" :class="nSort" v-if="th.sortKey"></view>
					</view>
				</template>
			</view>
			<view class="tr" v-for="(item, ind) in list" :key="ind" @click="links?bindLinks(item):bindClick(item)">
				<view class="td tick" :class="{checked:item.checked,disabled:item.disabled}" @click.stop="bindSelect(ind)" v-if="select"></view>
				<template v-for="(th, index) in thList">
					<view class="td" v-if="th.fixed" :key="index" :style="{width: th.width||'220rpx'}">
						<view class="mark" v-if="th.markKey && item[th.markKey]">{{item[th.markKey]}}</view>
						<view class="txt">{{ th.dataKey == 'index'?ind+1 : item[th.dataKey] }}</view>
					</view>
				</template>
			</view>
		</view>
		<view class="scroll_right">
			<scroll-view scroll-x="true">
				<view class="th">
					<template v-for="(th, ind) in thList">
						<view class="td" :class="{active:nSortKey==th.sortKey&&th.sortKey}" v-if="!th.fixed" :key="ind" :style="{width: th.width||'220rpx'}" @click="bindSort(th.sortKey)">
							<view v-html="th.text"></view>
							<view class="ic" :class="nSort" v-if="th.sortKey"></view>
						</view>
					</template>
				</view>
				<view class="tr" :class="{disabled:item.disabled}" v-for="(item, ind) in list" :key="ind" @click="links?bindLinks(item):bindClick(item)">
					<template v-for="(th, index) in thList">
						<view class="td" v-if="!th.fixed" :key="index" :style="{width: th.width||'220rpx'}">
							<view class="mark" v-if="th.markKey && item[th.markKey]">{{item[th.markKey]}}</view>
							<!-- <view v-if="th.markKey && item[th.markKey]" v-html="item[th.markKey]"></view> -->
							<input class="val" :type="th.inputType" v-model="item[th.dataKey]" :placeholder="th.inputPlaceholder" @confirm="bindConfirm(ind)" @input="(e)=>bindInput(e,ind,th.dataKey)"  v-if="th.isInput" :style="{width: th.inputWidth||'80rpx', height: th.inputHeight||'44rpx', fontSize: th.inputSize||'28rpx', color: th.inputColor||'#333'}"/>
							<!-- <uni-easyinput class="val" :type="th.inputType" v-model="th.unit" :placeholder="th.inputPlaceholder" :clearable="th.inputClearable" v-if="th.isInput"/> -->
							<text v-else v-html="th.dataKey == 'index'?ind+1 : item[th.dataKey]"></text>
							<text class="unit" v-if="th.unit">{{th.unit}}</text>
						</view>
					</template>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"wyh-table",
		props: {
			// 表头
			thList: {
				type: Array,
				default: () => { return []}
			},
			// 是否可选
			select: {
				type: String,
				default: ''     //空  不可选    radio   单选   multiple   多选
			},
			// 选择列表头
			selectStr: {
				type: String,
				default: '选择'
			},
			// 列表数据
			items: {
				type: Array,
				default: () => { return []}
			},
			// 默认选中项id
			activeIds: {
				type: Array,
				default: () => { return []}
			},
			// 排序
			sort: {
				type: String,
				default: 'desc' 	//desc 降序    acs 升序
			},
			//排序字段
			sortKey: {
				type: String,
				default: ''			//排序关键词
			}, 
			// 是否可点击
			isClick: {
				type: Boolean,
				default: false
			},
			// 路由页面 自主传参
			links: {
				type: String,
				default: ''
			},
			// 路由参数 多个用,隔开
			linksKey: {
				type: String,
				default: ''
			},
			// 是否显示固定区与滚动区的分隔线
			rightBorder: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				list: this.items,
				nSort: this.sort,
				nSortKey: this.sortKey
			};
		},
		watch: {
			items: {
				handler(ret, oldValue) {
					this.list = ret;
				},
				deep: true //深度侦听
			},
			sort: function (ret) {
				this.nSort = ret;
			},
			sortKey: function (ret) {
				this.nSortKey = ret;
			}
		},
		
		methods: {
			// 排序
			bindSort(sortKey) {
				if(!sortKey) return false;
				if(this.nSortKey == sortKey) {
					this.nSort = this.nSort == 'desc' ? 'acs' : 'desc';
				} else {
					this.nSortKey = sortKey;
					this.nSort = 'desc';
				}
				let sortData = {
					sort: this.nSort,
					sortKey: this.nSortKey
				};
				this.$emit('onSort', sortData);
			},
			// 选择
			bindSelect(ind) {
				let that = this;
				let _list = this.list;
				_list.map(function (item, i) {
					if( that.select=='radio') {
						if(i == ind) {
							item.checked = !item.checked;
						} else {
							item.checked = false;
						}
					} else {
						if(i == ind) {
							item.checked = !item.checked;
						}
					}
				})
				this.list = [];
				this.list = _list;
				this.$emit('onSelect',this.list[ind]);
			},
			//输入confirm事件
			bindConfirm(ind){
				let _list = this.list;
				let obj = this.list[ind];
				this.$emit('onSetting',obj);
			},
			//输入input事件
			bindInput(e,ind,itemKey){
				let _list = this.list;
				// let obj = this.list[ind];
				// e: input $event事件，ind: 整行对象的index，itemKey: 修改的这一行的key
				this.$emit('onInput',e, ind, itemKey);
			},
			bindClick(item) {
				if(this.isClick) {
					this.$emit('onClick', item);
				}
			},
			bindLinks(items){
				if(this.links&&this.linksKey) {
					if(this.linksKey.indexOf(',')!=-1){
						let keylist = this.linksKey.split(',');
						let keyTxt = '';
						for (var i = 0; i < keylist.length; i++) {
							if(i==0){
								keyTxt = '?'+keylist[i]+'='+items[keylist[i]]
							}else{
								keyTxt = keyTxt+'&'+keylist[i]+'='+items[keylist[i]]
							}
						}
						this.$loginOpenWin(this.links+keyTxt)
					}else{
						this.$loginOpenWin(this.links+'?'+this.linksKey+'='+items[this.linksKey])
					}
				}
			}
		},
		created() {
			let that = this;
			if(this.activeIds.length) {
				this.list.map(function (item) {
					if(that.activeIds.indexOf(item.id) != -1) {
						item.checked = true;
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wyh_table {
		background: #fff;
		margin-top: 20rpx;
		display: flex;
		.fixed_left {
			flex-shrink: 0;
			&.rightBorder {
				box-shadow: 1px 0 5px 0 rgba(0,0,0, 0.08);
			}
			.tick {
				width: 80rpx;
			}
			.tr {
				.tick {
					background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAhCAYAAABX5MJvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkRBQ0E4QThCOTRDRDExRUFCRDg0RkMxOTJCQTUzQjNDIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkRBQ0E4QThDOTRDRDExRUFCRDg0RkMxOTJCQTUzQjNDIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6REFDQThBODk5NENEMTFFQUJEODRGQzE5MkJBNTNCM0MiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6REFDQThBOEE5NENEMTFFQUJEODRGQzE5MkJBNTNCM0MiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qB3NUAAACcElEQVR42sSYzUsUcRjHxymToN0OWR07FJRdCoTMXjA7RO91qEuHMIte0F4OpX+DN8tDKRRJh4UIdiko8mJQZhZBXnqlP8DYDq4HsbD6PPGdWMXR2W12fg98mFlm5nm+y/x+z8tUZTIZrwTbAvt1XA8rYDmMw3f4BK/hsY6RzI9wz1Jog8/QD8ugF/bCGqjS0X7f0nW77wu06/l5bfEC14/ADXgHp2Ao5L5xYYEfwlXYDh06vwK5UkXUKPhuaIFBr3Qb0p9ohj7YB5dgKsrrSMMTqIX6MgUU26D8rJTf9EIilkAWvsIxKHjxmPk5Lr9ZxQkV0QMTcB5+e/HatPwWFGdOEUe1Bk7qgUrYtPw3K94MEbaNuuFsjK8gzCYUpzvYvoGIVhiNYRFGtWfa9qeLRVyGLi9Z69KW/SuiAX7By4RFDGuNNJiIPcpyLuyRxTcRW+GFIxEWt9FE1MEHRyLewwZf5XjMkYhvVh585fKCIxEWN+XrJO1IRMqSl6+OaLUjERY372tR1jkSsRE+mohXsMORCOu+hk3EABx2JMLiDpiIEaXvbQkLaIRFFj8oYNehM2ERnepj/1XRO7BJzUYStgs2w+1iEZNqy3u1dyudG/oUb3J2e5dTs9Gvd1UJM793FScX1ui2q9W/qckqbgE2oa2Ci/N12z/gIKyDBzGmc/NzH9bCgdkDkB9SVGxaysNbaPpPAU3yk5ffQtSB2JSeg2taI1nt61LzQFbPd8jfVDkDsS2ep3AG7sFPtWTPVXPG1MKnVIysBu2EQ1Ct/HMi2AXlTuXB9u0RwfeJC/o+UVvUj+T1feKNJviRqFPcHwEGAJnihtSlWLryAAAAAElFTkSuQmCC') center center no-repeat;
					background-size: 34rpx auto;
					&.checked {
						background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAABF9JREFUWEfVmV1sU2UYx//PKUN0jRiDeqGsXUaMMX7GmJjghUMjih+J6AzxKz1lfoTEnXKhwRgNCQmTcbF2RCI6expijEFFGRHxhnGjdwYxE9FA1k4vVEz5sMAi6/s3b9fK2vXjnPa0Y+9d0/d5nt/7nOec933/j6CB8deudf7MWV+30FgukNsg6AJwnQjaFaGEOANBGsRxgj9S1Lf+9uzotU9vz9QbVtwaEpDf4taDWcAUkccBXO7Sx3mSIxAmgubQNwLQjb0r4KQdWQ3gLQB3uAlSZe4PADYFzehup/4cAU8kXu1SMD4ApdupY1fzhKMG1IsdoW3Ha9nVBB63+9YIjB0ArqzlrJH/CfwDqJc6zaFPqvmpCpyyI+8QeB1AzYU1AjvTVoAtATO6oZK/iiDjces9EXnZKxA3fkju6AzHXilnUxY4aVsDgLzmJoj3c7k1aMb00y0as4BTces5iuxsZRlUWCyFfCEQjn1UUjIXfx4bXr+szeAhCvzeZ8y9RyEyhpI7l/YOHitYF2U4GbcOQJr06XLPO21BGQ2GB1fMAk7FI09R8Gm9fptpJ0RPIBz9TMfIZZiEpGxrDCI3NzNw/b55JBCK3SIC5oCTdt8qwPiqfoetsFSPBM2hfXngyOcA9DlhjgaPKqXWtC0wOKWwVyAdZUB2B83okzL27jq//4q2E4AsmhtaHiUudHea2//Q8VO21U9ImZ2Ok5lzF66RVNx6lCJ7LwVYfb4+f3bhdwRuLccj5GP6ZauwomYvoTizGvZcZuHXENxbKTLJLZJMRPaBeLjZeMX+3cPmP8r7JWlHfgFwY+uA64XNEf6qgU8BWNwa4IZgNeJpSdrWFCA+F8A/AfQBcpMLG709FX0NnNRsqX8RTOkMTwK4zGHwL4Nm9IldPT2+u1ddPyxAyJld47D5Gs5KKhE5QWKJo8CKm4NrY2/mtvONG41k4NSHtaG9gs0R5kriZ+ePlyeRVfcHe7cdcgbtKWyurGQ8bu3J6wuOkgwiDZV9oDa017CAECOSikc2U/CGM9r8rJrQ3sPqyEL06wyvFJH9roBz9TA706mOk8Mw5B7y3xWFs0E9X4MqO91Dcnjn8+2Ls1f/Xdfhpwz07zecvmpp72BaB/USFuDkIl96SePHyxLoQna8hdWXDH7RGY6t9uYAXwLtNex0EmYc4HNXpIQ1BjRwRSLSFPWsQU5QfO8DWO76vahoIEcCocGLVyQ9b15dQgsLS8bXH4CwOQplnekmcLDTjP7PVKRLaCFlgY/fN1updMF+Ziordy2rJKRoR3l59eNLQaoi1DOl8mtZMTBlWwOcYzFQwK0BJ2Jg4XHNK7l1eueFTNiR/lYL2iQGguHohkrNmprK+rxqGRTKQzdlsjSGBXKfizfc8VSCB32iej1pysyMmm97vQ3gdsc01Scezipu6lob01KZo1GzJEq96NpO2n0rDRghAnU1FgUYUVDNbyyWwldq3QLMK/iiW7R/etm6/Q/OJF/YK1kLKAAAAABJRU5ErkJggg==') center center no-repeat;
						background-size: 34rpx auto;
					}
				}
			}
		}
		.scroll_right {
			flex: 1;
			overflow: hidden;
		}
		.th, .tr {
			display: flex;
			flex-wrap: nowrap;
			position: relative;
			&:before {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				border-bottom: 1px solid #f4f4f4;
				// border-top: none;
			}
			&.disabled {
				opacity: 0.5;
			}
			.td {
				flex-shrink: 0;
				display: flex;
				font-weight: blod;
				align-items: center;
				justify-content: center;
				height: 80rpx;
				font-size: 28rpx;
				color: #333;
				padding: 0 14rpx;
				box-sizing: border-box;
				border: 1px solid #f4f4f4;
				.mark {
					display: flex;
					align-items: center;
					justify-content: center;
					background: #E09F70;
					color: #fff;
					width: 28rpx;
					height: 24rpx;
					border-radius: 5rpx;
					margin-right: 8rpx;
					font-size: 20rpx;
				}
				.txt {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box; /*（多行）*/
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					font-size: 24rpx;
				}
				.val {
					text-align: center;
					box-sizing: border-box;
					padding: 0 10rpx;
					border: 1px solid #ebebeb;
					border-radius: 10rpx;
					font-size: 24rpx;
				}
				.unit {
					margin-left: 10rpx;
					font-size: 26rpx;
					color: #666;
				}
			}
		}
		.th {
			.td {
				font-weight: blod;
				color: #666;
				font-size: 32rpx;
				text-align: center;
				.ic {
					width: 28rpx;
					height: 28rpx;
					background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAZFJREFUOE/tlD1Ow0AUhGdIIiE6JFpoKeEE2M9JhCiBAyCBOANwgQjOwI84ATQUREG7DieAlg6oAVGFwvZDa+Io2SQQqHG3u/P57c+8Ibyv3W7Pp2l6TXIqSZLVer3+5GvcmN4k4zi+UdUoXyRvgyAISaoPD4DGmG2Sp55oV0ROxoKtVmuhXC7fAZjtF6nqu6ouVavVx/75vKKqTllrLcmVkef52rKQzIr1HDTGHJBsjIL65g5E5LAHGmMWSbotTv8AfqRpulSr1R7yi7PWXgBY/wEqli9FZKMAOxNUK8COiMzkoDGmQXIbwByA0rjKqvpK8lhE9kcZYMIdDzvnH+y7gaHnUNWMZAqg4t3UC4CT3nNYa/9mgN9YjuRFGIabhXP+ZnJHW2v3APRaZowL9kXkaKAfXSPHcWwABGOgdhiG0VAjO7FLtyzL7v3oAPCWJMmyn3YDYWWt3QJw7mXOThRFZ9+mXPe8NwCqXWEsIi4qv49HJ242m/OVSuXK9WapVFoLguB5ZIBN3Eee0E/yif/zCdaWmh2MDIR+AAAAAElFTkSuQmCC') center center no-repeat;
					background-size: auto 100%;
				}
				
				&.active {
					color: #333333;
				
					.desc {
						background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAeBJREFUOE/tlL2O00AUhc9xEoSoQKJDIUFbbBmegDD5EaIEHgA5CJC2MVTsdqkiaJBBomLX2ScIDQVSVuOEJ1hahFAMouSvyoqNc5GdTRTPOsQPgAtLvnO+udcz517CeIbDYTEMw3ckrclkcqPZbH4xNdE3jSAHg8GBiNTiRfJ9tVq9TlJMOAFqrVsk9wzRfaXU7kqw3+9fzufzhwAuLItE5LeIVOr1erAcjzOKiOX7vk/yWur/zEpWJKfz9RjUWu+Q7KRBS7EdpdTTBai13iQZlXh2DXgUhmGl0Wh8jA/O9/0egFtroPnyG6XU7Tk4zpBtDo6VUudiUGvdIdkCcBFAblVmEflB8rVSajvNABkrPu2c/+DSCTDwHnUEaIEn1yGYgggBFAxTf58Cu1dsd3Ydo64zBrjObgsDlG13ZoCR5/RAZrVcr2y7d2Lw856zaVk4XJ9VjsLjSWXjwauZyaNX0HWeCLhomdSehGyX7BfPEv0o7bYVlH5pANUV1hmWgvM1ttvJRo7E37yt4jELHwAmRgcgP8M/cnXj4cvEtEsMq8B7fFco+0bWe2Xb9cxKzPGIUdc5AFg/EQ5Ktlsj8O/xGIk/eVvFHM+8JZAriHXzUuv51/TDytxISeGpUrPu8xe9f5wdtPORjAAAAABJRU5ErkJggg==') center center no-repeat;
						background-size: auto 100%;
					}
				
					.acs {
						background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAeRJREFUOE/llLtOG0EUhv+zFylKFSRKbC4pKOEFjHeIpYgy8ACOLWgosDugc2VBFROJKmCHFzBNCiyhHZsnIG2Uiw01l85IsHvQ7IJhNqwNabPFSjPnfHtmzv7nJ0Sen9XlhAX7AATDM/j92+znk2iOWtPjTQaoUyseApgNgoSj5MeKQwBHYQ1s14p5ALtaEmNpLF/ZiQV/7a0kTZ+OARqKJF363vX0xOJ25/F+UJFLJaM9eiEJNBNzn6Nk542gUsm/jwfgn2pxnQjlp6CHRFofzX3a6K1/7xYmDQPqiK/6gQBfWcbN1Eh2+0fQuHa1UAfRh/5QGGXm/fH81nwI1grdwdV6n+2O5SqvA7BTLZYZyBNhmAEztjLjnIm/jOe21v4SwHOOq3X1JcB/BbquWyYiNRXDAExm9onIA2BHmnYGYEcIEf4OKWUXwAC5PQhACBEKQEpZB/AsyRFR3XGchQB0XXeSSM3hwKpXnudNZTKZUOTqJaVcBdAbmRhBrAkhNjUBMLPRbDZdAOkYqOU4ziwR6YOsklutVsL3/e8AotZxYVnWdCqV0txOMyspZRbA10jVRSGEbmBRe7y7r7LHd3dwUwihrLK/ParkRqORsG37mxKDaZpz6XT69Kl7a0d9yXj9M3gLYQ2RHbHQz5oAAAAASUVORK5CYII=') center center no-repeat;
						background-size: auto 100%;
					}
				}
			}
		}
	}
</style>
