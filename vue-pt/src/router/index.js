import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
    {
        path: '/',
        name: "main",
        component: () => import("@/views/Main.vue"),
        redirect:'/home',
        children:[
            {
                path: 'home',
                name: "home",
                component: () => import("@/views/Home.vue"),
            },
            {
                path: '/user',
                name: "user",
                component: () => import("@/views/User.vue"),
            },
            {
                path: '/category',
                name: "category",
                component: () => import("@/views/CategoryManage.vue"),
            },
            {
                path: '/articleManage',
                name: "articleManage",
                component: () => import("@/views/ArticleManage.vue"),
            },
            {
                path: '/articleRelease',
                name: "articleRelease",
                component: () => import("@/views/ArticleRelase.vue"),
            }
            ,{
                path: '/articleUpdate',
                name: "articleUpdate",
                component: () => import("@/views/articleUpdate.vue"),
            },{
                path: '/person',
                name: "person",
                component: () => import("@/views/Person.vue"),
            }
        ]
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;