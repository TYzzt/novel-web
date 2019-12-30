<template>
    <div>
        <van-nav-bar
                title="新建ReptileBook"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />
        <div>
            <van-field label="书名" placeholder="请输入书名" v-model="novelbook.bookName"></van-field>
            <van-field label="网站根URL" placeholder="网站根URL" v-model="novelbook.webUrl"></van-field>
            <van-field label="目录URL" placeholder="目录URL" v-model="novelbook.fromUrl"></van-field>
            <van-field label="作者" placeholder="作者" v-model="novelbook.author"></van-field>
            <van-field label="类别" placeholder="修真 科幻 游戏.." v-model="novelbook.category"></van-field>
            <van-field label="封面URL" placeholder="请输入书名" v-model="novelbook.pic"></van-field>
            <van-field label="目录前置cssQuery" placeholder=".mlcontent #list" v-model="novelbook.mlPQuery"></van-field>
            <van-field label="目录cssQuery" placeholder="a标签" v-model="novelbook.mlQuery"></van-field>
            <van-field label="内容cssQuery" placeholder=".content" v-model="novelbook.contentQuery"></van-field>
            <van-field v-show="false" value="0" v-model="novelbook.state"></van-field>

            <van-button style="width:90%" type="primary" @click="newBook">提 交</van-button>
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
            onClickLeft(){
                this.$router.go(-1)
            }

        }
    }
</script>

<style scoped>

</style>