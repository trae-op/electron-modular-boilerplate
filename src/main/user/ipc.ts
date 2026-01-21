import { cacheUser } from "#main/@shared/cache-responses.js";
import { replyToRenderer } from "#main/@shared/ipc/ipc.js";
import { type TSendHandler } from "#main/@shared/ipc/types.js";
import { getElectronStorage } from "#main/@shared/store.js";

import { getUserById } from "#main/user/service.js";

export const handleSend: TSendHandler = async ({ event, payload }) => {
  if (payload.type !== "user") {
    return;
  }

  const userId = getElectronStorage("userId");
  const userFromCache = cacheUser(userId);

  if (userFromCache !== undefined) {
    replyToRenderer(event, {
      type: "user",
      data: {
        user: userFromCache,
      },
    });
  }

  const user = userId ? await getUserById(userId) : undefined;
  if (user !== undefined) {
    replyToRenderer(event, {
      type: "user",
      data: {
        user,
      },
    });
  }
};
