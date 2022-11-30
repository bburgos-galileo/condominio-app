
import { Injectable } from '@angular/core';
import { doc, Firestore, updateDoc, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage, uploadString } from '@angular/fire/storage';
import { Photo } from '@capacitor/camera';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AvatarService {

  constructor(private firestore: Firestore, private storage: Storage, private db: DatabaseService) { }

  async uploadImage(cameraFile: Photo, id: string) {

		const user = sessionStorage.getItem('userEmail');
		const path = `uploads/${id}/profile.webp`;
		const storageRef = ref(this.storage, path);

		try {

			await uploadString(storageRef, cameraFile.base64String, 'base64');

			const imageUrl = await getDownloadURL(storageRef);

			const userDocRef = doc(this.firestore, `Inquilino/${user}`);

      await updateDoc(userDocRef, { imageUrl: imageUrl })

			return true;
		} catch (e) {
			return null;
		}
	}

  async uploadImageReclamo(cameraFile: Photo, data: any, idReclamo: string) {

		const user = sessionStorage.getItem('userEmail');
		const path = `uploads/${data.id}/${idReclamo}/reclamo.webp`;
		const storageRef = ref(this.storage, path);

		try {

			await uploadString(storageRef, cameraFile.base64String, 'base64');

			const imageUrl = await getDownloadURL(storageRef);

			return imageUrl;

		} catch (e) {
			return null;
		}
	}


}
