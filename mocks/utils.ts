import dns from "dns";

let connected: boolean | null = null;

async function isConnectedToTheInternet() {
  if (connected === null) {
    connected = await new Promise((resolve) => {
      dns.lookupService("8.8.8.8", 53, (err) => {
        resolve(!err);
      });
    });
  }
  return connected;
}

function requiredParam(params: URLSearchParams, param: string) {
  if (!params.get(param)) {
    const paramsString = JSON.stringify(
      Object.fromEntries(params.entries()),
      null,
      2
    );
    throw new Error(
      `Param "${param}" required, but not found in ${paramsString}`
    );
  }
}

function requiredHeader(headers: Headers, header: string) {
  if (!headers.get(header)) {
    const headersString = JSON.stringify(
      Object.fromEntries(headers.entries()),
      null,
      2
    );
    throw new Error(
      `Header "${header}" required, but not found in ${headersString}`
    );
  }
}

function requiredProperty(
  object: { [key: string]: unknown },
  property: string
) {
  if (!object[property]) {
    const objectString = JSON.stringify(object);
    throw new Error(
      `Property "${property}" required, but not found in ${objectString}`
    );
  }
}

const isE2E = process.env.RUNNING_E2E === "true";

export {
  isE2E,
  isConnectedToTheInternet,
  requiredHeader,
  requiredParam,
  requiredProperty,
};
