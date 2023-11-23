import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Icon } from "semantic-ui-react";
import DataTable from "../Components/DataTable";
import CustomModal from "../Components/CustomModal";

const Sales = () => {
  const [pageOptions, setPageOptions] = useState({
    page: 1,
    limit: 10,
  });

  const [showModal, setModal] = useState(false);

  const [productsData, setProductsData] = useState([]);

  const [currentModal, setCurrentModal] = useState({ id: "", action: "" });

  const [{ customerId, productId, storeId, dateSold }, setFormFields] = useState({
    customerId: "",
    productId: "",
    storeId: "",
    dateSold: "",
  });

  // Function to fetch data using Axios
  const fetchData = async () => {
    try {
      const response = await axios.get("https://localhost:7058/api/SaleModel/");
      setProductsData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Call fetchData on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const [errorMsg, setErrorMsg] = useState("");

  // const productsData = [
  //   {
  //     id: 1,
  //     customer: "John",
  //     product: "Pear",
  //     store: "Countdown",
  //     date: "24 Jul,2018",
  //   },
  //   {
  //     id: 1,
  //     customer: "John",
  //     product: "Pear",
  //     store: "Countdown",
  //     date: "24 Jul,2018",
  //   },
  // ];

  const columns = [
    {
      header: "Customer",
      key: "customerId",
    },
    {
      header: "Product",
      key: "productId",
    },
    {
      header: "Store",
      key: "storeId",
    },
    {
      header: "Date Sold",
      key: "dateSold",
    },
    {
      header: "Action",
      renderCell: (row) => (
        <Button
          icon
          color="yellow"
          onClick={() => {
            setFormFields(() => ({customerId: row.customerId, productId:row.productId, storeId:row.storeId,  dateSold:row.dateSold}))
            handleAction(row.customerId, "edit")}
          }
        >
          <Icon name="edit" /> Edit
        </Button>
      ),
    },
    {
      header: "Price",
      renderCell: (row) => (
        <Button
          icon
          color="red"
          onClick={() => handleAction(row.customerId, "delete")}
        >
          <Icon name="trash alternate" /> Delete
        </Button>
      ),
    },
  ];

  const handleAction = (id, action) => {
    if (action === "delete") {
      setModal(true);
      setCurrentModal(() => ({ id, action: "delete" }));
      return;
    }

    setCurrentModal((state) => ({ ...state, action: "edit" }));
    setModal(true);

    // call api and set the data in the form fields or delete
  };

  const handlePageChange = (direction) => {
    setPageOptions((prevPage) => ({
      ...prevPage,
      page: direction === "next" ? prevPage + 1 : prevPage - 1,
    }));
  };

  const handleRowChange = (limit) => {
    setPageOptions(() => ({
      page: 1,
      limit: limit,
    }));
  };

  const onCloseModal = () => {
    if (currentModal.action !== "delete") {
      setFormFields(() => ({
        customerId: "",
        productId: "",
        storeId: "",
        dateSold: "",
      }));

      setErrorMsg("");
    }

    setCurrentModal(() => ({
      action: "",
      id: "",
    }));

    setModal(false);
  };

  const validateForm = () => {
    if (
      customerId.trim() === "" ||
      storeId.trim() === "" ||
      productId.trim() === "" ||
      dateSold.trim() === ""
    ) {
      setErrorMsg("please Fill all fields");
      return false;
    }

    return true;
  };

  const formSubmit = async () => {
    const isFormValid = validateForm();

    if (isFormValid) {
      const payload = {
        customerId,
        productId,
        storeId,
        dateSold
      };
      try {
        if (currentModal.action === "edit") {
          console.log("Inside sales edit");
          console.log(payload)
          await axios.put(
            `https://localhost:7058/api/SaleModel/{id}?SaleId=${currentModal.id}`,
            payload
          );
        } else {
          console.log("Inside sales add");
          console.log(payload)
          await axios.post("https://localhost:7058/api/SaleModel/", payload);
        }

        fetchData();
        onCloseModal();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const CustomerModal = () => {
    const handleOnChange = (name, value) => {
      errorMsg !== "" && setErrorMsg("");
      setFormFields((state) => ({
        ...state,
        [name]: value,
      }));
    };
    return (
      <>
        <Form>
          <Form.Field>
            <label>Customer</label>
            <input
              placeholder=""
              name="customer"
              value={customerId}
              onChange={(e) => handleOnChange("customerId", e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Product</label>
            <input
              placeholder=""
              name="product"
              value={productId}
              onChange={(e) => handleOnChange("productId", e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Store</label>
            <input
              placeholder=""
              name="store"
              value={storeId}
              onChange={(e) => handleOnChange("storeId", e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Date Sold</label>
            <input
              placeholder=""
              type="datetime-local"
              name="dateSold"
              value={dateSold}
              onChange={(e) => handleOnChange("dateSold", e.target.value)}
            />
          </Form.Field>
        </Form>
      </>
    );
  };

  const deleteRow = async () => {
    try {
      await axios.delete(
        `https://localhost:7058/api/SaleModel/${currentModal.id}`
      );
      fetchData();
      onCloseModal();
      // setCustomersData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteModal = () => {
    return <p>Are you sure?</p>;
  };

  const totalPages = Math.ceil(productsData.length / 10);

  const addNewCustomer = () => {
    setCurrentModal((state) => ({ ...state, action: "add" }));
    setModal(true);
  };

  return (
    <>
      <CustomModal
        show={showModal}
        onClose={onCloseModal}
        modalTitle={
          currentModal.action === "delete"
            ? "Delete Sales"
            : currentModal.action === "edit"
            ? "Edit Sales"
            : "Create Sales"
        }
        ModalBody={
          currentModal.action === "delete" ? deleteModal : CustomerModal
        }
        onSubmit={currentModal.action === "delete" ? deleteRow : formSubmit}
        error={errorMsg}
        currentModalView={currentModal.action}
      />
      <div className="page-wrap">
        <div>
          <Button primary onClick={addNewCustomer}>
            New Sale
          </Button>
        </div>
        <DataTable
          data={productsData}
          totalPage={totalPages}
          currentPage={pageOptions.page}
          limit={pageOptions.limit}
          handleRowChange={handleRowChange}
          onPageChange={handlePageChange}
          columns={columns}
        />
      </div>
    </>
  );
};

export default Sales;
