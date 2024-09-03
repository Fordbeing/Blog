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
                width: 400
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
                width:100
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
                width:220
            },
            {
                prop:'categoryName',
                label:'分类名称',
                width: 180
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
            
        ],
        // 分类标签
        CategoryLabelData:[
            {
                prop:'categoryID',
                label:'ID',
                width: 200
            },
            {
                prop:'name',
                label:'分类名称',
                width:400
            },
            {
                prop:'description',
                label:'分类描述',
                width: 400
            },
            {
                prop:'createTime',
                label:'创建时间',
                width: 300
            },
            
            
        ],
        // 评论管理标签
        CommentLabelData:[
            {
                prop:'commentID',
                label:'ID',
                width: 200
            },
            {
                prop:'author',
                label:'作者',
                width:300
            },
            {
                prop:'email',
                label:'邮箱',
                width: 400
            },
            {
                prop:'date',
                label:'创建时间',
                width: 300
            },
            
            
        ],
        // 图片管理标签
        PictureLabelData:[
            {
                prop:'imageId',
                label:'ID',
                width: 100
            },
            {
                prop:'filename',
                label:'图片名称',
                width:100
            },
            {
                prop:'filepath',
                label:'图片',
                width:400
            },
            {
                prop:'description',
                label:'图片描述',
                width: 300
            },
            {
                prop:'category',
                label:'图片分类',
                width: 80
            },
            {
                prop:'uploadTime',
                label:'上传时间',
                width: 200
            },
            
            
        ],
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