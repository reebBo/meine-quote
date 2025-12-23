import {
  Component,
  Inject,
  Input,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-share-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule],
  templateUrl: './share-button.component.html',
  styleUrl: './share-button.component.scss',
})
export class ShareButtonComponent {
  @Input() quote?: { quoteText: string; quoteAuthor?: string | null } | null;
  @Input() offsetDays = 0;
  @ViewChild('shareNoticeModal') shareNoticeModal?: TemplateRef<unknown>;
  modalMessage = '';
  modalRef?: BsModalRef;
  private isBrowser: boolean;
  private html2canvasModule?: typeof import('html2canvas/dist/html2canvas.esm.js');

  constructor(
    @Inject(PLATFORM_ID) platformId: object,
    private modalService: BsModalService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async share(platform: string) {
    if (!this.isBrowser) {
      return;
    }

    let hasShownModal = false;

    const url = new URL(window.location.href);
    if (this.offsetDays > 0) {
      url.searchParams.set('offset', String(this.offsetDays));
    } else {
      url.searchParams.delete('offset');
    }
    const shareUrlBase = url.toString();
    const quoteText = this.quote?.quoteText?.trim() ?? '';
    const quoteAuthor = this.quote?.quoteAuthor?.trim() || 'Unknown';
    const fullQuote = `"${quoteText}"${quoteAuthor ? ' — ' + quoteAuthor : ''}`;

    const screenshotFile = await this.captureScreenshot();
    const shareData: ShareData = {
      title: 'Quote of the Day',
      text: fullQuote,
      url: shareUrlBase,
    };
    if (screenshotFile) {
      shareData.files = [screenshotFile];
    }

    // Try Web Share API first (on supported platforms)
    if (navigator.share && platform !== 'instagram') {
      try {
        if (!shareData.files || !navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        });
        return;
      } catch (err) {
        console.warn('Web Share API failed or was cancelled:', err);
      }
    }

    if (screenshotFile) {
      hasShownModal =
        (await this.prepareDesktopScreenshot(screenshotFile)) || hasShownModal;
    }

    const urlEncoded = encodeURIComponent(shareUrlBase);
    const textEncoded = encodeURIComponent(fullQuote);
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${urlEncoded}&quote=${textEncoded}`;
        break;

      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${textEncoded}&url=${urlEncoded}`;
        break;

      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${textEncoded}%0A${urlEncoded}`;
        break;

      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${urlEncoded}&text=${textEncoded}`;
        break;

      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(
          'Quote of the Day'
        )}&body=${textEncoded}%0A${urlEncoded}`;
        break;

      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${urlEncoded}&description=${textEncoded}`;
        break;

      case 'reddit':
        shareUrl = `https://reddit.com/submit?url=${urlEncoded}&title=${textEncoded}`;
        break;

      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${urlEncoded}`;
        await this.showModal(
          'LinkedIn does not support sharing custom text. Only the link will be shared.'
        );
        hasShownModal = true;
        break;

      case 'instagram':
        await this.showModal(
          'Instagram does not support direct sharing from the browser. You can take a screenshot or copy the quote manually.'
        );
        hasShownModal = true;
        return;

      default:
        return;
    }

    if (!hasShownModal) {
      await this.showModal('Ready to open the share window.');
    }
    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url: shareUrl });
    } else {
      window.open(shareUrl, '_blank');
    }
  }

  private async captureScreenshot(): Promise<File | null> {
    const target = document.querySelector(
      '[data-share-card]'
    ) as HTMLElement | null;
    if (!target) {
      return null;
    }

    const html2canvas = await this.loadHtml2Canvas();
    if (!html2canvas) {
      return null;
    }

    const canvas = await html2canvas.default(target, {
      backgroundColor: null,
      scale: 2,
    });
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png')
    );

    if (!blob) {
      return null;
    }

    return new File([blob], 'quote.png', { type: 'image/png' });
  }

  private async loadHtml2Canvas() {
    if (!this.isBrowser) {
      return null;
    }

    if (!this.html2canvasModule) {
      this.html2canvasModule = await import(
        'html2canvas/dist/html2canvas.esm.js'
      );
    }

    return this.html2canvasModule;
  }

  private async prepareDesktopScreenshot(file: File): Promise<boolean> {
    const canWriteClipboard =
      !!navigator.clipboard?.write && typeof ClipboardItem !== 'undefined';

    if (canWriteClipboard) {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ [file.type]: file }),
        ]);
        await this.showModal(
          'Your screenshot is ready. In the share window, paste the image to attach it.'
        );
        return true;
      } catch {
        // Fall back to download when clipboard write fails.
      }
    }

    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quote.png';
    link.click();
    URL.revokeObjectURL(url);
    await this.showModal('Screenshot downloaded. Attach it in the share window.');
    return true;
  }

  primaryLinks = [
    {
      iconClass: 'fa-brands fa-twitter',
      platform: 'twitter',
      color: '#1DA1F2',
    },
    {
      iconClass: 'fa-brands fa-whatsapp',
      platform: 'whatsapp',
      color: '#25D366',
    },
    {
      iconClass: 'fa-brands fa-telegram',
      platform: 'telegram',
      color: '#0088cc',
    },
  ];

  moreLinks: Array<{
    iconClass: string;
    platform: string;
    color: string;
  }> = [];

  private showModal(message: string): Promise<void> {
    if (!this.isBrowser || !this.shareNoticeModal) {
      alert(message);
      return Promise.resolve();
    }

    this.modalMessage = message;
    this.modalRef = this.modalService.show(this.shareNoticeModal);

    if (!this.modalRef?.onHidden) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const sub = this.modalRef?.onHidden?.subscribe(() => {
        sub?.unsubscribe();
        resolve();
      });
    });
  }

}
