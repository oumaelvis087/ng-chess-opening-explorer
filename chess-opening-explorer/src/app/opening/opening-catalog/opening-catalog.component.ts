import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { OpeningService } from '../opening.service';
import { IOpening } from 'src/app/shared/interfaces/opening';
import { getRandomChessPiece } from 'src/app/shared/helpers/getRandomChessPieceImg';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import {
  IconDefinition,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-opening-catalog',
  templateUrl: './opening-catalog.component.html',
})
export class OpeningCatalogComponent implements OnInit {
  faInfoCircle: IconDefinition = faInfoCircle;
  randomChessPieceImgs: string[] = [];
  openings: IOpening[] | null = [];
  filteredOpenings: IOpening[] | null = [];
  searchQuery: string = '';
  isDynamicSearch: boolean =
    localStorage.getItem('isDynamicSearch') === 'false' ? false : true;
  showNoResultsMsg: boolean = false;
  showNoOpeningsMsg: boolean = false;
  initialImgsSet: boolean = false;
  isLoading: boolean = true;

  @ViewChild('searchInput') searchInput!: ElementRef;
  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent): void {
    if (event.key === '/') {
      event.preventDefault();
      this.searchInput.nativeElement.focus();
    }
  }

  constructor(
    private openingService: OpeningService,
    private router: Router,
    private route: ActivatedRoute,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['name'] || '';
      if (this.searchQuery.length > 0) {
        setTimeout(() => {
          this.searchInput.nativeElement.focus();
        });
      }
      this.fetchOpenings();
    });
  }

  fetchOpenings(): void {
    this.openingService
      .getAllOpenings()
      .then((openings) => {
        this.openings = openings;
        this.filteredOpenings = openings;
        this.searchHandler();
        this.isLoading = false;

        if (this.openings && !this.initialImgsSet) {
          this.initialImgsSet = true;
          this.generateRandomChessPieceImages();
        }

        this.showNoOpeningsMsg = this.openings.length === 0;
      })
      .catch((err) => {
        this.openings = null;
        this.isLoading = false;
        console.error('Error fetching all openings: ', err.message);
        this.router.navigate(['opening-not-found']);
        return this.notifService.showError(
          'Failed to load openings. Please try again later.'
        );
      });
  }

  toggleSearchMode(): void {
    this.isDynamicSearch = !this.isDynamicSearch;
    localStorage.setItem('isDynamicSearch', this.isDynamicSearch.toString());
  }

  searchHandler(): void {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredOpenings = this.openings;
      this.router.navigate(['/openings/catalog']);
    } else {
      if (this.openings) {
        this.filteredOpenings = this.openings?.filter((opening) =>
          opening.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );

        if (this.filteredOpenings.length === 0) {
          this.showNoResultsMsg = true;
        } else {
          this.showNoResultsMsg = false;
        }

        this.router.navigate(['/openings/catalog/search'], {
          queryParams: { name: this.searchQuery },
        });
      }
    }
  }

  generateRandomChessPieceImages(): void {
    for (let i = 0; i < this.openings!.length; i++) {
      this.randomChessPieceImgs[i] = getRandomChessPiece();
    }
  }
}
