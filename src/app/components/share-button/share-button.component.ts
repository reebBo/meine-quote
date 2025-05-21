import { Component, Input, OnInit } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
@Component({
  selector: 'app-share-button',
  standalone: true,
  imports: [CommonModule, ModalModule, BsDropdownModule],
  templateUrl: './share-button.component.html',
  styleUrl: './share-button.component.scss',
})
export class ShareButtonComponent {
  modalRef?: BsModalRef;

  constructor(private modalService: BsModalService) {}

  openModal(template: any) {
    this.modalRef = this.modalService.show(template);
  }
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
