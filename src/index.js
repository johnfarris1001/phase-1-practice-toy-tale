let addToy = false;
let toyURL = 'http://localhost:3000/toys'

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyName = document.getElementById("name");
  const toyImage = document.getElementById("image");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  const createBtn = document.querySelector('form');
  createBtn.addEventListener('submit', event => {
    event.preventDefault();
    submitToy(toyName.value, toyImage.value);
  })

  function submitToy(name, image) {
    const toyObj = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        'name': name,
        'image': image,
        'likes': 0
      })
    }

    fetch(toyURL, toyObj)
      .then(resp => resp.json())
      .then(data => addNewToy(data.name, data.image, data.id))

  }

  fetch(toyURL)
    .then(resp => resp.json())
    .then(json => renderToys(json))

});

function renderToys(toys) {
  for (let toy of toys) {
    const card = document.createElement('div');
    card.className = 'card';
    const h2 = document.createElement('h2');
    h2.textContent = toy.name;
    const img = document.createElement('img');
    img.src = toy.image;
    img.className = 'toy-avatar'
    const p = document.createElement('p');
    if (toy.likes === 1) {
      p.textContent = `${toy.likes} like`;
    } else {
      p.textContent = `${toy.likes} likes`;
    }
    const button = document.createElement('button');
    button.className = 'like-btn';
    button.textContent = 'Like!'
    button.id = toy.id;
    card.appendChild(h2)
    card.appendChild(img)
    card.appendChild(p)
    card.appendChild(button)
    document.getElementById('toy-collection').appendChild(card);

    button.addEventListener('click', () => {
      toy.likes++
      increaseLikes(toy.id, toy.likes);
    })
  }
}

function addNewToy(name, image, id) {
  const card = document.createElement('div');
  card.className = 'card';
  const h2 = document.createElement('h2');
  h2.textContent = name;
  const img = document.createElement('img');
  img.src = image;
  img.className = 'toy-avatar'
  const p = document.createElement('p');
  p.textContent = `0 likes`;
  let likes = 0;

  const button = document.createElement('button');
  button.className = 'like-btn';
  button.textContent = 'Like!'
  button.id = id;
  card.appendChild(h2)
  card.appendChild(img)
  card.appendChild(p)
  card.appendChild(button)
  document.getElementById('toy-collection').appendChild(card);

  button.addEventListener('click', () => {
    likes++
    increaseLikes(id, likes);
  })
}

function increaseLikes(id, likes) {

  const likesObj = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({
      'likes': likes
    })
  }

  fetch(`${toyURL}/${id}`, likesObj)
    .then(resp => resp.json())
    .then(data => document.getElementById(id).previousSibling.textContent = `${data.likes} likes`)
}