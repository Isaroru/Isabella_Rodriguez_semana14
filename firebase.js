// Import the functions you need from the SDKs you need
import {
  initializeApp
} from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import './sign-up/sign-up.js'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDW3vUOh4VxRN2dVQvM7g_MI6cilad98co",
  authDomain: "web-23-1-to-do-list.firebaseapp.com",
  projectId: "web-23-1-to-do-list",
  storageBucket: "web-23-1-to-do-list.appspot.com",
  messagingSenderId: "511789618398",
  appId: "1:511789618398:web:c58c2906a8fe5a9e519e4f",
  measurementId: "G-5DPMBWGRWJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getTasks() {
  const tasks = [];

  const querySnapshot = await getDocs(collection(db, "tasks"));
  querySnapshot.forEach((doc) => {
    //console.log(`${doc.id} => ${doc.data()}`);
    tasks.push({
      ...doc.data(),
      id: doc.id
    })
  });
  return tasks;
}

export async function addTask(taskTitle) {

  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      title: taskTitle
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function addUserToDb(userInfo, id) {
  try {
      await setDoc(doc(db, "users", id), userInfo);
      console.log("user written with ID: ", id);
  } catch (e) {
      console.error("Error adding user: ", e);
  }
}

export async function editDocument(title, id) {
  await setDoc(doc(db, "tasks", id), {
    title: title,
    completed: true,
  });
}
export async function createUser(userInfo) {
  const auth = getAuth();
  try {
    userCredential = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
    // Signed in
    const user = userCredential.user;
    console.log(user)
    //subir imagen
    const url = await uploadFile(user.id + userInfo.picture.name, userInfo.picture, 'profilePicture')

    //crear usuario
    const dbInfo = {
      url,
      email: userInfo.email,
      birthday: userInfo.birthday,
      username: userInfo.username
      }
      addUserToDb(dbInfo, user.id)
  }
  catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
  }
}

export async function uploadFile(name, file, folder) {
  const taskImgRef = ref(storage, `${folder}/${name}`);

  try {
      await uploadBytes(taskImgRef, file);
      const url = await getDownloadURL(taskImgRef);
      return url;
  } catch (error) {
      console.log("error creando imagen ->", error);
  }
}

export async function logInUser(email, password) {

  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user;
      return {status: true, info: user.id}

  } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      return {status: false, info: errorMessage}
  };
}