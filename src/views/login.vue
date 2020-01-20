<template>
    <div>
        <van-nav-bar
                title="注册/登陆"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"
        />
        <div>
            <van-field label="用户名" placeholder="请输入用户名" v-model="intUser.userName"></van-field>
            <van-field label="密码" placeholder="请输入密码" type="password" v-model="intUser.password"></van-field>
            <van-button style="width: 90%"  type="primary" @click="regLogin">{{regStr[regType]}}</van-button>
            <van-button style="margin: 10px;float: right;" size="small"  @click="changeRegType">{{regChangeStr[regType]}}</van-button>
        </div>
    </div>
</template>
<script>
    import axios from "axios";

    export default {
        name: "login",
        data(){
            return{
                intUser:{},
                regStr:{
                    1:'登 陆',
                    0:'注 册'
                },
                regType:0,
                regChangeStr:{
                    1:'注册',
                    0:'已有账号？去登陆'
                },
                regUrl:{
                    1:'intUser/login',
                    0:'intUser/singUpUser',
                }
            }
        },
        mounted() {
        },
        methods:{
            regLogin(){
                const _this = this;
                let url = this.regUrl[this.regType];
                // eslint-disable-next-line no-console
                console.log(this.intUser);
                axios({
                    url:url,
                    params:_this.intUser
                }).then(res=>{ //登陆/注册成功
                    if (res.data.state === 'success') {
                        _this.$Toast.success('成功');
                        _this.$simpleStore.setUserInfo(res.data.obj);
                        _this.onClickLeft();
                    }else {
                        _this.$Toast.fail(res.data.message)
                    }
                }).catch(e=>{
                    // eslint-disable-next-line no-console
                    console.log(e)
                    _this.$Toast('服务器异常')
                })
                _this.intUser = {}
            },
            onClickLeft(){
                this.$router.replace('/').catch(()=>{});
            },
            changeRegType(){
                this.regType = this.regType ^ 1;
            }
        }
    }
</script>

<style scoped>

</style>