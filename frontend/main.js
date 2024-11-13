const SERVER_URL = 'http://localhost:3000'

async function serverAddStudent(obj) {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  })
  let data = await response.json()

  return data
}

async function serverGetStudent() {
  let response = await fetch(SERVER_URL + '/api/students', {
    method: "GET",
    headers: { 'Content-Type': 'application/json' }, 
  })
  let data = await response.json()

  return data
}

async function serverDeleteStudent(id) {
  let response = await fetch(SERVER_URL + '/api/students/' + id, {
    method: "DELETE",
  
  })
  let data = await response.json()

  return data
}

let serverData = await serverGetStudent()

// const students = [{
//   name: 'Олег',
//   surname: 'Филимонов',
//   lastname: 'Александрович',
//   birthday: '31.12.1985',
//   studyStart: 2020,
//   faculty: 'Исторический'
// },

// {
//   name: 'Ирина',
//   surname: 'Балуевская',
//   lastname: 'Алексеевна',
//   birthday: '22.11.1987',
//   studyStart: 2021,
//   faculty: 'Филологический'
// },

// {
//   name: 'Иван',
//   surname: 'Туваев',
//   lastname: 'Николаевич',
//   birthday: '23.09.1990',
//   studyStart: 2022,
//   faculty: 'Энергетический'
// },

// {
//   name: 'Дмитрий',
//   surname: 'Шин',
//   lastname: 'Валерьевич',
//   birthday: '22.08.1987',
//   studyStart: 2020,
//   faculty: 'Математический'
// },

// {
//   name: 'Евгений',
//   surname: 'Козлов',
//   lastname: 'Петрович',
//   birthday: '30.07.1998',
//   studyStart: 2023,
//   faculty: 'Исторический'
// }
// ];



let students = []

if(serverData !== null) {
students = serverData
}

const addForm = document.getElementById('add-form');
const tbody = document.querySelector('#studentTable tbody');
tbody.classList.add('stroke')
const headers = document.querySelectorAll('th[data-sort]');
let sortDirection = 'asc';

const filterForm = document.getElementById('filter-form');
const fioFilterInp = document.getElementById('filter-fio');
const studyStartFilterInp = document.getElementById('filter-studyStart');
const endYearFilterInp = document.getElementById('filter-endYear');
const facultyFilterInp = document.getElementById('filter-faculty')


// Очищаем форму после отправки

function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('surname').value = '';
  document.getElementById('lastname').value = '';
  document.getElementById('birthday').value = '';
  document.getElementById('studyStart').value = '';
  document.getElementById('faculty').value = '';
}

