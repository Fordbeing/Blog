import {defineStore} from 'pinia'
import {ref} from 'vue'
function initState(){
    return {
        isCollapse:false,
        tags:[
            {
                path:'/home',
                label:'首页',
                name :'home',
                icon :'home',
            }
        ],
        currentMenu:null,
        // 用户表格标签
        tableLabelData:[
            {
                prop:'userID',
                label:'ID',
                
            },
            {
                prop:'username',
                label:'姓名'
            },
            {
                prop:'avatar',
                label:'头像',
                width: 200
            },
            {
                prop:'email',
                label:'邮箱',
                width:200,
            },
            {
                prop:'password',
                label:'密码',
                width: 200
            }
            ,
            {
                prop:'permissions',
                label:'权限',
                width:50
            }
            ,
            {
                prop:'registrationTime',
                label:'注册时间',
                width:200
            }
        ],
        // 帖子标签（还没改）
        PostTableLabelData:[
            {
                prop:'postID',
                label:'ID'
            },
            {
                prop:'title',
                label:'标题',
                width:250
            },
            {
                prop:'likes',
                label:'点赞数',
                width: 200
            },
            {
                prop:'replies',
                label:'回复数',
                width:200,
            },
            {
                prop:'views',
                label:'观看人数',
                width: 200
            }
            ,
            
            {
                prop:'publishDate',
                label:'发布时间',
                width:200
            },
            
        ]
    }
}

export const useAllDataStore = defineStore('allData',() => {
    const state = ref(initState());

    function selectMenu(val){
        if(val.name === 'home'){
            state.value.currentMenu = null;
        }else{
            let isExist = state.value.tags.findIndex((item) => item.name === val.name);
            isExist === -1 ? state.value.tags.push(val) : '';
        }
    }

    function updateTags(item){
        let index = state.value.tags.findIndex((val) => val.name === item.name);
        state.value.tags.splice(index,1);
    }


    return {
        state,
        selectMenu,
        updateTags,
    };
})