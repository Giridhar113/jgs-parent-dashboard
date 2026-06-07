const departments = [
  { branch: 'B.Tech CSE', code: 'CSE', subjects: ['Engineering Maths', 'Data Structures', 'Operating Systems', 'DBMS', 'Computer Networks', 'Python Lab'] },
  { branch: 'B.Tech AI & ML', code: 'AIML', subjects: ['Engineering Maths', 'Machine Learning', 'Python Programming', 'Data Mining', 'Statistics', 'AI Lab'] },
  { branch: 'B.Tech ECE', code: 'ECE', subjects: ['Engineering Maths', 'Network Theory', 'Signals & Systems', 'Digital Electronics', 'Communication Skills', 'Electronics Lab'] },
  { branch: 'B.Tech EEE', code: 'EEE', subjects: ['Engineering Maths', 'Circuit Theory', 'Power Systems', 'Electrical Machines', 'Control Systems', 'Electrical Lab'] },
  { branch: 'B.Tech Mechanical', code: 'MECH', subjects: ['Engineering Maths', 'Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing', 'Workshop Lab'] },
  { branch: 'B.Tech Civil', code: 'CIVIL', subjects: ['Engineering Maths', 'Surveying', 'Structural Analysis', 'Geotechnical Engineering', 'Transportation', 'Civil Lab'] },
  { branch: 'Intermediate Science', code: 'ISCI', subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'Computer Science'] },
  { branch: 'Intermediate Commerce', code: 'ICOM', subjects: ['Accountancy', 'Economics', 'Business Studies', 'Mathematics', 'English', 'Informatics'] },
  { branch: 'School Class 10', code: 'CLS10', subjects: ['Mathematics', 'Science', 'English', 'Hindi', 'Social Studies', 'Computer Applications'] }
];

const batches = [2024, 2025, 2026];
const firstNames = ['Aarav', 'Aditi', 'Anaya', 'Arjun', 'Diya', 'Ishan', 'Kabir', 'Meera', 'Neha', 'Rohan', 'Saanvi', 'Vivaan'];
const lastNames = ['Shah', 'Patel', 'Iyer', 'Nair', 'Khan', 'Mehta', 'Rao', 'Joshi', 'Fernandes', 'Desai'];
const parentFirstNames = ['Sunita', 'Rajesh', 'Kavita', 'Amit', 'Pooja', 'Suresh', 'Neelam', 'Vikram', 'Meena', 'Anil'];
const faculty = ['Prof. Asha Mehta - Data Structures', 'Dr. Kavita Rao - Engineering Maths', 'Prof. Sameer Iyer - Operating Systems', 'Prof. Neha Kulkarni - DBMS'];
const messages = [];
const sessions = new Map();
const payments = [];

function pick(list, index) {
  return list[index % list.length];
}

function academicLevel(branch, year) {
  if (branch.startsWith('B.Tech')) {
    return { 2024: 'Semester 5', 2025: 'Semester 3', 2026: 'Semester 1' }[year] || 'Semester 1';
  }
  if (branch === 'Intermediate Science' || branch === 'Intermediate Commerce') {
    return year === 2024 ? 'Intermediate Year 2' : 'Intermediate Year 1';
  }
  return 'Class 10';
}

function sequenceNumberFor(group, localIndex) {
  if (group.code === 'ECE' && group.year === 2026) return localIndex + 61;
  return localIndex;
}

function initials(name) {
  return String(name || '')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function loginIdentityForStudent(student, index) {
  if (student.roll === 'JGS/CSE/2024/048') {
    return {
      email: 'priya.sharma@jgs.edu.in',
      mobile: '9820001101',
      parentMobile: '9876543210'
    };
  }

  const [code, year, sequence] = student.roll.split('/').slice(1);
  const slug = student.name.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/(^\.|\.$)/g, '');
  return {
    email: `${slug}.${code.toLowerCase()}.${year}.${sequence}@jgs.edu.in`,
    mobile: String(9820000000 + index).padStart(10, '0'),
    parentMobile: String(9876500000 + index).padStart(10, '0')
  };
}

