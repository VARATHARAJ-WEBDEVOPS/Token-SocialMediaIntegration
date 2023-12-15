import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { WebShareService } from 'src/app/services/web-share.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  datas: any;
  user: any;
  userToken: any;

  constructor(private authService: AuthService,
    private router: Router,
    private webShareService: WebShareService) { }

  alert(message: string, mood: String) {
    Swal.fire({
      title: mood === "good" ? 'Yep!' : 'Oops!',
      text: `${message}`,
      icon: mood === "good" ? 'success' : 'error',
      confirmButtonText: 'Got it!'
    });
  }

  ngOnInit(): void {
    // console.log(this.authService.authChecking());
    // if (!this.authService.authChecking()) {
    //   this.router.navigateByUrl('');
    //   this.alert('unAutherized User :( ', 'bad');
    // }
    this.getUserData();
    this.authService.getAll().subscribe(
      (res: any) => {
        this.datas = res
        console.log(res);
        
      }, (err) => {
        this.alert('err', 'bad');
      }
    );

    const authValue = localStorage.getItem('auth');
    this.userToken = authValue ? authValue.replace(/^"|"$/g, '') : ''; 
  }

  logout() {
    Swal.fire({
      title: 'Are you sure to Log out?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigateByUrl('');
      }
    });
  }

  getUserData() {
    this.authService.getUserData().subscribe(
      (res: any) => {
        this.user = res
        console.log(res);
        
      }, (err) => {
        this.alert(err.error.message, 'bad');
      }
    )
  }

  copyToClipboard() {
    if (this.userToken) {
      const el = document.createElement('textarea');
      el.value = this.userToken;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      this.alert('Token Copied to clipboard', 'good')
    }
  }
  
  // shareFiles() {
  //   const filesArray: never[] = []; 
  //   if (navigator['canShare'] && navigator['canShare']({ files: filesArray })) {
  //     navigator['share']({
  //       files: filesArray,
  //       title: 'Vacation Pictures',
  //       text: 'Photos from September 27 to October 14.'
  //     })
  //     .then(() => console.log('Share was successful.'))
  //     .catch((error) => console.log('Sharing failed', error));
  //   } else {
  //     console.log(`Your system doesn't support sharing files.`);
  //   }
  // }
  
  shareContent() {
    this.webShareService.shareContent(
      'Shared from my Angular App!',
      'Check out this awesome content!',
      'https://your-website-url.com'
    ).then(() => {
      // Handle success if needed
    }).catch((error) => {
      console.log(error);
      
    });
  }
  

}

