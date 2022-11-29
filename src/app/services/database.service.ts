import { Usuario } from './../model/usuario';
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, docData, addDoc, setDoc, deleteDoc, updateDoc, doc, query, where, getDocs, docSnapshots, getFirestore, getDoc } from '@angular/fire/firestore';
import { async } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  newUsuario: Usuario = null;
  datos: any;

  constructor(private fireBase: Firestore) {

  }

  async crearDocument(data: any, path: string) {

    const collectionRef = collection(this.fireBase, path);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;

  }

  async crearUsuario(id: string, data: any){
    const userDocRef = doc(this.fireBase, `Inquilino/${id}`);
    await setDoc(userDocRef, data);
  }

  async actualizarImagen(id: string, image: string){
    const userDocRef = doc(this.fireBase, `Inquilino/${id}`);
    await setDoc(userDocRef, {imageUrl: image});
  }


  async obtenerUsuario(id: string){
    const docRef = doc(this.fireBase, `Inquilino/${id}`);
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      //console.log("Document data:", JSON.parse(JSON.stringify(docSnap.data())));
      return JSON.parse(JSON.stringify(docSnap.data()));
    } else {
      // doc.data() will be undefined in this case
      return null;
    }
  }

  async datosUsuario(email: string, path: string) {

    const q = query(collection(this.fireBase, path), where('correo', "==", email));
    const querySnapshot = await getDocs(q);

    console.log("Registros " + querySnapshot.size);


    if (querySnapshot.size == 1) {
      querySnapshot.forEach((doc) => {
        //doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());

        this.datos = JSON.parse(JSON.stringify(doc.data()));

        console.log(this.datos.nombre);
        console.log(this.datos.reclamos);
      });


    }
  }

  padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  formatDate(date: Date) {
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('/');
  }

  getID(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
