import React from "react";
import ChatService from "../services/chat.service"
import {useNavigate} from "react-router-dom";

export default function Register(props) {
    const navigate = useNavigate();

    const[register,setRegister] = React.useState({
        userid:"",
        password:"",
        nickname:"",
        fullname:""
    })

    const [errorMsg, setErrorMsg] = React.useState("")

    function handleChange(evt){
        console.log(evt);
        setRegister((prevState) => ({...prevState,[evt.target.name]:evt.target.value}));
    }

    function registerUser(){
        ChatService.register(register).then((response)=>{
            redirectLogin();
        }).catch((error) => {
            console.log(error)
            setErrorMsg(error.response.statusText);
        })
    }

    function redirectLogin(){
        navigate("/")
    }

    return (

        <>
            <form className="p-2">
                <h1>Register</h1>
                <div className="form-group mt-3">
                    <label>HSE Account</label>
                    <input type=""
                           className="form-control"
                           placeholder="HSE Account"
                           name="userid"
                           value={register.userid}
                           onChange={handleChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Nickname</label>
                    <input type=""
                           className="form-control"
                           placeholder="Nickname"
                           name="nickname"
                           value={register.nickname}
                           onChange={handleChange}
                    />
                </div>
                <div className="form-group mt-3">
                    <label>Fullname</label>
                    <input type=""
                           className="form-control"
                           placeholder="Fullname"
                           name="fullname"
                           value={register.fullname}
                           onChange={handleChange}
                    />
                </div>
                <div className="form-group  mt-3">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password"
                           className="form-control"
                           name="password"
                           placeholder="Password"
                           onChange={handleChange}
                    />
                </div>
                <button onClick={registerUser} type="button" className="w-100 btn btn-primary mt-4">Register</button>
                <div>{errorMsg}</div>
                <div className="mt-4 d-flex justify-content-center">Already Registered?</div>
                <button onClick={redirectLogin} type="button" className="w-100 btn btn-primary mt-4">Log- In</button>
            </form>
        </>
    )
}
