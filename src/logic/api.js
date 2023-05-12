import createSubscription from "@/utils/createSubscription";
import delay from "@/utils/delay";
import useDummyData, { dummyData, useAsyncDummyData } from "@/utils/dummy_data";
import usePromise from "@/utils/usePromise";

export const useAnnouncementsAPI = () =>
  useAsyncDummyData({ announcements: ["admission", 1, 1] });

export const useAdminDashboardAPI = () =>
  useAsyncDummyData({
    years: () => ["2022/2023", "2021/2022", "2020/2021", "2019/2020"],
    numStudents: "range(2000, 5000)",
    numTeachers: "range(19, 100)",
    numParents: "range(1000, 2000)",
  });
export const forgotPasswordAPIUrl = "/api/resetpassword";
const USERS = {
  "admin@test.com": {
    password: "admin-password",
    role: "admin",
  },
  "teacher@test.com": {
    password: "teacher-password",
    role: "teacher",
  },
  "student@test.com": {
    password: "student-password",
    role: "student",
  },
  "parent@test.com": {
    password: "parent-password",
    role: "parent",
  },
};
/**
 * @param {FormData} data
 */
export const doLogin = async (data) => {
  await delay(1500);
  const email = data.get("email");
  const password = data.get("password");
  if (USERS[email]) {
    const user = USERS[email];
    if (user.password === password) {
      localStorage.setItem("user-logged-in", email);
      setUser(user);
      return { success: true };
    } else {
      throw { success: false, cause: "password" };
    }
  } else {
    throw { success: false, cause: "user" };
  }
};

export const doLogout = async () => {
  await delay(1500);
  localStorage.removeItem("user-logged-in");
  setUser(null);
};
export const errorToUserString = (e) => {
  switch (e) {
    case "user":
      return "Email is not registered";
    case "password":
      return "Wrong password";
    default:
      console.error(e);
      return "Server Error. Try refreshing this page.";
  }
};

const USER_API = dummyData({
  name: "name",
  firstName: "firstName",
  lastName: "lastName",
  phoneNumber: "phoneNumber",
  photoURL: "image",
});
export const [useUser, , setUser] = createSubscription(async (setData) => {
  const loggedIn = localStorage.getItem("user-logged-in") ?? null;
  await delay(3000);
  setData(loggedIn && USERS[loggedIn] ? getUser(loggedIn) : null);
});

const getUser = (email) => Object.assign(USERS[email], USER_API, { email });
