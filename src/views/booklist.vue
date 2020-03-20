<template>
    <div>
        <van-nav-bar
                left-text="新建"
                @click-left="onClickLeft"
                :right-text="rightClickStr"
                @click-right="onClickRight"
        >
            <van-button slot="title" size="mini" plain style="border: 0" @click="queryBooklist" type="info" >novel.ineedthis</van-button>
        </van-nav-bar>
        <van-search placeholder="搜索" v-model="searchValue" />
        <van-overlay :show="overLayShow" @click="overLayShow = false" >
            <div class="wrapper" @click="overLayShow = false">
                <div class="block">
                    点击右上角，选择在浏览器中打开
                </div>
            </div>
        </van-overlay>
        <van-notice-bar
                color="#1989fa"
                background="#ecf9ff"
                left-icon="info-o"
                v-show="noticeShow"
                mode="closeable"
                @click="tocontentByNotice"
        >
            {{'继续阅读 '+noticeBean.bookName+' '+noticeBean.title}}
        </van-notice-bar>
        <van-loading v-show="loading" size="24px">加载中...</van-loading>
        <van-index-bar :index-list="booklisttypes">
            <template v-for="(items,key) in booklistmap" >
                <van-index-anchor :index="key" :key="key" v-show="!searchValue">{{key}}
                </van-index-anchor>
                <van-cell :title="item.bookName" v-for="item in items" :key="item.id" v-show="item._show">
                    <van-button  type="default" @click="toContentList(item)" size="small">开始阅读</van-button>
                    <van-button  type="default" @click="deleteNovelBook(item.id)" size="small">删除</van-button>
                </van-cell>
            </template>
        </van-index-bar>
        <van-action-sheet  v-model="actionShow" :actions="actions" @select="actionSelect" />
    </div>
