export const n_localstorage ={
    set(key, value, expired) {
        /*
        * set 存储方法
        * @ param {String}     key 键
        * @ param {String}     value 值，
        * @ param {String}     expired 过期时间，以分钟为单位，非必须
        * @ 由@IT·平头哥联盟-首席填坑官∙苏南 分享,交流：912594095
        */
        this.remove(key);
        localStorage.setItem(key, JSON.stringify(value));
        if (expired){
            localStorage.setItem(key+'__expires__',Date.now() + 1000*60*expired)
        }
        return value;
    },
    get(key) {
        /*
        * get 获取方法
        * @ param {String}     key 键
        * @ param {String}     expired 存储时为非必须字段，所以有可能取不到，默认为 Date.now+1
        * @ 由@IT·平头哥联盟-首席填坑官∙苏南 分享,交流：912594095
        */
        const expired = localStorage.getItem(key+'__expires__')||Date.now+1;
        const now = Date.now();

        if ( now >= expired ) {
            this.remove(key);
            return;
        }
        return  localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : localStorage.getItem(key);
    },
    remove(key){
        localStorage.removeItem(key)
        localStorage.removeItem(key+'__expires__')
    }
}
