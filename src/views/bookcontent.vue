<template>
    <div :style="'background:'+color+';font-size:'+fontSize+'px;wdith:100%'">
        <div>
            <strong>书,ineedthis</strong>
        <p>
            背景色:<input v-model="color"/>
        </p>
            <p>
            字体:<input v-model="fontSize"/>
             </p>
        </div>


        字体:<input v-model="fontSize"/>
        <select name="public-choice" v-model="contentId" @change="getCouponSelected($event)">
            <option :value="item.id" :key="item.id" v-for="item in bookcontentList" >{{item.title}}</option>
        </select>
        <div class="content" v-if="content">
            <p v-html='content.content'>
            </p>
            <button @click="pre" style="margin-right: 5px">上一章 </button>
            <button @click="next"> 下一章</button>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import Cookies from 'js-cookie'
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
                    let cookieI = Cookies.get('bookcontentI' + _this.bookId);
                    if (cookieI) {
                        _this.getCouponSelected(null, cookieI);
                    }
                }
            })
        },
        methods:{
            getCouponSelected(e,i){
                if (!i) {
                    i = e.target.options.selectedIndex;
                }
                const _this = this;
                //记录cookie
                Cookies.set('bookcontentI'+_this.bookId, i);
                _this.contentIndex = i;
                _this.contentId = _this.bookcontentList[i].id;
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
                    this.getCouponSelected(null,i);
                    document.documentElement.scrollTop = document.body.scrollTop = 0;
                }else {
                    alert("无");
                }
            },
            pre(){
                let i = this.contentIndex - 1;
                if (this.bookcontentList[i]) {
                    this.contentId = this.bookcontentList[i].id;
                    this.getCouponSelected(null,i);
                    document.documentElement.scrollTop = document.body.scrollTop = 0;
                }else {
                    alert("无");
                }
            }
        }
    }
</script>

<style scoped>
.content{
    overflow-y: auto;
    margin-bottom: 20px;
}
    input{
        background-color:transparent;
        border-color:#2c3e50;
    }
    select{
        background-color:transparent;
        border-color:#2c3e50;
    }
    button{
        background-color:transparent;
        border-color:#2c3e50;
    }
select{
    -webkit-appearance: none;
}
input[type=datetime-local]{
    -webkit-appearance:none;
    outline:none;
    border:none;
}
</style>