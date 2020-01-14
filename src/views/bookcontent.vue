<template>
    <div :style="'background:'+color+';font-size:'+fontSize+'px;wdith:100%;'"  v-wechat-title="bookContentBean.title">
        <van-overlay :show="showOverlay">
            <div class="wrapper" >
               <van-loading type="spinner" />
            </div>
        </van-overlay>
        <div>
            <div>
                <strong>{{bookContentBean.title}}</strong>
            </div>
        </div>
        <div class="colorConfig">
            <p>
                背景色:<input v-model="color" @change="changeColor"/>
            </p>
            <p>
                字体:<input v-model="fontSize" @change="changeColor"/>
            </p>
        </div>

        <div class="content" v-if="bookContentBean">
            <div class="qhContent">
                <button class="pre" @click="pre">上一章 </button>
                <button @click="toMl('/bookcontentlist/'+bookContentBean.bookId+'/'+bookName)">目录</button>
                <button class="next" @click="next"> 下一章</button>
            </div>
            <p v-html='bookContentBean.content'>
            </p>
            <div class="qhContent">
                <button class="pre" @click="pre" style="margin-right: 5px">上一章 </button>
                <button @click="toMl('/bookcontentlist/'+bookContentBean.bookId+'/'+bookName)">目录</button>
                <button class="next" @click="next"> 下一章</button>
            </div>

 <!--           <van-list
                    v-model="contentLoading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="next"
            >
                <van-cell
                        v-for="item in contentlist"
                        :key="item.id"
                >
                    <p v-html='item.content'>
                    </p>
                </van-cell>
            </van-list>-->

        </div>
    </div>
</template>

<script>

    let nextRecord = null;

    import axios from 'axios';
    import Cookies from 'js-cookie'
    export default {
        name: "bookcontent",
        data(){
            return{
                bookContentId:null,
                bookContentBean:{},
                color:'grey',
                fontSize:'20',
                bookName:'',
                contentLoading:false,
                finished:false,
                showOverlay:false,//遮罩
            }
        },
        mounted() {
            this.bookContentId = this.$route.params.contentid
            this.bookName = this.$route.params.name
            this.getCouponSelected();

            let cookieI = Cookies.get('bookcontentColor'); //记录背景颜色信息
            // eslint-disable-next-line no-console
            console.log(cookieI);
            if (cookieI) {
                cookieI = JSON.parse(cookieI);
                if (cookieI.color) {
                    this.color = cookieI.color;
                    this.fontSize = cookieI.fontSize
                }
            }

        },
        watch: {
  /*          $route(){
                this.bookContentId = this.$route.params.contentid
                this.bookName = this.$route.params.name
            },
            bookContentId() {
                this.getCouponSelected();
            }*/
        },
            methods:{
            /*获取内容*/
            getCouponSelected(){
                const _this = this;
                _this.showOverlay = true
                axios({
                    url:'/novelBook/content/'+_this.bookContentId
                }).then(res=>{
                    if (res.data.state === 'success') {
                        _this.bookContentBean = res.data.obj;
                        _this.getNext();
                    }
                }).finally(()=>{
                    _this.showOverlay = false;
                })
            },
            getNext(){
                nextRecord = null;
                const _this = this;
                axios({
                    url:'/novelBook/nextContent/'+_this.bookContentBean.bookId+'/'+_this.bookContentBean.sortIndex
                }).then(res=>{
                    if (res.data.state === 'success') {
                        if (res.data.obj.id) {
                            nextRecord = res.data.obj
                        }
                    }
                })
            },
            next(){
                const _this = this;
                if (nextRecord) {
                    _this.bookContentBean = nextRecord;
                    _this.bookContentId =nextRecord.id;
                    _this.$router.push('/bookcontent/' + nextRecord.id + '/' + _this.bookName+'/'+nextRecord.title).catch(() => {})
                    document.documentElement.scrollTop = document.body.scrollTop = 0; //跳转回最上面
                    _this.getNext();
                }else {
                    _this.showOverlay = true;
                    axios({
                        url:'/novelBook/nextContent/'+_this.bookContentBean.bookId+'/'+_this.bookContentBean.sortIndex
                    }).then(res=>{
                        if (res.data.state === 'success') {
                            if (!res.data.obj.id) {
                                _this.$Toast("没有了");
                            }else {
                                _this.bookContentBean = res.data.obj;
                                _this.bookContentId = res.data.obj.id;
                                _this.$router.push('/bookcontent/' + res.data.obj.id + '/' + _this.bookName+'/'+res.data.obj.title).catch(() => {})
                                document.documentElement.scrollTop = document.body.scrollTop = 0; //跳转回最上面
                                _this.getNext();
                            }
                        }
                        // eslint-disable-next-line no-unused-vars
                    }).catch(e=>{
                        // eslint-disable-next-line no-console
                        console.log(e);
                        _this.$Toast("没有了");
                    }).finally(()=>{
                        _this.showOverlay = false;
                    })
                }
            },
            pre(){
                nextRecord = null;
                const _this = this;
                _this.showOverlay = true;
                axios({
                    url:'/novelBook/preContent/'+_this.bookContentBean.bookId+'/'+_this.bookContentBean.sortIndex
                }).then(res=>{
                    if (res.data.state === 'success') {
                        if (!res.data.obj.id) {
                            _this.$Toast("没有了");
                        }else {
                            _this.bookContentBean = res.data.obj;
                            _this.bookContentId = res.data.obj.id;
                            _this.$router.push('/bookcontent/' + res.data.obj.id + '/' + _this.bookName+'/'+res.data.obj.title).catch(() => {})
                            document.documentElement.scrollTop = document.body.scrollTop = 0; //跳转回最上面
                        }
                    }
                    // eslint-disable-next-line no-unused-vars
                }).catch(e=>{
                    // eslint-disable-next-line no-console
                    console.log(e);
                    _this.$Toast("没有了");
                }).finally(()=>{
                    _this.showOverlay = false;
                })
            },
            changeColor(){
                const _this = this;
                Cookies.set('bookcontentColor',{
                    color:_this.color,
                    fontSize:_this.fontSize,
                })
        },
                toMl(to){
                    this.$router.push(to).catch(() => {})
                }
        }
    }
</script>

<style scoped>
.content{
    overflow-y: auto;
    margin-bottom: 20px;
    min-height: 500px;
    margin-left:8px;
    margin-right:8px;
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

    .colorConfig p{
       font-size: small;
    }

    .qhContent .pre{
        margin-right: 20px;
        margin-bottom: 40px;
    }
    .qhContent .next{
        margin-left: 20px;
    }


.wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>