import { setInputField } from "../redux/slices/productSlice";
import { confirmDialog } from "primereact/confirmdialog";
import { store } from "../redux/store";
import {
  generateRandomString,
  saveDataToLocalStorage,
} from "./global.functions";
import {
  setShowEmptyFieldsMessage,
  setSavedData,
  setEditIndex,
  setFormData,
  setAddProduct,
  setDialogHeader,
  setDeleteConfirmation,
} from "../redux/slices/productSlice";

//TASK make 1 action instead of 4
export const handleFormInputChange = (key, value) => {
  store.dispatch(setInputField({ key, value }));
};

// Save Product
export const handleSaveProduct = () => {
  const { formData, editIndex, savedData, addProduct } =
    store.getState().product;
  const randomId = generateRandomString(8);

  const productDataWithId = { ...formData, id: randomId };
  if (
    formData.name === "" ||
    formData.brand === "" ||
    formData.price === "" ||
    formData.stock === ""
  ) {
    store.dispatch(setShowEmptyFieldsMessage(true));
    return;
  }
  if (editIndex !== null) {
    const updatedData = [...savedData];

    updatedData[editIndex] = formData;
    store.dispatch(setSavedData(updatedData));
    saveDataToLocalStorage("savedData", [updatedData]);
    store.dispatch(setEditIndex(null));
  } else {
    store.dispatch(setSavedData([...savedData, productDataWithId]));
    saveDataToLocalStorage("savedData", [...savedData, productDataWithId]);
    // showSuccess("saved successfully");
    store.dispatch(setShowEmptyFieldsMessage(false));
  }
  store.dispatch(
    setFormData({
      name: "",
      brand: "",
      stock: "",
      price: "",
      id: "",
    })
  );
  store.dispatch(setAddProduct(!addProduct));
};

// handle decrement / increment
export const handleQuantityChange = (key, index) => {
  const { savedData } = store.getState().product;
  const updatedData = [...savedData];
  if (key == "increment") {
    if (updatedData[index].stock > 0) {
      const updatedItem = { ...updatedData[index] };
      updatedItem.count++;
      updatedItem.stock--;
      updatedData[index] = updatedItem;
      store.dispatch(setSavedData(updatedData));
    }
  } else {
    if (updatedData[index].count > 0) {
      const updatedItem = { ...updatedData[index] };
      updatedItem.count--;
      updatedItem.stock++;
      updatedData[index] = updatedItem;
      store.dispatch(setSavedData(updatedData));
    }
  }
};

//edit funtion
export const handleEditProduct = (index) => {
  const { savedData } = store.getState().product;
  const itemToEdit = savedData[index];
  if (itemToEdit) {
    store.dispatch(setFormData(itemToEdit));
    store.dispatch(setEditIndex(index));
    store.dispatch(setDialogHeader("Edit Product"));
    store.dispatch(setAddProduct(true));
  } else {
    console.error("Item to edit not found at index:", index);
  }
};
//add product
export const handleClick = () => {
  const { addProduct } = store.getState().product;
  store.dispatch(setAddProduct(!addProduct));

  store.dispatch(setDialogHeader("Add Product"));
  store.dispatch(
    setFormData({
      name: "",
      brand: "",
      stock: "",
      price: "",
      count: 0,
      id: "",
    })
  );
};
//handle delete product

//   delte prime react
export const handleDeleteConfirm = (index, toast) => {
  confirmDialog({
    message: "Do you want to delete this record?",
    header: "Delete Confirmation",
    icon: "pi pi-info-circle",
    defaultFocus: "reject",
    acceptClassName: "p-button-danger",
    accept: () => handleDeleteProduct(index, toast),
    reject: handleCancelDelete,
  });
};

export const handleDeleteProduct = (index, toast) => {
  const { savedData } = store.getState().product;
  const updatedData = [...savedData];
  updatedData.splice(index, 1);
  store.dispatch(setSavedData(updatedData));
  store.dispatch(setDeleteConfirmation(false));
  showSuccess(toast, "Deleted Successfully", "error");
};

const showSuccess = (toast, message, severity = "success") => {
  toast.current.show({
    severity: severity,
    summary: "Success",
    detail: message,
    life: 3000,
  });
};
//   handleCancelDelete

export const handleCancelDelete = () => {
  store.dispatch(setDeleteConfirmation(false));
};