function buildStudents() {
  const students = [{
    name: 'Priya Sharma',
    roll: 'JGS/CSE/2024/048',
    branch: 'B.Tech CSE',
    sem: 'Semester 3',
    attendance: 79.4,
    cgpa: 7.8,
    parentName: 'Mrs. Sunita Sharma',
    admissionYear: 2024
  }];
  const groups = departments.flatMap((department) => batches.map((year) => ({ ...department, year })));
  let globalIndex = 1;

  groups.forEach((group, groupIndex) => {
    const target = groupIndex < 6 ? 47 : 46;
    const alreadySeeded = group.code === 'CSE' && group.year === 2024 ? 1 : 0;
    const recordsToCreate = target - alreadySeeded;

    for (let localIndex = 1; localIndex <= recordsToCreate; localIndex += 1) {
      const sequence = String(sequenceNumberFor(group, localIndex)).padStart(3, '0');
      const firstName = pick(firstNames, globalIndex);
      const lastName = pick(lastNames, globalIndex);
      students.push({
        name: `${firstName} ${lastName}`,
        roll: `JGS/${group.code}/${group.year}/${sequence}`,
        branch: group.branch,
        sem: academicLevel(group.branch, group.year),
        attendance: Number((72 + (globalIndex % 25) + (globalIndex % 10) / 10).toFixed(1)),
        cgpa: Number((6.1 + (globalIndex % 30) / 10).toFixed(1)),
        parentName: `${globalIndex % 2 === 0 ? 'Mrs.' : 'Mr.'} ${pick(parentFirstNames, globalIndex)} ${pick(lastNames, globalIndex + 2)}`,
        admissionYear: group.year
      });
      globalIndex += 1;
    }
  });

  if (students.length !== 1248) {
    throw new Error(`Expected 1248 students, generated ${students.length}`);
  }
  return students;
}

function branchMeta(branch) {
  return departments.find((department) => department.branch === branch) || departments[0];
}

function subjectRows(student, index) {
  const subjects = branchMeta(student.branch).subjects;
  return subjects.map((name, subjectIndex) => {
    const percent = Math.min(98, Math.max(62, Number((student.attendance + ((index + subjectIndex) % 11) - 5).toFixed(1))));
    const total = 32 + ((index + subjectIndex) % 13);
    const present = Math.round((total * percent) / 100);
    return {
      name,
      percent,
      present,
      absent: total - present
    };
  });
}

function marksRows(student, index) {
  return branchMeta(student.branch).subjects.map((subject, subjectIndex) => {
    const internal = 19 + ((index + subjectIndex) % 11);
    const midterm = 13 + ((index + subjectIndex) % 7);
    const total = internal + midterm;
    return {
      subject,
      internal: `${internal}/30`,
      midterm: `${midterm}/20`,
      total,
      grade: total >= 45 ? 'A+' : total >= 40 ? 'A' : total >= 35 ? 'B+' : 'B',
      status: total >= 42 ? 'Excellent' : total >= 38 ? 'Strong' : total >= 34 ? 'Good' : 'Needs revision'
    };
  });
}

function feeRecord(student, index) {
  const amount = student.branch.startsWith('B.Tech') ? 82000 : student.branch.startsWith('Intermediate') ? 46000 : 38000;
  const isPaid = index % 7 !== 0;
  return {
    title: `${student.sem} Fee`,
    amount: `Rs ${amount.toLocaleString('en-IN')}`,
    status: isPaid ? 'Paid' : 'Due Soon',
    paidOn: isPaid ? '12 Jan 2026' : 'Pending',
    receipt: isPaid ? `JGS/FEE/2026/${String(8000 + index).padStart(4, '0')}` : 'Not generated',
    breakdown: [
      { label: 'Tuition Fee', value: `Rs ${Math.round(amount * 0.76).toLocaleString('en-IN')}` },
      { label: 'Lab & Activity Fee', value: `Rs ${Math.round(amount * 0.1).toLocaleString('en-IN')}` },
      { label: 'Library & Exam Fee', value: `Rs ${Math.round(amount * 0.09).toLocaleString('en-IN')}` },
      { label: 'Student Services', value: `Rs ${Math.round(amount * 0.05).toLocaleString('en-IN')}` }
    ],
    history: isPaid
      ? [{ date: '12 Jan 2026', detail: `${student.sem} fee paid`, amount: `Rs ${amount.toLocaleString('en-IN')}`, status: 'Paid' }]
      : [{ date: '10 Jul 2025', detail: 'Previous term fee paid', amount: `Rs ${(amount - 1500).toLocaleString('en-IN')}`, status: 'Paid' }],
    reminders: [isPaid ? 'Next fee schedule will be shared after 20 Jun 2026.' : 'Current fee payment is due by 12 Jun 2026.']
  };
}

