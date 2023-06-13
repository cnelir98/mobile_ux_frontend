import axios from "axios";
import React from "react";
const API_URL = "https://www2.hs-esslingen.de/~melcher/map/chat/api/index.php/";


class ChatService {
    login(userid,password){
        return axios.post(API_URL, {request:"login",userid:userid,password:password})
    }

    logout(token){
        return axios.post(API_URL, {request:"logout",token:token})
    }

    register(register){
        return axios.post(API_URL, {request:"register",userid:register.userid,password:register.password,nickname:register.nickname,fullname:register.fullname})
    }

    deregister(){

    }

    async fetch_photo(token,photoid){
        const response = await axios.post(API_URL,{request:"fetchphoto",token:token, photoid},{responseType:'blob'});

        return response;
    }



    fetch_messages(token){
        return axios.post(API_URL, {request:"fetchmessages",token:token})

    }

    send_message(token,text,foto){
        return axios.post(API_URL, {request:"sendmessage",token:token,text:text,photo:foto})

    }
}

export default new ChatService();
