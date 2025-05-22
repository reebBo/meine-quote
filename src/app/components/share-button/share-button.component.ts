import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';



@Component({
  selector: 'app-share-button',
  standalone: true,
  imports: [CommonModule, BsDropdownModule],
  templateUrl: './share-button.component.html',
  styleUrl: './share-button.component.scss',
})
export class ShareButtonComponent {

  
  async share(platform: string) {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.title);
    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'instagram':
        alert('Instagram doesn’t support direct web sharing. Please share manually.');
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

socialLinks = [
  { iconClass: 'fa-brands fa-linkedin', platform: 'linkedin', color: '#0A66C2' },   
  { iconClass: 'fa-brands fa-instagram', platform: 'instagram', color: '#E4405F' },  
  { iconClass: 'fa-brands fa-facebook', platform: 'facebook', color: '#1877F2' },   
  { iconClass: 'fa-brands fa-twitter', platform: 'twitter', color: '#1DA1F2' }     
];
}
