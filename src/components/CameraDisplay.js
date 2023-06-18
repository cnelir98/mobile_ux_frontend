import React, {useEffect} from "react";
import Camera from "../camera";
import {useNavigate} from "react-router-dom";
import ChatService from "../services/chat.service";


export default function CameraDisplay() {
    const[show,setShow] = React.useState({camera:true,photo:false})
    const [cam, setCam] = React.useState(null); // Zustand für die Kamera-Instanz
    const[sendMessage,setSendMessage] = React.useState("")
    const[foto,setFoto] = React.useState("");

    const navigate = useNavigate();


    useEffect(()=> {
        initCam();
    },[]);

    function initCam(){
        if ('mediaDevices' in navigator && document.getElementById("vid") !== null) {
            let camera;
            camera = new Camera(document.getElementById("vid"));
            camera.switchOn();
            setCam(camera);
        }

    }

     async function takePhoto(){
         await setShow((prevState) => ({...prevState,camera:false,photo:true}));
         let foto =  document.getElementById("foto");
         foto.src = cam.takePhoto();
         setFoto(foto.src.slice(22));
         cam.switchOff();
         setCam(null);
    }

    function returnChat(){
        cam.switchOff();
        navigate("/chat");
    }

    async function retakePhoto(){
        await setShow((prevState) => ({...prevState,camera:true,photo:false}));
        initCam();
    }

    function handleChangeMessage(evt){
        setSendMessage(evt.target.value);
    }

    function sendMessageToGroup(){
        ChatService.send_message(sessionStorage.getItem("token"), sendMessage,foto).then((response) => {
            navigate("/chat");
        }).catch((error) => {
        })
        setSendMessage("");
    }
    return (
        <>
            { show.camera && <div>
                <video id="vid" autoPlay style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}></video>
                <button
                type="button"
                style={{
                    position: "fixed",
                    top: "5%",
                    left: "10%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "transparent",
                    border: "none",
                    color: "white", // Change this to the color you want the 'X' to be
                    fontSize: "30px", // Change this to adjust the size of the 'X'
                }}
                onClick={returnChat}

            >
                X
            </button>

            <button
                className="btn btn-light"
                type="button"
                style={{
                    position: "fixed",
                    top: "90%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "50%",
                    width: "60px",
                    height: "60px",
                    border: "5px solid white", // This creates a 10px wide ring. Adjust the size and color as needed.
                    backgroundColor: "transparent", // This makes the inside of the ring transparent.
                }}
                onClick={takePhoto}
            />
            </div>}

            {show.photo &&
            <div>
                <button
                    type="button"
                    style={{
                        position: "fixed",
                        top: "5%",
                        left: "10%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "transparent",
                        border: "none",
                        color: "white", // Change this to the color you want the 'X' to be
                        fontSize: "30px", // Change this to adjust the size of the 'X'
                        zIndex:"999"
                    }}
                    onClick={retakePhoto}

                >
                    X
                </button>
                <img  style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} id="foto" src="" alt="pic"/>
                <div className="d-flex m-2" style={{position: "fixed", bottom:0, width:"95%"}}>
                <input
                       type="text"
                       className="form-control"
                       placeholder="Type Message"
                       aria-describedby="basic-addon2"
                       value={sendMessage}
                       onChange={handleChangeMessage}

                />
                    <button onClick={sendMessageToGroup}  className="btn btn-primary" type="button">Send</button>
                </div>
            </div>}
        </>
    )
}
