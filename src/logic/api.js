import createSubscription from "@/utils/createSubscription";
import delay from "@/utils/delay";
import useDummyData, {
  dummyData,
  pick,
  useAsyncDummyData,
} from "@/utils/dummy_data";
import sentenceCase from "@/utils/sentenceCase";
import usePromise from "@/utils/usePromise";
import { faker } from "@faker-js/faker/locale/en_NG";

const ANNOUNCEMENTS_API = { announcements: ["admission", 1, 1] };
export const useAnnouncementsAPI = () => useAsyncDummyData(ANNOUNCEMENTS_API);

// Dashboard
const DASHBOARD_API = {
  years: () => ["2022/2023", "2021/2022", "2020/2021", "2019/2020"],
  numStudents: "range(2000, 5000)",
  numTeachers: "range(19, 100)",
  numParents: "range(1000, 2000)",
  incompleteTeacherProfiles: () =>
    Math.round(dummyData({ data: "range(0, 700)" }).data / 0.07) / 100,
  events: [
    {
      date: () => faker.date.soon(5),
      title: () => sentenceCase(faker.git.commitMessage()),
      scope: {
        teachers: faker.datatype.boolean,
        students: faker.datatype.boolean,
        parents: faker.datatype.boolean,
      },
    },
    3,
    3,
  ],
};
export const useAdminDashboardAPI = () => useAsyncDummyData(DASHBOARD_API);

// Registrations
const REGISTRATIONS_API = {
  students: [
    {
      name: "name",
      entranceClass: "class",
      gender: pick("M", "F"),
    },
  ],
};
export const useRegistrationsAPI = () => useAsyncDummyData(REGISTRATIONS_API);

// Administrators
const ADMINISTRATORS_API = {
  admins: [
    {
      name: "name",
      email: "email",
      dateCreated: "pastDate(1)",
      status: faker.datatype.boolean,
    },
    25,
    36,
  ],
};
export const useAdministratorsAPI = () => useAsyncDummyData(ADMINISTRATORS_API);

// Students
const STUDENTS_API = {
  students: [
    {
      name: "name",
      email: "email",
      class: "class",
      status: faker.datatype.boolean,
    },
    25,
    36,
  ],
};
export const useStudentsAPI = () => useAsyncDummyData(STUDENTS_API);

// Teachers
const TEACHERS_API = {
  teachers: [
    {
      name: "name",
      email: "email",
      subject: "subject",
      class: pick("", "JSS1", "JSS2", "SSS1"),
    },
    25,
    36,
  ],
};
/**
 * @typedef {("high school"|"montessori")} SchoolType
 */
/**
 * Get the list of teachers in the school
 * @param {SchoolType} school
 * @returns
 */
export const useTeachersAPI = (school) =>
  useAsyncDummyData((school /* unused*/, TEACHERS_API));

// Parents
const PARENTS_API = {
  parents: [
    {
      name: "name",
      email: "email",
      numPupils: "range(1,4)",
      status: faker.datatype.boolean,
    },
    25,
    36,
  ],
};
export const useParentsAPI = () => useAsyncDummyData(PARENTS_API);

// Payments
const PAYMENTS_API = {
  payments: [
    {
      name: "name",
      desc: faker.lorem.sentence,
      amount: "range(10000, 450000)",
      date: faker.date.recent,
    },
  ],
};
export const usePaymentsAPI = () => useAsyncDummyData(PAYMENTS_API);

// Courses
const COURSES_API = {
  courses: [
    {
      name: "subject",
      assignedTeacher: "name",
      desc: faker.lorem.sentence,
      year: "range(7, 10)",
      branch: pick("Mercury", "Venus", "Mars", "Jupiter"),
    },
    40,
    40,
  ],
};
export const useCoursesAPI = (_class) =>
  useAsyncDummyData((_class, COURSES_API));

/**
 *
 * @param {SchoolType} school
 */
export const useClassesAPI = (school) =>
  usePromise(async () => {
    await delay(1000);
    if (school === "high school") {
      return { classes: ["Year 7", "Year 8", "Year 9", "Year 10"] };
    } else {
      return {
        classes: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"],
      };
    }
  }, [school]);

//User Management
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

//Utilities
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
