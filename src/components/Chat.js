import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import { useRef } from 'react';
import ChatService from "../services/chat.service"
import Alert from 'react-bootstrap/Alert';
import dayjs from 'dayjs';
import {format} from "date-fns";

export default function Chat(props) {
    const [fontSize, setFontSize] = React.useState(16);

    const[foto,setFoto] = React.useState("");

    const navigate = useNavigate();
    const[messages,setMessages] = React.useState([{data:{}}])
    const[sendMessage,setSendMessage] = React.useState("")

    const [speech, setSpeech] = React.useState(false)
    const recognitionRef = useRef(null);

    const textToSpeechRef = useRef(null);

    //const[user,setUser] = React.useState({userid:""});


    const messageEnd = useRef(null);
    const [colorMode, setColorMode] = React.useState('dark')

    useEffect(()=> {
        //const userString = localStorage.getItem('user');
        //const userParsed = JSON.parse(userString);
        //setUser((prevState) => ({...prevState,userid:userParsed.userid}));

        fetch_messages();

    },[]);

    function fetch_messages(){
        ChatService.fetch_messages(sessionStorage.getItem("token")).then((response)=>{
            console.log(response);
            const messagesWithPic = response.data.messages.map(async (msg) => {
                if(msg.time) {
                    console.log(msg.time)
                    let date = msg.time.split('_')
                    date[1] = date[1].replaceAll('-', ':')
                    msg.time = date[0] + ' ' + date[1]
                    if(dayjs(msg.time).format('DD.MM.YYYY') === dayjs().format('DD.MM.YYYY')) {
                        msg.time = "today " + dayjs(msg.time).format('hh:mm a')
                    }
                    else if(dayjs(msg.time).format('DD.MM.YYYY') === dayjs().subtract(1, 'day').format('DD.MM.YYYY')){
                        msg.time = "yesterday " + dayjs(msg.time).format('hh:mm a')
                    }
                    else {
                        msg.time = dayjs(msg.time).format('DD.MM.YYYY hh:mm a')
                    }

                    console.log(msg)
                }
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
                messageEnd?.current?.scrollIntoView({ behavior: 'smooth' });
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
        messageEnd?.current?.scrollIntoView({ behavior: 'smooth' });
    }

    function logout(){
        ChatService.logout(sessionStorage.getItem("token")).then(()=>{
            localStorage.removeItem('user');
            sessionStorage.removeItem('userhash')
            sessionStorage.removeItem('token')
            navigate("/");
        }).catch((error)=>{
            console.log(error.response.statusText);
        })
    }

    function deregister(){
        ChatService.deregister(sessionStorage.getItem("token")).then(() => {
            localStorage.removeItem('user');
            navigate("/");
        }).catch((error) => {
            console.log(error.response.statusText);
        });
    }

    function handleChangeMessage(evt){
        setSendMessage(evt.target.value);
    }

    function navigateCamera(){
        navigate("/camera");
    }

    function toggle_colormode() {
        if(colorMode === 'light') {
            setColorMode('dark')
            document.body.className = "bg-dark text-light"
        }
        else {
            setColorMode('light');
            document.body.className = "bg-light text-dark"

        }

    }


    // Text to speech
    useEffect(()=> {
        if(!('speechSynthesis' in window)){
            console.log('speechSynthesis wird von Ihrem Browser nicht unterstützt');
            return
        }
        textToSpeechRef.current = window.speechSynthesis;

    },[]);

    function textToSpeech(message){
        const utterThis = new SpeechSynthesisUtterance(message);
        textToSpeechRef.current.speak(utterThis);
    }

    // Talk to text
    function toggleSpeech(){
        setSpeech(!speech);
    }

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.log('Spracherkennung wird von Ihrem Browser nicht unterstützt');
            return;
        }

        recognitionRef.current = new window.webkitSpeechRecognition();
        recognitionRef.current.lang = "de-DE";  // Sprache auf Deutsch setzen

        recognitionRef.current.onresult = (event) => {
            setSendMessage(event.results[0][0].transcript);
        };

        recognitionRef.current.onerror = (event) => {
            console.log('Fehler bei der Spracherkennung:', event.error);
        };

    }, []);

    useEffect(() => {
        if(recognitionRef.current === null){
          return ;
        }
        if (speech) {
            recognitionRef.current.start();  // die Spracherkennung starten
        } else {
            recognitionRef.current.stop();  // die Spracherkennung stoppen
        }
    }, [speech]);

    function changeTextSize(event){
        setFontSize(event.target.value);
        fetch_messages();
    }

    return (
        <>
        <div data-bs-theme={colorMode}>
              <div id="header" className="p-2 mt-2 d-flex justify-content-between">
                  <button type="button" className="btn btn-primary">Back</button>
                  <h1>Chatname</h1>
                  <div>
                    <button onClick={toggle_colormode} type="button" className="btn btn-info">Color mode</button>
                    <button onClick={logout} type="button" className="btn btn-warnign">Logout</button>
                    <button onClick={deregister} type="button" className="btn btn-danger">Deregister</button>

                  </div>
              </div>


            <div className="d-flex flex-column justify-content-center mt-2">
            <button  onClick={fetch_messages} className="btn btn-primary" type="button">Fetch Messages</button>
                <label>Schriftgröße ändern</label>
                <select value={fontSize} onChange={changeTextSize} className="form-select mb-3" aria-label="Default select example">
                    <option  value={10}>Klein</option>
                    <option  value={16}>Mittel</option>
                    <option  value={22}>Groß</option>

                </select>
            </div>

            <div className="p-2 mt-1" id="messages"  style={{maxHeight:"600px", overflow:"scroll"}}>
            {messages?.data?.map((message) => (
                <div>
                    {message.userhash === sessionStorage.getItem('userhash')&& <div>
                        <label>{message.usernickname}&nbsp;&nbsp;&nbsp;{message.time}</label>
                         <Alert className="d-flex" data-bs-theme={colorMode} data-theme={colorMode} key={message.id} variant="primary">
                             <div  style={{ flexGrow: 1 }}>
                                 {message.text}
                                 <br />
                                 {message.photoid && <img id={message.id} src="" alt="pic"/>}
                             </div>
                             <button style={{ alignSelf: 'center' }} onClick={() =>  textToSpeech(message.text)} className="btn btn-primary" type="button">lol</button>
                         </Alert>
                    </div>}
                    {message.userhash !== sessionStorage.getItem('userhash')&&  <div>
                            <label>{message.usernickname}&nbsp;&nbsp;&nbsp;{message.time}</label>
                            <Alert className="d-flex" data-bs-theme={colorMode} data-theme={colorMode} key={message.id} variant="secondary">
                                <div  style={{ flexGrow: 1 }}>
                                    <p style={{ fontSize: `${fontSize}px` }}> {message.text}</p>
                                    <br />
                                    {message.photoid && <img id={message.id} src="" alt="pic"/>}
                                </div>
                                <button style={{ alignSelf: 'center' }} onClick={() =>  textToSpeech(message.text)} className="btn btn-primary" type="button">lol</button>
                            </Alert>
                    </div>}


                </div>
            ))}
            <div style={{height: 1}} ref={messageEnd}></div>
            </div>

                <div id="chat"></div>
                <form  style={{position:"absolute",bottom:0}} className="p-2 w-100">
                    <div className="input-group mb-1">
                        <button onClick={navigateCamera} className="btn btn-primary" type="button">Pic</button>
                        <input type="text"
                           className="form-control"
                           placeholder="Type Message"
                           aria-describedby="basic-addon2"
                           value={sendMessage}
                           onChange={handleChangeMessage}
                        />
                        <div className="input-group-append">
                            <button onClick={toggleSpeech} type="button" className="btn btn-danger">Mic</button>
                            <button onClick={sendMessageToGroup} className="btn btn-primary" type="button">Send</button>
                            <button onClick={textToSpeech} className="btn btn-primary" type="button">text</button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}