function buildRecord(student, index) {
  const subjects = subjectRows(student, index);
  const working = 150 + (index % 8);
  const present = Math.round((working * student.attendance) / 100);
  return {
    attendance: {
      present,
      absent: working - present,
      working,
      weeks: [0, 1, 2, 3, 4, 5].map((offset) => Math.min(98, Math.max(60, Number((student.attendance + ((index + offset) % 9) - 4).toFixed(1))))),
      absentDates: ['05 Feb 2026', '13 Feb 2026', '28 Mar 2026', '18 Apr 2026'].slice(0, 2 + (index % 3)),
      subjects
    },
    marks: marksRows(student, index),
    fees: feeRecord(student, index),
    notices: [
      { title: 'Hall ticket window opens 3 Jun 2026', date: '02 Jun 2026', category: 'Exam', priority: index % 3 === 0 ? 'Urgent' : 'High', unread: true },
      { title: 'Parent-teacher meeting on 8 Jun 2026', date: '30 May 2026', category: 'General', priority: 'High', unread: index % 2 === 0 },
      { title: `${student.sem} fee update`, date: '28 May 2026', category: 'Fee', priority: 'Normal', unread: false }
    ],
    events: [
      { title: 'Campus counselling meet', date: '05 Jun 2026', time: '10:30 AM', description: 'Counsellor interaction for parents and students.' },
      { title: 'Internal assessment review', date: '10 Jun 2026', time: '02:00 PM', description: 'Review of internal marks and teacher remarks.' },
      { title: 'Parent orientation session', date: '18 Jun 2026', time: '11:00 AM', description: 'Academic planning and support session for parents.' }
    ]
  };
}

const students = buildStudents();
const parents = [];
const wards = {};
const records = {};

