import { types, flow, applySnapshot } from "mobx-state-tree";

import { WishList } from "./WishList";
import { createStorable } from "./Storable";

const User = types.compose(
  types
    .model({
      id: types.identifier,
      name: types.string,
      gender: types.enumeration("gender", ["m", "f"]),
      wishList: types.optional(WishList, {}),
      recipient: types.maybe(types.reference(types.late(() => User))),
    })
    .actions((self) => ({
      getSuggestions: flow(function* getSuggestions() {
        const response = yield window.fetch(
          `http://localhost:3001/suggestions_${self.gender}`
        );
        self.wishList.items.push(...(yield response.json()));
      }),
    })),
  createStorable("users", "id")
);

export const Group = types
  .model({
    users: types.map(User),
  })
  .actions((self) => {
    let controller;

    return {
      afterCreate() {
        self.load();
      },
      load: flow(function* load() {
        controller = window.AbortController && new window.AbortController();
        try {
          const response = yield window.fetch(`http://localhost:3001/users`, {
            signal: controller && controller.signal,
          });
          const users = yield response.json();
          applySnapshot(
            self.users,
            users.reduce((base, user) => ({ ...base, [user.id]: user }), {})
          );
          console.log("success");
        } catch (e) {
          console.log("aborted", e.name);
        }
      }),
      reload() {
        if (controller) controller.abort();
        self.load();
      },
      beforeDestroy() {
        if (controller) controller.abort();
      },
      drawLots() {
        const allUsers = Array.from(self.users.values());

        // not enough users, bail out
        if (allUsers.length <= 1) return;

        // not assigned lots
        let remaining = allUsers.slice();

        allUsers.forEach((user) => {
          // edge case: the only person without recipient
          // is the same as the only remaining lot
          // swap lot's with some random other person
          if (remaining.length === 1 && remaining[0] === user) {
            const swapWith =
              allUsers[Math.floor(Math.random() * (allUsers.length - 1))];
            user.recipients = swapWith.recipient;
            swapWith.recipient = self;
          } else
            while (!user.recipient) {
              // Pick random lot from remaing list
              let recipientIdx = Math.floor(Math.random() * remaining.length);

              // If it is not the current user, assign it as recipient
              // and remove the lot
              if (remaining[recipientIdx] !== user) {
                user.recipient = remaining[recipientIdx];
                remaining.splice(recipientIdx, 1);
              }
            }
        });
      },
    };
  });
