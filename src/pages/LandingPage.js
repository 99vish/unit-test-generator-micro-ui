import '../PagesCSS/LandingPage.css';
import '../componentCSS/FormComponent.css';
import FormComponent from '../components/FormComponent';
import React, { useState } from 'react';
import axios from 'axios';





function LandingPage() {


  // Define initial state for paths
  const [projectPath, setProjectPath] = useState("C:\\Platform\\platform-master-data-api");
  const [excelPath, setExcelPath] = useState("C:\\Platform\\excelFiles\\testmethods (1).xlsx");
  const [error, setError] = useState('');
 //const [responseData, setResponseData] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [fields ,setFields ]= useState ([
    { label: "Project Path", placeholder: "Enter project path", value: projectPath, setFunction: setProjectPath },
    { label: "Excel Path", placeholder: "Enter Excel path", value: excelPath, setFunction: setExcelPath  },
    
  ]);
  

  const handleSubmit = async () => {
    try {

      const response = await axios.post('http://localhost:8080/api/updatePaths', {
        projectPath,
        excelPath,
      });

     // setResponseData(response.data);
      setShowForm(false);
      console.log('Backend response:', response.data);

    } catch (error) {
      // Handle errors
      setError('Error updating paths in backend');
      console.error('Error updating paths in backend:', error);
    }
  };



  const buttonText = "Submit";

   


  return (
    <div className="landing-page">
      {showForm && <FormComponent initialFields={fields} buttonText={buttonText} onSubmit={handleSubmit} />}
      {error && <div className="error-message">{error}</div>}

    </div>
  );
}

export default LandingPage;
