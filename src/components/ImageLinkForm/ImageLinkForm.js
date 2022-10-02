import React from "react";
import "./ImageLinkForm.css";

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  return (
    <div>
      <p className="white f3">
        {
          "This Magic Brain will detect faces in your pictures. Give it a try. Just add the address of any Image in the address bar."
        }
        <br />
        {"To get the Address of Image:"}
        <br />
        {"Find any image on the internet"}
        <br />
        {'Right Click the Image and Click on "Copy Image Address" '}
        <br />
        {
          'OR "Open Image in New Tab and Then Copy Image Address in Website Address Bar'
        }
        <br />
      </p>
      <div className="center">
        <div className="form center pa4 br3 shadow-5">
          <input
            className="f4 pa2 w-70 center"
            type="text"
            placeholder="Add the Address of the image here!"
            onChange={onInputChange}
          />
          <button
            className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple"
            onClick={onButtonSubmit}
          >
            Detect
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
