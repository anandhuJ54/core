import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    editableValues:[],
    customerDetailsBulk:{}, 
    companyNames:[], 
    baseUrlIs:'http://sustainos.ai:9000/'
}
const editableReducer = createSlice({
    name:"editableReducer",
    initialState,
    reducers:{
        editDetails:(state,action)=>{
            state.editableValues = [action.payload]
        },
        bulkdataIs:(state,action)=>{
            state.customerDetailsBulk = {...state.customerDetailsBulk,[action.payload.key]: action.payload}
        },
        setCompanyNames:(state,action)=>{
            state.companyNames  = action.payload;
        },
        baseUrlIs:(state,action)=>{
            state.baseUrlIs = action.payload
        },
    }
})

export const {editDetails,bulkdataIs ,setCompanyNames,baseUrlIs} = editableReducer.actions;
export default editableReducer.reducer;