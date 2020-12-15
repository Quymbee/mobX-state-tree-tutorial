import { types, getParent, destroy } from "mobx-state-tree";

export const WishListItem = types
  .model({
    name: types.string,
    price: types.number,
    image: "",
  })
  .actions((self) => ({
    /*
      mobx models are by default read only
      need actions to access and modify models. 
      .actions() returns an object of available actions
      self parameter prevents issues with divs
      this way of doing functions allows for private functions
    */
    changeName(newName) {
      self.name = newName;
    },
    changePrice(newPrice) {
      self.price = newPrice;
    },
    changeImage(newImage) {
      self.image = newImage;
    },
    remove() {
      getParent(self, 2).remove(self);
    },
  }));

export const WishList = types
  .model({
    items: types.optional(types.array(WishListItem), []),
  })
  .actions((self) => ({
    add(item) {
      self.items.push(item);
    },
    remove(item) {
      destroy(item);
    },
  }))
  .views((self) => ({
    get totalPrice() {
      return self.items.reduce((sum, entry) => sum + entry.price, 0);
    },
  }));
