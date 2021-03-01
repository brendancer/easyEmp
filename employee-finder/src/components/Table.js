import React from "react";
import EmployeeData from "./EmployeeData";

class Table extends React.Component {

  renderTableData() {
    return this.state.employees.map((employee, index) => {
      const {
        id,
        picture,
        name,
        gender,
        city,
        postcode,
        email,
        registered,
      } = employee;
      return (
        <>
          <tr>
            <th>Employee Id</th>
            <th>Picture</th>
            <th>Name</th>
            <th>Gender</th>
            <th>City</th>
            <th>Zip Code</th>
            <th>Email</th>
            <th>Date of Employ</th>
          </tr>

          <tr key={id}>
            <td>{id}</td>
            <td>{picture}</td>
            <td>{name}</td>
            <td>{gender}</td>
            <td>{city}</td>
            <td>{postcode}</td>
            <td>{email}</td>
            <td>{registered}</td>
          </tr>
        </>
      );
    });
  }

//   render() {
//     return (
//       <ul>
//         {this.props.employee.map((employee) => (
//           <EmployeeData key={employee.id} employees={employee} />
//         ))}
//       </ul>
//     );
//   }
// }

export default Table;
