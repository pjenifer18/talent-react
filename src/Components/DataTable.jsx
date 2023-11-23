// DataTable.js
import { Table } from "semantic-ui-react";
import Pagination from "./Pagination";

const DataTable = ({
  columns,
  data,
  totalPage,
  onPageChange,
  currentPage,
  handleRowChange,
  limit,
}) => {
  return (
    <>
      <Table celled>
        <Table.Header>
          <Table.Row>
            {columns.map((column, index) => (
              <Table.HeaderCell key={index}>{column.header}</Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.map((row, rowIndex) => (
            <Table.Row key={rowIndex}>
              {columns.map((column, colIndex) => (
                <Table.Cell key={colIndex}>
                  {column.renderCell ? column.renderCell(row) : row[column.key]}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <Pagination
        totalPages={totalPage}
        currentPage={currentPage}
        onPageChange={onPageChange}
        onPageSizeChange={handleRowChange}
        limit={limit}
      />
    </>
  );
};

export default DataTable;

// const DataTable = ({
//   data,

// }) => {
//   const handleEdit = (itemId) => {
//     // Implement the logic for editing an item
//     console.log("Edit clicked for item with ID:", itemId);
//   };

//   const handleDelete = (itemId) => {
//     // Implement the logic for deleting an item
//     console.log("Delete clicked for item with ID:", itemId);
//   };

//   return (
//     <div>
//       <Table celled striped>
//         <Table.Header>
//           <Table.Row>
//             <Table.HeaderCell sorted="ascending">Name</Table.HeaderCell>
//             <Table.HeaderCell>Address</Table.HeaderCell>
//             <Table.HeaderCell>Action</Table.HeaderCell>
//             <Table.HeaderCell>Action</Table.HeaderCell>
//           </Table.Row>
//         </Table.Header>

//         <Table.Body>
//           {data.map((item) => (
//             <Table.Row key={item.id}>
//               <Table.Cell>{item.name}</Table.Cell>
//               <Table.Cell>{item.address}</Table.Cell>
//               <Table.Cell>
//                 <Button icon color="yellow" onClick={() => handleEdit(item.id)}>
//                   <Icon name="edit" /> Edit
//                 </Button>
//               </Table.Cell>
//               <Table.Cell>
//                 <Button icon color="red" onClick={() => handleDelete(item.id)}>
//                   <Icon name="trash alternate" /> Delete
//                 </Button>
//               </Table.Cell>
//             </Table.Row>
//           ))}
//         </Table.Body>
//       </Table>

//     </div>
//   );
// };

// export default DataTable;
