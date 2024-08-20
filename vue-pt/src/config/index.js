// config.js  
const env = import.meta.env.MODE || "prod";  
  
const EnvConfig = {  
    development: {  
        baseApi: "http://localhost:8080/",  
        mockApi: "",  
    },  
    prod: {  
        baseApi: "http://localhost:8080/",  
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