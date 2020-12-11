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
  list.add(
    WishListItem.create({
      name: "Chesterton",
      price: 10,
    })
  );

  expect(list.items.length).toBe(1);
  expect(list.items[0].name).toBe("Chesterton");

  list.items[0].changeName("Book of Chesterton");
  expect(list.items[0].name).toBe("Book of Chesterton");
});
