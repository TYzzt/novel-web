<template>
    <div>
        <h1>booklist</h1>
        <ul>
            <li v-for="item in booklist" :key="item.id">
                <router-link :to="'/bookcontent/'+item.id"> {{ item.bookName }}</router-link>
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

        }
    }
</script>

<style scoped>

</style>