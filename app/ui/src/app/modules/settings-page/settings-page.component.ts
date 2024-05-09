import { Component } from '@angular/core';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { Router } from '@angular/router';

interface Settings {
  trainModel: boolean;
  pullImage: string;
}

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent {

  isActiveForTrain: boolean = true;
  pullImageMode: string = '';


  constructor(
    private router: Router,
    private firestore: Firestore
  ) { }
  async ngOnInit() {

  }

  async setData(): Promise<Settings> {
    //Add a new document in collection Settings
    const docRef = doc(this.firestore, "Settings", "trainModel");
    const pullImages = doc(this.firestore, "Settings", "pullImage");
    if (this.isActiveForTrain) {
      await setDoc(docRef, {
        toTrain: true
      });
    } else {
      await setDoc(docRef, {
        toTrain: false
      });
    }
    if (this.pullImageMode === "Edge") {
      console.log(this.pullImageMode, 'tiene que ser edge')
      await setDoc(pullImages, {
        pullImageMode: 'Edge'
      });
    } else {
      console.log(this.pullImageMode, 'tiene que ser cloud')
      await setDoc(pullImages, {
        pullImageMode: 'Cloud'
      });
    }
    return null!;
  }

  backToSharePage() {
    this.router.navigate(['/share-page']);
  }

}
