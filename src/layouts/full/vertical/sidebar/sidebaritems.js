import { uniqueId } from 'lodash';

const SidebarContent = [
  // ==================== NON-PRO SECTIONS ====================
  {
    heading: 'Home',
    children: [
      {
        name: 'Dashboard',
        icon: 'solar:widget-2-linear',
        id: uniqueId(),
        url: '/super/dashboard',
        isPro: false
      },
      {
        id: uniqueId(),
        name: 'My Profile',
        icon: 'solar:user-circle-linear',
        url: '/super/user-profile',
        isPro: false
      }]

  },

  {
    heading: 'SASS Management',
    children: [
      {
        name: 'Schools list',
        icon: 'solar:server-linear',
        id: uniqueId(),
        url: '/super/utilities/schools'
      },
      {
        name: 'Manage Plans',
        icon: 'solar:document-add-linear',
        id: uniqueId(),
        url: '/super/utilities/plans'
      },
      {
        name: 'Payment History',
        icon: 'solar:document-add-linear',
        id: uniqueId(),
        url: '/super/utilities/payment-history'
      }]
  },

  {
    heading: 'Systems & Settings',
    children: [
      {
        name: 'Platform Configuration',
        id: uniqueId(),
        icon: 'solar:settings-linear',
        children: [
          {
            id: uniqueId(),
            name: 'Platform Settings',
            url: '/super/settings/platform',
            isPro: false
          },
          {
            id: uniqueId(),
            name: 'Payment Gateways',
            url: '/super/settings/payment-gateways',
            isPro: false
          },
          {
            id: uniqueId(),
            name: 'SMS Gateway',
            url: '/super/settings/sms-gateways',
            isPro: false
          },
          {
            id: uniqueId(),
            name: 'Notification Types',
            url: '/super/settings/notification-types',
            isPro: false
          }]
      },
      {
        name: 'Landing Page',
        id: uniqueId(),
        icon: 'solar:layers-linear',
        children: [
          {
            id: uniqueId(),
            name: 'Landing Page',
            url: '/super/cms/page-sections',
            isPro: false
          },
          {
            id: uniqueId(),
            name: 'Navigation Menu',
            url: '/super/cms/navigation-menu',
            isPro: false
          },
          {
            name: 'Client Logo',
            id: uniqueId(),
            url: '/super/settings/client-logos',
            isPro: false
          }
        ]
      },
      {
        name: 'Front-End CMS',
        id: uniqueId(),
        icon: 'solar:layers-linear',
        children: [
          {
            id: uniqueId(),
            name: 'Master Menu Builder',
            url: '/super/settings/menu-builder',
            isPro: false
          },
          {
            name: 'Specific School Settings',
            id: uniqueId(),
            url: '/super/settings/school-features',
            isPro: false
          }
        ]
      }
    ]
  },
  {
    heading: 'Ticketing Tool',
    children: [
      {
        id: uniqueId(),
        name: 'Notes',
        icon: 'solar:notes-linear',
        url: '/super/apps/notes',
        isPro: false
      },
      {
        id: uniqueId(),
        name: 'Tickets',
        icon: 'solar:ticker-star-linear',
        url: '/super/apps/tickets',
        isPro: false
      },
      {
        id: uniqueId(),
        name: 'Leads',
        icon: 'solar:ticker-star-linear',
        url: '/super/apps/leads',
        isPro: false
      },
      {
        name: 'Blogs',
        id: uniqueId(),
        icon: 'solar:sort-by-alphabet-linear',
        children: [
          {
            id: uniqueId(),
            name: 'Blog Post',
            url: '/super/apps/blog/post',
            isPro: false
          },
          {
            id: uniqueId(),
            name: 'Blog Detail',
            url: '/super/apps/blog/detail/streaming-video-way-before-it-was-cool-go-dark-tomorrow',
            isPro: false
          }]

      }]

  }];



export default SidebarContent;