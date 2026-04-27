const OWN_DEPARTMENT_CATEGORIES = new Set(['Academic', 'Faculty', 'Examination']);

const CENTRAL_CATEGORY_MAP = {
  Hostel: 'Hostel Office',
  Library: 'Library',
  Infrastructure: 'Civil Engineering',
  Ragging: 'Student Welfare',
  Other: 'Admin Triage',
};

const DEFAULT_DEPARTMENT = 'Admin Triage';

const mapCategoryToDepartment = (category, studentDepartment) => {
  if (OWN_DEPARTMENT_CATEGORIES.has(category)) {
    return studentDepartment || 'Academic Office';
  }

  return CENTRAL_CATEGORY_MAP[category] || DEFAULT_DEPARTMENT;
};

module.exports = { mapCategoryToDepartment };
