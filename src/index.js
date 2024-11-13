import { initializeApp } from 'firebase/app';
import { getDatabase, query, serverTimestamp } from "firebase/database";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, onSnapshot, doc, updateDoc, where } from 'firebase/firestore';
 
console.log('Find it ... the One Piece');

const firebaseConfig = {
    apiKey: "AIzaSyC1QAN3eH6k9spUOhbsyu9Sg8fcPHthqcg",
    authDomain: "fir-firststep-1bb6e.firebaseapp.com",
    projectId: "fir-firststep-1bb6e",
    storageBucket: "fir-firststep-1bb6e.appspot.com",
    messagingSenderId: "164259876059",
    appId: "1:164259876059:web:e96530cc7c47560a11d0fe",
    measurementId: "G-0PMSRPP8BJ"
  };
  
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const dbRef = collection(db, "Facture");

document.querySelector('#addfacture').addEventListener('submit', async (event) => {
  event.preventDefault();

  let numeroFacture = document.getElementById("number");
  let status = document.getElementById("status");
  let idField = document.getElementById("factureId"); 

  let numeroFactureValue = numeroFacture.value.trim();
  let statusValue = status.value.trim();
  let date = serverTimestamp();
  let docId = idField.value;

  if (numeroFactureValue && statusValue) {
    const data = {
      number: numeroFactureValue,
      status: statusValue,
      date: date
    };

    try {
      if (docId) {

        await updateDoc(doc(db, "Facture", docId), data);
        console.log("Document updated successfully:", docId);
      } else {

        const docRef = await addDoc(dbRef, data);
        console.log("Document added successfully:", docRef.id);
      }

      document.getElementById("addfacture").reset();
      document.getElementById("factureId").value = ""; 
    } catch (error) {
      console.log("Erreur", error);
    }
  } else {
    alert("Vous devez remplir les champs");
  }
});

async function searchFactures() {
  const searchInput = document.getElementById('searchBar').value.toLowerCase();
  const tbody = document.getElementById('tbody');

  tbody.innerHTML = '';

  if (!searchInput) {
    displayTab();
    return;
  }

  const q = query(dbRef, where('number', '>=', searchInput), where('number', '<=', searchInput + '\uf8ff'));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const row = `
      <tr>
        <th scope="row">${data.number}</th>
        <td>${data.status}</td>
        <td>
          <button class="editFacture" data-id="${doc.id}" data-number="${data.number}" data-status="${data.status}">Edit</button>
          <button class="deleteFacture" data-id="${doc.id}">Delete</button>
        </td>
      </tr>`;
    tbody.innerHTML += row;
  });

  addEventListeners();
}

function displayTab() {
  const tbody = document.querySelector('#tbody');


  onSnapshot(query(collection(db, 'Facture')), (snapshot) => {
    tbody.innerHTML = ""; 

    snapshot.forEach((doc) => {
      const data = doc.data();
      const row = `
        <tr>
          <th scope="row">${data.number}</th>
          <td>${data.status}</td>
          <td>
            <button class="editFacture" data-id="${doc.id}" data-number="${data.number}" data-status="${data.status}">Edit</button>
            <button class="deleteFacture" data-id="${doc.id}">Delete</button>
          </td>
        </tr>`;
      tbody.innerHTML += row;
    });

    document.querySelectorAll('.deleteFacture').forEach(element => {
      element.addEventListener('click', async (e) => {
        const docId = e.target.getAttribute('data-id');
        await deleteDoc(doc(db, "Facture", docId));
        console.log("Document deleted:", docId);
      });
    });


    document.querySelectorAll('.editFacture').forEach(element => {
      element.addEventListener('click', (e) => {
        const docId = e.target.getAttribute('data-id');
        const number = e.target.getAttribute('data-number');
        const status = e.target.getAttribute('data-status');

        document.getElementById("number").value = number;
        document.getElementById("status").value = status;
        document.getElementById("factureId").value = docId;
      });
    });

  });
}

displayTab();
