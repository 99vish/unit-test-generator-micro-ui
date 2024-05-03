import React, { useEffect, useState } from 'react';
import '../componentCSS/DropDown.css'; // Import the CSS file
import { Button, Checkbox, Collapse, List, ListItemButton, ListItemText, TextField, Typography } from '@mui/material';
import {  ExpandLess, ExpandMore } from '@mui/icons-material';
import axios from 'axios';
import TemplateGeneratorPage from '../pages/TemplateGeneratorPage';

const DropDown = ({ options }) => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [expandedControllers, setExpandedControllers] = useState({});
  const [assertionParameters, setAssertionParameters] = useState({});
  const [responseData, setResponseData] = useState([]);
  const [showOptions, setShowOptions] = useState(true);


  useEffect(() => {
    const initialMethods = {};
    options.forEach(classItem => {
      Object.keys(classItem).forEach(className => {
        initialMethods[className] = []; // Initialize as an empty array
      });
    });
    setSelectedMethods(initialMethods);
  }, [options]);
  
  
  // Initialize expandedControllers state
  useEffect(() => {
    const initialExpandedControllers = {};
    options.forEach(classItem => {
        Object.keys(classItem).forEach(className => {
            initialExpandedControllers[className] = false;
        });
    });
    setExpandedControllers(initialExpandedControllers);
  }, [options]);

  debugger

  const handleMethodChange = (className, methodName) => {
    
    
    
    setSelectedMethods(prevState => {
        const updatedMethods = { ...prevState };
        if (updatedMethods[className].includes(methodName)) {
          updatedMethods[className] = updatedMethods[className].filter(m => m !== methodName);
        } else {
          updatedMethods[className] = [...updatedMethods[className], methodName];
        }
        

        const hasSelectedMethods = Object.values(updatedMethods).some(methods => methods.length > 0);
        setSelectedClasses(prevState => {
        
          if (hasSelectedMethods && !prevState.includes(className)) {
            return [...prevState, className]; // Add class if any method is selected
          } else if (!hasSelectedMethods && prevState.includes(className)) {
            return prevState.filter(c => c !== className); // Remove class if no method is selected
          }
          return prevState;
        });
        return updatedMethods;
    }); 
    };

  const handleClassClick = (controllerName) => {

    setExpandedControllers(prevState => ({
        ...prevState, [controllerName]: !prevState[controllerName]
    }));
  };

  const handleFormSubmit = async() => {
    
    setShowOptions(false);
    let requestData = [];
    

    selectedClasses.forEach(className => {
        selectedMethods[className].forEach(methodName => {
            const assertionParametersKey = `${className}-${methodName}` ;
            const assertionParametersString = assertionParameters[assertionParametersKey];

            const requestDataItem = {
                className: className,
                methodName: methodName,
                assertionParametersString: assertionParametersString

            };

            requestData.push(requestDataItem);
        });
    });
    try {
        const response = await axios.post('http://localhost:8080/api/generateTemplatesFromSelection', { inputTestCasesList: requestData })
        
        setResponseData(response.data);
        console.log('Backend response: ', response.data);
        
    } catch (error) {
        console.log(`Error sending data to backend`);
    }
    console.log(requestData); // Just for demonstration, you can send this data to the backend using an API call
  }


  return (
    <div className='wrapper'>
      {responseData && responseData.length > 0 ? (
        <TemplateGeneratorPage templates={responseData} />
      ) : (
        showOptions && (
          <div>
            <List
              sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
              component="nav"
              aria-labelledby="nested-list-subheader"
            >
              {options.map((classItem, index) => (
                <div key={index} className='option-group'>
                  {Object.keys(classItem).map(className => (
                    <div key={className}>
                      <ListItemButton onClick={() => handleClassClick(className)} key={className} >
                        <ListItemText primary={className} />
                        {expandedControllers[className] ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse in={expandedControllers[className]} timeout="auto" unmountOnExit>
                        {classItem[className].map((item, itemIndex) => (
                          <ListItemButton key={itemIndex}>
                            <Checkbox
                              checked={selectedMethods[className] && selectedMethods[className].includes(item)}
                              onChange={() => handleMethodChange(className, item)}
                            />
                            <ListItemText>
                              <Typography sx={{ fontSize: 14 }}>{item}</Typography>
                            </ListItemText>
                            {selectedMethods[className] && selectedMethods[className].includes(item) && (
                              <TextField
                                variant="outlined"
                                label="Enter Assertion Parameters"
                                value={assertionParameters[`${className}-${item}`] || ''}
                                onChange={(e) => setAssertionParameters(prevState => ({
                                  ...prevState,
                                  [`${className}-${item}`]: e.target.value
                                }))}
                              />
                            )}
                          </ListItemButton>
                        ))}
                      </Collapse>
                    </div>
                  ))}
                </div>
              ))}
            </List>
            <Button onClick={handleFormSubmit}>Submit</Button>
          </div>
        )
      )}
    </div>
  );
  
};

export default DropDown;
