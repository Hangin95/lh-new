<template>
	<view @click="open">
		<!-- 基础卡片 -->
		<view v-if="item.mode === 'base'" class="list-card">
			<view class="listcard-image">
				<image :src="item.cover[0]" mode="aspectFill"></image>
			</view>
			<view class="listcard-content">
				<view class="listcard-content_title">
					<text>{{item.title}}</text>
					<likes :types="types" :item="item"></likes>
				</view>
				<view class="listcard-content_des">
					<view class="listcard-content_des__label">
						<view class="listcard-content_des__label-item">
							{{item.classify}}
						</view>
					</view>
					<view class="listcard-content_des__look">
						{{item.browse_count}}浏览
					</view>
				</view>
			</view>
		</view>

		<!-- 多图模式 -->
		<view v-if="item.mode === 'column'" class="list-card mode-column">

			<view class="listcard-content">
				<view class="listcard-content_title">
					<text>{{item.title}}</text>
					<likes :types="types" :item="item"></likes>
				</view>
				<view class="listcard-image">
					<view v-if="index < 3" v-for="(item,index) in item.cover" :key="index" class="listcard-image__item">
						<image :src="item" mode="aspectFill"></image>
					</view>
				</view>
				<view class="listcard-content_des">
					<view class="listcard-content_des__label">
						<view class="listcard-content_des__label-item">
							{{item.classify}}
						</view>
					</view>
					<view class="listcard-content_des__look">
						{{item.browse_count}}浏览
					</view>
				</view>
			</view>
		</view>

		<!-- 大图模式 -->
		<view v-if="item.mode === 'image'" class="list-card mode-image">
			<view class="listcard-image">
				<image :src="item.cover[0]" mode="aspectFill"></image>
			</view>
			<view class="listcard-content">
				<view class="listcard-content_title">
					<text>{{item.title}}</text>
					<likes :types="types" :item="item"></likes>
				</view>
				<view class="listcard-content_des">
					<view class="listcard-content_des__label">
						<view class="listcard-content_des__label-item">
							{{item.classify}}
						</view>
					</view>
					<view class="listcard-content_des__look">
						{{item.browse_count}}浏览
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		props: {
			mode: {
				type: String,
				default: 'base'
			},
			item: {
				type: Object,
				default () {
					return {}
				}
			},
			types: {
				type: String,
				default: ''
			}
		},
		data() {
			return {

			};
		},
		methods: {
			open() {
				const item = this.item;
				const params = {
					_id: item._id,
					browse_count: item.browse_count,
					create_time: item.create_time,
					title: item.title,
					thumbs_up_count: item.thumbs_up_count,
					author: item.author
				}
				//传参注意长度
				uni.navigateTo({
					url: "/pages/home-detail/home-detail?params=" + JSON.stringify(params)
				})
				this.$emit('clickCard', this.item)
			}
		}
	}
</script>

<style lang="scss">
	.list-card {
		display: flex;
		align-items: center;
		padding: 10px;
		margin: 10px;
		border-radius: 5px;
		box-shadow: 0 0 5px rgba($color: #000000, $alpha: .1);
		box-sizing: border-box;

		.listcard-image {
			width: 60px;
			height: 60px;
			border-radius: 5px;
			overflow: hidden;
			box-sizing: border-box;
			// 如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。
			flex-shrink: 0;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.listcard-content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-left: 10px;
			width: 100%;

			.listcard-content_title {
				position: relative;
				padding-right: 30px;
				font-weight: 400;
				line-height: 1.2;
				color: #333;
				font-size: 14px;

				text {
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}


			}

			.listcard-content_des {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 12px;
				margin-top: 5px;

				.listcard-content_des__label {
					display: flex;

					.listcard-content_des__label-item {
						padding: 0 5px;
						border: 1px $lh-base-color solid;
						border-radius: 15px;
						color: $lh-base-color;
						margin-right: 5px;
					}

				}

				.listcard-content_des__look {
					color: #666;
				}
			}
		}

		&.mode-column {
			.listcard-content {
				width: 100%;
				padding-left: 0;

				.listcard-image {
					display: flex;
					margin-top: 10px;
					width: 100%;
					height: 70px;

					.listcard-image__item {
						margin-left: 10px;
						width: 100%;
						border-radius: 5px;
						overflow: hidden;

						&:first-child {
							margin-left: 0;
						}

						image {
							width: 100%;
							height: 100%;
						}
					}

				}

				.listcard-content_des {
					margin-top: 10px;
				}
			}
		}

		&.mode-image {
			flex-direction: column;

			.listcard-image {
				width: 100%;
				height: 100px;
			}

			.listcard-content {
				padding-left: 0;
				margin-top: 10px;

				.listcard-content_des {
					margin-top: 10px;
				}
			}
		}
	}
</style>
