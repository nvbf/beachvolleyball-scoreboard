import { useState } from "react";
import * as XLSX from 'xlsx';
import { AdminMatch, MatchState } from "../components/tournamentAdmin/types";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";


function CreateTournament() {

  // onchange states
  const [excelFile, setExcelFile] = useState<ArrayBuffer | null>(null);
  const [typeError, setTypeError] = useState<string | null>(null);


  //submit state
  const [jsonData, setJSONData] = useState<AdminMatch[]>([])
  
  const handleFile= (excelUploadFile: React.ChangeEvent<HTMLInputElement>)=>{
    const selectedFile = excelUploadFile.target.files?.[0];
    const reader = new FileReader();

    if(selectedFile){
      setTypeError(null);
      if(selectedFile.type.includes('sheet') || selectedFile.type.includes('excel')){
        reader.readAsArrayBuffer(selectedFile);
      }else if(selectedFile.type == 'text/csv'){
        reader.readAsText(selectedFile)
      }

      reader.onload=(e: any)=>{
        //setExcelFile(e.target.result);
        //console.log(e.target.result)
        
        const data  = e.target.result;
        const dataType = selectedFile.type === 'text/csv' ? 'string' : 'buffer';        
        const workbook  = XLSX.read(data,{type: dataType});
        const worksheetname = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetname];
        const jsonDataTemp = XLSX.utils.sheet_to_json<AdminMatch>(worksheet, {header: 1});

        setJSONData(jsonDataTemp.slice(1))
        /*
        const matches = jsonData.map((row: any) => {
          console.log(row);
        })
*/

      }
    }
    else{
      setTypeError('Please select only excel/csv');
      setExcelFile(null);
    }
  } 


  const handleSubmit=(e: any)=>{
    e.preventDefault(); //prevent the page frome reloading
    const matches = jsonData.map((row) =>{
      console.log(row);
    })
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
