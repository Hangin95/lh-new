<template>
	<view class="icons" @click.stop="likeTop">
		<uni-icons color="#fe350e" size='20' :type="like?'heart-filled':'heart'"></uni-icons>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default () {
					return {}
				}
			},
			types:{
				type:String,
				default:''
			}
		},
		data() {
			return {
				like: false
			};
		},
		watch: {
			item(newVal) {
				this.like = this.item.is_like
			}
		},
		created() {
			this.like = this.item.is_like
		},
		methods: {
			likeTop() {
				this.setUpdateLikes()
			},
			setUpdateLikes() {
				uni.showLoading()
				this.$api.update_like({
					user_id: "5f3fe47ea406e900014f2518",
					article_id: this.item._id
				}).then((res) => {
					uni.hideLoading();
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					uni.$emit('update_article',this.types)
					this.like = !this.like
				}).catch((err) => {
					uni.hideLoading();
				})
			}
		}
	}
</script>

<style lang="scss">
	.icons {
		position: absolute;
		top: 0;
		right: 0;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
