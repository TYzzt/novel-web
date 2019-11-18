import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld'
const bookcontent = () => import('@/views/bookcontent.vue');
const booklist = () => import('@/views/booklist.vue');

Vue.use(Router);

export const defaultRouterMap = [
    { path: '/', redirect: '/index' },
    {
        path: '/index',
        component: booklist,
        name: 'index',
    },
    {
        path: '/bookcontent/:id',
        component: bookcontent,
        name: 'bookcontent',
    },
];

export default new Router({
    mode: 'hash',//去掉 # url锚点
    routes: defaultRouterMap
});

