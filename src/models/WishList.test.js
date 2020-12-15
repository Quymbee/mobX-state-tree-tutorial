import { getSnapshot, onSnapshot, onPatch } from "mobx-state-tree";
import { reaction } from "mobx";
import { WishListItem, WishList } from "./WishList";

it("can create an instance of a model", () => {
  const item = WishListItem.create({
    name: "Narnia Box Set",
    price: 28.73,
    image:
      "https://images-na.ssl-images-amazon.com/images/I/51ZeZZD1XML._SX258_BO1,204,203,200_.jpg",
  });

  expect(item.price).toBe(28.73);
  expect(item.image).toBe(
    "https://images-na.ssl-images-amazon.com/images/I/51ZeZZD1XML._SX258_BO1,204,203,200_.jpg"
  );

  //testing changeName function action
  item.changeName("Narnia");
  expect(item.name).toBe("Narnia");
});

it("can create a wishlist", () => {
  const list = WishList.create({
    items: [
      {
        name: "Narnia Box Set",
        price: 28.73,
        image:
          "https://images-na.ssl-images-amazon.com/images/I/51ZeZZD1XML._SX258_BO1,204,203,200_.jpg",
      },
      {
        name: "Narnia Box Set",
        price: 28.73,
        image:
          "https://images-na.ssl-images-amazon.com/images/I/51ZeZZD1XML._SX258_BO1,204,203,200_.jpg",
      },
      {
        name: "Narnia Box Set",
        price: 28.73,
        image:
          "https://images-na.ssl-images-amazon.com/images/I/51ZeZZD1XML._SX258_BO1,204,203,200_.jpg",
      },
    ],
  });

  expect(list.items.length).toBe(3);
  expect(list.items[0].price).toBe(28.73);
});

it("can add new items", () => {
  const list = WishList.create();
  const states = [];
  onSnapshot(list, (snapshot) => {
    states.push(snapshot);
  });

  list.add({
    name: "Chesterton",
    price: 10,
  });

  expect(list.items.length).toBe(1);
  expect(list.items[0].name).toBe("Chesterton");

  list.items[0].changeName("Book of Chesterton");
  expect(list.items[0].name).toBe("Book of Chesterton");

  /*
   with use of getSnapshot(), 
   you can have it match against immutable snapshot object
  */
  expect(getSnapshot(list)).toEqual({
    items: [
      {
        name: "Book of Chesterton",
        price: 10,
        image: "",
      },
    ],
  });

  //jest allows toMatchSnapshot()
  expect(getSnapshot(list)).toMatchSnapshot();

  //uses states array instead of getSnapshot(list) that detects any change
  expect(states).toMatchSnapshot();
});

it("can add new items - 2", () => {
  const list = WishList.create();
  const patches = [];
  onPatch(list, (snapshot) => {
    patches.push(snapshot);
  });

  list.add({
    name: "Chesterton",
    price: 10,
  });

  list.items[0].changeName("Book of Chesterton");

  expect(patches).toMatchSnapshot();
});

it("can calculate the total price of a wishlist", () => {
  const list = WishList.create({
    items: [
      {
        name: "Lipstick",
        price: 7.35,
        image:
          "https://images-na.ssl-images-amazon.com/images/I/51ZeZZD1XML._SX258_BO1,204,203,200_.jpg",
      },
      {
        name: "Lego",
        price: 27.35,
        image:
          "https://images-na.ssl-images-amazon.com/images/I/51ZeZZD1XML._SX258_BO1,204,203,200_.jpg",
      },
    ],
  });

  expect(list.totalPrice).toBe(34.7);

  let changed = 0;
  reaction(
    () => list.totalPrice,
    () => changed++
  );

  //shows that calculating total price isn't costly
  expect(changed).toBe(0);
  list.items[0].changeName("Test");
  expect(changed).toBe(0);
  list.items[0].changePrice(29);
  expect(changed).toBe(1);
});
