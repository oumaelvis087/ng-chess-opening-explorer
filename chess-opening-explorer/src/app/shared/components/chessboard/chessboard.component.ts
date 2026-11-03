import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgxChessBoardView, PieceIconInput } from 'ngx-chess-board';

@Component({
  selector: 'app-chessboard',
  templateUrl: './chessboard.component.html',
  styleUrls: ['./chessboard.component.scss'],
})
export class ChessboardComponent implements AfterViewInit, OnChanges, OnDestroy {
  chessboardSize: number = 480;
  @Input() size: number = 480;
  @Input() fen: string = '';

  @ViewChild('chessboard', { static: false }) chessboard!: NgxChessBoardView;
  @ViewChild('boardStage', { static: true })
  boardStage!: ElementRef<HTMLElement>;

  readonly pieceIcons: PieceIconInput = {
    whiteKingUrl: '/assets/images/chess-pieces/kw.png',
    whiteQueenUrl: '/assets/images/chess-pieces/qw.png',
    whiteKnightUrl: '/assets/images/chess-pieces/nw.png',
    whiteRookUrl: '/assets/images/chess-pieces/rw.png',
    whitePawnUrl: '/assets/images/chess-pieces/pw.png',
    whiteBishopUrl: '/assets/images/chess-pieces/bw.png',
    blackKingUrl: '/assets/images/chess-pieces/kb.png',
    blackQueenUrl: '/assets/images/chess-pieces/qb.png',
    blackKnightUrl: '/assets/images/chess-pieces/nb.png',
    blackRookUrl: '/assets/images/chess-pieces/rb.png',
    blackPawnUrl: '/assets/images/chess-pieces/pb.png',
    blackBishopUrl: '/assets/images/chess-pieces/bb.png',
  };

  private resizeObserver?: ResizeObserver;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateChessboardSize();
  }

  ngOnInit(): void {
    this.updateChessboardSize();
    setTimeout(() => {
      if (this.fen !== '' && this.chessboard) {
        this.setBoardFEN();
      }
    });
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateChessboardSize();
    });
    this.resizeObserver.observe(this.boardStage.nativeElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['size'] && this.boardStage) {
      this.updateChessboardSize();
    }

    if (changes['fen'] && this.fen !== '' && this.chessboard) {
      this.setBoardFEN();
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  updateChessboardSize(): void {
    const availableSize = this.boardStage.nativeElement.clientWidth - 24;
    this.chessboardSize = Math.max(
      100,
      Math.min(this.size, availableSize)
    );
  }

  resetBoardHandler(): void {
    this.chessboard.reset();
  }

  flipBoardHandler(): void {
    this.chessboard.reverse();
  }

  undoMoveHandler(): void {
    this.chessboard.undo();
  }

  setBoardFEN(): void {
    this.chessboard.setFEN(this.fen);
  }
}
