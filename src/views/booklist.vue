<template>
    <div>
        <div>
            <strong>书,ineedthis</strong>
        </div>
        <ul>
            <li v-for="item in booklist" :key="item.id">
                <router-link :to="'/bookcontentlist/'+item.id+'/'+item.bookName"> {{ item.bookName }}</router-link> <a href="#" @click="updateNovelBookFromZhwenpg(item.id)">更新</a>
            </li>
        </ul>
    </div>
</template>
<script>
    import axios from 'axios';
    export default {
        name: "booklist",
        data(){
          return{
              booklist:[]
          }
        },
        mounted() {
            const _this = this;
            axios({
                url:'/novelBook/book/list'
            }).then(res=>{
                if (res.data.state === 'success') {
                    _this.booklist = res.data.obj;
                }
            })

        },
        methods:{
            updateNovelBookFromZhwenpg(id){
                axios({
                    url:'reptile/updateNovelBookFromZhwenpg?bookId='+id,
                }).then(res=>{
                    if (res.data === -1) {
                        alert('服务异常')
                    }else{
                        alert('更新条数:'+res.data)
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>