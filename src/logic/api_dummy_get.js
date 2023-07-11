import delay from "@/utils/delay";
import { dummyData, pick, useAsyncDummyData } from "@/utils/dummy_data";
import usePromise from "@/utils/usePromise";
import { faker } from "@faker-js/faker/locale/en_NG";
/**
 * @typedef {import("./schools").SchoolType} SchoolType
 */
const ANNOUNCEMENTS_API = { announcements: ["admission", 1, 1] };
export const useAnnouncementsAPI = () => useAsyncDummyData(ANNOUNCEMENTS_API);

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
      id: faker.database.mongodbObjectId,
      category: pick("School Fees", "School Uniform"),
      studentName: "name",
      session: () => "Year 7, 2020/2021",
      ticketCreationDate: "pastDate(1)",
      payerName: faker.name.fullName,
      paymentType: pick("Master Card", "Bank Deposit"),
    },
    30,
    30,
  ],
};
// eslint-disable-next-line no-unused-vars
export const usePaymentsAPI = (_class) => useAsyncDummyData(PAYMENTS_API);

const RESULTS_API = {
  results: [
    {
      id: "range(1000, 10000)",
      name: "name",
      firstTest: "range(0, 100)",
      midTerm: "range(0, 100)",
      pna: "range(0, 100)",
      exam: "range(0,100)",
    },
    30,
    30,
  ],
};
// eslint-disable-next-line no-unused-vars
export const useResultsAPI = (_class, branch) => useAsyncDummyData(RESULTS_API);

const STUDENTS_RESULT_API = {
  results: [
    {
      subject: "subject",
      firstTest: "range(0, 100)",
      midTerm: "range(0, 100)",
      pna: "range(0, 100)",
      exam: "range(0,100)",
    },
  ],
};
// eslint-disable-next-line no-unused-vars
export const useStudentsResultsAPI = (studentID) =>
  useAsyncDummyData(STUDENTS_RESULT_API);

// Courses
const branches = ["Mercury", "Venus", "Mars", "Jupiter"];
const COURSES_API = {
  courses: [
    {
      name: "subject",
      assignedTeacher: "name",
      desc: faker.lorem.sentence,
      year: "range(7, 10)",
      branch: pick(...branches),
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
    const onEach = (e) =>
      branches.map((b) => ({
        class: e,
        branch: b,
        assignedTeacher: dummyData({ name: "name" }).name,
      }));
    if (school === "high school") {
      return {
        classes: ["Year 7", "Year 8", "Year 9", "Year 10"].map(onEach).flat(),
      };
    } else {
      return {
        classes: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"]
          .map(onEach)
          .flat(),
      };
    }
  }, [school]);

//User Management
export const forgotPasswordAPIUrl = "/api/resetpassword";
