import axios from "axios";
import React from "react";
const API_URL = "https://www2.hs-esslingen.de/~melcher/map/chat/api/index.php/";

//import fetchAdapter from '@vespaiach/axios-fetch-adapter';




class ChatService {
    login(userid,password){
    //     const response = fetch(API_URL, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({request:"login",userid:userid,password:password})
    //     });
    //     return response;
        return axios.post(API_URL, {request:"login",userid:userid,password:password})
    }

    logout(token){
        // const response = fetch(API_URL, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({request:"logout",token:token})
        // });
        // return response;
        return axios.post(API_URL, {request:"logout",token:token})
    }

    register(register){
        // const response = fetch(API_URL, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({request:"register",userid:register.userid,password:register.password,nickname:register.nickname,fullname:register.fullname})
        // });
        // return response;
        return axios.post(API_URL, {request:"register",userid:register.userid,password:register.password,nickname:register.nickname,fullname:register.fullname})
    }

    deregister(token){
        // const response = fetch(API_URL, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({request: "deregister", token: token})
        // });
        // return response;
        return axios.post(API_URL, {request: "deregister", token: token})
    }

    async fetch_photo(token,photoid){
        // const response = fetch(API_URL, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({request:"fetchphoto",token:token, photoid},{responseType:'blob'})
        // });
        // return response;
        const response = await axios.post(API_URL,{request:"fetchphoto",token:token, photoid},{responseType:'blob'});
        return response;
    }



    fetch_messages(token){
        const response = fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({request:"fetchmessages",token:token})
        });
        return response;
        //return axios.post(API_URL, {request:"fetchmessages",token:token})

    }

    send_message(token,text,foto){
        // const response = fetch(API_URL, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({request:"sendmessage",token:token,text:text,photo:foto})
        // });
        // return response;
        return axios.post(API_URL, {request:"sendmessage",token:token,text:text,photo:foto})

    }
}

export default new ChatService();
