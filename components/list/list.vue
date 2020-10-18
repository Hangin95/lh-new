<template>
	<swiper class="home-swiper" @change="change" :current="activeIndex">
		<swiper-item v-for="(item,index) in tab" :key="index" class="swiper-item">
			<list-item :list="listCatchData[index]" :load="load[index]" @loadmore="loadmore"></list-item>
		</swiper-item>
	</swiper>
</template>

<script>
	import listItem from './list-item.vue'
	export default {
		components: {
			listItem
		},
		props: {
			tab: {
				type: Array,
				default () {
					return []
				}
			},
			activeIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				list: [],
				listCatchData: {},
				load: {},
				pageSize: 10
			};
		},
		watch: {
			tab(newVal) {
				if (newVal.length === 0) return
				this.list = []
				this.listCatchData = {}
				this.load = {}
				this.getList(this.activeIndex)
			}
		},
		created() {
			uni.$on('update_article', (e) => {
				console.log(e);
				if (e === 'follow') {
					//清空数据，避免key重复
					this.listCatchData = {}
					this.load = {}
					this.getList(this.activeIndex)
				}
			})
		},
		methods: {
			loadmore() {
				if (this.load[this.activeIndex].loading === 'noMore') return
				this.load[this.activeIndex].page++
				this.getList(this.activeIndex)
			},
			change(e) {
				const {
					current
				} = e.detail;
				this.$emit('change', current)
				//TODO 当数据不存在或者长度为0的时候再去请求数据
				if (!this.listCatchData[current] || this.listCatchData.length === 0) {
					this.getList(current)
				}
			},
			//获取列表
			getList(current) {
				if (!this.load[current]) {
					this.load[current] = {
						page: 1,
						loading: "loading"
					}
				}
				this.$api.get_list({
					name: this.tab[current].name,
					page: this.load[current].page,
					pageSize: this.pageSize
				}).then(res => {
					console.log(res);
					const {
						data
					} = res;
					if (data.length === 0) {
						let oldLoad = {};
						oldLoad.loading = 'noMore';
						oldLoad.page = this.load[current].page;
						this.$set(this.load, current, oldLoad);
						// 强制渲染页面
						this.$forceUpdate()
						return
					}
					let oldList = this.listCatchData[current] || [];
					oldList.push(...data)
					//懒加载
					this.$set(this.listCatchData, current, oldList);
				})
			}
		}
	}
</script>

<style lang="scss">
	.home-swiper {
		height: 100%;

		.swiper-item {
			height: 100%;
			overflow: hidden;
		}
	}
</style>
