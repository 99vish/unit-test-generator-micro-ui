
import React, { useState } from 'react';
import '../componentCSS/FormComponent.css';

function FormComponent ({ initialFields, buttonText ,onSubmit })  {

    const [fields, setFields] = useState(initialFields);

    const handleInputChange = (newValue, index) => {
        const updatedFields = [...fields];  
        updatedFields[index].value = newValue;  
 
        setFields(updatedFields);
        initialFields[index].setFunction(newValue);
      };

      const handleSubmit = () => {
        const formValues = fields.reduce((acc, field) => {
            acc[field.label] = field.value;
            return acc;
        }, {});
        onSubmit(formValues);
    };

  return (
    <div className="form-container">
     {fields.map((field, index) => (
      <div key={index} className="form-group">
        <label htmlFor={`input-${index}`} className="label">{field.label}</label>
        <input
          id={`input-${index}`}
          type="text"
          placeholder={field.placeholder}
          className="input-field"
          value={field.value}
          onChange={(e) => handleInputChange(e.target.value, index)}
        />
      </div>        
      ))}
      <button className='submit-button' onClick={handleSubmit}>{buttonText}</button>
    </div>
  );
};

export default FormComponent;