</template>
<script>
    import axios from 'axios';
    import {n_localstorage} from "../util/localstorage.js";
    import {pageUrl} from "../util/pageUrl.js";

    var browser = {
        versions: function () {
            var u = navigator.userAgent;
            return {         //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()
    }

    export default {
        name: "booklist",
        data(){
          return{
              loading:true,
              booklist:[],
              booklistmap:{},
              booklisttypes:[],
              searchValue:'',
              rightClickStr:'登陆',

              actionShow:false,
              actions:[
                  { name: '注销',type:'logout' }
              ],
              noticeShow:false,
              noticeBean:{},
              overLayShow:false
          }
        },
        watch: {
            searchValue() {
                let v = this.searchValue;
                let map = this.booklistmap;
                for (let key in map) {
                    let list = this.booklistmap[key];
                    list.forEach(item=>{
                        item._show = !v||v===''||item.bookName.indexOf(v) !== -1;
                    })
                }
            },
            '$route.path':function(newVal){
                if(newVal === '/index'){
                    this.queryLastRead();
                }
            }
            },

        mounted() {
            this.checkBrow();
            this.queryBooklist();
            this.queryUser();
        },

        methods:{
            checkBrow(){ //检查浏览器
                if (browser.versions.mobile) {//判断是否是移动设备打开。browser代码在下面
                    var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
                    if (ua.match(/MicroMessenger/i) == "micromessenger") {
                        //在微信中打开
                        this.overLayShow = true;
                    }
                    if (ua.match(/WeiBo/i) == "weibo") {
                        //在新浪微博客户端打开
                        //在微信中打开
                        this.overLayShow = true;
                    }
                    if (ua.match(/QQ/i) == "qq") {
                        //在QQ空间打开
                        //在微信中打开
                        this.overLayShow = true;
                    }
                    if (browser.versions.ios) {
                        //是否在IOS浏览器打开
                    }
                    if(browser.versions.android){
                        //是否在安卓浏览器打开
                    }
                } else {
                    //否则就是PC浏览器打开
                }
            },
            queryLastRead() {
                const _this = this;
                if (!_this.$simpleStore.state.userInfo) {
                    return;
                }
                axios({
                    url:pageUrl.queryLastRead
                }).then(res=>{
                    if (res.data.state === 'success' && res.data.obj) {
                        _this.noticeBean = res.data.obj
                        _this.noticeShow = true;
                    }
                });
            },
            queryBooklist() {
                const _this = this;
                _this.loading = true
                axios({
                    url:'/novelBook/book/list'
                }).then(res=>{
                    if (res.data.state === 'success') {
                        let list = res.data.obj;
                        let sc = '推荐',scByUser = '收藏'
                        let map = {'收藏':[],'推荐':[]};
                        let listtype = [scByUser,sc];
                        list.forEach(item=>{
                            item._show = true
                            if (item.isCollection && item.isCollection === 1) {
                                map[sc].push(item);
                            }
                            if (item.isUserCollection && item.isUserCollection === 1) {
                                map[scByUser].push(item);
                            }
                            if(!item.category){
                                item.category = '**';
                            }
                            if (!map[item.category]) {
                                map[item.category] = [];
                                listtype.push(item.category);
                            }
                            map[item.category].push(item);
                        })
                        _this.booklistmap = map;
                        _this.booklisttypes = listtype;
                    }
                }).finally(()=>{
                    _this.loading = false;
                })
            },
            /*跳跃到读小说页面*/
            toContentList(item){
                let to = {path:'/bookcontentlist/'+item.id+'/'+item.bookName}
                this.loading = true;
                n_localstorage.set('book',item)
                this.$router.push(to).catch(() => {})
                this.loading = false;
            },
            /*删除小说*/
            deleteNovelBook(id) {
                const _this = this;
                this.loading = true;
                axios({
                    url:pageUrl.addCollection,
                    params:{
                        bookId:id,
                        type:0
                    }
                }).then(res=>{
                    if (res.data.state === 'success') {
                        if (res.data.obj < 0) {
                            _this.$Toast({
                                message: '服务异常',
                            });
                        }else{
                            _this.$Toast({
                                message: '删除成功',
                            });
                            _this.queryBooklist();
                        }
                    }else {
                        _this.$Toast(res.data.message)
                    }
                }).catch(()=>{
                    _this.$Toast({
                        message: '服务异常',
                    });
                }).finally(()=>{
                    this.loading = false;
                })
            },
            onClickLeft() {
                this.$router.push('/newbook').catch(() => {})
            },
            onClickRight(){
                if (this.rightClickStr === '登陆') {
                    if (this.$simpleStore.state.userInfo) {
                        this.rightClickStr = this.$simpleStore.state.userInfo.userName
                    }else {
                        this.$router.replace('/login').catch(()=>{});
                    }
                }else {
                    this.actionShow = true;
                }
            },
            queryUser(){
                const _this = this;
                let i = -1;
                let dsq = setInterval(function () {
                    i += 1;
                    let a = i % 3;
                    if (a === 0) {
                        str = '.';
                    }
                    let str = '';
                    for (let j = 0; j <= a; j++) {
                        str += '.';
                    }
                    _this.rightClickStr = str;
                }, 1000);

                axios({
                    url:pageUrl.queryUserByToken
                }).then(res=>{
                    if (res.data.state === 'success' && res.data.obj) {
                        _this.$simpleStore.setUserInfo(res.data.obj);
                        _this.rightClickStr = res.data.obj.userName;
                        this.queryLastRead();
                    }else {
                        _this.rightClickStr = '登陆';
                    }
                }).catch(()=>{
                    _this.rightClickStr = '登陆';
                }).finally(()=>{
                    clearInterval(dsq)
                })

            },
            actionSelect(event) {
                if (event.type === 'logout') {
                    axios({
                        url:'intUser/logout'
                    })
                    this.rightClickStr = '登陆';
                    this.$simpleStore.clearUserInfo();
                }
                this.actionShow = false;
            },
            tocontentByNotice() {
                if (this.noticeBean) {
                    var item = this.noticeBean
                    var to ='/bookcontent/'+item.id+'/'+item.bookName+'/'+item.title
                    this.$router.push(to).catch(() => {})
                }
            }
        },

    }
</script>

<style scoped>
    .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
    }
    .block {
        width: 200px;
        height: 120px;
        color: #fff;
    }
</style>