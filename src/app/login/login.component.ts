import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  public loginForm: FormGroup;
  public showKeyboard: boolean = false;
  public keyboardActive: boolean = false;
  public showHidePassword: boolean = false;
  public defaultLogin: string = '';
  public debug: string = '';
  public viewportHeight: number;
  public visualViewport: string = '';
  public existingLang: string = 'fr-FR';
  public availableLanguages = [{ code: 'fr-FR', locale: 'fr-FR' }];
  public scrollRef: string = '';
  private timer = 0;
  private delay: number;

  constructor(
    public readonly formBuilder: FormBuilder,
    private readonly domCtrl: DomController,
    private readonly platform: Platform
  ) {
    this.loginForm = formBuilder.group({
      login: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      lang: ['', Validators.compose([Validators.required])],
    });
  }
  ngAfterViewInit(): void {
    this.setTop();
  }
  @ViewChild('keyboardButton', { static: false }) keyboardButton: ElementRef;
  @HostListener('window:click', ['$event']) click(event: Event): void {
    if (event && event.target) {
      const srcElement = event.target as HTMLElement;
      const refElement = srcElement.closest('ion-item');
      if (refElement && refElement.classList.contains('item-input')) {
        this.debug = refElement.tagName;
        this.keyboardActive = true;
        this.computeViewPort();
      } else {
        this.debug = 'x' + 'NOP';
        this.keyboardActive = false;
      }
    }
  }
  @HostListener('window:resize', ['$event']) resize(): void {
    this.scrollRef =
      window.visualViewport.height +
      ' >= ' +
      this.viewportHeight +
      ':' +
      (window.visualViewport.height >= this.viewportHeight);
    if (window.visualViewport.height >= this.viewportHeight) {
      this.keyboardActive = false;
    } else {
      this.keyboardActive = true;
    }
  }

  test(f: string) {
    this.keyboardActive = false;
  }

  ngOnInit() {
    this.viewportHeight = window.visualViewport.height;
    this.delay = this.platform.is('ios') ? 1000 : 250;
    window.visualViewport.addEventListener('resize', () => {
      this.computeViewPort();
      console.log('reszize');
    });
  }

  ngOnDestroy() {
    window.clearTimeout(this.timer);
    this.timer = null;
    window.visualViewport.removeEventListener('resize', () =>
      this.computeViewPort()
    );
  }

  computeViewPort() {
    window.clearTimeout(this.timer);
    this.timer = window.setTimeout(() => {
      this.visualViewport = 'oo' + window.visualViewport.height;

      this.setTop();
    }, this.delay);
  }

  setTop() {
    this.domCtrl.write(() => {
      if (this.keyboardButton && this.keyboardButton.nativeElement) {
        this.keyboardButton.nativeElement.style.top = `${window.visualViewport.height}px`;
      }
    });
  }

  login() {
    if (this.loginForm.invalid) {
      throw Error('INVALID_FORM');
    }
  }
}
