<template>
    <div>
        <van-nav-bar
                title="novel.ineedthis"
                right-text="新建"
                @click-right="onClickRight"
        />
        <van-index-bar :index-list="booklisttypes">
            <template v-for="(items,key) in booklistmap" >
                <van-index-anchor :index="key" :key="key">{{key}}
                </van-index-anchor>
                <van-cell :title="item.bookName" v-for="item in items" :key="item.id" >
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
              booklist:[],
              booklistmap:{},
              booklisttypes:[],
          }
        },
        mounted() {
            const _this = this;
            axios({
                url:'/novelBook/book/list'
            }).then(res=>{
                if (res.data.state === 'success') {
                    let list = res.data.obj;
                    let map = {};
                    let listtype = [];
                    list.forEach(item=>{
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
            })

        },
        methods:{
            /*更新小说*/
            updateNovelBookFromZhwenpg(id){
                axios({
                    url:'reptile/updateNovelBookFromZhwenpg?bookId='+id,
                }).then(res=>{
                    if (res.data === -1) {
                        alert('服务异常')
                    }else if (res.data === -2) {
                        alert('1小时内只能更新一次,请稍后重试')
                    }else{
                        alert('正在更新,条数:'+res.data)
                    }
                })
            },
            toContentList(item){
                let to = '/bookcontentlist/'+item.id+'/'+item.bookName
                this.$router.push(to).catch(() => {})
            },
            deleteNovelBook(id) {
                const _this = this;
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