import { Menu, Icon, Dropdown } from "semantic-ui-react";

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  onPageSizeChange,
  limit,
}) => {
  return (
    <div className="w-100">
      <Dropdown
        selection
        compact
        options={[10, 25, 50].map((option) => ({
          key: option,
          text: option,
          value: option,
        }))}
        onChange={(e, { value }) => onPageSizeChange(value)}
        value={limit}
      />

      <Menu floated="right" pagination>
        <Menu.Item
          as="a"
          icon
          onClick={() => onPageChange("prev")}
          disabled={currentPage === 1}
        >
          <Icon name="chevron left" />
        </Menu.Item>

        {Array.from({ length: totalPages }, (_, index) => (
          <Menu.Item
            key={index + 1}
            as="a"
            active={currentPage === index + 1}
            onClick={() => onPageChange(index + 1)}
            className={currentPage === index + 1 ? "active-pag-item" : ""}
          >
            {index + 1}
          </Menu.Item>
        ))}

        <Menu.Item
          as="a"
          icon
          onClick={() => onPageChange("next")}
          disabled={currentPage === totalPages}
        >
          <Icon name="chevron right" />
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Pagination;
