import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addProduct: false,
  savedData: [],
  editIndex: null,
  dialogHeader: "add product",
  showEmptyFieldsMessage: false,
  formData: {
    name: "",
    brand: "",
    stock: "",
    price: "",
    count: 0,
    id: "",
  },
  deleteConfirmation: false,
  globalFilterValue: null,
  cart: {
    productid: "",
    quantity: "",
    id: "",
  },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setAddProduct: (state, action) => {
      state.addProduct = action.payload;
    },
    setSavedData: (state, action) => {
      state.savedData = action.payload;
    },
    setEditIndex: (state, action) => {
      state.editIndex = action.payload;
    },
    setDialogHeader: (state, action) => {
      state.dialogHeader = action.payload;
    },
    setShowEmptyFieldsMessage: (state, action) => {
      state.showEmptyFieldsMessage = action.payload;
    },
    setFormData: (state, action) => {
      state.formData = action.payload;
    },

    setInputField: (state, action) => {
      const { key, value } = action.payload;
      if (key == "name") {
        state.formData.name = value;
      } else if (key == "brand") {
        state.formData.brand = value;
      } else if (key == "price") {
        state.formData.price = value;
      } else if (key == "stock") {
        state.formData.stock = value;
      }
    },

    setDeleteConfirmation: (state, action) => {
      state.deleteConfirmation = action.payload;
    },
    setGlobalFilterValue: (state, action) => {
      state.globalFilterValue = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAddProduct,
  setSavedData,
  setEditIndex,
  setDialogHeader,
  setShowEmptyFieldsMessage,
  setDeleteConfirmation,
  setGlobalFilterValue,
  setCart,
  setInputField,
} = productSlice.actions;

export const { setFormData, setName, setBrand, setPrice, setStock } =
  productSlice.actions;

export default productSlice.reducer;
