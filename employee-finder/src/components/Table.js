import React from "react";
import EmployeeData from "./EmployeeData";

class Table extends React.Component {
  render() {
    return (
      <ul>
        {this.props.employee.map((employee) => (
          <EmployeeData key={employee.id} employees={employee} />
        ))}
      </ul>
    );
  }
}

export default Table;
