import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import "./style.css";
import { Loader } from "../loader";
import { ErrorModal } from "../errorModal";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";

export function MerchantBillingDetails(props) {
  const [billingFirstName, setBillingFirstName] = useState("");
  const [billingLastName, setBillingLastName] = useState("");
  const [billingCompanyName, setBillingCompanyName] = useState("");
  const [billingPhone, setBillingPhone] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingAbn, setBillingAbn] = useState("");
  const [billingAddress1, setBillingAddress1] = useState("");
  const [billingAddress2, setBillingAddress2] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPostcode, setBillingPostcode] = useState("");
  const [billingSuburb, setBillingSuburb] = useState("");
  const [bookingPreference, setBookingPreference] = useState("");
  const [fallbackAmount, setFallbackAmount] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [isInsurancePaidByCustomer, setIsInsurancePaidByCustomer] = useState(0);
  const [automaticOrderProcess, setAutomaticOrderProcess] = useState(0);
  const [conditionalValue, setConditionalValue] = useState("");
  const [insuranceAmount, setInsuranceAmount] = useState("");
  const [processAfterMinutes, setProcessAfterMinutes] = useState(60);
  const [processAfterDays, setProcessAfterDays] = useState(0);
  const [isDropOffTailLift, setIsDropOffTailLift] = useState(false);
  const [tailLiftValue, setTailLiftValue] = useState(30);
  const [suburbs, setSuburbs] = useState([]);
  const [defaultSuburb, setDefaultSuburb] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [activeCouriers, setActiveCouriers] = useState([]);
  // const [shoppingPreference, setShoppingPreference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [carrierServices, setCarrierServices] = useState(null);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCourierPref, setSelectedCourierPref] = useState([]);
  const [categoryOfGoods, setCategoryOfGoods] = useState([]);
  const [selectedGoods, setSelectedGoods] = useState(null);

  const fetch = useAuthenticatedFetch();

  // const categoryOfGoods = [
  //     {
  //         "value": "alcohal", "label": "alcohal"
  //     },
  //     {
  //         "value": "food", "label": "food"
  //     },
  //     {
  //         "value": "furniture", "label": "furniture"
  //     },
  //     {
  //         "value": "plants", "label": "plants"
  //     }
  // ]

  const getMerchantDetails = (categories) => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "request-type": process.env.REQUEST_TYPE,
      version: "3.1.1",
      Authorization: "Bearer " + accessToken,
    };
    axios
      .get(`${process.env.API_ENDPOINT}/api/wp/get_merchant`, {
        headers: headers,
      })
      .then((response) => {
        // getMerchant();
        setDefaultSuburb({
          value:
            response.data.data.billing_suburb +
            ", " +
            response.data.data.billing_postcode +
            " (" +
            response.data.data.billing_state +
            ")",
          label:
            response.data.data.billing_suburb +
            ", " +
            response.data.data.billing_postcode +
            "(" +
            response.data.data.billing_state +
            ")",
        });
        // Set default selected goods
        let selected_value = JSON.parse(response.data.data.categories_of_goods);

        setSelectedGoods(
          categories.filter((item) => selected_value.includes(item.value))
        );
        setMerchantDetails(response.data.data);
        props.setMerchantDetails(response.data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const getCategoryOfGoods = () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "request-type": process.env.REQUEST_TYPE,
      version: "3.1.1",
      Authorization: "Bearer " + accessToken,
    };
    axios
      .get(`${process.env.API_ENDPOINT}/api/wp/categories_of_goods`, {
        headers: headers,
      })
      .then((response) => {
        var categories = [];
        response.data.data.forEach((element) => {
          var category = { value: element.id, label: element.category };
          categories.push(category);
        });

        setCategoryOfGoods(categories);
        getMerchantDetails(categories);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const saveMerchant = async (merchantDetails) => {
    const response = await fetch("/api/save-merchant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(merchantDetails),
    });
  };

  const getMerchant = async () => {
    const response = await fetch("/api/get-merchant", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const getCarriers = async () => {
    const response = await fetch("/api/carrier-services", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("carrier", data.data);
    setCarrierServices(data.data);
  };

  function getDefaultGoods() {
    const values = selectedGoods?.map((element, i) => {
      return categoryOfGoods[element];
    });
    console.log("values=", values);
    return values;
  }

  function setMerchantDetails(merchant) {
    setBillingFirstName(merchant.billing_first_name);
    setBillingLastName(merchant.billing_last_name);
    setBillingCompanyName(merchant.billing_company_name);
    setBillingPhone(merchant.billing_phone);
    setBillingEmail(merchant.billing_email);
    setBillingAbn(merchant.abn);
    setBillingAddress1(merchant.billing_address_1);
    setBillingAddress2(merchant.billing_address_2);
    setBillingState(merchant.billing_state);
    setBillingPostcode(merchant.billing_postcode);
    setBillingSuburb(merchant.billing_suburb);
    setBookingPreference(merchant.booking_preference);
    setFallbackAmount(merchant.fallback_amount);
    setInsuranceType(merchant.insurance_type);
    setIsInsurancePaidByCustomer(merchant.is_insurance_paid_by_customer);
    setConditionalValue(merchant.conditional_price);
    setInsuranceAmount(merchant.insurance_amount);
    setIsDropOffTailLift(merchant.is_drop_off_tail_lift);

    const carriers = JSON.parse(merchant.courier_preferences);

    setSelectedCourierPref(carriers);

    const tailLiftWeight = localStorage.getItem("tailLiftValue");
    setTailLiftValue(tailLiftWeight);
  }

  const getSuburbs = () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "request-type": process.env.REQUEST_TYPE,
      version: "3.1.1",
      Authorization: "Bearer " + accessToken,
    };
    axios
      .get(`${process.env.API_ENDPOINT}/api/wp/suburbs`, { headers: headers })
      .then((response) => {
        var suburbData = [];
        response.data.data.forEach((element) => {
          var suburb = {
            value:
              element.name +
              ", " +
              element.postcode +
              " (" +
              element.state +
              ")",
            label:
              element.name +
              ", " +
              element.postcode +
              "(" +
              element.state +
              ")",
          };
          suburbData.push(suburb);
        });

        setSuburbs(suburbData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getCouriers = () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "request-type": process.env.REQUEST_TYPE,
      version: "3.1.1",
      Authorization: "Bearer " + accessToken,
    };
    axios
      .get(`${process.env.API_ENDPOINT}/api/wp/couriers`, { headers: headers })
      .then((response) => {
        setCouriers(response.data.data);
        var courierIds = [];
        courierIds = response.data.data.map((element) => element.id.toString());
        setActiveCouriers(courierIds);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const validations = () => {
    if (billingFirstName == "") {
      setErrorMessage("Please enter first name.");
      return false;
    }
    if (billingLastName == "") {
      setErrorMessage("Please enter last name.");
      return false;
    }
    if (billingCompanyName == "") {
      setErrorMessage("Please enter company name.");
      return false;
    }
    if (billingPhone == "") {
      setErrorMessage("Please enter phone number.");
      return false;
    }
    if (billingEmail == "") {
      setErrorMessage("Please enter email.");
      return false;
    }
    if (billingAddress1 == "") {
      setErrorMessage("Please enter address1.");
      return false;
    }
    if (billingSuburb == "") {
      setErrorMessage("Please select suburb.");
      return false;
    }
    if (selectedGoods.length == 0 || selectedGoods === null) {
      setErrorMessage("Please select atleast 1 category of goods.");
      return false;
    }
    return true;
  };

  const activateMerchant = async () => {
    try {
      const isValid = validations();
      console.log("isValid=", isValid);
      if (isValid) {
        setIsLoading(true);
        const accessToken = localStorage.getItem("accessToken");
        const merchantDomainId = localStorage.getItem("merchantDomainId");
        const payload = {
          id: merchantDomainId,
          billingFirstName: billingFirstName,
          billingLastName: billingLastName,
          billingCompanyName: billingCompanyName,
          billingPhone: billingPhone,
          billingEmail: billingEmail,
          abn: billingAbn,
          packageType: "box",
          billingAddress1: billingAddress1,
          billingAddress2: billingAddress2,
          billingSuburb: billingSuburb,
          billingState: billingState,
          billingPostcode: billingPostcode,
          conditionalPrice: conditionalValue,
          courierPreferences: selectedCourierPref,
          bookingPreference: bookingPreference,
          isInsurancePaidByCustomer: isInsurancePaidByCustomer ? 1 : 0,
          fallbackAmount: fallbackAmount,
          insuranceType: insuranceType,
          insuranceAmount: insuranceAmount,
          isDropOffTailLift: isDropOffTailLift,
          tailLiftValue: tailLiftValue,
          isAuthorityToLeave: "0",
          processAfterMinutes: processAfterMinutes,
          processAfterDays: processAfterDays,
          automaticOrderProcess: automaticOrderProcess,
          shoppingPreference: "show_shipping_price_with_carrier_name",
          action: "post_activate_mechant",
          paymentMethod: "pm_1O9jNICodfiDzZhka9lcNse4",
          categoriesOfGoods: selectedGoods ?? [],
        };
        props.setActiveApiPayload(payload);
        const headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
          "request-type": process.env.REQUEST_TYPE,
          version: "3.1.1",
          Authorization: "Bearer " + accessToken,
        };
        await axios
          .post(`${process.env.API_ENDPOINT}/api/wp/activate`, payload, {
            headers: headers,
          })
          .then((response) => {
            props.setActiveNavItem("paymentMethods");
            localStorage.setItem("tailLiftValue", tailLiftValue);
            const carrierService = getCarrierSerice(carrierServices);
            if (carrierService == null) {
              createCarrierService();
            }
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
          });
      } else {
        setOpenErrorModal(true);
      }
    } catch (error) {
      console.log("error==", error);
    }
  };

  const getCarrierSerice = (data) => {
    const item = data.find((obj) => obj.name === "Fast Courier");
    return item ?? null;
  };

  const createCarrierService = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/carrier-service/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          package_name: "Fast Courier",
        }),
      });
      const data = await response.json();
      console.log("carrier", data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const handleCourierChange = (e) => {
    const courierIds = selectedCourierPref.includes(e.target.value)
      ? selectedCourierPref.filter((item) => item !== e.target.value)
      : [...selectedCourierPref, e.target.value];

    setSelectedCourierPref(courierIds);
  };

  function handleCategoryChange(categorData) {
    const categoryIds = categorData.map((element, i) => {
      return element.value;
    });
    setSelectedGoods(categoryIds);
  }

  useEffect(() => {
    getCouriers();
    getSuburbs();
    getCarriers();
    getCategoryOfGoods(); // LIST OF CATEGORY OF GOODS
  }, []);

  return (
    <div className="merchant-main">
      {isLoading && <Loader />}
      <ErrorModal
        showModal={openErrorModal}
        message={errorMessage}
        onConfirm={() => setOpenErrorModal(false)}
      />
      <div className="merchant-heading1">Merchant Billing Details</div>
      <div className="input-row">
        <div className="input-container1">
          <div className="input-lebel1">
            <span> First Name&nbsp;</span>
            <span style={{ color: "red" }}> *</span>
          </div>
          <div className="input-field">
            <input
              className="input-field-text1"
              type="text"
              value={billingFirstName}
              placeholder="First Name"
              onChange={(e) => setBillingFirstName(e.target.value)}
            />
          </div>
        </div>
        <div className="input-container1">
          <div className="input-lebel1">
            <span> Last Name&nbsp;</span>
            <span style={{ color: "red" }}> *</span>
          </div>
          <div className="input-field">
            <input
              className="input-field-text1"
              type="text"
              value={billingLastName}
              placeholder="Last Name"
              onChange={(e) => setBillingLastName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="input-row">
        <div className="input-container1">
          <div className="input-lebel1">
            <span> Company Name&nbsp;</span>
            <span style={{ color: "red" }}> *</span>
          </div>
          <div className="input-field">
            <input
              className="input-field-text1"
              type="text"
              value={billingCompanyName}
              placeholder="Company Name"
              onChange={(e) => setBillingCompanyName(e.target.value)}
            />
          </div>
        </div>
        <div className="input-container1">
          <div className="input-lebel1">
            <span> Contact Phone Number&nbsp;</span>
            <span style={{ color: "red" }}> *</span>
          </div>
          <div className="input-field">
            <input
              className="input-field-text1"
              type="text"
              value={billingPhone}
              placeholder="Contact Phone Number"
              onChange={(e) => setBillingPhone(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="input-row">
        <div className="input-container1">
          <div className="input-lebel1">
            <span> Email&nbsp;</span>
            <span style={{ color: "red" }}> *</span>
          </div>
          <div className="input-field">
            <input
              className="input-field-text1"
              type="text"
              value={billingEmail}
              placeholder="Email"
              onChange={(e) => setBillingEmail(e.target.value)}
            />
          </div>
        </div>
        <div className="input-container1">
          <div className="input-lebel1">
            <span> ABN&nbsp;</span>
            <span style={{ color: "red" }}> *</span>
          </div>
          <div className="input-field">
            <input
              className="input-field-text1"
              type="text"
              value={billingAbn}
              placeholder="ABN"
              onChange={(e) => setBillingAbn(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="input-row">
        <div className="input-container1">
          <div className="input-lebel1">
            <span> Address 1&nbsp;</span>
            <span style={{ color: "red" }}> *</span>
          </div>
          <div className="input-field">
            <input
              className="input-field-text1"
              type="text"
              value={billingAddress1}
              placeholder="Address 1"
              onChange={(e) => setBillingAddress1(e.target.value)}
            />
          </div>
        </div>
        <div className="input-container1">
          <div className="input-lebel1">
            <span> Address 2</span>
          </div>
          <div className="input-field">
            <input
              className="input-field-text1"
              type="text"
              value={billingAddress2}
              placeholder="Address 2"
              onChange={(e) => setBillingAddress2(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="input-row">
        <div className="input-container1">
          <div className="input-lebel1">
            <span> Suburb&nbsp;</span>
            <span style={{ color: "red" }}> *</span>
          </div>
          {defaultSuburb != null && (
            <Select
              options={suburbs}
              onChange={(e) => {
                const [, extractedCity, extractedPostcode, extractedState] =
                  e.value.match(/^(.*), (\d+) \((.*)\)$/);
                setBillingSuburb(extractedCity);
                setBillingPostcode(extractedPostcode);
                setBillingState(extractedState);
              }}
              defaultValue={defaultSuburb}
            />
          )}
        </div>
      </div>
      <div className="shipping-config">
        <div className="shipping-left">
          <div className="merchant-heading1">Shipping Configuration</div>
          <div className="shipping-label">
            <span> Set your shipping costs preferences&nbsp;</span>
            <span style={{ color: "red" }}> *</span>
          </div>
          <div className="input-radio">
            <input
              type="radio"
              name="bookingPreference"
              id="freeForAllOrders"
              value="free_for_all_orders"
              checked={bookingPreference == "free_for_all_orders"}
              onChange={(e) => setBookingPreference(e.target.value)}
            />
            <label htmlFor="freeForAllOrders">&nbsp;Free For All orders</label>
          </div>
          <div className="input-radio">
            <input
              type="radio"
              name="bookingPreference"
              id="freeForBasketValue"
              value="free_for_basket_value_total"
              checked={bookingPreference == "free_for_basket_value_total"}
              onChange={(e) => setBookingPreference(e.target.value)}
            />
            <label htmlFor="freeForBasketValue">
              &nbsp;Free for Orders with Prices{" "}
            </label>
            {bookingPreference == "free_for_basket_value_total" && (
              <span className="conditional-price">
                {"> "}
                <input
                  type="type"
                  name="conditionalPrice"
                  className="input-field-text1"
                  value={conditionalValue}
                  onChange={(e) => setConditionalValue(e.target.value)}
                />
              </span>
            )}
          </div>
          <div className="input-radio">
            <input
              type="radio"
              name="bookingPreference"
              id="notFree"
              value="shipping_cost_passed_on_to_customer"
              checked={
                bookingPreference == "shipping_cost_passed_on_to_customer"
              }
              onChange={(e) => setBookingPreference(e.target.value)}
            />
            <label htmlFor="notFree">
              &nbsp;All Shipping Costs Passed on to Customer
            </label>
          </div>
        </div>
        <div className="shipping-right">
          <div className="shipping-label">
            <span> Fallback Shipping Amount&nbsp;</span>
            <span style={{ color: "red" }}> *</span>
          </div>
          <div className="shipping-label1">
            <span>
              {" "}
              On occasions where no carrier can be found set a default shipping
              price&nbsp;
            </span>
          </div>
          <div className="input-field">
            <input
              className="input-field-text1"
              type="text"
              value={fallbackAmount}
              onChange={(e) => setFallbackAmount(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="courier-preference">
        <div className="merchant-heading1">Courier Preferences</div>
        <div className="shipping-label">
          <span> Active Couriers&nbsp;</span>
          <span style={{ color: "red" }}> *</span>
        </div>
        <div className="courier-preference-items">
          {activeCouriers.length > 0 &&
            couriers.map((courier, i) => {
              return (
                <div className="input-checkbox" key={i}>
                  <input
                    type="checkbox"
                    name={courier.id}
                    id={courier.id}
                    value={courier.id}
                    onChange={(e) => handleCourierChange(e)}
                    checked={selectedCourierPref.includes(
                      courier.id.toString()
                    )}
                  />
                  <label htmlFor={courier.id}>&nbsp;{courier.name}</label>
                </div>
              );
            })}
        </div>
      </div>
      <div className="input-row">
        <div className="input-container1">
          <div className="input-lebel1">
            <span> Category of Goods Sold&nbsp;</span>
            <span style={{ color: "red" }}> *</span>
          </div>

          {categoryOfGoods.length > 0 && selectedGoods && (
            <Select
              defaultValue={selectedGoods}
              isMulti
              name="colors"
              options={categoryOfGoods}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={(e) => handleCategoryChange(e)}
            />
          )}
        </div>
      </div>
      <div className="insurance-preferences">
        <div className="merchant-heading1">Insurance Preferences</div>
        <div className="shipping-label">
          <span> Insurance Types&nbsp;</span>
          <span style={{ color: "red" }}> *</span>
        </div>
        <div className="input-radio">
          <input
            type="radio"
            name="insuranceType"
            id="notRequired"
            value="1"
            onChange={(e) => setInsuranceType(e.target.value)}
            checked={insuranceType == "1"}
          />
          <label htmlFor="notRequired">
            &nbsp;Complimentary Coverage - No Additional Charge
          </label>
        </div>
        <div className="input-radio">
          <input
            type="radio"
            name="insuranceType"
            id="requiredUpto"
            value="2"
            onChange={(e) => setInsuranceType(e.target.value)}
            checked={insuranceType == "2"}
          />
          <label htmlFor="requiredUpto">
            &nbsp;Transit Insurance Coverage up to $
          </label>
          {insuranceType == 2 && (
            <span className="conditional-price">
              {"> "}
              <input
                type="type"
                name="insuranceAmount"
                className="input-field-text1"
                value={insuranceAmount}
                onChange={(e) => setInsuranceAmount(e.target.value)}
              />
            </span>
          )}
        </div>
        <div className="input-radio">
          <input
            type="radio"
            name="insuranceType"
            id="fullCartValue"
            value="3"
            onChange={(e) => setInsuranceType(e.target.value)}
            checked={insuranceType == "3"}
          />
          <label htmlFor="fullCartValue">
            &nbsp;Full Insurance Coverage of Shipment Value (Max. $10,000 AUD)
          </label>
        </div>
        <div className="input-checkbox">
          <input
            type="checkbox"
            name="isInsurancePaidByCustomer"
            id="isInsurancePaidByCustomer"
            onChange={(e) => setIsInsurancePaidByCustomer(e.target.checked)}
            checked={isInsurancePaidByCustomer == "1"}
          />
          <label htmlFor="isInsurancePaidByCustomer">
            &nbsp;Insurance cost passed onto customer
          </label>
        </div>
      </div>
      {/* <div className="settings">
                <div className="merchant-heading1">
                    Settings
                </div>
                <div className="shipping-label">
                    <span> Order processing&nbsp;</span><span style={{ color: "red" }}> *</span>
                </div>
                <div className="input-radio">
                    <input type="radio" name="automaticOrderProcess" id="auto" value="1" checked={automaticOrderProcess == 1} onChange={(e) => setAutomaticOrderProcess(e.target.value)} />
                    <label htmlFor="auto">&nbsp;Auto</label>
                    {
                        automaticOrderProcess == "1" &&
                        <span className="conditional-price">
                            {" > "}<input type="type" name="processAfterMinutes" className="input-field-text1" value={processAfterMinutes} onChange={(e) => setProcessAfterMinutes(e.target.value)} /> <span>minutes</span>
                        </span>
                    }
                </div>
                <div className="input-radio">
                    <input type="radio" name="automaticOrderProcess" id="manual" value="0" checked={automaticOrderProcess == 0} onChange={(e) => setAutomaticOrderProcess(e.target.value)} />
                    <label htmlFor="manual">&nbsp;Manual</label>
                </div>
            </div> */}
      <div className="input-checkbox">
        <input
          type="checkbox"
          name="isDropOffTailLift"
          id="isDropOffTailLift"
          value={isDropOffTailLift}
          onChange={(e) => setIsDropOffTailLift(e.target.checked)}
          checked={isDropOffTailLift}
        />
        <label htmlFor="isDropOffTailLift">
          &nbsp;Default tail lift on delivery
        </label>
        {isDropOffTailLift == true && (
          <span className="conditional-price">
            {"> It will only apply for packages over "}
            <input
              type="type"
              name="tailLiftValue"
              className="input-field-text1"
              value={30}
              onChange={(e) => setTailLiftValue(e.target.value)}
            />{" "}
            {" Kgs."}
          </span>
        )}
      </div>

      <div className="submit">
        <button className="submit-btn" onClick={() => activateMerchant()}>
          Save details
        </button>
      </div>
    </div>
  );
}
