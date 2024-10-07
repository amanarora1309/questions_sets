import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  const [name, setName] = useState("");
  const [excelFile, setExcelFile] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("excelFile", excelFile);
      const response = await axios.post(`http://localhost:8000/api/v1/question-paper/genrate-question-sets`, formData);

      if (response.data.success) {
        console.log(response.data);
        toast.success("Sets Genrated Successfully");
      }
      else {
        toast.error(response.data.message);
      }

    } catch (error) {
      console.log(error.response);
      toast.error(error.response.data.message)
    }

  }

  const handleFileUpload = async (e) => {
    console.log(e.target.files[0]);
    setExcelFile(e.target.files[0]);

  };

  return (
    <>
      <h1 className="text-center" >Genrate Question Sets</h1>

      <div className="container authcontainer">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Folder Name</label>
            <input type="text" className="form-control" id="name" name='name' placeholder='Enter Folder Name' value={name} aria-describedby="emailHelp" onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className=" mb-3">
            <label >Select File</label>
            <input type="file" accept='.xlsx' name='xlsxFile' id='xlsxFile' placeholder='Upload a File' className='form-control' onChange={handleFileUpload} />
          </div>
          <div className="mb-3">
            <button type="submit" className="btn btn-primary" >GENRATE SETS</button>
          </div>
        </form>

      </div>

      <ToastContainer />
    </>
  );
}

export default App;