// Функция, которая считает возраст
function calculateAge(birthday) {
  const today = new Date();
  const birth = new Date(birthday.split('.').reverse().join('-')); // Преобразование строки в объект Date

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // Если месяц текущий меньше месяца рождения или день еще не наступил, уменьшаем возраст на 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// Фильтрация

function filter(arr, prop, value) {
  if (prop === 'studyStart') {
    // Фильтрация по году начала обучения
    return arr.filter(student => Number(student.studyStart) === parseInt(value.trim()));
  } else if (prop === 'endYear') {
    // Фильтрация по году окончания обучения
    return arr.filter(student => Number(student.endYear) === parseInt(value.trim()));
  } else if (prop === 'FIO') {
    // Фильтрация по ФИО
    return arr.filter(student => student.FIO.toLowerCase().includes(value.trim().toLowerCase()));
  } else {
    // Фильтрация по строковым значениям
    return arr.filter(student => student[prop].toLowerCase().includes(value.trim().toLowerCase()));
  }
}

// Функция изменения формата даты

function formatDate(dateString) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

// Функция сортировки
function sortStudents(key) {
  students.sort((a, b) => {
    const valueA = typeof a[key] === 'string' ? a[key].toLowerCase() : a[key];
    const valueB = typeof b[key] === 'string' ? b[key].toLowerCase() : b[key];

    if (sortDirection === 'asc') {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });
}

function createOneStudent(student) {
  const nameCell = document.createElement('td');
  nameCell.textContent = student.FIO;
  nameCell.classList.add('fasdf')
  const facultyCell = document.createElement('td');
  facultyCell.textContent = student.faculty;
  facultyCell.classList.add('fasdf')
  const birthdayCell = document.createElement('td');
  birthdayCell.textContent = student.birthday + ' ' + '(' + student.age + ' ' + 'лет' + ')';
  const studyStartCell = document.createElement('td');
  studyStartCell.textContent = `${student.year} (${student.status})`;
  const tdDelete = document.createElement('td')
  const btnDelete = document.createElement('button')
  btnDelete.classList.add("btn", "btn-danger", "w-100")
  btnDelete.textContent = "Удалить"
  const row = document.createElement('tr');

btnDelete.addEventListener("click", async function() {
  const studentId = student.id; // Получаем ID студента
  await serverDeleteStudent(studentId); // Удаляем с сервера

  // Обновляем локальный массив студентов, исключая удаленного студента
  students = students.filter(s => s.id !== studentId);
  render(students); // Перерисовываем таблицу
})

  // Добавляем ячейки в строку
  row.appendChild(nameCell);
  row.appendChild(facultyCell);
  row.appendChild(birthdayCell);
  row.appendChild(studyStartCell);
  row.appendChild(btnDelete);
  

  return (row)
}

function render(arrData) {

  tbody.innerHTML = '';

  let copyStudents = [...arrData]


  for (const student of copyStudents) {
    student.FIO = student.surname + ' ' + student.name + ' ' + student.lastname;
    const currentYear = new Date().getFullYear();
    student.well = currentYear - student.studyStart + 1;
    student.endYear = student.studyStart - (-4);
    student.year = `${student.studyStart} - ${student.endYear}`;
    student.age = calculateAge(student.birthday)

    if (currentYear > student.endYear || (currentYear === student.endYear && new Date().getMonth() >= 8)) {

      student.status = 'Закончил';
    } else {

      student.status = `${student.well} курс`;
    }

  }

  if (fioFilterInp.value.trim() !== "") {
    copyStudents = filter(copyStudents, 'FIO', fioFilterInp.value)
  }

  if (studyStartFilterInp.value.trim() !== "") {
    copyStudents = filter(copyStudents, 'studyStart', studyStartFilterInp.value)
  }

  if (endYearFilterInp.value.trim() !== "") {
    copyStudents = filter(copyStudents, 'endYear', endYearFilterInp.value)
  }

  if (facultyFilterInp.value.trim() !== "") {
    copyStudents = filter(copyStudents, 'faculty', facultyFilterInp.value)
  }

  copyStudents.forEach(student => {
    // Создаем ячейки <td>
    const newTr = createOneStudent(student)
    // Добавляем строку в <tbody>
    tbody.appendChild(newTr);
  });

}

render(students)

// Добавляем студента из формы в массив

addForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  // Валидация фамилии
  if (surname.value.trim() === '') {
    alert('Фамилия не введена!');
    return;
  }

  // Валидация имени
  const name = document.getElementById('name')
  if (name.value.trim() === '') {
    alert('Имя не введено!');
    return;
  }

  // Валидация отчества
  if (lastname.value.trim() === '') {
    alert('Отчество не введено!');
    return;
  }

  const today = new Date();
  const currentYear = today.getFullYear();
  const birthdayValue = document.getElementById('birthday').value;
  const birthdayParsed = new Date(birthdayValue);
  const birthdayNumber = birthdayParsed.getTime();


  const minbirthday = new Date('1900-01-01').getTime();
  if (isNaN(birthdayParsed.getTime()) || birthdayNumber < minbirthday || birthdayNumber > today.getTime()) {
    alert('Дата рождения должна быть в диапазоне от 01.01.1900 до текущей даты!');
    return;
  }

  // Валидация года начала обучения
  const studyStartValue = parseInt(document.getElementById('studyStart').value.trim(), 10);
  if (isNaN(studyStartValue) || studyStartValue < 2000 || studyStartValue > new Date().getFullYear()) {
    alert(`Год начала обучения должен быть в диапазоне от 2000 до ${new Date().getFullYear()}!`);
    return;
  }

  // Валидация факультета
  if (faculty.value.trim() === '') {
    alert('Факультет не введен!');
    return;
  }

  // Добавление студента после валидации
  let newStudentObj = {
    name: document.getElementById('name').value.trim(),
    surname: document.getElementById('surname').value.trim(),
    lastname: document.getElementById('lastname').value.trim(),
    birthday: formatDate(birthdayValue),
    studyStart: studyStartValue,
    faculty: document.getElementById('faculty').value.trim(),
  };

  let serverDataObj = await serverAddStudent(newStudentObj)
students.push(serverDataObj)
  render(students);
  clearForm();

});

// Функция для обработки кликов на заголовки таблицы
headers.forEach(header => {
  header.addEventListener('click', () => {
    const key = header.getAttribute('data-sort');

    // Определение направления сортировки
    if (header.classList.contains('asc')) {
      sortDirection = 'desc';
    } else {
      sortDirection = 'asc';
    }

    // Удаляем классы сортировки со всех заголовков
    headers.forEach(h => h.classList.remove('asc', 'desc'));

    // Добавляем класс направления сортировки на текущий заголовок
    header.classList.add(sortDirection);

    // Сортировка студентов по выбранному ключу
    sortStudents(key);

    // Перерисовка таблицы после сортировки
    render(students);
  });
});


filterForm.addEventListener('submit', function (event) {
  event.preventDefault()
})

fioFilterInp.addEventListener('input', function () {
  render(students)
})
studyStartFilterInp.addEventListener('input', function () {
  render(students)
})
endYearFilterInp.addEventListener('input', function () {
  render(students)
})
facultyFilterInp.addEventListener('input', function () {
  render(students)
})

const resetButton = document.getElementById('btnFilter');
resetButton.addEventListener('click', () => {
  filterForm.reset();
  render(students)
});


