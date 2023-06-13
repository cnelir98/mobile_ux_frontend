import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import ChatService from "../services/chat.service"
import Alert from 'react-bootstrap/Alert';
import CameraModal from "./CameraModal";
import Camera from "../camera";

export default function Chat(props) {
    let camera;
    const[foto,setFoto] = React.useState("");

    const navigate = useNavigate();
    const[messages,setMessages] = React.useState([{data:{}}])
    const[sendMessage,setSendMessage] = React.useState("")
    const[user,setUser] = React.useState({userid:""});

    // Modale
    const [showCamera, setShowCamera] = React.useState(false);
    const handleShowCameraModalClose = () => {setShowCamera(false);} ;
    const handleShowCameraModal = () => setShowCamera(true);

    useEffect(()=> {
        const userString = localStorage.getItem('user');
        const userParsed = JSON.parse(userString);
        setUser((prevState) => ({...prevState,userid:userParsed.userid}));

        fetch_messages();
    },[]);

    function fetch_messages(){
        ChatService.fetch_messages(sessionStorage.getItem("token")).then((response)=>{
            console.log(response);
            const messagesWithPic = response.data.messages.map(async (msg) => {
                if (msg.photoid) {

                    const res = await ChatService.fetch_photo(sessionStorage.getItem("token"), msg.photoid)
                    // Bekomme blob und nehme davon die url
                    console.log(res);
                    const blobUrl = URL.createObjectURL(res.data);
                    console.log(blobUrl);
                    document.getElementById(msg.id).src = blobUrl;

                    let img = document.getElementById(msg.id);
                    img.height = 200;
                    img.width = 300;
                }
            })
            setMessages((prevState) => ({...prevState,data:response.data.messages}));

            //setMessages(response.data.messages);
        }).catch((error) => {
            console.log(error)
        })

    }

    function sendMessageToGroup(evt){
        ChatService.send_message(sessionStorage.getItem("token"), sendMessage,foto).then((response) => {
            fetch_messages();
        }).catch((error) => {
        })
        setSendMessage("");
    }

    function logout(){
        ChatService.logout(sessionStorage.getItem("token")).then(()=>{
            localStorage.removeItem('user');

            navigate("/");
        }).catch((error)=>{
            console.log(error.response.statusText);
        })
    }

    function handleChangeMessage(evt){
        setSendMessage(evt.target.value);
    }

    useEffect(()=> {
        if ('mediaDevices' in navigator && document.getElementById("vid") !== null) {
            camera = new Camera(document.getElementById("vid"));
            camera.switchOn();
        }
    },[handleShowCameraModal]);

    function takepic(){
        let cam = document.getElementById("vid");
        cam.remove();

        let foto = document.getElementById("foto");
        foto.src = camera.takePhoto();
        setFoto((foto.src));
    }

    function switchCamOff(){
        handleShowCameraModalClose();
        camera.switchOff();

    }

    return (
        <>
              <div id="header" className="p-2 mt-2 d-flex justify-content-between">
                  <button type="button" className="btn btn-primary">Back</button>
                  <h1>Chatname</h1>
                  <button onClick={logout} type="button" className="btn btn-primary">Logout</button>
              </div>

            <div className="d-flex justify-content-center mt-2">
            <button  onClick={fetch_messages} className="btn btn-primary" type="button">Fetch Messages</button>
            </div>

            <div className="p-2 mt-1" id="messages"  style={{maxHeight:"700px", overflow:"scroll"}}>
            {messages?.data?.map((message) => (
                <div>
                    {message.usernickname === user?.userid && <div>
                        <label>{message.usernickname}&nbsp;&nbsp;&nbsp;{message.time}</label>
                         <Alert key={message.id} variant="primary">{message.text}
                             <br />
                             {message.photoid &&<img id={message.id} src="" alt="pic"/>}
                         </Alert>
                    </div>}
                    {message.usernickname !== user?.userid &&  <div>
                        <label>{message.usernickname}&nbsp;&nbsp;&nbsp;{message.time}</label>
                        <Alert key={message.id} variant="dark">{message.text}
                            <br />
                            {message.photoid && <img id={message.id} src="" alt="pic"/>}
                        </Alert>
                    </div>}


                </div>
            ))}
            </div>

                <div id="chat"></div>
                <form  style={{position:"absolute",bottom:0}} className="p-2 w-100">
                    <div className="input-group mb-3">
                        <button onClick={handleShowCameraModal} className="btn btn-primary" type="button">Pic</button>
                        <input type="text"
                           className="form-control"
                           placeholder="Type Message"
                           aria-describedby="basic-addon2"
                           value={sendMessage}
                           onChange={handleChangeMessage}
                    />
                        <div className="input-group-append">
                            <button onClick={sendMessageToGroup} className="btn btn-primary" type="button">Send</button>
                        </div>
                    </div>
                </form>
            <CameraModal show={showCamera} switchCamOff={switchCamOff} sendMessageToGroup={sendMessageToGroup} handleClose={handleShowCameraModalClose} takepic={takepic}></CameraModal>
        </>
    )
}
