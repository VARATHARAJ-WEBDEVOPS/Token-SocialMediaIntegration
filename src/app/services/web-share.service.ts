import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebShareService {
  shareContent(title: string, text: string, url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (navigator.share) {
        navigator.share({ title, text, url })
          .then(() => {
            console.log('Shared successfully');
            resolve();
          })
          .catch((error) => {
            console.log('Error sharing:', error);
            reject(error);
          });
      } else {
        console.log('Web Share API not supported.');
        reject('Web Share API not supported.');
      }
    });
  }
}
