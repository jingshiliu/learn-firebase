import React, {useState} from 'react';

function FileUploader({uploadFile}) {
    const [file, setFile] = useState(null)

    return (
        <div>
            <h3>The File Uploader</h3>
            <input type="file"
                   onChange={e => setFile(e.target.files[0])}
            />
            <button onClick={() => uploadFile(file)}>Upload File</button>
        </div>
    );
}

export default FileUploader;