class RecipeMandatoryFieldsNotPresent extends Error {
  public mandatoryFields: string[]
  constructor(message, mandatoryFieldsNotPresent) { 
    super(message); 
    this.name = 'RecipeMandatoryFieldsNotPresent'; 
    this.mandatoryFields = mandatoryFieldsNotPresent
  } 
}

export default RecipeMandatoryFieldsNotPresent