<template>
    <div>
        <mt-header :title="bookName">
            <router-link icon="back" to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <mt-button slot="right" @click="updateNovelBookFromZhwenpg">更新</mt-button>
        </mt-header>
        <mt-cell :title="item.title" v-for="item in booklist" :key="item.id" :to="'/bookcontent/'+item.id+'/'+bookName+'/'+item.title"></mt-cell>
    </div>
</template>
<script>
    import axios from "axios";

    export default {
        name: "booklist",
        data(){
            return{
                booklist:[],
                bookName:'',
                bookId:'',
            }
        },
        mounted() {
            const _this = this;
            _this.bookId = _this.$route.params.id
            _this.bookName = _this.$route.params.name
            _this.queryList();
        },
        methods:{
            queryList(){
                const _this = this;
                axios({
                    url:'/novelBook/contentList/'+_this.bookId
                }).then(res=>{
                    if (res.data.state === 'success') {
                        _this.booklist = res.data.obj;
                    }
                })
            },
            updateNovelBookFromZhwenpg(){
                const _this = this;
                let id = _this.bookId
                axios({
                    url:'reptile/updateNovelBookFromZhwenpg?bookId='+id,
                }).then(res=>{
                    if (res.data === -1) {
                        _this.$Toast('服务异常')
                    }else if (res.data === -2) {
                        _this.$Toast('1小时内只能更新一次,请稍后重试')
                    }else{
                        _this.$Toast('正在更新,条数:'+res.data)
                    }
                }).catch(()=>{
                    _this.$Toast('服务异常')
                })
            },
        }
    }
</script>

<style scoped>

</style>