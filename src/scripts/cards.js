import { imagePopup, popupCaption, popupImage } from "./index.js";
import { openModal } from './modal.js';
import { deleteCard, toggleLike } from "./api.js";
const cardTemplate = document.querySelector('#card-template').content;
 

export const createCard = (initialCards, userId) => {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');

  cardImage.src = initialCards.link;
  cardImage.alt = initialCards.name;
  cardTitle.textContent = initialCards.name;
  likeCount.textContent = initialCards.likes.length;
  
  if (initialCards.owner._id !== userId) {
    deleteButton.remove(); 
  }
   else
  {
    deleteButton.addEventListener('click', () => {
      deleteCard(initialCards._id);
      cardElement.remove();
    });
  }
  
  if (initialCards.likes.some(like => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    toggleLike(initialCards._id, isLiked)
      .then((updatedCard)=>{
        likeCount.textContent = updatedCard.likes.length;
        likeButton.classList.toggle('card__like-button_is-active');
      })
      .catch(err => console.log(err));
  });

  cardImage.addEventListener('click', () => {
    popupImage.src = initialCards.link;
    popupImage.alt = initialCards.name;
    popupCaption.textContent = initialCards.name;
    openModal(imagePopup);
  });

  return cardElement;
};

