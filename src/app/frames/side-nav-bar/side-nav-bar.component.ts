import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-nav-bar',
  templateUrl: './side-nav-bar.component.html',
  styleUrls: ['./side-nav-bar.component.scss']
})
export class SideNavBarComponent implements OnInit {
  sections = [
    {
      name: 'Dashboard',
      type: 'link',
      icon: 'fa fa-dashboard',
      opened: false,
      background: 'dashboard_link',
      title: 'menu_title'
    },
    {
      name: 'Pages',
      type: 'toggle',
      icon: 'fa fa-list-ol',
      opened: false,
      title: 'menu_title',
      pages: [
        {
          name: 'First Page',
          type: 'link',
          path: 'page/first',
          icon: 'fa fa-star',
          title: 'menu_link_title',
          background: 'menu-link-section'
        },
        {
          name: 'Second Page',
          type: 'link',
          path: 'page/second',
          icon: 'fa fa-star-o',
          title: 'menu_link_title',
          background: 'menu-link-section'
        },
        {
          name: 'Third Page',
          type: 'link',
          path: 'page/third',
          icon: 'fa fa-star-half-full',
          title: 'menu_link_title',
          background: 'menu-link-section'
        }
      ]
    },
    {
      name: 'About Us',
      type: 'toggle',
      icon: 'fa fa-user',
      opened: false,
      title: 'menu_title',
      pages: [
        {
          name: 'Contact',
          type: 'link',
          path: 'contact',
          icon: 'fa fa-phone',
          title: 'menu_link_title',
          background: 'menu-link-section'
        }
      ]
    }
  ];

  toggledMenu: boolean;
  container_wrapper: string;
  opened: boolean;


  constructor(
  ) { }

  toggleMenu(brand) {
  }

  toggleOpen(index: number) {
  }

  toggled() {
  }


  ngOnInit(): void {
    this.toggledMenu = false;
    this.container_wrapper = 'container_wrapper'
    this.opened = true;
  }

}
