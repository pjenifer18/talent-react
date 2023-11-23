import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Icon } from "semantic-ui-react";
import DataTable from "../Components/DataTable";
import CustomModal from "../Components/CustomModal";

const Customers = () => {
  const [pageOptions, setPageOptions] = useState({
    page: 1,
    limit: 10,
  });

  const [showModal, setModal] = useState(false);
  const [customersData, setCustomersData] = useState([]);
  const [currentModal, setCurrentModal] = useState({ id: "", action: "" });

  const [{ name, address }, setFormFields] = useState({
    name: "",
    address: "",
  });

  // Function to fetch data using Axios
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7058/api/CustomerModel/"
      );
      setCustomersData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [errorMsg, setErrorMsg] = useState("");

  // const customersData = [
  //   { id: 1, name: "John Doe", address: "123 Main St" },
  //   { id: 2, name: "Jane Doe", address: "456 Oak St" },
  // ];

  const columns = [
    {
      header: "ID",
      key: "customerId",
    },
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Address",
      key: "address",
    },
    {
      header: "Action",
      renderCell: (row) => (
        <Button
          icon
          color="yellow"
          onClick={() => {
            setFormFields(() => ({name: row.name, address:row.address}))
            handleAction(row.customerId, "edit")
          }}
        >
          <Icon name="edit" /> Edit
        </Button>
      ),
    },
    {
      header: "Address",
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

    setCurrentModal(() => ({ id, action: "edit" }));
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
        name: "",
        address: "",
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
    if (name.trim() === "" || address.trim() === "") {
      setErrorMsg("please Fill all fields");
      return false;
    }

    return true;
  };

  const formSubmit = async () => {
    const isFormValid = validateForm();

    if (isFormValid) {
      console.log("Print state content");

      console.log(name);

      const payload = {
        name,
        address,
      };

      try {
        if (currentModal.action === "edit") {
          await axios.put(
            `https://localhost:7058/api/CustomerModel/{id}?CustomerId=${currentModal.id}`,
            payload
          );
        } else {
          await axios.post(
            "https://localhost:7058/api/CustomerModel/",
            payload
          );
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
            <label>Name</label>
            <input
              placeholder=""
              name="name"
              value={name}
              onChange={(e) => handleOnChange("name", e.target.value)}
            />
          </Form.Field>
          <Form.Field>
            <label>Address</label>
            <input
              placeholder=""
              name="address"
              value={address}
              onChange={(e) => handleOnChange("address", e.target.value)}
            />
          </Form.Field>
        </Form>
      </>
    );
  };

  const deleteRow = async () => {
    try {
      await axios.delete(
        `https://localhost:7058/api/CustomerModel/{id}?CustomerId=${currentModal.id}`
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

  const totalPages = Math.ceil(customersData.length / 10);

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
            ? "Delete Customer"
            : currentModal.action === "edit"
            ? "Edit Customer"
            : "Create Customer"
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
            New Customer
          </Button>
        </div>
        <DataTable
          data={customersData}
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

export default Customers;
