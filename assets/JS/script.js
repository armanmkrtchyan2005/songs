const form = document.querySelector("#form");
const searchInp = document.querySelector("#search");
const result = document.querySelector("#result");
const more = document.querySelector("#more");

const resultUrl =
  "https://cors-anywhere.herokuapp.com/http://api.deezer.com/search?limit=15&q=";
let num = 0;
const lyricsUrl = "https://api.lyrics.ovh/v1";

async function lyricsRes(artist, title, img) {
  const res = await fetch(`${lyricsUrl}/${artist}/${title}`);
  const data = await res.json();
  let lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
  result.innerHTML = `
    <h2>${title}</h2>
    <img src="${img}" class="img" />
    <p>${lyrics}</p>
  `;
}

async function prevRes(artist) {
  num -= 15;
  const res = await fetch(`${resultUrl}${artist}&index=${num}`);
  const data = await res.json();
  result.innerHTML = "";
  data.data.map((item) => {
    result.innerHTML += `
        <ul class="songs">
            <li>
                ${item.artist.name} - ${item.title}
                <button class="btn">Lyrics</button>
            </li>
        </ul>
    `;
    if (data.prev == undefined) {
      more.innerHTML = `
              <button class="btn" onclick="nextRes('${item.artist.name}')">Next</button>
          `;
    } else if (data.next == undefined) {
      more.innerHTML = `
              <button class="btn" onclick="prevRes('${item.artist.name}')" >Prev</button>
          `;
    } else {
      more.innerHTML = `
            <button class="btn" onclick="prevRes('${item.artist.name}')" >Prev</button>
            <button class="btn" onclick="nextRes('${item.artist.name}')">Next</button>
        `;
    }
  });
}

async function nextRes(artist) {
  num += 15;
  const res = await fetch(`${resultUrl}${artist}&index=${num}`);
  const data = await res.json();
  result.innerHTML = "";
  data.data.map((item) => {
    result.innerHTML += `
        <ul class="songs">
            <li>
                ${item.artist.name} - ${item.title}
                <button class="btn">Lyrics</button>
            </li>
        </ul>
    `;
    if (data.prev == undefined) {
      more.innerHTML = `
              <button class="btn" onclick="nextRes('${item.artist.name}')">Next</button>
          `;
    } else if (data.next == undefined) {
      more.innerHTML = `
                <button class="btn" onclick="prevRes('${item.artist.name}')">Prev</button>
        `;
    } else {
      more.innerHTML = `
              <button class="btn" onclick="prevRes('${item.artist.name}')">Prev</button>
              <button class="btn" onclick="nextRes('${item.artist.name}')">Next</button>
          `;
    }
  });
}

async function resultFoo() {
  if (searchInp.value !== "") {
    result.innerHTML = `
      <p>Results will be displayed here</p>
    `;
    const res = await fetch(`${resultUrl}${searchInp.value}&index=0`);
    const data = await res.json();
    data.data.map((item) => {
      result.innerHTML += `
        <ul class="songs">
            <li>
                ${item.artist.name} - ${item.title}
                <button class="btn" onclick="lyricsRes('${item.artist.name}', '${item.title}', '${item.artist.picture}')">Lyrics</button>
            </li>
        </ul>
    `;
      more.innerHTML = `
        <button class="btn" onclick="nextRes('${item.artist.name}')">Next</button>
    `;
    });
    searchInp.value = "";
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  resultFoo();
});

// function search(num, arr) {
//   let start = 0;
//   let end = arr.length - 1;
//   let newMidle = end - start;
//   while (start < end) {
//     let middle = Math.floor((end - start) / 2);
//     if (num === arr[middle]) {
//       return arr[middle];
//     } else if (num < arr[middle]) {
//       start = middle;
//       middle = Math.floor(middle / 2);
//     } else if (num > arr[middle]) {
//       end = middle;
//       middle = Math.floor(middle / 2);
//       console.log(middle);
//     }
//   }
// }

// console.log(search(13, [1, 3, 10, 12, 13, 40]));
