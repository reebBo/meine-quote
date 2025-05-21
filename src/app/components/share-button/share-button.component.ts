import { Component, Input, OnInit } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
@Component({
  selector: 'app-share-button',
  standalone: true,
  imports: [CommonModule, BsDropdownModule],
  templateUrl: './share-button.component.html',
  styleUrl: './share-button.component.scss',
})
export class ShareButtonComponent {

  constructor() {}
  socialLinks = [
  { iconClass: 'fa-brands fa-linkedin', url: '#', color: '#0A66C2' },   
  { iconClass: 'fa-brands fa-instagram', url: '#', color: '#E4405F' },  
  { iconClass: 'fa-brands fa-facebook', url: '#', color: '#1877F2' },   
  { iconClass: 'fa-brands fa-twitter', url: '#', color: '#1DA1F2' }     
];

  // socialPlatforms = [
  //   {
  //     name: 'Facebook',
  //     iconClass: 'fa-brands fa-facebook',
  //     url: 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href)
  //   },
  //   {
  //     name: 'LinkedIn',
  //     iconClass: 'fa-brands fa-linkedin',
  //     url: 'https://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(window.location.href)
  //   },
  //   {
  //     name: 'Instagram',
  //     iconClass: 'fa-brands fa-instagram',
  //     url: 'https://www.instagram.com/', // Instagram doesn't support direct share links
  //     disabled: true
  //   },
  //   {
  //     name: 'Twitter',
  //     iconClass: 'fa-brands fa-twitter',
  //     url: 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href)
  //   }
  // ];


  // @Input() url: string = window.location.href;
  // @Input() text: string = 'Check this out!';

  // facebookShareUrl!: string;
  // twitterShareUrl!: string;
  // linkedinShareUrl!: string;

  // ngOnInit(): void {
  //   const encodedUrl = encodeURIComponent(this.url);
  //   const encodedText = encodeURIComponent(this.text);

  //   this.facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  //   this.twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
  //   this.linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  // }

  // copyInstagramMessage(): void {
  //   const caption = `${this.text} ${this.url}`;
  //   navigator.clipboard.writeText(caption).then(() => {
  //     alert('Copied to clipboard! Paste it in Instagram manually.');
  //   });
  // }
}
