// App.js
import { useState } from "react";
import { Menu, Container } from "semantic-ui-react";
import "./App.css"; // You can create a CSS file for additional styling
import "semantic-ui-css/semantic.min.css";
import Products from "./Pages/Products";
import Stores from "./Pages/Stores";
import Sales from "./Pages/Sales";
import Customers from "./Pages/Customers";

const App = () => {
  const [currentMenuItem, setCurrentMenuItem] = useState("customers");

  const renderTable = () => {
    switch (currentMenuItem) {
      case "customers":
        return <Customers />;
      case "products":
        return <Products />;
      case "stores":
        return <Stores />;
      case "sales":
        return <Sales />;
      default:
        return null;
    }
  };

  return (
    <>
      <Menu inverted color="black">
        <Menu.Item
          name="Customers"
          active={currentMenuItem === "customers"}
          onClick={() => setCurrentMenuItem("customers")}
        />
        <Menu.Item
          name="Products"
          active={currentMenuItem === "products"}
          onClick={() => setCurrentMenuItem("products")}
        />
        <Menu.Item
          name="Stores"
          active={currentMenuItem === "stores"}
          onClick={() => setCurrentMenuItem("stores")}
        />
        <Menu.Item
          name="Sales"
          active={currentMenuItem === "sales"}
          onClick={() => setCurrentMenuItem("sales")}
        />
      </Menu>

      <Container className="app-content">{renderTable()}</Container>
    </>
  );
};

export default App;
