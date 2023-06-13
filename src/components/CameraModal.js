import {Button, Form, Modal} from "react-bootstrap";
import React, {useEffect} from "react";

export default function CameraModal(props) {

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Foto aufnehmen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex justify-content-center" id="pic">
                    <video id="vid" width="320" height="240" controls></video>
                  <img id="foto" src="" alt="pic"/>
                </div>
            </Modal.Body>
            <div className="modal-footer d-flex justify-content-center">
                <button onClick={props.takepic} type="button" className="btn btn-primary">Take Photo</button>
                <button onClick={props.switchCamOff} type="button" className="btn btn-primary">Close</button>
                <button onClick={props.sendMessageToGroup} type="button" className="btn btn-primary">Send Foto</button>

            </div>
        </Modal>
    )
}
