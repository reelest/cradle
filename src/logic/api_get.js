import createSubscription from "@/utils/createSubscription";
import { None } from "@/utils/none";
import sentenceCase from "@/utils/sentenceCase";
import useSWR from "swr";
import isServerSide from "@/utils/is_server_side";
const ROOT = "";
const BLOCKED_SERVER_SIDE_REQUEST = 600;
// CSRF global token
let CSRF_TOKEN = null;
async function updateCSRFToken() {
  if (isServerSide) return "";
  CSRF_TOKEN = await (
    await fetch(`${ROOT}/api/token`, {
      headers: {
        "X-CSRF-TOKEN-36": 1,
      },
    })
  ).json();
  setCSRFToken(CSRF_TOKEN);
  return CSRF_TOKEN;
}

/** @type {import("@/utils/createSubscription").Subscription<string>} */
export const [useCSRFToken, , setCSRFToken] = createSubscription(() => {
  if (!CSRF_TOKEN) updateCSRFToken();
});

// Utilities
const getContent = async (res) => {
  try {
    return JSON.parse(await res.text(), (_, value) => {
      if (typeof value === "string" && value.startsWith("@cradle.Date:")) {
        return new Date(Number(value.slice(13)));
      }
      return value;
    });
  } catch (e) {
    if (e instanceof SyntaxError) {
      return res.statusText;
    }
    throw e;
  }
};

/**
 *
 * @param {Request} res
 * @returns {number}
 */
const getErrorCode = (res) =>
  res.status >= 300 || res.status < 200 ? res.status : 0;

/**@returns {Promise<[Response, any]>} */
const jsonRpc = async (url, body, init) => {
  if (isServerSide)
    return [BLOCKED_SERVER_SIDE_REQUEST, "Server-side Rendering"];
  if (init && init.method === "POST") {
    if (!CSRF_TOKEN) await updateCSRFToken();
    init.headers = {
      "X-CSRFTOKEN": CSRF_TOKEN,
      ...(init.headers || None),
    };
    init.mode = "same-origin";
  }
  return await fetch(`${ROOT}${url}`, {
    method: "GET",
    body: body ? JSON.stringify(body) : undefined,
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...((init && init.headers) || None),
    },
  }).then(async (res) => [getErrorCode(res), await getContent(res)]);
};

/**@type {import("swr").Fetcher} */
export const fetcher = async (resource, init) => {
  const [error, body] = await jsonRpc(resource, undefined, init);
  if (error) {
    throw new Error(body);
  }
  return body;
};

// Authentication

/**
 * @typedef {{
 *      uid: "string",
 *      name: "name",
 *      firstName: "firstName",
 *      lastName: "lastName",
 *      phoneNumber: "phoneNumber",
 *      photoURL: "image"
 * }} UserInfo
 */

/**
* # User Management
* The website is an SPA which means all interactions are done as fetch APIs.
* Most of the fetch APIs make use of Django REST Framework, but authentication is handled
* separately. First the client requests the UserInfo which will return 401 if the user is not
* signed in. Next, if the user is not signed in, the can login using doLogin. Upon successful login,
* a UserInfo object is also returned.
  TODO: We could inspect the user's session cookie first before requesting UserInfo.
* 
*/
export const forgotPasswordAPIUrl = "/api/resetpassword";

/**
 * @param {{email: string, password: string}} data
 */
export const doLogin = async ({ email, password }) => {
  const [error, user] = await jsonRpc(
    "/api/login",
    { email, password },
    { method: "POST" }
  );
  if (error) {
    throw new Error(user);
  } else {
    setCSRFToken(null);
    setUser(user);
  }
};

export const createAccount = async ({
  email,
  password,
  telephone,
  address,
  firstName,
  lastName,
}) => {
  const [error, body] = await jsonRpc(
    "/api/register",
    {
      email,
      password,
      telephone,
      address,
      firstName,
      lastName,
    },
    { method: "POST" }
  );
  if (error) {
    throw new Error(sentenceCase(String(body)));
  } else {
    setUser(body);
  }
};

export const doLogout = async () => {
  const [err] = await jsonRpc("/api/logout", null, { method: "POST" });
  if (err) updateUser();
  else {
    setCSRFToken(null);
    setUser(null);
  }
};

/** @type {import("@/utils/createSubscription").Subscription<UserInfo>}*/
const updateUser = async () => {
  const [err, user] = await jsonRpc(`/api/user_info`);
  if (err === BLOCKED_SERVER_SIDE_REQUEST) return setUser(undefined);
  if (err) {
    setCSRFToken(null);
    setUser(null);
  } else {
    setCSRFToken(null);
    setUser(user);
  }
};

export const [useUser, onUser, setUser] = createSubscription(updateUser);

//Admin Dashboard
// Dashboard
/**
 * @typedef {{
 *    years: Array<string>,
 *    numStudents: number,
 *    numTeachers: number,
 *    numParents: number,
 *    incompleteTeacherProfiles: number
 *    events: Array<{
 *       date: Date,
 *       title: string,
 *       scope: {
 *         teachers: faker.datatype.boolean,
 *         students: faker.datatype.boolean,
 *         parents: faker.datatype.boolean,
 *       },
 *    }
 * }} DashboardInfo
 */

/** @returns {DashboardInfo} */
export const useAdminDashboardAPI = () => useSWR("/api/dashboard").data;
