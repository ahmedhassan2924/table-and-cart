import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "../styles/cartStyle.css";
import { Card } from "primereact/card";
import { useSelector, useDispatch } from "react-redux";
import { setShow } from "../redux/slices/cartSlice";
import { setTotalAmount } from "../redux/slices/cartSlice";

import { Toast } from "primereact/toast";
import {
  saveDataToLocalStorage,
  getSavedDataFromLocalStorage,
} from "../functions/global.functions";

function Cart() {
  const [showToast, setShowToast] = useState(false);
  const [placeorder, setPlaceOrder] = useState(false);
  const show = useSelector((state) => state.cart.show);
  const totalAmount = useSelector((state) => state.cart.totalAmount);
  const dispatch = useDispatch();

  //   effects

  useEffect(() => {
    filterProducts();
  }, []);

  //   filter products
  const filterProducts = () => {
    const savedData = getSavedDataFromLocalStorage("savedData");
    const cartData = getSavedDataFromLocalStorage("cart");
    const newarray = cartData.map((item) => item.productId);
    const array = savedData.filter((item) => newarray.includes(item.id));

    let total = 0;

    savedData.map((item) => {
      const cartItem = cartData.find(
        (cartItem) => cartItem.productId === item.id
      );
      if (cartItem) {
        item.count = cartItem.quantity;
        item.total = item.price * cartItem.quantity;
        total += item.total;
        return item;
      }
    });
    dispatch(setShow(array));
    dispatch(setTotalAmount(total));
  };
  const updateTotalAmount = (data) => {
    let total = 0;
    data.forEach((item) => {
      total += item.total;
    });
    dispatch(setTotalAmount(total));
  };
  const toast = useRef(null);

  // increment and decrement functions
  const handleIncrement = (index) => {
    const updatedData = [...show];
    if (updatedData[index].stock > 0) {
      const updatedItem = { ...updatedData[index] };
      updatedItem.count++;
      updatedItem.stock--;
      updatedData[index] = updatedItem;
      updatedData[index].total =
        updatedData[index].price * updatedData[index].count;
      console.log(updatedData);
      saveDataToLocalStorage("cart", updatedData);
      saveDataToLocalStorage("savedData", updatedData);
      dispatch(setShow(updatedData));
      updateTotalAmount(updatedData);
    } else {
      {
        toast.current.show({
          severity: "info",
          summary: "Info",
          detail: "out of stock",
        });
      }
      setShowToast(false);
    }
  };

  const handleDecrement = (index) => {
    const updatedData = [...show];
    if (updatedData[index].count > 0) {
      const updatedItem = { ...updatedData[index] };
      updatedItem.count--;
      updatedItem.stock++;
      updatedData[index] = updatedItem;
      updatedData[index].total =
        updatedData[index].price * updatedData[index].count;
      dispatch(setShow(updatedData));
      updateTotalAmount(updatedData);
      saveDataToLocalStorage("cart", updatedData);
      saveDataToLocalStorage("savedData", updatedData);
    }
  };
  return (
    <div className="Body">
      <Toast ref={toast} />

      <div className="innerBox">
        <DataTable value={show}>
          <Column
            field="SrNo."
            header="SrNo."
            body={(rowData, rowIndex) => <span>{rowIndex.rowIndex + 1}</span>}
          ></Column>
          <Column field="name" header="Name"></Column>
          <Column field="brand" header="Brand"></Column>
          <Column field="price" header="Price"></Column>
          <Column field="count" header="quantity"></Column>
          <Column
            field="total"
            header="total"
            body={(rowData) => rowData.price * rowData.count}
          ></Column>

          <Column
            field="Cart"
            header="cart"
            body={(rowData, rowIndex) => (
              <div className="Button">
                <>
                  <Button
                    icon="pi pi-minus"
                    rounded
                    outlined
                    severity="danger"
                    aria-label="Cancel"
                    onClick={() => handleDecrement(rowIndex.rowIndex)}
                  />
                  <span field="count" className="p-mx-2">
                    {rowData.count}
                  </span>
                  <Button
                    icon="pi pi-plus"
                    rounded
                    outlined
                    aria-label="Filter"
                    onClick={() => handleIncrement(rowIndex.rowIndex)}
                  />
                </>
              </div>
            )}
          ></Column>
        </DataTable>
        <div className="card">
          <Card title="Total Amount">
            <p className="m-0">Total: {totalAmount}</p>
            <Button onClick={() => setPlaceOrder(true)}>Place Order</Button>
            <Column
              field="total"
              header="total"
              body={(rowData) => rowData.price * rowData.count}
            ></Column>
          </Card>
        </div>
      </div>
      <div className="card flex justify-content-center">
        <Dialog
          header="Your Final Cart"
          visible={placeorder}
          style={{ width: "50vw" }}
          onHide={() => {
            if (!placeorder) return;
            setPlaceOrder(false);
          }}
        >
          <DataTable value={show}>
            <Column
              field="SrNo."
              header="SrNo."
              body={(rowData, rowIndex) => <span>{rowIndex.rowIndex + 1}</span>}
            ></Column>
            <Column field="name" header="Name"></Column>
            <Column field="brand" header="Brand"></Column>
            <Column field="price" header="Price"></Column>
            <Column field="count" header="quantity"></Column>
            <Column
              field="total"
              header="total"
              body={(rowData) => rowData.price * rowData.count}
            ></Column>
          </DataTable>
          <p className="m-0">Total: {totalAmount}</p>
        </Dialog>
      </div>
    </div>
  );
}

export default Cart;
