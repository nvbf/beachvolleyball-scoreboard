import { useState } from "react";
import * as XLSX from 'xlsx';

function CreateTournament() {

  // onchange states
  const [excelFile, setExcelFile] = useState<ArrayBuffer | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);


  //submit state
  const [excelData, setExcelData] = useState(null);
  
  const handleFile= (e: React.ChangeEvent<HTMLInputElement>)=>{
    let fileTypes = ['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/csv'];
    let selectedFile = e.target.files?.[0];
    if(selectedFile!=null){
      if(selectedFile&&fileTypes.includes(selectedFile.type)){
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload=(e: any)=>{
          setExcelFile(e.target.result);
          console.log(e.target.result)
        }
      }
      else{
        setTypeError('Please select only excel/csv');
        setExcelFile(null);
      }
    }
    
    
  } 


  const handleSubmit=(e: any)=>{
    e.preventDefault(); //prevent the page frome reloading
    console.log("handleSubmit");
  } 
  

  return (
    <div>
      <h3>Upload & View Excel Sheets</h3>
      <form className="form-group custom-form" onSubmit={handleSubmit}>    
        <input type="file" className="form-control" onChange={handleFile} />
        <button type="submit" className="btn btn-success btn-md">UPLOAD</button>
        {typeError&&(
          <div className="alert alert-danger" role="alert">{typeError}</div>
        )}
    </form>


    </div>
  );
}

export default CreateTournament;
