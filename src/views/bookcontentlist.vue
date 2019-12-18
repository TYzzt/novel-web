<template>
    <div>
        <div>
            <router-link :to="'/'"> 首页</router-link>
        </div>
        <div>
            <strong>{{bookName}}</strong>
        </div>
        <ul>
            <li v-for="item in booklist" :key="item.id">
                <router-link :to="'/bookcontent/'+item.id+'/'+bookName+'/'+item.title"> {{ item.title }}</router-link>
            </li>
        </ul>
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
            }
        }
    }
</script>

<style scoped>

</style>