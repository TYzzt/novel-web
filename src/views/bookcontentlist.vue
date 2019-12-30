<template>
    <div>
        <van-nav-bar
                :title="bookName"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        >
            <van-button plain hairline type="info"  size="mini" @click="actionShow=!actionShow" slot="right" >操作</van-button>
<!--            <van-button plain hairline type="info"  size="mini" @click="contentReversal" slot="right" >收藏</van-button>-->
         <!--   <van-button plain hairline type="info"  size="mini" @click="contentReversal" slot="right" >章节颠倒</van-button>
            <van-button plain hairline type="info"  size="mini" @click="updateNovelBookFromZhwenpg" slot="right" >更新</van-button>-->
        </van-nav-bar>
        <van-loading v-show="loading" size="24px">加载中...</van-loading>

        <van-index-bar :index-list="bookcontentlistmaptype">
            <template v-for="(items,key) in bookcontentlistmap" >
                <van-index-anchor :index="key" :key="key">{{key}}
                </van-index-anchor>
                <van-cell :title="item.title" v-for="item in items" :key="item.id"  :to="'/bookcontent/'+item.id+'/'+bookName+'/'+item.title">
                </van-cell>
            </template>
        </van-index-bar>
        <van-action-sheet  v-model="actionShow" :actions="actions" @select="actionSelect" />
    </div>
</template>
<script>
    import axios from "axios";
    import {n_localstorage} from "../util/localstorage.js";
    import {pageUrl} from "../util/pageUrl.js";
    let deleteContentCount = 0;
    export default {
        name: "bookcontentlist",
        data(){
            return{
                loading:true,
                bookcontentlistmap:{},
                bookcontentlistmaptype:[],
                bookName:'',
                bookId:'',
                actionShow:false, //弹出菜单
                actions:[
                    { name: '更新',type:'update' },
                    { name: '清除章节',type:'deleteContent' },
                    { name: '章节颠倒',type:'contentReversal' },
                    { name: '收藏', type:'updateCollection'}
                ],

            }
        },
        mounted() {
            const _this = this;
            // eslint-disable-next-line no-console
            console.log(_this.$route.params);
            _this.bookId = _this.$route.params.id
            _this.bookName = _this.$route.params.name

            let cookieI = n_localstorage.get('contentlist'); // => 'value'
            if (cookieI && cookieI.length>0) {
                if (cookieI[0].bookId != _this.bookId) {
                    _this.queryList();
                }else {
                    _this.showContentList(cookieI);
                }
            }else {
                _this.queryList();
            }
        },
        methods:{
            showContentList(list){
                this.loading = false;
                let map = {}
                let indextype = ['0'];
                if (!list) {
                    map['0']='暂无列表'
                }else {
                    let i = -1;
                    let size = list.length>100?100:list.length
                    let index = '0-'+size
                    indextype = [index]
                    map[index] = []
                    list.forEach(item=>{
                        i += 1;
                        if (i >size) {
                            size += 100;
                            index = i+'-'+size
                            map[index] = []
                            indextype.push(index);
                        }
                        map[index].push(item);
                    })
                }
                this.bookcontentlistmap= map;
                this.bookcontentlistmaptype= indextype;
            },
            queryList(){
                const _this = this;
                _this.loading = true;
                axios({
                    url:'/novelBook/contentList/'+_this.bookId
                }).then(res=>{
                    if (res.data.state === 'success') {
                        //记录目录数据
                        n_localstorage.set('contentlist', res.data.obj,120);
                        _this.showContentList(res.data.obj)
                    }
                }).finally(()=>{
                    _this.loading = false;
                })
            },
            updateNovelBookFromZhwenpg(){
                const _this = this;
                let id = _this.bookId
                _this.loading = true;
                n_localstorage.remove('contentlist');
                axios({
                    url:'reptile/updateNovelBookFromZhwenpg?bookId='+id,
                }).then(res=>{
                    // eslint-disable-next-line no-console
                    console.log(res)
                    if (res.data === -1) {
                        _this.$Toast('服务异常')
                    }else if (res.data === -2) {
                        _this.$Toast('1小时内只能更新一次,请稍后重试')
                    }else if(res.data ===0){
                        _this.$Toast('无更新')
                    }else{
                        _this.$Toast('正在更新,条数:'+res.data)
                    }
                }).catch(()=>{
                    _this.$Toast('服务异常')
                }).finally(()=>{
                    _this.loading = false;
                })
            },
            onClickLeft(){
                this.$router.push('/')
            },
            /*颠倒顺序*/
            contentReversal(){
                const _this = this;
                let id = _this.bookId
                _this.loading = true;
                axios({
                    url:'novelBook/contentReversal/'+id,
                }).then(res=>{
                    if (res.data.state === 'success') {
                        _this.$Toast('章节顺序颠倒')
                        _this.loading = true;
                        _this.queryList();
                    }
                }).catch(()=>{
                    _this.$Toast('服务异常')
                }).finally(()=>{
                    _this.loading = false;
                })
            },
            actionSelect(item){
                const _this = this;
                if (item.type==='update') {
                    _this.updateNovelBookFromZhwenpg();
                }else if (item.type === 'contentReversal') {
                    _this.contentReversal();
                }else if (item.type === 'updateCollection') {
                    _this.updateCollection();
                }else if (item.type === 'deleteContent' && ++deleteContentCount>10) {
                    _this.deleteContent();
                }
                _this.actionShow = false;
            },
            updateCollection(){
                const _this = this;
                let book = n_localstorage.get('book');
                // eslint-disable-next-line no-console
                console.log(book);
                let sc = 1;
                if (book && book.id==_this.bookId) {
                    if (book.isCollection && book.isCollection===1) {
                        sc = 0;
                    }
                }
                _this.loading = true;
                axios({
                    url:pageUrl.updateNovelBook,
                    params:{
                        id:_this.bookId,
                        isCollection:sc
                    }
                }).then(res=>{
                    if (res.data.state === 'success') {
                        if (sc === 1) {
                            _this.$Toast('收藏成功')
                        }else {
                            _this.$Toast('取消收藏成功')
                        }
                    }
                }).catch(()=>{
                    _this.$Toast('服务异常')
                }).finally(()=>{
                    _this.loading = false;
                })
            },
            deleteContent(){
                const _this = this;
                _this.loading = true;
                axios({
                    url:pageUrl.deleteContentsByBookId,
                    params:{
                        bookId:_this.bookId,
                    }
                }).then(res=>{
                    if (res.data.state === 'success') {
                        n_localstorage.remove('contentlist')
                        _this.$router.go(-1);
                    }
                }).catch(()=>{
                    _this.$Toast('服务异常')
                }).finally(()=>{
                    _this.loading = false;
                })
            }
        }
    }
</script>

<style scoped>

</style>