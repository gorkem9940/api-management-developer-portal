import { CustomWidgetModel } from "../customWidgetModel";

const blobContainer = "scaffoldtest";

export function buildBlobStorageSrc({uri = ""}: Partial<CustomWidgetModel>, filePath: string = ""): string {
  return `https://${blobContainer}.blob.core.windows.net/${uri}/${filePath}`;
}

export function buildRemoteFilesSrc(model: Partial<CustomWidgetModel>, filePath: string = "", environment: string = ""): string {
  let developmentSrc;

  if (environment === "development") {
    const key = `cw_${model.uri}_devsrc`;
    const searchParams = new URLSearchParams(window.location.search);
    developmentSrc = searchParams.get(key);
    if (developmentSrc) window.sessionStorage.setItem(key, developmentSrc);
    else developmentSrc = window.sessionStorage.getItem(key);

    if (developmentSrc) developmentSrc = developmentSrc + filePath;
  }

  const values = {
    data: JSON.parse(model.customInputValue).data,
    origin: window.location.origin,
  };
  let searchParams = `?editorValues=${encodeURIComponent(JSON.stringify(values))}`;
  /** invalidate cache every 1 ms on dev */
  if (environment === "development") searchParams += `&v=${(new Date()).getTime()}`;

  return (developmentSrc ?? buildBlobStorageSrc(model, filePath)) + searchParams;
}
