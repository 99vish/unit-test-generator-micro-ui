import React, { useState } from 'react'
import FormComponent from '../components/FormComponent';
import axios from 'axios';
import '../PagesCSS/SelectionPage.css';
import '../componentCSS/FormComponent.css';
import Dialog from '../pages/Dialog';

const SelectionPage = () => {

    const [projectPath, setProjectPath] = useState("C:\\Platform1\\platform-master-data-api");
    const [showForm, setShowForm] = useState(true);
    const [responseData, setResponseData ] =useState ([]);
    const [showDropdown, setShowDropdown ] = useState(false);
    const [fields,setFields] = useState([
        {label: "Project Path", placeholder: "Enter project path", value: projectPath, setFunction: setProjectPath}
    ])

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/getControllersAndMethods', { projectPath });
            setResponseData(response.data);
            setShowForm(false);
            setShowDropdown(true);
            console.log('Backend response:', response.data);
        } catch (error) {
            console.error('Error updating paths in backend:', error);
        }
    }
    
  return (
    <div id='formContainer'>
        {showForm && <FormComponent initialFields={fields} buttonText="Submit" onSubmit={handleSubmit} />}
        {showDropdown && <Dialog options={responseData} />}
    </div>
  )
}

export default SelectionPage