import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld'
const bookcontent = () => import('@/views/bookcontent.vue');
const booklist = () => import('@/views/booklist.vue');

Vue.use(Router);

export const defaultRouterMap = [
    {
        path: '/booklist',
        component: booklist,
        name: 'booklist',
    },
    {
        path: '/bookcontent',
        component: bookcontent,
        name: 'bookcontent',
    },
];

export default new Router({
    // mode: 'history',//去掉 # url锚点
    routes: defaultRouterMap
});

