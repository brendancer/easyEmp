import React from "react";
// import Header from "./Header"
import Table from "./Table";

// import { v4 as uuidv4 } from "uuid";

class DirectoryContainer extends React.Component {
  state = {
    employee: [
      {
        id: 1,
        picture: "https://randomuser.me/api/portraits/men/75.jpg",
        name: "Thomas Goodwin",
        gender: "male",
        city: "salt Lake City",
        postcode: "84103",
        email: "tgoodwin@gmail.com",
        registered: "2002-05-21T10:59:49.966Z",
      },
      {
        id: 2,
        picture: "https://randomuser.me/api/portraits/men/75.jpg",
        name: "Brenda Goodwin",
        gender: "Female",
        city: "salt Lake City",
        postcode: "84103",
        email: "brendanced@gmail.com",
        registered: "2002-05-21T10:59:49.966Z",
      },
    ],
  };

  // componentDidMount() {
  //   fetch("https://randomuser.me/api/?results=25")
  //     .then((response) => response.json())
  //     .then((data) => this.setState({ employees: data }));
  //   console.log(this.state);
  // }

  render() {
    return (
      <div>
        <Table employee={this.state.employee} />
      </div>
    );
  }
}
export default DirectoryContainer;
