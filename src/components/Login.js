import React, {useEffect} from "react";
import ChatService from "../services/chat.service"
import {useNavigate} from "react-router-dom";
import Form from 'react-bootstrap/Form';

export default function Login(props) {

    const navigate = useNavigate();
    const[login,setLogin] = React.useState({
        userid:"",
        password:"",
    })
    const[rememberMe, setRememberMe] = React.useState(false)
    const [errorMsg, setErrorMsg] = React.useState("")

    useEffect(()=> {
    if(localStorage.getItem('user') !== null){
        const userString = localStorage.getItem('user');
        const userParsed = JSON.parse(userString);
        userLogin(userParsed.userid,userParsed.password);
    }
  },[]);


    function rememberMeFn(evt){
        setRememberMe(evt.target.value);
    }

    function handleChangeUsername(evt){
        setLogin((prevState) => ({...prevState,userid:evt.target.value}));
    }
    function handleChangePassword(evt){
        setLogin((prevState) => ({...prevState,password:evt.target.value}));
    }

    function callLogin(){
        userLogin(login.userid,login.password);
    }

    function userLogin(userid,password){
        ChatService.login(userid,password).then((response)=>{
            if(rememberMe){
                localStorage.setItem('user', JSON.stringify(login));
            }
            sessionStorage.setItem("token", response.data.token);
            navigate("/chat");
        }).catch((error)=> {
            console.log(error.response.statusText);
            setErrorMsg(error.response.statusText);
        })
    }

    function redirectRegister(){
        navigate("/register");
    }
    return (
        <>
                <form className="p-2">
                    <h1>Login</h1>
                    <div className="form-group mt-3">
                        <label>HSE Account</label>
                        <input type=""
                               className="form-control"
                               id="exampleInputEmail1"
                               aria-describedby="emailHelp"
                               placeholder="HSE Account"
                               value={login.userid}
                               onChange={handleChangeUsername}
                        />
                    </div>
                    <div className="form-group  mt-3">
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password"
                               className="form-control"
                               id="exampleInputPassword1"
                               placeholder="Password"
                               onChange={handleChangePassword}
                        />
                        <Form className="d-flex justify-content-center mt-2">
                            <Form.Check
                                type="switch"
                                id="custom-switch"
                                label="Remember Me"
                                value={rememberMe}
                                onChange={rememberMeFn}
                            />
                        </Form>
                    </div>
                    <button onClick={callLogin} type="button" className="w-100 btn btn-primary mt-4">Login</button>
                    <div>{errorMsg}</div>
                    <div className="mt-4 d-flex justify-content-center">or</div>
                    <button onClick={redirectRegister} type="button" className="w-100 btn btn-primary mt-4">Register</button>
                </form>
        </>
    )
}
