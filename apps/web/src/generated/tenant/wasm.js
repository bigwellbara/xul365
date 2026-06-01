
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.StudentScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  gradeLevel: 'gradeLevel',
  enrollmentDate: 'enrollmentDate',
  status: 'status',
  parentContact: 'parentContact'
};

exports.Prisma.TeacherScalarFieldEnum = {
  id: 'id',
  firstName: 'firstName',
  lastName: 'lastName',
  email: 'email',
  phone: 'phone',
  subjects: 'subjects',
  status: 'status',
  joinedAt: 'joinedAt'
};

exports.Prisma.ClassScalarFieldEnum = {
  id: 'id',
  name: 'name',
  gradeLevel: 'gradeLevel',
  teacherId: 'teacherId',
  academicYear: 'academicYear',
  capacity: 'capacity'
};

exports.Prisma.EnrollmentScalarFieldEnum = {
  id: 'id',
  studentId: 'studentId',
  classId: 'classId',
  enrolledAt: 'enrolledAt'
};

exports.Prisma.AttendanceRecordScalarFieldEnum = {
  id: 'id',
  studentId: 'studentId',
  classId: 'classId',
  date: 'date',
  status: 'status',
  recordedBy: 'recordedBy',
  createdAt: 'createdAt'
};

exports.Prisma.SubjectScalarFieldEnum = {
  id: 'id',
  name: 'name',
  code: 'code',
  gradeLevel: 'gradeLevel'
};

exports.Prisma.TimetableScalarFieldEnum = {
  id: 'id',
  classId: 'classId',
  subjectId: 'subjectId',
  dayOfWeek: 'dayOfWeek',
  startTime: 'startTime',
  endTime: 'endTime'
};

exports.Prisma.ExamScalarFieldEnum = {
  id: 'id',
  name: 'name',
  academicYear: 'academicYear',
  term: 'term',
  gradeLevel: 'gradeLevel',
  startDate: 'startDate',
  endDate: 'endDate',
  createdAt: 'createdAt'
};

exports.Prisma.ExamResultScalarFieldEnum = {
  id: 'id',
  examId: 'examId',
  studentId: 'studentId',
  subjectId: 'subjectId',
  marks: 'marks',
  grade: 'grade',
  comments: 'comments'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  studentId: 'studentId',
  academicYear: 'academicYear',
  term: 'term',
  items: 'items',
  totalAmountUsd: 'totalAmountUsd',
  totalAmountZig: 'totalAmountZig',
  status: 'status',
  dueDate: 'dueDate',
  createdAt: 'createdAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  amountPaid: 'amountPaid',
  currency: 'currency',
  method: 'method',
  reference: 'reference',
  status: 'status',
  paidAt: 'paidAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  Student: 'Student',
  Teacher: 'Teacher',
  Class: 'Class',
  Enrollment: 'Enrollment',
  AttendanceRecord: 'AttendanceRecord',
  Subject: 'Subject',
  Timetable: 'Timetable',
  Exam: 'Exam',
  ExamResult: 'ExamResult',
  Invoice: 'Invoice',
  Payment: 'Payment'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
