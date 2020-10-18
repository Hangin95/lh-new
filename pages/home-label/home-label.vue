<template>
	<view class="label">
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">我的标签</view>
				<view class="label-edit" @click="editLabel">{{is_edit?"完成":"编辑"}}</view>
			</view>
			<uni-load-more v-if="loading" iconType="snow" status="loading"></uni-load-more>
			<view class="label-content">
				<view v-if="!loading" class="label-content__item" v-for="(item,index) in myLabel" :key="item._id">
					{{item.name}}
					<uni-icons @click="del(index)" v-if="is_edit" class="icons-close" type="clear" size="16" color="red"></uni-icons>
				</view>
				<view v-if="myLabel.length === 0 && !loading" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
		<view class="label-box">
			<view class="label-header">
				<view class="label-title">标签推荐</view>
			</view>
			<uni-load-more v-if="loading" iconType="snow" status="loading"></uni-load-more>
			<view class="label-content">
				<view v-if="!loading" class="label-content__item" @click="add(index)" v-for="(item,index) in labelList" :key="item._id">
					{{item.name}}
				</view>
				<view v-if="labelList.length === 0 && !loading" class="no-data">
					当前没有数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				is_edit: false,
				myLabel: [],
				labelList: [],
				loading: false
			}
		},
		onLoad() {
			this.getLabel()
		},
		methods: {
			editLabel() {
				if (this.is_edit) {
					this.setUpdateLabel(this.myLabel);
					this.is_edit = false;
				} else {
					this.is_edit = true
				}

			},
			del(index) {
				this.labelList.push(this.myLabel[index])
				this.myLabel.splice(index, 1)
			},
			add(index) {
				if (!this.is_edit) return
				this.myLabel.push(this.labelList[index])
				this.labelList.splice(index, 1)
			},
			setUpdateLabel(label) {
				let newArrIds = []
				label.forEach(item => {
					newArrIds.push(item._id)
				})
				uni.showLoading()
				this.$api.update_label({
					label: newArrIds
				}).then((res) => {
					uni.hideLoading()
					uni.showToast({
						title: res.msg,
						icon: 'none'
					})
					//自定义事件
					uni.$emit('labelChange')
				})
			},
			getLabel() {
				this.loading = true
				this.$api.get_label({
					type: 'all'
				}).then((res) => {
					console.log(res)
					let {
						data
					} = res
					this.loading = false 
					this.myLabel = data.filter(item => item.current)
					this.labelList = data.filter(item => !item.current)
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.label {
		.label-box {
			background-color: #fff;
			margin-bottom: 10px;

			.label-header {
				display: flex;
				justify-content: space-between;
				padding: 10px 15px;
				font-size: 14px;
				color: #666;
				border-bottom: 1px #f5f5f5 solid;

				.label-edit {
					color: #30b33a;
					font-weight: bold;
				}
			}

			.label-content {
				display: flex;
				flex-wrap: wrap;
				padding: 15px;
				padding-top: 0;

				.label-content__item {
					position: relative;
					padding: 2px 5px;
					margin-top: 12px;
					margin-right: 10px;
					border-radius: 5px;
					border: 1px #666 solid;
					font-size: 14px;
					color: #666;

					.icons-close {
						position: absolute;
						top: -8px;
						right: -8px;
						background-color: #fff;
						border-radius: 50%;
					}
				}
			}
		}
	}
	.no-data{
		width: 100%;
		padding: 50px 0;
		font-size: 14px;
		color: #999;
		text-align: center;
	}
</style>
