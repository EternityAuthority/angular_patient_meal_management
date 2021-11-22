/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

import { NbMenuItem } from '@nebular/theme';
import { NbIconLibraries } from '@nebular/theme';
import { Injectable } from '@angular/core';
import { ROLES } from '../@auth/roles';

@Injectable()
export class PagesMenu {

  

  adminMenu: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'browser-outline',
      link: '/pages/admin/'
    },
    {
      title: 'Nutrient & Food Maintenance',
      group: true,
    },
    {
      title: 'Food Groups',
      icon: 'book-outline',
      children: [
        {
          title: 'List',
          link: '/pages/admin/foodgroups-list',
        },
        {
          title: 'Add',
          link: '/pages/admin/foodgroup-add',
        }
      ]
    },
    {
      title: 'Nutrients',
      icon: 'clipboard-outline',
      children: [
        {
          title: 'List',
          link: '/pages/admin/nutrients-list',
        },
        {
          title: 'Add',
          link: '/pages/admin/nutrient-add',
        },
      ]
    },
    {
      title: 'Foods',
      icon: 'trending-up-outline',
      children: [
        {
          title: 'List',
          link: '/pages/admin/foods-list',
        },
        {
          title: 'Add',
          link: '/pages/admin/food-add',
        },
      ]
    },
    {
      title: 'Manage Clients',
      group: true,
    },
    {
      title: 'Clients',
      icon: 'people-outline',
      children: [
        {
          title: 'List',
          link: '/pages/admin/clients-list',
        }
      ]
    }
  ];

  businessMenu: NbMenuItem[] = [
    {
      title: 'My Account',
      link: '/pages/business/my-account',
      icon: 'person'
    },
    {
      title: 'My Clients',
      icon: 'people',
      link: '/pages/business/my-clients',
      // children: [
      //   {
      //     title: 'List',
      //     icon: 'list-outline',
      //     link: '/pages/business/my-clients',
      //   },
      //   {
      //     title: 'Add',
      //     icon: 'person-add-outline',
      //     link: '/pages/business/add-client',
      //   }
      // ]
    }
  ];

  constructor() { }

  getMenu(): NbMenuItem[] {
    const user = JSON.parse(atob(localStorage.getItem('myAuthDetail')));
    if (user && user.userType === ROLES.BUSINESS) {
      return [...this.businessMenu];
    }

      if (user && user.userType === ROLES.ADMIN) {
      return [...this.adminMenu];
    }
  }

  // getMenu(): Observable<NbMenuItem[]> {
  //   const dashboardMenu: NbMenuItem[] = [
  //     {
  //       title: 'Dashboard',
  //       icon: 'home-outline',
  //       link: '/pages/admin/',
  //       home: true,
  //       children: undefined,
  //     },
  //   ];

  //   const ordersMenu: NbMenuItem[] = [
  //     // {
  //     //   title: 'Orders',
  //     //   icon: 'car-outline',
  //     //   link: '/pages/orders/list',
  //     //   children: undefined,
  //     // },
  //   ];

  //   const menu: NbMenuItem[] = [
  //     {
  //       title: 'Nutrient & Food Maintenance',
  //       group: true,
  //     },
  //     {
  //       title: 'Food Groups',
  //       icon: 'folder-outline',
  //       children: [
  //         {
  //           title: 'List',
  //           link: '/pages/admin/foodgroups-list',
  //         },
  //         {
  //           title: 'Add',
  //           link: '/pages/admin/foodgroup-add',
  //         }
  //       ]
  //     },
  //     {
  //       title: 'Nutrients',
  //       icon: 'folder-outline',
  //       children: [
  //         {
  //           title: 'List',
  //           link: '/pages/admin/nutrients-list',
  //         },
  //         {
  //           title: 'Add',
  //           link: '/pages/admin/nutrient-add',
  //         },
  //       ]
  //     },
  //     {
  //       title: 'Foods',
  //       icon: 'folder-outline',
  //       children: [
  //         {
  //           title: 'List',
  //           link: '/pages/admin/foods-list',
  //         },
  //         {
  //           title: 'Add',
  //           link: '/pages/admin/food-add',
  //         },
  //       ]
  //     },
  //     {
  //       title: 'Manage Clients',
  //       group: true,
  //     },
  //     {
  //       title: 'Client',
  //       icon: 'people-outline',
  //       children: [
  //         {
  //           title: 'List',
  //           link: '/pages/admin/clients-list',
  //         },
  //         // {
  //         //   title: 'Add',
  //         //   link: '/pages/admin/client-add',
  //         // }
  //       ]
  //     }
  //   ];

  //   // const menu: NbMenuItem[] = [
  //   //   {
  //   //     title: 'FEATURES',
  //   //     group: true,
  //   //   },
  //   //   {
  //   //     title: 'Layout',
  //   //     icon: 'layout-outline',
  //   //     children: [
  //   //       {
  //   //         title: 'Stepper',
  //   //         link: '/pages/layout/stepper',
  //   //       },
  //   //       {
  //   //         title: 'List',
  //   //         link: '/pages/layout/list',
  //   //       },
  //   //       {
  //   //         title: 'Infinite List',
  //   //         link: '/pages/layout/infinite-list',
  //   //       },
  //   //       {
  //   //         title: 'Accordion',
  //   //         link: '/pages/layout/accordion',
  //   //       },
  //   //       {
  //   //         title: 'Tabs',
  //   //         pathMatch: 'prefix',
  //   //         link: '/pages/layout/tabs',
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: 'Forms',
  //   //     icon: 'edit-2-outline',
  //   //     children: [
  //   //       {
  //   //         title: 'Form Inputs',
  //   //         link: '/pages/forms/inputs',
  //   //       },
  //   //       {
  //   //         title: 'Form Layouts',
  //   //         link: '/pages/forms/layouts',
  //   //       },
  //   //       {
  //   //         title: 'Buttons',
  //   //         link: '/pages/forms/buttons',
  //   //       },
  //   //       {
  //   //         title: 'Datepicker',
  //   //         link: '/pages/forms/datepicker',
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: 'UI Features',
  //   //     icon: 'keypad-outline',
  //   //     link: '/pages/ui-features',
  //   //     children: [
  //   //       {
  //   //         title: 'Grid',
  //   //         link: '/pages/ui-features/grid',
  //   //       },
  //   //       {
  //   //         title: 'Icons',
  //   //         link: '/pages/ui-features/icons',
  //   //       },
  //   //       {
  //   //         title: 'Typography',
  //   //         link: '/pages/ui-features/typography',
  //   //       },
  //   //       {
  //   //         title: 'Animated Searches',
  //   //         link: '/pages/ui-features/search-fields',
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: 'Modal & Overlays',
  //   //     icon: 'browser-outline',
  //   //     children: [
  //   //       {
  //   //         title: 'Dialog',
  //   //         link: '/pages/modal-overlays/dialog',
  //   //       },
  //   //       {
  //   //         title: 'Window',
  //   //         link: '/pages/modal-overlays/window',
  //   //       },
  //   //       {
  //   //         title: 'Popover',
  //   //         link: '/pages/modal-overlays/popover',
  //   //       },
  //   //       {
  //   //         title: 'Toastr',
  //   //         link: '/pages/modal-overlays/toastr',
  //   //       },
  //   //       {
  //   //         title: 'Tooltip',
  //   //         link: '/pages/modal-overlays/tooltip',
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: 'Extra Components',
  //   //     icon: 'message-circle-outline',
  //   //     children: [
  //   //       {
  //   //         title: 'Calendar',
  //   //         link: '/pages/extra-components/calendar',
  //   //       },
  //   //       {
  //   //         title: 'Progress Bar',
  //   //         link: '/pages/extra-components/progress-bar',
  //   //       },
  //   //       {
  //   //         title: 'Spinner',
  //   //         link: '/pages/extra-components/spinner',
  //   //       },
  //   //       {
  //   //         title: 'Alert',
  //   //         link: '/pages/extra-components/alert',
  //   //       },
  //   //       {
  //   //         title: 'Calendar Kit',
  //   //         link: '/pages/extra-components/calendar-kit',
  //   //       },
  //   //       {
  //   //         title: 'Chat',
  //   //         link: '/pages/extra-components/chat',
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: 'Maps',
  //   //     icon: 'map-outline',
  //   //     children: [
  //   //       {
  //   //         title: 'Google Maps',
  //   //         link: '/pages/maps/gmaps',
  //   //       },
  //   //       {
  //   //         title: 'Leaflet Maps',
  //   //         link: '/pages/maps/leaflet',
  //   //       },
  //   //       {
  //   //         title: 'Bubble Maps',
  //   //         link: '/pages/maps/bubble',
  //   //       },
  //   //       {
  //   //         title: 'Search Maps',
  //   //         link: '/pages/maps/searchmap',
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: 'Charts',
  //   //     icon: 'pie-chart-outline',
  //   //     children: [
  //   //       {
  //   //         title: 'Echarts',
  //   //         link: '/pages/charts/echarts',
  //   //       },
  //   //       {
  //   //         title: 'Charts.js',
  //   //         link: '/pages/charts/chartjs',
  //   //       },
  //   //       {
  //   //         title: 'D3',
  //   //         link: '/pages/charts/d3',
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: 'Editors',
  //   //     icon: 'text-outline',
  //   //     children: [
  //   //       {
  //   //         title: 'TinyMCE',
  //   //         link: '/pages/editors/tinymce',
  //   //       },
  //   //       {
  //   //         title: 'CKEditor',
  //   //         link: '/pages/editors/ckeditor',
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: 'Tables & Data',
  //   //     icon: 'grid-outline',
  //   //     children: [
  //   //       {
  //   //         title: 'Smart Table',
  //   //         link: '/pages/tables/smart-table',
  //   //       },
  //   //       {
  //   //         title: 'Tree Grid',
  //   //         link: '/pages/tables/tree-grid',
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: 'Miscellaneous',
  //   //     icon: 'shuffle-2-outline',
  //   //     children: [
  //   //       {
  //   //         title: '404',
  //   //         link: '/pages/miscellaneous/404',
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: 'Auth',
  //   //     icon: 'lock-outline',
  //   //     children: [
  //   //       {
  //   //         title: 'Login',
  //   //         link: '/auth/login',
  //   //       },
  //   //       {
  //   //         title: 'Register',
  //   //         link: '/auth/register',
  //   //       },
  //   //       {
  //   //         title: 'Request Password',
  //   //         link: '/auth/request-password',
  //   //       },
  //   //       {
  //   //         title: 'Reset Password',
  //   //         link: '/auth/reset-password',
  //   //       },
  //   //     ],
  //   //   },
  //   // ];

  //   // const userMenu: NbMenuItem = {
  //   //   title: 'Users',
  //   //   icon: 'people-outline',
  //   //   link: '/pages/users/list',
  //   //   children: undefined,
  //   // };

  //   return this.accessChecker.isGranted('view', 'users')
  //     .pipe(map(hasAccess => {
  //       if (hasAccess) {
  //         // return [...dashboardMenu, ...ordersMenu, userMenu, ...menu];
  //         return [...dashboardMenu, ...ordersMenu, ...menu];
  //       } else {
  //         return [...dashboardMenu, ...ordersMenu, ...menu];
  //       }
  //     }));
  // }
}
