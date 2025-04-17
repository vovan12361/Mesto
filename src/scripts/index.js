import '../pages/index.css';
import { openModal, closeModal } from './modal.js';
import { enableValidation } from './validate.js';
import { createCard} from './cards.js';
import { getInitialCards, getUserInfo, patchProfile, postCard, patchAvatar } from "./api.js";

console.log(getUserInfo());

const placesList = document.querySelector('.places__list');
const profileFormElement = document.querySelector('[name="edit-profile"]');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const profilePopup = document.querySelector('.popup_type_edit');
const profileName = profilePopup.querySelector('[name="name"]');
const profileNewDescription = profilePopup.querySelector('[name="description"]');
const popups = document.querySelectorAll('.popup');

const cardFormElement = document.querySelector('[name="new-place"]');
const cardPopup = document.querySelector('.popup_type_new-card');
const avatarPopup = document.querySelector('.popup_type_avatar');
const avatarFormElement = document.querySelector('[name="new-avatar"]');
export const imagePopup = document.querySelector('.popup_type_image');
export const popupImage = imagePopup.querySelector('.popup__image');
export const popupCaption = imagePopup.querySelector('.popup__caption');

const profileEditButton = document.querySelector('.profile__edit-button');
const cardAddButton = document.querySelector('.profile__add-button');
const profileEditCloseButton = profilePopup.querySelector('.popup__close');
const cardCloseButton = cardPopup.querySelector('.popup__close');
const imageCloseButton = imagePopup.querySelector('.popup__close');
const avatarCloseButton = avatarPopup.querySelector('.popup__close');


popups.forEach((popup) => {
  popup.classList.add('popup_is-animated');
});

function closeByOverlay (evt) {
  if (evt.target===evt.currentTarget) {
    closeModal(evt.target);
  }
}

popups.forEach (element => {
  element.addEventListener('mousedown', closeByOverlay);
});

profileEditButton.addEventListener('click', () => {
  profileName.value = profileTitle.textContent;
  profileNewDescription.value = profileDescription.textContent;
  openModal(profilePopup);
});

profileImage.addEventListener('click', ()=>{
  openModal(avatarPopup);
})

function renderLoading(button, isLoading, buttonText = 'Сохранить', loadingText = 'Сохранение...') {
  button.textContent = isLoading ? loadingText : buttonText;
}

function profileFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const name = profileName.value;
  const description =  profileNewDescription.value;
  renderLoading(submitButton, true);
  patchProfile(name, description)
    .then(() => {
      profileDescription.textContent = description;
      profileTitle.textContent = name;
      closeModal(profilePopup);
    })
    .catch((err) => {
      console.log('Ошибка при обновлении профиля:', err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

function cardFormSubmit(evt) {
  evt.preventDefault();
  const name = document.querySelector('[name="place-name"]').value;
  const link = document.querySelector('[name="link"]').value;
  const submitButton = evt.submitter;
  // const formInitialCards = [
  //   {
  //     name: name,
  //     link: link,
  //   }
  // ];
  renderLoading(submitButton, true);
  postCard(name, link)
    .then(res=>{
      if (res.ok){
        return res.json();
      }
      return Promise.reject(`Ошибка: ${res.status}`);
    })
    .then(data => {
      placesList.prepend(createCard(data));
      cardFormElement.reset();
      closeModal(cardPopup);
    })
    .catch((err) => {
      console.log('Ошибка при создании карточки:', err);
    })
    .finally(() => {
      renderLoading(submitButton, false, 'Создать');
    });
  // formInitialCards.forEach(element => {
  //   placesList.prepend(createCard(element));
  // });
  // cardFormElement.reset();
  // closeModal(cardPopup);
}

function avatarFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const imageLink = avatarFormElement.querySelector('.popup__input').value
  renderLoading(submitButton, true);
  patchAvatar(imageLink)
    .then(() => {
      profileImage.style.backgroundImage = `url(${imageLink})`;
      closeModal(avatarPopup);
    })
    .catch((err) => {
      console.log('Ошибка при обновлении аватара:', err);
    })
    .finally(() => {
      renderLoading(submitButton, false);
    });
}

const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

profileFormElement.addEventListener('submit', profileFormSubmit);
cardFormElement.addEventListener('submit', cardFormSubmit);
avatarFormElement.addEventListener('submit', avatarFormSubmit);
cardAddButton.addEventListener('click', () => openModal(cardPopup));
profileEditCloseButton.addEventListener('click', () => closeModal(profilePopup));
cardCloseButton.addEventListener('click', () => closeModal(cardPopup));
imageCloseButton.addEventListener('click', () => closeModal(imagePopup));
avatarCloseButton.addEventListener('click',() => closeModal(avatarPopup));


// getUserInfo()
//   .then((result) => {
//     console.log(result);
//     profileTitle.textContent = result.name;
//     profileDescription.textContent = result.about;
//     profileImage.style.backgroundImage = `url(${result.avatar})`;
//   })
//   .catch((err) => {
//     console.log(err); 
//   }); 
  
// getInitialCards()
//   .then((result) => {
//     console.log(result);
//     result.forEach(element => {
//       placesList.append(createCard(element));
//     });
//   })
//   .catch((err) => {
//     console.log(err); 
//   });

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    const UserId = userData._id;
    console.log(userData);
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;
    
    cards.forEach(cardData => {
      const cardElement = createCard(cardData, UserId);
      placesList.append(cardElement);
    });
  })
  .catch(err => console.log(err));

enableValidation(validationSettings);