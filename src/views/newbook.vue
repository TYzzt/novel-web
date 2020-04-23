<template>
    <div>
        <van-nav-bar
                title="新建ReptileBook"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />
        <div>
            <van-field label="Site" disabled v-model="novelSites[choseNovelSiteIndex].siteName" @click="novelSitePicker=true"></van-field>

            <van-popup v-model="novelSitePicker" position="bottom">
                <van-picker
                        show-toolbar
                        :columns="novelSites"
                        @cancel="novelSitePicker = false"
                        @confirm="onChange"
                        :default-index="choseNovelSiteIndex"
                        value-key="siteName"
                />
            </van-popup>

<!--            <van-popup v-model="novelSitePicker" position="bottom" > <van-picker :show-toolbar="true" @cancel="novelSitePicker = false"-->
<!--                                                                                 @change="onChange"  :columns="novelSites" :default-index="choseNovelSiteIndex" value-key="siteName"/></van-popup>-->
            <van-field label="原始id" laceholder="wunjuc" v-model="novelbook.oriBookId"></van-field>
            <van-field label="书名" placeholder="请输入书名" v-model="novelbook.bookName"></van-field>
<!--            <van-field label="网站根URL" placeholder="网站根URL" v-model="novelbook.webUrl"></van-field>-->
<!--            <van-field label="目录URL" placeholder="目录URL" v-model="novelbook.fromUrl"></van-field>-->
            <van-field label="作者" placeholder="作者" v-model="novelbook.author"></van-field>
            <van-field label="类别" placeholder="修真 科幻 游戏.." v-model="novelbook.category"></van-field>
<!--            <van-field label="封面URL" placeholder="请输入书名" v-model="novelbook.pic"></van-field>-->
<!--            <van-field label="目录前置cssQuery" placeholder=".mlcontent #list" v-model="novelbook.mlPQuery"></van-field>-->
<!--            <van-field label="目录cssQuery" placeholder="a标签" v-model="novelbook.mlQuery"></van-field>-->
<!--            <van-field label="内容cssQuery" placeholder=".content" v-model="novelbook.contentQuery"></van-field>-->
            <van-field v-show="false" value="1" v-model="novelbook.state"></van-field>

            <van-button style="width:90%" type="primary" @click="newBook">提 交</van-button>
        </div>
        <div>
            <van-cell-group>
                <van-cell :title="item.name" :key="item.id" value="测试" is-link v-for="(item) in testList" @click="testReptile(item.id)"/>
                <p v-show="testResult!=null">{{testResult}}</p>
            </van-cell-group>
        </div>
    </div>
</template>
<script>
    import axios from "axios";

    export default {
        name: "newbook",
        data(){
            return{
                novelbook:{},
                novelSites:[{id:0,siteName:'加载中'}],
                choseNovelSiteIndex:0,
                novelSitePicker:false,
                testList:[], //测试列表
                testResult:null,//测试结果
            }
        },
        mounted() {
            this.queryAllNovelSite();
        },
        methods:{
            newBook(){
                const _this = this;

                let novelSite = _this.novelSites[_this.choseNovelSiteIndex];
                let novelBook = _this.novelbook;
                novelBook.webUrl = novelSite.siteUrl
                novelBook.fromUrl = novelSite.bookUrl.replace('%bkid',novelBook.oriBookId)
                novelBook.mlPQuery = novelSite.mlpquery
                novelBook.mlQuery = novelSite.mlquery
                novelBook.contentQuery = novelSite.contentquery
                novelBook.novelSiteId = novelSite.id
                novelBook.state = 1
                axios({
                    url:'/novelBook/insertNovelBook',
                    params:novelBook
                }).then(res=>{
                    if (res.data.state === 'success') {
                        _this.$Toast("success");
                        _this.novelbook = {}
                        _this.testList.push({name:novelBook.bookName,id:res.data.obj})
                    }
                })
            },
            onClickLeft(){
                this.$router.go(-1)
            },
            queryAllNovelSite(){
                const _this = this;
                axios({
                    url:'/novelSite/queryAllNovelSite',
                }).then(res=>{
                    if (res.data.state === 'success') {
                        _this.novelSites = res.data.obj
                    }
                })
            },
            onChange(e,i) {
                this.choseNovelSiteIndex = i;
                this.novelSitePicker = false;
            },
            testReptile(id){
                const _this = this;
                axios({
                    url:'/reptile/testReptile',
                    params:{
                        bookId:id
                    }
                }).then(res=>{
                    if (res.data.state === 'success') {
                        _this.testResult = res.data.obj
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>