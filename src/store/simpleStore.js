export const simpleStore  = {
    state:{
        userInfo:null
    },

    setUserInfo(userinfo){
        this.state.userInfo = userinfo
    },
    clearUserInfo(){
        this.state.userInfo = null;
    }
}
