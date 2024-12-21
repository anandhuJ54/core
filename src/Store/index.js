import { configureStore } from "@reduxjs/toolkit";
import editableReducer from "./EditReducer"

const store = configureStore (
    {
        reducer:{
            editableReducer: editableReducer
        }
    }
)

export default store;