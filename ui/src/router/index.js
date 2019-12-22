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
      name: 'dashboard',
      component: Dashboard
    },

    {
      path: '/backup',
      name: 'backup',
      component: Backup
    },
    {
      path: '/storage',
      name: 'storage',
      component: Storage
    },
    {
      path: '/disk-usage',
      name: 'disk_usage',
      component: DiskUsage
    },

    {
      path: '/certificates',
      name: 'certificates',
      component: Certificates
    },
    {
      path: '/dns',
      name: 'dns',
      component: DNS
    },
    {
      path: '/dhcp',
      name: 'dhcp',
      component: DHCP
    },
    {
      path: '/services',
      name: 'services',
      component: Services
    },
    {
      path: '/users-groups',
      name: 'users_groups',
      component: UsersGroups
    },

    {
      path: '/network',
      name: 'network',
      component: Network
    },
    {
      path: '/ssh',
      name: 'ssh',
      component: SSH
    },
    {
      path: '/tls-policy',
      name: 'tls_policy',
      component: TLSPolicy
    },
    {
      path: '/trusted-networks',
      name: 'trusted_networks',
      component: TrustedNetworks
    },

    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/logs',
      name: 'logs',
      component: Logs
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },

    {
      path: '/applications',
      name: 'applications',
      component: Applications
    },
    {
      path: '/applications/:name',
      name: 'ApplicationsDetails',
      component: ApplicationsDetails
    },

    {
      path: '/software-center',
      name: 'software_center',
      component: SoftwareCenter
    },

    {
      path: '/subscription',
      name: 'subscription',
      component: Subscription
    },

    {
      path: '/terminal',
      name: 'terminal',
      component: Terminal
    }
  ]
})
