import "./style.css";
import { Modal } from "../modal";
import axios from "axios";
import { useEffect, useState } from "react";
import { AddLocation } from "../addLocation";
import { ErrorModal } from "../errorModal";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loader } from "../loader";
import { ConfirmModal } from "../confirmModal";
import { Link, useNavigate } from "react-router-dom";

export function HoldOrders() {
  const fetch = useAuthenticatedFetch();
  const [isLoading, setIsLoading] = useState(false); 
  const [selectedOrders, setSelectedOrders] = useState([]); 
  const [orders, setOrders] = useState([]);
  const [allHoldOrders, setAllHoldOrders] = useState([]) 
  const [filterData, setFilterData] = useState({
    startDate: "",
    endDate: "",
    orderId: "",
    shippingType: "",
  }); 
  const navigate = useNavigate();

  const getAllOrders = () => {
    setIsLoading(true);

    return new Promise((resolve, reject) => {
      fetch(`/api/orders`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch orders, status: ${response.status}`
            );
          }
          return response.json();
        })
        .then((data) => {
          resolve(data.data);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setIsLoading(false);
          reject(error);
        });
    });
  };

  const getOrderMeta = () => {
    return new Promise((resolve, reject) => {
      fetch(`/api/order-metafields`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Failed to fetch order metafields, status: ${response.status}`
            );
          }
          return response.json();
        })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.error("Error fetching order metafields:", error);
          setIsLoading(false);
          reject(error);
        });
    });
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getAllOrders(), getOrderMeta()])
      .then(([ordersData, orderMetaData]) => {
        const getOrders = ordersData?.map((item1) => {
          const matchingItem2 = orderMetaData?.body?.data?.orders?.edges.find(
            (item2) => item2.node.id.includes(item1.id)
          );
          return { ...item1, ...matchingItem2 };
        });
        setOrders(getOrders);
        setAllHoldOrders(getOrders);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("error:", error);
      });
  }, []);

  const getMetaValue = (metafields, keyValue) => {
    var location = metafields?.find((element) => element.node.key == keyValue);
    return location != undefined ? location.node.value : null;
  };

  const selectOrder = (e) => {
    const orderIds = selectedOrders.includes(e.target.value)
      ? selectedOrders.filter((item) => item !== e.target.value)
      : [...selectedOrders, e.target.value];
    setSelectedOrders(orderIds);
  };

  const handleSelectAll = (e) => {
    var selectedIds = e.target.checked
      ? orders.map((element) => element.id.toString())
      : [];
    setSelectedOrders(selectedIds);
  };
 
  return (
    <div className="hold-orders">
      {isLoading && <Loader />}
      <div className="orders-filters">
        <div className="input-container">
          <div className="input-lebel">
            <span> Start Date&nbsp;</span>
          </div>
          <div className="input-field1">
            <input
              className="input-field-text"
              type="date"
              onChange={(e) =>
                setFilterData({ ...filterData, startDate: e.target.value })
              }
              value={filterData.startDate}
            />
          </div>
        </div>
        <div className="input-container">
          <div className="input-lebel">
            <span> End Date&nbsp;</span>
          </div>
          <div className="input-field1">
            <input
              className="input-field-text"
              type="date"
              onChange={(e) =>
                setFilterData({ ...filterData, endDate: e.target.value })
              }
              value={filterData.endDate}
            />
          </div>
        </div>
        <div className="input-container">
          <div className="input-lebel">
            <span> Order Id&nbsp;</span>
          </div>
          <div className="input-field1">
            <input
              className="input-field-text"
              type="text"
              placeholder="Order Id"
              onChange={(e) =>
                setFilterData({ ...filterData, orderId: e.target.value })
              }
              value={filterData.orderId}
            />
          </div>
        </div>
        <div className="input-container">
          <div className="input-lebel">
            <span> Order Shipping Type&nbsp;</span>
          </div>
          <div className="input-field1">
            <select className="input-field-text" type="text">
              <option value="all">All</option>
            </select>
          </div>
        </div>
        <div className="d-flex align-items-end  ">
        <button className="fc-yellow-btn pointer"
        onClick={()=>{ 
           
            const filteredOrders = allHoldOrders?.filter((element) => {
              const orderDate = new Date(element.created_at);
              const startDate = new Date(filterData.startDate);
              const endDate = new Date(filterData.endDate);
           
              startDate.setHours(0, 0, 0, 0); 
              endDate.setHours(23, 59, 59, 999);
          
              const orderDateCheck = (filterData.startDate !== "" && filterData.endDate !== "")
                  ? (orderDate >= startDate && orderDate <= endDate)
                  : true;
          
              const orderIdCheck = (filterData.orderId !== "")
                  ? element.order_number.toString().includes(filterData.orderId.toString())
                  : true;
          
              return orderDateCheck && orderIdCheck;
          });
          
          setOrders(filteredOrders);
          
        }}
        
        >Filter</button>
      </div>
        <div className="filter-buttons">
          {/* <button> Filter </button> */}
        
          <button className="pointer"
          onClick={()=>{
            setFilterData({
              startDate: "",
              endDate: "",
              orderId: "",
              shippingType: "",
            })
            setOrders(allHoldOrders)
          }}
          
          > Reset </button>
        </div>
      </div>
      <div className="order-action-buttons">
        <button className="submit-btn">Book Selected Orders</button>
      </div>
      <div className="pickup-locations-table">
        <table>
          <tr className="table-head">
            <th className="select-all">
              <input type="checkbox" onChange={(e) => handleSelectAll(e)} />
            </th>
            <th>Order Id</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Ship To</th>
            <th>Status</th>
            <th>Remarks</th>
            <th>Total</th>
            <th>packages</th>
            <th>Shipping type</th>
            <th>Actions</th>
          </tr>
          {orders?.length > 0 &&
            orders.map((element, i) => {
              if (
                getMetaValue(
                  element.node?.metafields?.edges,
                  "fc_order_status"
                ) == "Hold"
              ) {
                return (
                  <tr
                    key={i}
                    className="products-row"
                    style={{ background: i % 2 == 0 ? "#F5F8FA" : "#FFFFFF" }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        value={element.id}
                        onChange={(e) => selectOrder(e)}
                        checked={selectedOrders.includes(element.id.toString())}
                      />
                    </td>
                    <td
                      width="7%"
                      onClick={() => navigate("/orderDetails")}
                      style={{ cursor: "pointer" }}
                    >
                      {element.order_number}
                    </td>
                    <td width="7%">
                      {new Date(element.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td width="15%">
                      {element?.shipping_address?.first_name +
                        " " +
                        element?.shipping_address?.last_name}
                    </td>
                    <td width="15%">
                      {element?.shipping_address?.address1 +
                        ", " +
                        element?.shipping_address?.address2 +
                        " " +
                        element.shipping_address?.city}
                    </td>
                    <td width="8%">{"Hold"}</td>
                    <td width="8%">{"NA"}</td>
                    <td width={"8%"}>{element.subtotal_price}</td>
                    <td width="7%">
                      {element.line_items[0].fulfillable_quantity}
                    </td>
                    <td width="15%">{"NA"}</td>
                    <td width="10%" className="order-actions">
                      <FontAwesomeIcon
                        icon="fa-solid fa-pen-to-square"
                        size="2xs"
                      />
                    </td>
                  </tr>
                );
              }
            })}
        </table>
      </div>
    </div>
  );
}