students.forEach((student, index) => {
  const identity = loginIdentityForStudent(student, index + 1);
  const parent = {
    id: `parent-${student.roll.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    name: student.parentName,
    phone: identity.parentMobile,
    email: `parent.${identity.email}`,
    identifiers: [student.roll, identity.mobile, identity.email, identity.parentMobile, `+91${identity.parentMobile}`],
    pin: '1248',
    wardRoll: student.roll
  };
  parents.push(parent);
  wards[student.roll] = {
    name: student.name,
    initials: initials(student.name),
    roll: student.roll,
    branch: student.branch,
    semester: student.sem,
    status: 'Active',
    attendance: student.attendance,
    lastPresent: 'Today 08:52 AM',
    feeStatus: index % 7 === 0 ? 'Due Soon' : 'Paid',
    nextExam: '15 Jun',
    cgpa: String(student.cgpa),
    rank: `${(index % 45) + 1} / ${student.branch.startsWith('B.Tech') ? 86 : 120}`
  };
  records[student.roll] = buildRecord(student, index);
});

function normalizeIdentifier(value) {
  return String(value || '').trim().toLowerCase();
}

function createToken(parentId) {
  const token = `jgs-${parentId}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  sessions.set(token, parentId);
  return token;
}

function findParentByLogin(identifier, pin) {
  const normalized = normalizeIdentifier(identifier);
  return parents.find((parent) => {
    return parent.pin === String(pin || '') && parent.identifiers.some((item) => normalizeIdentifier(item) === normalized);
  });
}

function findParentByToken(token) {
  const parentId = sessions.get(token);
  return parents.find((parent) => parent.id === parentId) || null;
}

function getParentPayload(parent) {
  return {
    id: parent.id,
    name: parent.name,
    phone: parent.phone,
    email: parent.email,
    wardRoll: parent.wardRoll
  };
}

function childPayload(parent) {
  const ward = wards[parent.wardRoll];
  const record = records[parent.wardRoll];
  return {
    ...ward,
    grade: ward.semester,
    roll: ward.roll,
    badges: [
      ward.attendance >= 85 ? 'Good attendance' : 'Attendance watch',
      Number(ward.cgpa) >= 8 ? 'Top performer' : 'Steady progress'
    ],
    subjects: record.attendance.subjects.slice(0, 4)
  };
}

function getWardScopedData(parent) {
  const ward = wards[parent.wardRoll];
  const record = records[parent.wardRoll];
  return {
    parent: getParentPayload(parent),
    ward,
    children: [childPayload(parent)],
    schoolStats: {
      totalStudents: students.length,
      totalParents: parents.length,
      dataset: '1248 student records'
    },
    attendance: record.attendance,
    marks: record.marks,
    fees: record.fees,
    faculty,
    replies: [
      { from: 'Class Teacher', subject: 'Weekly update', message: `${ward.name} has new academic updates in the parent portal.`, date: '29 May 2026' },
      { from: 'Accounts Office', subject: 'Fee desk', message: record.fees.status === 'Paid' ? 'Receipt is available for download.' : 'Fee payment window is open.', date: '27 May 2026' }
    ],
    notices: record.notices,
    events: record.events
  };
}

function addMessage(parent, payload) {
  const message = {
    id: `msg-${messages.length + 1}`,
    parentId: parent.id,
    wardRoll: parent.wardRoll,
    faculty: payload.faculty,
    subject: payload.subject,
    message: payload.message,
    sentAt: new Date().toISOString(),
    status: 'sent'
  };
  messages.unshift(message);
  return message;
}

function amountToNumber(value) {
  return Number(String(value || '').replace(/[^0-9.]/g, '')) || 0;
}

function formatReceiptNumber() {
  return `JGS/FEE/2026/${String(9000 + payments.length + 1).padStart(4, '0')}`;
}

function createPaymentOrder(parent, payload) {
  const data = getWardScopedData(parent);
  const amount = amountToNumber(payload.amount || data.fees.amount);
  const order = {
    id: `JGS-PAY-${Date.now()}-${payments.length + 1}`,
    parentId: parent.id,
    wardRoll: parent.wardRoll,
    amount,
    amountLabel: `Rs ${amount.toLocaleString('en-IN')}`,
    gateway: payload.gateway || 'JGS Demo Gateway',
    purpose: payload.purpose || data.fees.title,
    status: 'created',
    createdAt: new Date().toISOString()
  };
  payments.unshift(order);
  return order;
}

function confirmPayment(parent, payload) {
  const payment = payments.find((item) => item.id === payload.orderId && item.parentId === parent.id);
  if (!payment) throw new Error('Payment order not found.');

  payment.status = 'paid';
  payment.method = payload.method || 'UPI';
  payment.transactionId = payload.transactionId || `TXN${Date.now()}`;
  payment.paidAt = new Date().toISOString();

  const record = records[parent.wardRoll];
  const paidDate = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  record.fees.status = 'Paid';
  record.fees.paidOn = paidDate;
  record.fees.receipt = formatReceiptNumber();
  record.fees.history.unshift({ date: paidDate, detail: `${payment.purpose} paid via ${payment.method}`, amount: payment.amountLabel, status: 'Paid' });
  record.fees.reminders = ['Payment completed. Receipt is available for download.'];
  wards[parent.wardRoll].feeStatus = 'Paid';

  return { payment, fees: record.fees, ward: wards[parent.wardRoll] };
}

function receiptText(parent) {
  const data = getWardScopedData(parent);
  return [
    'JGS Group of Institutes',
    'Andheri East, Mumbai',
    'Fee Receipt',
    '',
    `Parent: ${data.parent.name}`,
    `Student: ${data.ward.name}`,
    `Roll: ${data.ward.roll}`,
    `Branch: ${data.ward.branch}`,
    `Semester: ${data.ward.semester}`,
    '',
    `Fee: ${data.fees.title}`,
    `Amount: ${data.fees.amount}`,
    `Status: ${data.fees.status}`,
    `Paid on: ${data.fees.paidOn}`,
    `Receipt: ${data.fees.receipt}`,
    '',
    'Breakdown:',
    ...data.fees.breakdown.map((item) => `- ${item.label}: ${item.value}`),
    '',
    'This is a system-generated receipt for parent portal use.'
  ].join('\n');
}

function attendanceReportText(parent) {
  const data = getWardScopedData(parent);
  return [
    'JGS Group of Institutes',
    'Monthly Attendance Report',
    '',
    `Student: ${data.ward.name}`,
    `Roll: ${data.ward.roll}`,
    `Overall Attendance: ${data.ward.attendance}%`,
    `Present Days: ${data.attendance.present}`,
    `Absent Days: ${data.attendance.absent}`,
    `Working Days: ${data.attendance.working}`,
    '',
    'Subject-wise Attendance:',
    ...data.attendance.subjects.map((item) => `- ${item.name}: ${item.percent}% (${item.present} present, ${item.absent} absent)`),
    '',
    'Absent Dates:',
    ...data.attendance.absentDates.map((date) => `- ${date}`)
  ].join('\n');
}

function progressReportText(parent) {
  const data = getWardScopedData(parent);
  return [
    'JGS Group of Institutes',
    'Progress Report',
    '',
    `Student: ${data.ward.name}`,
    `Roll: ${data.ward.roll}`,
    `Branch: ${data.ward.branch}`,
    `Semester: ${data.ward.semester}`,
    `CGPA: ${data.ward.cgpa}`,
    `Rank: ${data.ward.rank}`,
    '',
    'Marks:',
    ...data.marks.map((item) => `- ${item.subject}: ${item.internal} internal, ${item.midterm} mid-term, ${item.total}/50, ${item.grade}, ${item.status}`)
  ].join('\n');
}

module.exports = {
  addMessage,
  attendanceReportText,
  confirmPayment,
  createToken,
  createPaymentOrder,
  findParentByLogin,
  findParentByToken,
  getParentPayload,
  getWardScopedData,
  messages,
  progressReportText,
  receiptText
};
