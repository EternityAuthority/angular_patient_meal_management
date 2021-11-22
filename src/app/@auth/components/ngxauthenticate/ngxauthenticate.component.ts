import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../../pages/Services/loading.service';

@Component({
  selector: 'ngx-ngxauthenticate',
  templateUrl: './ngxauthenticate.component.html',
  styleUrls: ['./ngxauthenticate.component.scss']
})
export class NgxauthenticateComponent implements OnInit {

  constructor(public load: LoadingService,
    private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('userId')) {
      this.router.navigate(['/auth/payment'], {
        queryParams: {
          userId: this.route.snapshot.queryParamMap.get('userId')
        }
      });
    }
  }

}
