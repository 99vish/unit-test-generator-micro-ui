import React, { useState, useEffect } from 'react';
import FormComponent from '../components/FormComponent';
import ExcelJS from 'exceljs';
import axios from 'axios';
import '../PagesCSS/TemplateGeneratorPage.css';
import '../componentCSS/FormComponent.css';
function TemplateGeneratorPage({ templates }) {


    const [templateIndex, setTemplateIndex] = useState(0);
    const [showFormIndex, setShowFormIndex] = useState(null);
    const [completedExcelPath, setCompletedExcelPath] = useState("C:\\Users\\vishakha.mundra\\Downloads\\excel_template_AccessorialChargeController (3).xlsx");
    const [showTemplateGenerationButton , setShowTemplateGenerationButton] = useState(true);
    


    const handleSubmit = async () => {
        
        try {
            const className = templates[templateIndex].className;
            console.log(className);
            const response = await axios.post('http://localhost:8080/api/generateTests', { completedExcelPath: completedExcelPath , className: className }); 
            console.log(response);
        } catch (error) {
            const className = templates[templateIndex].className;
            console.error(`Error generating tests for ${className}`);
        }
    }


    const generateExcelWorkbook = async (template) => {
        
        setShowTemplateGenerationButton(false);
        try {

            const workbook = new ExcelJS.Workbook();
            debugger

            const headers = template.headers;
            const methodParams = template.methodParams;
            const combinedHeaders = [headers, ...methodParams];
            const ws = workbook.addWorksheet('MethodParams');
            ws.addRows(combinedHeaders);

            const requestHeaders = ["request","request","request","response","response","response"];

            for(let i=0; i<template.requests.length; i++){
                const requestName = template.requests[i];
                const worksheet = workbook.addWorksheet(`${requestName}`);
                worksheet.addRow(requestHeaders);
            }
            
            try {
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `excel_template_${template.className}.xlsx`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setShowFormIndex(templateIndex);
            } catch (error) {
                console.error('Error saving Excel workbook', error);
            }
            console.log(`Excel workbook generated for ${template.className}`);
        } catch (error) {
            console.error('Error generating Excel workbook', error);
        }
    };

    const handleNext = () => {
        setShowTemplateGenerationButton(true);
        setTemplateIndex((prevState) => prevState + 1);
    };


    return (
        <div>
            {
                templateIndex < templates.length && <div>
                    <h4>Process running for {templates[templateIndex].className}</h4>
                    { 
                        showTemplateGenerationButton && <button onClick={()=>generateExcelWorkbook(templates[templateIndex])}>Generate Excel Template</button> 
                    }
                    {
                        showFormIndex === templateIndex && <div id='excelForm'>
                            <FormComponent 
                                initialFields={[{ label: "Enter Completed Excel Path" ,placeholder: "Excel Path here:", value: completedExcelPath, setFunction: setCompletedExcelPath}]}
                                buttonText={"Submit"}
                                onSubmit={handleSubmit}
                            />
                        </div>
                    }
                </div>

            }
           {(templateIndex < templates.length - 1) && <button id="nextButton" onClick={handleNext}>Next</button>}
        </div>
    );
}

export default TemplateGeneratorPage