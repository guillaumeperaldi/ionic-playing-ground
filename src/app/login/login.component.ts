import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  public loginForm: FormGroup;
  public showKeyboard: boolean = false;
  public keyboardActive: boolean = false;
  public showHidePassword: boolean = false;
  public defaultLogin: string = '';
  public debug: string = '';
  public viewport: string = '';
  public visualViewport: string = '';
  public existingLang: string = 'fr-FR';
  public availableLanguages = [{ code: 'fr-FR', locale: 'fr-FR' }];
  private scrolling = 0;
  private scrollRef: HTMLElement;

  constructor(
    public readonly formBuilder: FormBuilder,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) {
    this.loginForm = formBuilder.group({
      login: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required])],
      lang: ['', Validators.compose([Validators.required])],
    });
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

  /*
scrollElement.addEventListener('scroll', ev => {
                    // debounce resize, wait for resize to finish before doing stuff
                    window.clearTimeout(this.scrolling);
                    this.scrolling = window.setTimeout(() => {
                        if (this.userEvent) {
                            this.saveScrollYPosition(scrollElement.scrollHeight, scrollElement.scrollTop);
                        }
                    }, 250);
                });
  */
  ngOnInit() {
    this.viewport = 'viewport ' + window.visualViewport.height;
    this.scrollRef = this.keyboardButton.nativeElement;
    console.log(this.keyboardButton);
    window.visualViewport.addEventListener('resize', () =>
      this.computeViewPort()
    );
  }

  ngOnDestroy() {
    window.clearTimeout(this.scrolling);
    this.scrolling = null;
    window.visualViewport.removeEventListener('resize', () =>
      this.computeViewPort()
    );
  }

  computeViewPort() {
    window.clearTimeout(this.scrolling);
    this.scrolling = window.setTimeout(() => {
      this.visualViewport = '' + window.visualViewport.height;

      this.setTop();
    }, 1000);
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
