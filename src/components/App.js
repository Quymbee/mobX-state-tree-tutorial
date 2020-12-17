import React, { useState } from "react";
import logo from "../assets/santa.png";
import { observer } from "mobx-react";

import WishListView from "./WishListView";

const App = (props) => {
  const { group } = props;
  const [selectedUser, setSelectedUser] = useState(null);

  const onSelectUser = (event) => {
    setSelectedUser(group.users.get(event.target.value));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title"> Wishlist</h1>
      </header>
      <button onClick={group.reload}>Reload</button>
      <select onChange={onSelectUser}>
        <option>- Select User -</option>
        {Array.from(group.users.values()).map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
      <button onClick={group.drawLots}>Draw Lots</button>
      {selectedUser && <User user={selectedUser} />}
    </div>
  );
};

const User = observer(({ user }) => {
  return (
    <div>
      <WishListView wishList={user.wishList} />
      <button onClick={user.getSuggestions}>Suggestions</button>
      <hr />
      <h2>{user.recipient ? user.recipient.name : ""} </h2>
      {user.recipient && (
        <WishListView wishList={user.recipient.wishList} readonly />
      )}
    </div>
  );
});

export default observer(App);
