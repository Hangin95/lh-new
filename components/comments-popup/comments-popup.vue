<template>
	<!-- 评论弹出层 -->
	<uni-popup type="bottom" ref="popup" :maskClick="false">
		<view class="popup-wrap">
			<view class="popup-header">
				<text class="popup-header__item" @click="popupClose">取消</text>
				<text class="popup-header__item" @click="submit">发布</text>
			</view>
			<view class="popup-content">
				<textarea class="popup-textarea" maxlength="200" fixed v-model="commentsValue" placeholder="请输入评论内容" />
				<view class="popup-count">
						{{commentsValue.length}}/200 
					</view>
				</view>
			</view>
	</uni-popup>
</template>

<script>
	export default {
		props:{
			popupOpen:{
				type:Boolean,
				default:false
			},
			replyFormData:{
				type:Object,
				default:{}
			},
			article_id:{
				type:String || Number,
				default:''
			}
		},
		data() {
			return {
				commentsValue:''
			};
		},
		watch:{
			popupOpen(newVal){
				if(newVal){
					this.$refs.popup.open()
				}
			}
		},
		methods:{
			//关闭弹出层
			popupClose(){
				this.$emit('popupClose',false)
				this.$refs.popup.close()
			},
			//点击发布
			submit(){
				if(!this.commentsValue){
					uni.showToast({
						title:"请输入评论内容",
						icon:"none"
					})
					return 
				}
				this.commentSubmit({"content":this.commentsValue,...this.replyFormData})
			},
			//提交发布内容云函数
			commentSubmit(content){
				uni.showLoading()
				this.$api.update_comment({
					article_id:this.article_id,
					...content
				}).then((res)=>{
					uni.hideLoading()
					uni.showToast({
						title:'评论发布成功'
					})
					// this.getComments()
					this.popupClose()
					this.$emit('commentSubmit')
					this.commentsValue = ''
				})
			},
		}
	}
</script>

<style lang="scss">
.popup-wrap{
		background-color: #fff;
		.popup-header{
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 14px;
			color: #666;
			border-bottom: 1px #f5f5f5 solid;
			.popup-header__item{
				height: 50px;
				line-height: 50px;
				padding: 0 15px;
			}
		}
		.popup-content{
			width: 100%;
			padding: 15px;
			box-sizing: border-box;
			.popup-textarea{
				width: 100%;
				height: 200px;
			}
			.popup-count{
				display: flex;
				justify-content: flex-end;
				color: #999;
				font-size: 12px;
			}
		}
	}
</style>
