

export function validateStepOne(formData) {
  if (!formData?.DestinationBranch) {
    return { isValid: false, message: 'Company is required' };
  }
  if (!formData?.branchvalue) {
    return { isValid: false, message: 'Branch is required' };
  }
  return { isValid: true };
}




// Step 1 - Truck info and weights
export function validateStepTwo(formData) {
  const fields = [
    { key: 'Trucknumber', message: 'Truck number is required' },
    { key: 'grossWeight', message: 'Gross weight is required' },
    { key: 'tareWeight', message: 'Tare weight is required' },
    { key: 'netWeight', message: 'Net weight is required' },
    { key: 'date', message: 'Date is required' },
    { key: 'bagCount', message: 'BagCount is required' },
    { key: 'size', message: 'Size is required' },

  ];

  for (let field of fields) {
    if (!formData[field.key]) {
      return { isValid: false, message: field.message, field: field.key };
    }
  }

  // Truck number format check
  const truckNumber = formData.Trucknumber?.trim().toUpperCase();
  if (truckNumber.length < 8 || truckNumber.length > 12) {
    return { isValid: false, message: 'Truck number must be 8–12 characters' };
  }

  // Gross/Tare weight > 0
  if (+formData.grossWeight <= 0 || +formData.tareWeight <= 0 ) {
    return { isValid: false, message: 'Gross and Tare weight must be greater than 0 and cannot be negative' };
  }

  if(+formData.netWeight <= 0) {
    return { isValid: false, message: 'Net weight must be greater than 0 and cannot be negative' };
  }

  return { isValid: true };
};



export function validateStepThree(formData) {
  const requiredFields = [
    {
      condition: formData.stainingColour && !formData.stainingColourPercent,
      message: 'Staining Colour Percent is required',

    },
    {
      condition: formData.blackSmutOnion && !formData.blackSmutPercent,
      message: 'BlackSmutPercent is required',
   
    },
    {
      condition: formData.sproutedOnion && !formData.sproutedPercent,
      message: 'Sprouted Percent is required',
  
    },
    {
      condition: formData.spoiledOnion && !formData.spoiledPercent,
      message: 'Spoiled Percent is required',
  
    },
    {
      condition: formData.onionSkin === "SINGLE" && !formData.onionSkinPercent,
      message: 'Onion Skin Single is required',
  
    },
    {
      condition: formData.moisture === "WET" && !formData.moisturePercent,
      message: 'Moisture wet is required',
  
    },

  ];

  for (let item of requiredFields) {
    if (item.condition) {
      return {
        isValid: false,
        message: item.message,

      };
    }
  }

  return { isValid: true };
}




















