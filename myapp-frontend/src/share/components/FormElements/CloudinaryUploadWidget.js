import React, { useRef,useState,useEffect,Component} from 'react';
import Button from './Button';
import './ImageUpload.css';

const CloudinaryUploadWidget = (props) => {
    const cloudName = "dtyuvzh9w";
    const uploadPreset = "rw8l6kac";
    const [previewUrl, setPreviewUrl] = useState();

    const myWidget = window.cloudinary.createUploadWidget(
        {
            cloudName: cloudName,
            uploadPreset: uploadPreset
        },
        (error, result) => {
            if (!error && result && result.event === "success") {
                console.log("Done! Here is the image info: ", result.info);
                setPreviewUrl(result.info.url);

                const tmp = document.getElementById("uploadedimage");
                if (tmp){
                    tmp.setAttribute("src", result.info.secure_url);
                }
            }
        }
    );

    const el = document.getElementById("upload_widget");
    if(el){
        el.addEventListener(
            "click",
            function () {
                myWidget.open();
            },
            false
        );
    }


    // const [file, setFile] = useState();
    // const [isValid, setIsValid] = useState(false);
    // const filePickerRef = useRef();

    // useEffect(() => {
    //     if (!file) {
    //         return;
    //     }
    //     const fileReader = new FileReader();
    //     fileReader.onload = () => {
    //         setPreviewUrl(fileReader.result);
    //     };
    //     fileReader.readAsDataURL(file);
    // }, [file]);

    // const pickedHandler = event => {
    //     let pickedFile;
    //     let fileIsValid = isValid;
    //     if (event.target.files && event.target.files.length === 1) {
    //         pickedFile = event.target.files[0];
    //         setFile(pickedFile);
    //         setIsValid(true);
    //         fileIsValid = true;
    //     } else {
    //         setIsValid(false);
    //         fileIsValid = false;
    //     }
    //     props.onInput(props.id, pickedFile, fileIsValid);
    // };

    return (
        <div className="form-control">
            {/* <input
                id= {props.id}
                ref={filePickerRef}
                style={{ display: 'none' }}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickedHandler}
            /> */}
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className="image-upload__preview">
                    {previewUrl && <img src={previewUrl} alt="Preview" />}
                    {!previewUrl && <p>Please pick an image.</p>}
                </div>
                <Button id="upload_widget" className="button">
                    PICK IMAGE
                </Button>
            </div>
        </div>
    );
}

export default CloudinaryUploadWidget;
