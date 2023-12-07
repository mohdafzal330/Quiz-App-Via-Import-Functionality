import axios from "axios";
 
import React, { Component } from "react";
import { Link } from 'react-router-dom'
import Home from "./Home";

 
export class FileUploader extends Component {
    state = {
        selectedFile: null,
        uploaded: false
    };

    
 
    onFileChange = (event) => {
        console.log(this.state.uploaded);
        this.setState({
            selectedFile: event.target.files[0],
            uploaded: false
        });
    };
 
    onFileUpload = () => {
        const formData = new FormData();
        formData.append(
            "questionFile",
            this.state.selectedFile,
            this.state.selectedFile.name
        );
        console.log(this.state.selectedFile);
        axios.post("http://localhost:8200/uploadFile", formData).then((res)=>{
            this.setState()
            console.log(this.state.uploaded);
        }).catch((err)=>{
            console.log(err);
        })
    };

    handleShow(){
        axios.get('http://localhost:8200/loadQuestions').then((res)=>{
            document.getElementById('questionPlaceholder').innerHTML = res.data;
        })
    }
 
    fileData = () => {
        if (this.state.selectedFile) {
            return (
                <div>
                    <h2>File Details:</h2>
                    <p>
                        File Name:{" "}
                        {this.state.selectedFile.name}
                    </p>
 
                    <p>
                        File Type:{" "}
                        {this.state.selectedFile.type}
                    </p>
 
                    <p>
                        Last Modified:{" "}
                        {this.state.selectedFile.lastModifiedDate.toDateString()}
                    </p>
                </div>
            );
        } else {
            return (
                <div>
                    <br />
                    <h4>
                        Choose a file before Pressing the Upload
                        button
                    </h4>
                </div>
            );
        }
    };
 
    render() {
        return (
            <div>
                <h1>Technology Xtend Assignment | (Mohammad Raaz)</h1>
                <h3>File Upload!</h3>
                <div>
                    <input
                        type="file"
                        onChange={this.onFileChange}
                    />
                    <button onClick={this.onFileUpload}>
                        Upload!
                    </button>
                </div>
                {this.fileData()}

                {/* <Link to='/home'>Start Quiz</Link> <br /><br /> */}
                <button  onClick={this.handleShow}>Show questions</button> <br /> <br />
                <div id="questionPlaceholder" style={{ background:'white',padding: 30, }}>

                </div>
            </div>
        );
    }
}
 