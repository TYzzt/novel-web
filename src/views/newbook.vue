<template>
    <div>
        <mt-header title="新建ReptileBook">
            <router-link to="/" slot="left">
                <mt-button icon="back"></mt-button>
            </router-link>
        </mt-header>
        <div>
            <mt-field label="书名" placeholder="请输入书名" v-model="novelbook.bookName"></mt-field>
            <mt-field label="网站根URL" placeholder="网站根URL" v-model="novelbook.webUrl"></mt-field>
            <mt-field label="目录URL" placeholder="目录URL" v-model="novelbook.fromUrl"></mt-field>
            <mt-field label="作者" placeholder="作者" v-model="novelbook.author"></mt-field>
            <mt-field label="类别" placeholder="修真 科幻 游戏.." v-model="novelbook.category"></mt-field>
            <mt-field label="封面URL" placeholder="请输入书名" v-model="novelbook.pic"></mt-field>
            <mt-field label="目录前置cssQuery" placeholder=".mlcontent #list" v-model="novelbook.mlPQuery"></mt-field>
            <mt-field label="目录cssQuery" placeholder="a标签" v-model="novelbook.mlQuery"></mt-field>
            <mt-field label="内容cssQuery" placeholder=".content" v-model="novelbook.contentQuery"></mt-field>
            <mt-field v-show="false" value="0" v-model="novelbook.state"></mt-field>

            <mt-button style="width:90%" type="primary" @click="newBook">提 交</mt-button>
        </div>
    </div>
</template>
<script>
    import axios from "axios";

    export default {
        name: "newbook",
        data(){
            return{
                novelbook:{}
            }
        },
        mounted() {
        },
        methods:{
            newBook(){
                const _this = this;
                axios({
                    url:'/novelBook/insertNovelBook',
                    data:_this.novelbook
                }).then(res=>{
                    if (res.data.state === 'success') {
                        _this.$Toast("success");
                        _this.novelbook = {}
                        setTimeout(function () {
                            _this.$router.push('/').catch(() => {})
                        },1000)
                    }
                })
            },

        }
    }
</script>

<style scoped>

</style>