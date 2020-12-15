import React, { useState } from "react";
import { observer } from "mobx-react";
import { clone, getSnapshot, applySnapshot } from "mobx-state-tree";

import WishListItemEdit from "./WishListItemEdit";

const WishListItemView = (props) => {
  const { item, readonly } = props;
  const [edit, setEdit] = useState(false);
  const [cloneState, setCloneState] = useState(null);

  const toggleEdit = () => {
    setEdit(!edit);
    setCloneState(clone(item));
  };

  const saveEdit = () => {
    applySnapshot(item, getSnapshot(cloneState));
    setEdit(false);
    setCloneState(null);
  };

  return edit ? (
    <li className="item">
      <WishListItemEdit item={cloneState} />
      <button onClick={saveEdit}>💾</button>
      <button onClick={toggleEdit}>❎</button>
    </li>
  ) : (
    <li className="item">
      {item.image && <img src={item.image} alt={`${item.name}`} />}
      <h3>{item.name}</h3>
      <span>{item.price}</span>
      {!readonly && (
        <span>
          <button onClick={toggleEdit}>🖍️</button>
          <button onClick={item.remove}>❎</button>
        </span>
      )}
    </li>
  );
};

export default observer(WishListItemView);
