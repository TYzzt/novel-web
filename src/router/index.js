import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld'
const bookcontent = () => import('@/views/bookcontent.vue');
const booklist = () => import('@/views/booklist.vue');
const bookcontentlist = () => import('@/views/bookcontentlist.vue');
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

Vue.use(Router);
// const routerPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//     return routerPush.call(this, location).catch(error=> error)
// }
export const defaultRouterMap = [
    { path: '/', redirect: '/index' },
    {
        path: '/index',
        component: booklist,
        name: 'index',
    },
    {
        path: '/bookcontent/:contentid/:name/:title',
        component: bookcontent,
        name: 'bookcontent',
    },
    {
        path: '/bookcontentlist/:id/:name',
        component: bookcontentlist,
        name: 'bookcontentlist',
    },
];

export default new Router({
    mode: 'hash',//去掉 # url锚点
    routes: defaultRouterMap
});

