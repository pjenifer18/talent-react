import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Icon } from "semantic-ui-react";
import DataTable from "../Components/DataTable";
import CustomModal from "../Components/CustomModal";

const Products = () => {
  const [pageOptions, setPageOptions] = useState({
    page: 1,
    limit: 10,
  });

  const [showModal, setModal] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [currentModal, setCurrentModal] = useState({ id: "", action: "" });

  const [{ name, price }, setFormFields] = useState({
    name: "",
    price: "",
  });

  const [errorMsg, setErrorMsg] = useState("");

  // const productsData = [
  //   { id: 1, name: "Apple", price: "$10" },
  //   { id: 2, name: "Orange", price: "$20" },
  //   { id: 3, name: "Pear", price: "$15" },
  // ];

  // Function to fetch data using Axios
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://20.198.254.87:80/api/ProductModel/"
      );
      setProductsData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      header: "Product ID",
      key: "productId",
    },
    {
      header: "Name",
      key: "name",
    },
    {
      header: "Price",
      key: "price",
    },
    {
      header: "Action",
      renderCell: (row) => (
        <Button
          icon
          color="yellow"
          onClick={() => {
            setFormFields(() => ({name: row.name, price:row.price}))
            handleAction(row.productId, "edit");
          }}
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
          onClick={() => handleAction(row.productId, "delete")}
        >
          <Icon name="trash alternate" /> Delete
        </Button>
      ),
    },
  ];

  const handleAction = (id, action) => {
    // if (action === "delete") {
    //   setModal(true);
    //   setCurrentModal(() => ({ id, action: "delete" }));
    //   return;
    // }

    // setCurrentModal((state) => ({ ...state, action: "edit" }));
    // setModal(true);

    // // call api and set the data in the form fields or delete

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
        price: "",
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
    if (name.trim() === "" || price.trim() === "") {
      setErrorMsg("please Fill all fields");
      return false;
    }

    return true;
  };

  const formSubmit = async () => {
    const isFormValid = validateForm();

    if (isFormValid) {
      const payload = {
        name,
        price,
      };
      try {
        if (currentModal.action === "edit") {
          await axios.put(
            `http://20.198.254.87:80/api/ProductModel/{id}?ProductId=${currentModal.id}`,
            payload
          );
        } else {
          await axios.post("http://20.198.254.87:80/api/ProductModel/", payload);
        }

        fetchData();
        onCloseModal();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const ProductModel = () => {
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
            <label>Price</label>
            <input
              placeholder=""
              name="price"
              value={price}
              onChange={(e) => handleOnChange("price", e.target.value)}
            />
          </Form.Field>
        </Form>
      </>
    );
  };

  const deleteRow = async () => {
    try {
      await axios.delete(
        `http://20.198.254.87:80/api/ProductModel/${currentModal.id}`
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
            ? "Delete Product"
            : currentModal.action === "edit"
            ? "Edit Product"
            : "Create Product"
        }
        ModalBody={
          currentModal.action === "delete" ? deleteModal : ProductModel
        }
        onSubmit={currentModal.action === "delete" ? deleteRow : formSubmit}
        error={errorMsg}
        currentModalView={currentModal.action}
      />
      <div className="page-wrap">
        <div>
          <Button primary onClick={addNewCustomer}>
            New Product
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

export default Products;
