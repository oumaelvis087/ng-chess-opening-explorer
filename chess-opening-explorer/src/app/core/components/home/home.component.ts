import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { OpeningService } from 'src/app/opening/opening.service';
import { getRandomChessPiece } from 'src/app/shared/helpers/getRandomChessPieceImg';
import { IOpening } from 'src/app/shared/interfaces/opening';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  lastThreeOpenings: IOpening[] | null = [];
  featuredPieceImages: string[] = [];
  showNoOpeningsMsg: boolean = false;
  isLoading: boolean = true;

  constructor(
    private openingService: OpeningService,
    private changeDetectorRef: ChangeDetectorRef,
    private notifService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.fetchLastThreeOpenings();
  }

  fetchLastThreeOpenings(): void {
    this.openingService
      .getLastThreeOpenings()
      .then((openings) => {
        this.lastThreeOpenings = openings;
        this.featuredPieceImages = openings.map(() => getRandomChessPiece());
        this.isLoading = false;
        this.showNoOpeningsMsg = this.lastThreeOpenings.length === 0;
        this.changeDetectorRef.detectChanges();
      })
      .catch((err) => {
        this.lastThreeOpenings = null;
        this.isLoading = false;
        console.error('Error fetching last three openings: ', err.message);
        this.router.navigate(['opening-not-found']);
        return this.notifService.showError(
          'Failed to load featured openings. Please try again later.'
        );
      });
  }
}
