const usersContainer = document.querySelector(".users");
const dialog = document.querySelector(".dialog");
const dialogWrapper = document.querySelector(".dialog__wrapper");
const searchInput = document.querySelector(".search__input");
const searchButton = document.querySelector(".search__button");

const baseUrl = "http://127.0.0.1:3000";

const getUsers = async () => {
  try {
    const res = await fetch(baseUrl);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

const searchUsers = async (term) => {
  try {
    const res = await fetch(`${baseUrl}?term=${term}`);
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

let users = (await getUsers()) ?? [];

const renderUsers = () => {
  usersContainer.innerHTML = "";

  if (!users.length) {
    usersContainer.innerHTML = `
    <div>
      <p>Пользователи не найдены</p>
    </div>
    `;
    return;
  }

  for (let i = 0; i < users.length; i++) {
    usersContainer.innerHTML += `
    <div class="user" data-id="${i}">
      <div class="user__name">${users[i].name}</div>
      <div class="user__info">
        <span class="info__field">
          <img src="icons/phone.svg"/>
          <div class="user__phone">${users[i].phone}</div>
        </span>
        <span class="info__field">
          <img src="icons/mail.svg"/>
          <div class="user__email">${users[i].email}</div>
        </span>
        </div>
    </div>
    `;
  }
};

renderUsers();

const search = async () => {
  if (!searchInput.value.trim()) {
    searchInput.value = "";
    users = await getUsers();
  } else {
    users = await searchUsers(searchInput.value);
  }
  renderUsers();
};

const debounce = (fn, ms) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), ms);
  };
};

searchButton.addEventListener("click", async (event) => {
  event.preventDefault();
  search();
});

searchInput.addEventListener("input", debounce(search, 500));

usersContainer.addEventListener("click", (event) => {
  const userCard = event.target.closest(".user");
  if (userCard) {
    const user = users[userCard.dataset.id];
    dialogWrapper.innerHTML = `
    <div class="dialog__header">
      <span class="dialog__title">${user.name}</span>
      <form method="dialog">
        <button class="dialog__close">
        <img src="icons/close.svg" alt="">
      </button>
      </form> 
    </div>
    <section class="dialog__info">
      <div class="dialog__info__field">
        <span class="field__label">Телефон:</span>
        <span class="field__value">${user.phone}</span>
      </div>
      <div class="dialog__info__field">
        <span class="field__label">Почта:</span>
        <span class="field__value">${user.email}</span>
      </div>
      <div class="dialog__info__field">
        <span class="field__label">Дата приёма:</span>
        <span class="field__value">${user.hire_date}</span>
      </div>
      <div class="dialog__info__field">
        <span class="field__label">Должность:</span>
        <span class="field__value">${user.position_name}</span>
      </div>
      <div class="dialog__info__field">
        <span class="field__label">Подразделение:</span>
        <span class="field__value">${user.department}</span>
      </div>
    </section>
    <section class="dialog__additional-info">
      <div class="additional-info__header">Дополнительная информация:</div>
      <div class="additional-info__body">Адрес: ${user.address}</div>
    </section>
    `;
    dialog.showModal();
  }
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});
