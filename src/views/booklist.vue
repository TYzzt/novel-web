<template>
    <div>

    <!--    <ul>
            <li v-for="item in booklist" :key="item.id">
                <router-link :to="'/bookcontentlist/'+item.id+'/'+item.bookName"> {{ item.bookName }}</router-link> <a href="#" @click="updateNovelBookFromZhwenpg(item.id)">更新</a>
            </li>
        </ul>-->
        <mt-header title="novel.ineedthis">
            <router-link to="/newbook" slot="right">
                <mt-button >新建</mt-button>
            </router-link>
        </mt-header>
        <mt-index-list>
            <mt-index-section :index="key" v-for="(items,key) in booklistmap" :key="key" >
                <mt-cell :title="item.bookName" v-for="item in items" :key="item.id" >
                    <mt-button  type="default" @click="toContentList(item)" size="small">开始阅读</mt-button>
                    <mt-button  type="default" @click="deleteNovelBook(item.id)" size="small">删除</mt-button>
<!--                    <mt-button slot type="default" @click="updateNovelBookFromZhwenpg(item.id)" size="small">更新</mt-button>-->
                </mt-cell>
            </mt-index-section>
        </mt-index-list>
    </div>

</template>
<script>
    import axios from 'axios';
    export default {
        name: "booklist",
        data(){
          return{
              booklist:[],
              booklistmap:{}
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
                    list.forEach(item=>{
                        if(!item.category){
                            item.category = '**'
                        }
                        if (!map[item.category]) {
                            map[item.category] = [];
                        }
                        map[item.category].push(item);
                    })
                    _this.booklistmap = map;
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
            }
        }
    }
</script>

<style scoped>

</style>