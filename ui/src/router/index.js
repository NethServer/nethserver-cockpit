import Vue from 'vue'
import Router from 'vue-router'

/* SYSTEM */
import Dashboard from '@/components/system/Dashboard'

import Backup from '@/components/system/Backup'
import Storage from '@/components/system/Storage'
import DiskUsage from '@/components/system/DiskUsage'

import Certificates from '@/components/system/Certificates'
import DNS from '@/components/system/DNS'
import DHCP from '@/components/system/DHCP'
import Services from '@/components/system/Services'
import UsersGroups from '@/components/system/UsersGroups'

import Network from '@/components/system/Network'
import SSH from '@/components/system/SSH'
import TLSPolicy from '@/components/system/TLSPolicy'
import TrustedNetworks from '@/components/system/TrustedNetworks'

import Settings from '@/components/system/Settings'
import Logs from '@/components/system/Logs'
import About from '@/components/system/About'
/* */

/* APPLICATIONS */
import Applications from '@/components/applications/Applications'
import ApplicationsDetails from '@/components/applications/ApplicationsDetails'
/* */

/* SOFTWARE CENTER */
import SoftwareCenter from '@/components/software-center/SoftwareCenter'
/* */

/* SUBSCRIPTION */
import Subscription from '@/components/system/Subscription'
/* */

/* TERMINAL */
import Terminal from '@/components/system/Terminal'
/* */

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },

    {
      path: '/backup',
      name: 'Backup',
      component: Backup
    },
    {
      path: '/storage',
      name: 'Storage',
      component: Storage
    },
    {
      path: '/disk-usage',
      name: 'DiskUsage',
      component: DiskUsage
    },

    {
      path: '/certificates',
      name: 'Certificates',
      component: Certificates
    },
    {
      path: '/dns',
      name: 'DNS',
      component: DNS
    },
    {
      path: '/dhcp',
      name: 'DHCP',
      component: DHCP
    },
    {
      path: '/services',
      name: 'Services',
      component: Services
    },
    {
      path: '/users-groups',
      name: 'UsersGroups',
      component: UsersGroups
    },

    {
      path: '/network',
      name: 'Network',
      component: Network
    },
    {
      path: '/ssh',
      name: 'SSH',
      component: SSH
    },
    {
      path: '/tls-policy',
      name: 'TLSPolicy',
      component: TLSPolicy
    },
    {
      path: '/trusted-networks',
      name: 'TrustedNetworks',
      component: TrustedNetworks
    },

    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/logs',
      name: 'Logs',
      component: Logs
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },

    {
      path: '/applications',
      name: 'Applications',
      component: Applications
    },
    {
      path: '/applications/:name',
      name: 'ApplicationsDetails',
      component: ApplicationsDetails
    },

    {
      path: '/software-center',
      name: 'SoftwareCenter',
      component: SoftwareCenter
    },

    {
      path: '/subscription',
      name: 'Subscription',
      component: Subscription
    },

    {
      path: '/terminal',
      name: 'Terminal',
      component: Terminal
    }
  ]
})
