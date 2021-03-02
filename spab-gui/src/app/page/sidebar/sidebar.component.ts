import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'spab-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  isOpen = false;

  constructor() { }

  ngOnInit(): void {
  }
}
