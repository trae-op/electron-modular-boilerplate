import { restApi } from "#main/config.js";

import { showErrorMessages } from "#main/@shared/error-messages.js";
import { get } from "#main/@shared/services/rest-api/service.js";

export async function getUserById<R extends TUser>(
  id: string,
): Promise<R | undefined> {
  const response = await get<R>(
    `${restApi.urls.base}${restApi.urls.baseApi}${
      restApi.urls.user.base
    }${restApi.urls.user.byId(id)}`,
    {
      isCache: true,
    },
  );

  if (response.error !== undefined) {
    showErrorMessages({
      title: "Error request by getUserById",
      body: response.error.message,
      isDialog: false,
    });
  }

  return response.data;
}
