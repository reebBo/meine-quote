import { Component, Inject, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-share-button',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, BsDropdownModule],
  templateUrl: './share-button.component.html',
  styleUrl: './share-button.component.scss',
})
export class ShareButtonComponent {
  @Input() quote?: { quoteText: string; quoteAuthor?: string | null } | null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async share(platform: string) {
    if (!this.isBrowser) {
      return;
    }

    const url = window.location.href;
    const quoteText = this.quote?.quoteText?.trim() ?? '';
    const quoteAuthor = this.quote?.quoteAuthor?.trim() || 'Unknown';
    const fullQuote = `"${quoteText}"${quoteAuthor ? ' — ' + quoteAuthor : ''}`;

    const shareData = {
      title: 'Quote of the Day',
      text: fullQuote,
      url: url,
    };

    // Try Web Share API first (on supported platforms)
    if (navigator.share && platform !== 'instagram') {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        console.warn('Web Share API failed or was cancelled:', err);
      }
    }

    const urlEncoded = encodeURIComponent(url);
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
        alert(
          'LinkedIn does not support sharing custom text. Only the link will be shared:\n\n' +
            shareUrl
        );
        break;

      case 'instagram':
        alert(
          'Instagram does not support direct sharing from the browser.\nYou can take a screenshot or copy the quote manually:\n\n' +
            fullQuote
        );
        return;

      default:
        return;
    }

    if (Capacitor.isNativePlatform()) {
      await Browser.open({ url: shareUrl });
    } else {
      window.open(shareUrl, '_blank');
    }
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
  {
    iconClass: 'fa-solid fa-envelope',
    platform: 'email',
    color: '#7B7B7B',
  },
];

moreLinks = [
  {
    iconClass: 'fa-brands fa-linkedin',
    platform: 'linkedin',
    color: '#0A66C2',
  },
  {
    iconClass: 'fa-brands fa-facebook',
    platform: 'facebook',
    color: '#1877F2',
  },
  {
    iconClass: 'fa-brands fa-pinterest',
    platform: 'pinterest',
    color: '#BD081C',
  },
  {
    iconClass: 'fa-brands fa-reddit',
    platform: 'reddit',
    color: '#FF4500',
  },
  {
    iconClass: 'fa-brands fa-instagram',
    platform: 'instagram',
    color: '#E4405F',
  },
];

}
