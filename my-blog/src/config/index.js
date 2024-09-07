const env = import.meta.env.MODE || "prod";

const EnvConfig = {  
    development: {  
        baseApi: "http://localhost:8081/",  
        mockApi: "",  
    },  
    prod: {  
        baseApi: "/api/", // 生产环境下路径由 Nginx 处理
        mockApi: "",  
    },  
    test: {  
        baseApi: "",  
        mockApi: "",  
    }  
};

export default {  
    env,  
    ...EnvConfig[env],  
    mock: false,  
};
