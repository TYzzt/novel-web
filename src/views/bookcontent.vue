<template>
    <div :style="'background:'+color+';font-size:'+fontSize+'px'">
        <h3>bookcontent</h3>
        背景色:<input v-model="color"/>
        字体:<input v-model="fontSize"/>
        <select name="public-choice" v-model="contentId" @change="getCouponSelected($index)">
            <option :value="item.id" :key="item.id" v-for="item in bookcontentList" >{{item.title}}</option>
        </select>
        <div class="content" v-if="contentId">
            <p v-html='content.content'>
            </p>
            <button @click="pre">上一章</button>
            <button @click="next">下一章</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "bookcontent",
        data(){
            return{
                bookId:null,
                bookcontentList:[],
                contentId:null,
                content:null,
                contentIndex:0,
                color:'grey',
                fontSize:'20'
            }
        },
        mounted() {
            const _this = this;
            _this.bookId = _this.$route.params.id
            axios({
                url:'/novelBook/contentList/'+_this.bookId
            }).then(res=>{
                if (res.data.state === 'success') {
                    _this.bookcontentList = res.data.obj;
                }
            })
        },
        methods:{
            getCouponSelected(i){
                const _this = this;
                _this.contentIndex = i;
                axios({
                    url:'/novelBook/content/'+_this.contentId
                }).then(res=>{
                    if (res.data.state === 'success') {
                        _this.content = res.data.obj;
                    }
                })
            },
            next(){
                let i = this.contentIndex + 1;
                if (this.bookcontentList[i]) {
                    this.contentId = this.bookcontentList[i].id;
                    this.getCouponSelected(i);
                }else {
                    alert("无");
                }
            },
            pre(){
                let i = this.contentIndex - 1;
                if (this.bookcontentList[i]) {
                    this.contentId = this.bookcontentList[i].id;
                    this.getCouponSelected(i);
                }else {
                    alert("无");
                }
            }
        }
    }
</script>

<style scoped>

</style>