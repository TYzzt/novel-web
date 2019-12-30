<template>
    <div>
        <van-nav-bar
                title="novel.ineedthis"
                right-text="新建"
                @click-right="onClickRight"
        />
        <van-search placeholder="搜索" v-model="searchValue" />
        <van-loading v-show="loading" size="24px">加载中...</van-loading>
        <van-index-bar :index-list="booklisttypes">
            <template v-for="(items,key) in booklistmap" >
                <van-index-anchor :index="key" :key="key" v-show="!searchValue">{{key}}
                </van-index-anchor>
                <van-cell :title="item.bookName" v-for="item in items" :key="item.id" v-show="item._show">
                    <van-button  type="default" @click="toContentList(item)" size="small">开始阅读</van-button>
                    <van-button  type="default" @click="deleteNovelBook(item.id)" size="small">删除</van-button>
                </van-cell>
            </template>
        </van-index-bar>
    </div>
</template>
<script>
    import axios from 'axios';
    export default {
        name: "booklist",
        data(){
          return{
              loading:true,
              booklist:[],
              booklistmap:{},
              booklisttypes:[],
              searchValue:'',
          }
        },
        watch: {
            searchValue() {
                let v = this.searchValue;
                let map = this.booklistmap;
                for (let key in map) {
                    let list = this.booklistmap[key];
                    list.forEach(item=>{
                        item._show = !v||v===''||item.bookName.indexOf(v) !== -1;
                    })
                }
            }},
        mounted() {
            this.queryBooklist();
        },
        methods:{
            queryBooklist() {
                const _this = this;
                _this.loading = true
                axios({
                    url:'/novelBook/book/list'
                }).then(res=>{
                    if (res.data.state === 'success') {
                        let list = res.data.obj;
                        let map = {};
                        let listtype = [];
                        list.forEach(item=>{
                            item._show = true
                            if(!item.category){
                                item.category = '**'
                            }
                            if (!map[item.category]) {
                                map[item.category] = [];
                                listtype.push(item.category);
                            }
                            map[item.category].push(item);
                        })
                        _this.booklistmap = map;
                        _this.booklisttypes = listtype;
                        // eslint-disable-next-line no-console
                        console.log(map)
                    }
                }).finally(()=>{
                    _this.loading = false;
                })
            },
            /*跳跃到读小说页面*/
            toContentList(item){
                let to = '/bookcontentlist/'+item.id+'/'+item.bookName
                this.loading = true;
                this.$router.push(to).catch(() => {})
                this.loading = false;
            },
            /*删除小说*/
            deleteNovelBook(id) {
                const _this = this;
                this.loading = true;
                axios({
                    url:'novelBook/makeNovelBookInvaild?bookId='+id,
                }).then(res=>{
                    if (res.data.obj < 0) {
                        _this.$Toast({
                            message: '服务异常',
                        });
                    }else{
                        _this.$Toast({
                            message: '删除成功',
                        });
                    }
                }).catch(()=>{
                    _this.$Toast({
                        message: '服务异常',
                    });
                }).finally(()=>{
                    this.loading = false;
                })
            },
            onClickRight() {
                this.$router.push('/newbook').catch(() => {})
            }
        }
    }
</script>

<style scoped>

</style>