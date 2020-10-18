<template>
	<view class="home">
		<navbar></navbar>
		<tab :list="tabList" @tab="tab" :tabIndex="tabIndex"></tab>
		<view class="home-list">
			<list :tab="tabList" @change="change" :activeIndex="activeIndex"></list>
		</view>
	</view>
</template>

<script>
	// 在uni-app中
	//easyCom @/components/组件/组件.vue 局部引用
	//在根目录有components 默认就是自定义组件，无需再自己引用注册
	//例如无需：
	//引用
	// import navbar from '@/components/navbar/navbar.vue'
	//注册
	// components:{
	// 	navbar
	// },
	
	var user = {
		name:'哇哈哈哈'
	}
	var count = 12
	Object.defineProperty(user,'age',{
		get:function(){
			console.log("获取值");
			return count
		},
		set:function(newVal){
			console.log("设置值");
			count = newVal+1
		}
	})
	user.age = 11
	console.log(user.age);
	import {mapState} from 'vuex'
	export default {

		data() {
			return {
				"tabList": [],
				"tabIndex": 0,
				"activeIndex": 0
			}
		},
		computed:{
			...mapState(['userinfo'])
		},
		watch:{
			userinfo(newVal){
				this.getLabel()
			}
		},
		onLoad() {
			uni.$on('labelChange',(res)=>{
				this.tabList = []
				this.tabIndex = 0
				this.activeIndex = 0
				this.getLabel()
			})
		},
		methods: {
			getLabel() {
				console.log(this.$api);
				this.$api.get_label().then((res) => {
					const {
						data
					} = res
					data.unshift({
						name:'全部'
					})
					this.tabList = data;
				})
			},
			tab(data) {
				this.activeIndex = data.index;
			},
			change(current) {
				this.tabIndex = current;
				this.activeIndex = current;
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		display: flex;
	}

	.home {
		display: flex;
		flex-direction: column;
		flex: 1;
		overflow: hidden;

		.home-list {
			flex: 1;
			box-sizing: border-box;
		}
	}
</style>
