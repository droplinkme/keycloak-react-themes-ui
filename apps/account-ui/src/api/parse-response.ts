import {
  getNetworkErrorMessage,
  getNetworkErrorDescription,
} from "@droplink/keycloak-ui-shared";
import { CONTENT_TYPE_HEADER, CONTENT_TYPE_JSON } from "./constants";
import { ContentTypeEnum } from "./enums";
import { ApiException } from "./exceptions/ApiException";
import { MessageException } from "./exceptions/MessageException";

const throwFn = (error: any): any => {
  if (error instanceof MessageException || error instanceof ApiException) {
    throw error;
  }
  throw new Error("Unable to parse response as valid Blob.", {
    cause: error,
  });
}

const responseNotOk = <T extends any>(response: Response, data: T): any => {
  if (!response.ok) {
    const message = getNetworkErrorMessage(data);
    const description = getNetworkErrorDescription(data);

    if (!message) {
      throw new MessageException(
        "Unable to retrieve error message from response, no matching key found.",
      );
    }

    throw new ApiException(message, description);
  }
}

export async function parseResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers?.get(CONTENT_TYPE_HEADER)?.split(';')[0] as ContentTypeEnum;

  switch (contentType) {
    case ContentTypeEnum.JSON:
      return await parseJSON(response) as T;
    case ContentTypeEnum.PNG:
    case ContentTypeEnum.JPEG:
    case ContentTypeEnum.GIF:
    case ContentTypeEnum.SVG:
    case ContentTypeEnum.WEBP:
    case ContentTypeEnum.MULTIPART:
      return await parseBLOB(response) as T;
    default:
      throw new Error(
        `Unsupported content type: '${contentType}'.`,
      );
  }


}

async function parseJSON(response: Response): Promise<any> {
  try {
    const data = await response.json();
    responseNotOk(response, data);
    return data;
  } catch (error) {
    throw throwFn(error)
  }
}

async function parseBLOB(response: Response): Promise<Blob> {
  try {
    const data = await response.blob();
    responseNotOk(response, data);
    return data;
  } catch (error) {
    throw throwFn(error)
  }
}



