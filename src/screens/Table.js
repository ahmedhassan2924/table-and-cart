import "../styles/MainStyle.css";
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Card } from "primereact/card";
import "primeicons/primeicons.css";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Message } from "primereact/message";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { useSelector, useDispatch } from "react-redux";
import { setAddProduct } from "../redux/slices/productSlice";
import {
  setSavedData,
  setDeleteConfirmation,
  setCart,
} from "../redux/slices/productSlice";
import {
  saveDataToLocalStorage,
  getSavedDataFromLocalStorage,
} from "../functions/global.functions";
import {
  handleFormInputChange,
  handleSaveProduct,
  handleQuantityChange,
  handleEditProduct,
  handleClick,
  handleDeleteConfirm,
} from "../functions/table.functions";

const Table = () => {
  const toast = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState(null);
  const addProduct = useSelector((state) => state.product.addProduct);
  const savedData = useSelector((state) => state.product.savedData);
  const dialogHeader = useSelector((state) => state.product.dialogHeader);
  const showEmptyFieldsMessage = useSelector(
    (state) => state.product.showEmptyFieldsMessage
  );
  const formData = useSelector((state) => state.product.formData);
  const dispatch = useDispatch();
  let navigate = useNavigate();

  //#region Functions

  useEffect(() => {
    const dataFromLocalStorage = getSavedDataFromLocalStorage("savedData");
    dispatch(setSavedData(dataFromLocalStorage));
  }, []);

  const handleDeleteConfirm1 = (index) => {
    handleDeleteConfirm(index, toast);
  };

  //cart funtion
  const addToCart = () => {
    const newCart = savedData
      .filter((item) => item.count > 0)
      .map((item) => ({
        quantity: item.count,
        productId: item.id,
      }));

    dispatch(setCart(newCart));
    saveDataToLocalStorage("cart", newCart);
    saveDataToLocalStorage("savedData", savedData);

    navigate("/Cart");
  };

  return (
    <div className="Body">
      <div className="innerBox">
        <Card>
          <div className="mainHeader">
            <h3>PRODUCTS</h3>

            <IconField>
              <InputIcon className="pi pi-search" />
              <InputText
                type="search"
                onInput={(e) => setGlobalFilterValue(e.target.value)}
                placeholder="Search..."
              />
            </IconField>

            <Button
              severity="secondary"
              text
              raised
              rounded
              onClick={handleClick}
              label="Add Product"
            />
            <Button
              severity="secondary"
              text
              raised
              rounded
              onClick={addToCart}
              label="Go to Cart"
            />
          </div>
        </Card>

        {/* Table */}
        <div className="card">
          <DataTable
            toast={toast}
            value={savedData}
            showGridlines
            globalFilter={globalFilterValue}
            tableStyle={{ minWidth: "20rem" }}
          >
            <Column
              field="SrNo."
              header="SrNo."
              body={(rowData, rowIndex) => <span>{rowIndex.rowIndex + 1}</span>}
            ></Column>
            <Column field="name" header="Name"></Column>
            <Column field="brand" header="Brand"></Column>
            <Column field="price" header="Price"></Column>
            <Column field="stock" header="Stock"></Column>
            <Column
              field="Cart"
              header="cart"
              body={(rowData, rowIndex) => (
                <div className="Button">
                  <Button
                    icon="pi pi-minus"
                    onClick={() =>
                      handleQuantityChange("decrement", rowIndex.rowIndex)
                    }
                    rounded
                    outlined
                    severity="danger"
                    aria-label="Cancel"
                  />
                  <span field="count" className="p-mx-2">
                    {rowData.count}
                  </span>
                  <Button
                    icon="pi pi-plus"
                    rounded
                    outlined
                    aria-label="Filter"
                    onClick={() =>
                      handleQuantityChange("increment", rowIndex.rowIndex)
                    }
                  />
                </div>
              )}
            ></Column>
            <Column
              field="Action"
              header="Action"
              body={(rowData, rowIndex) => (
                <div className="Buttons">
                  <Button
                    outlined
                    className="p-button-danger"
                    icon="pi pi-trash"
                    label="Delete"
                    severity="danger"
                    onClick={() => handleDeleteConfirm1(rowIndex.rowIndex)}
                  />
                  <Button
                    icon="pi pi-check"
                    outlined
                    onClick={() => handleEditProduct(rowIndex.rowIndex)}
                    label="Edit"
                  />
                </div>
              )}
            ></Column>
          </DataTable>
        </div>
      </div>
      <ConfirmDialog />

      {/* Add Product Dialog */}
      {addProduct && (
        <Dialog
          header={dialogHeader}
          visible={addProduct}
          onHide={() => dispatch(setAddProduct(false))}
        >
          {showEmptyFieldsMessage && (
            <Message severity="error" text="Please fill all fields." />
          )}
          <div className="inputFields">
            <FloatLabel>
              <InputText
                id="Name"
                value={formData.name}
                onChange={(event) =>
                  handleFormInputChange("name", event.target.value)
                }
              />
              <label for="username">Name</label>
            </FloatLabel>
          </div>
          <div className="inputFields">
            <FloatLabel>
              <InputText
                id="Brand"
                value={formData.brand}
                onChange={(event) =>
                  handleFormInputChange("brand", event.target.value)
                }
              />
              <label for="username">Brand</label>
            </FloatLabel>
          </div>
          <div className="inputFields">
            <FloatLabel>
              <InputText
                id="Price"
                value={formData.price}
                onChange={(event) =>
                  handleFormInputChange("price", event.target.value)
                }
              />
              <label for="username">Price</label>
            </FloatLabel>
          </div>
          <div className="inputFields">
            <FloatLabel>
              <InputText
                id="Stock"
                value={formData.stock}
                onChange={(event) =>
                  handleFormInputChange("stock", event.target.value)
                }
              />
              <label for="username">Stock</label>
            </FloatLabel>
          </div>
          <div className="Buttons">
            <Button
              label="Cancel"
              icon="pi pi-times"
              severity="danger"
              outlined
              onClick={handleClick}
            />
            <Button
              icon="pi pi-check"
              label="Save"
              onClick={handleSaveProduct}
            />
          </div>
        </Dialog>
      )}
      <Toast ref={toast} />
    </div>
  );
};

export default Table;
