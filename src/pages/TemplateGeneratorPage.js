import React, { useState } from 'react';
import FormComponent from '../components/FormComponent';
import ExcelJS from 'exceljs';
import axios from 'axios';
import '../PagesCSS/TemplateGeneratorPage.css';
import '../componentCSS/FormComponent.css';
function TemplateGeneratorPage({ templates }) {

    console.log("vish");
    
    const [completedExcelPath, setCompletedExcelPath] = useState("C:\\Users\\vishakha.mundra\\Downloads\\excel_template_AccessorialChargeController (3).xlsx");
    const [showTemplateGenerationButton , setShowTemplateGenerationButton] = useState(true);
    const [showCompletedExcelForm, setShowCompletedExcelForm] = useState(false);
    


    const handleSubmit = async () => {
        
        try {
            
            const response = await axios.post('http://localhost:8080/api/generateTests', { completedExcelPath: completedExcelPath }); 
            console.log(response);
        } catch (error) {
           
            console.error(`Error generating tests`);
        }
    }

    const generateExcelWorkbook = async (template) => {
        
        setShowTemplateGenerationButton(false);
        try{
        const workbook = new ExcelJS.Workbook();
        const ws = workbook.addWorksheet('MethodDetails');
        ws.addRow(["ClassName","MethodName","Method Parameters","Request Headers","Request","Response Headers","Response"]);

            debugger

            for(let i=0;i<templates.length;i++){
                const template = templates[i];
                const methodParams = template.methodParams;
                const className = template.className;
                

                for(let j=0; j<template.requests.length; j++){
                    const methodName = template.requests[j];
                    const params = methodParams[methodName];
                   
                    ws.addRow([className,methodName,params]);
                }

                for(let k=0;k<template.methodsRequiringResponses.length; k++){
                    const methodName = template.methodsRequiringResponses[k];
                    const params = methodParams[methodName];
                  
                    ws.addRow([className,methodName,params]);
                    
                }
            }
 
            try {
                
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `excel_template.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setShowCompletedExcelForm(true);

                
            } catch (error) {
                console.error('Error saving Excel workbook', error);
            }
            console.log(`Excel workbook generated!`);
        } catch (error) {
            console.error('Error generating Excel workbook', error);
        }
    };

    


    return (
        <div className="centered-container">
            { 
                showTemplateGenerationButton && <button onClick={()=>generateExcelWorkbook(templates)}>Generate Excel Template</button> 
            }
            {
                showCompletedExcelForm && <div id='excelForm'>
                    <FormComponent 
                        initialFields={[{ label: "Enter Completed Excel Path" ,placeholder: "Excel Path here:", value: completedExcelPath, setFunction: setCompletedExcelPath}]}
                        buttonText={"Submit"}
                        onSubmit={handleSubmit}
                    />
                </div>
            }
    
           
        </div>
    );

}
export default TemplateGeneratorPage;