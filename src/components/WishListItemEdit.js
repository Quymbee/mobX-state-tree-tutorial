import React from "react";
import { observer } from "mobx-react";

const WishListItemEdit = (props) => {
  const { item } = props;

  const onNameChange = (event) => {
    item.changeName(event.target.value);
  };

  const onPriceChange = (event) => {
    const price = parseFloat(event.target.value);
    if (!isNaN(price)) item.changePrice(price);
  };

  const onImageChange = (event) => {
    item.changeImage(event.target.value);
  };

  return (
    <div className="item-edit">
      Name: <input value={item.name} onChange={onNameChange} />
      <br />
      Price: <input value={item.price} onChange={onPriceChange} />
      <br />
      Image: <input value={item.image} onChange={onImageChange} />
      <br />
    </div>
  );
};

export default observer(WishListItemEdit);
