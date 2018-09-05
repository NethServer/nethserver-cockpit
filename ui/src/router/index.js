import Vue from 'vue'
import Router from 'vue-router'

/* WIZARD */
import Wizard from '@/components/wizard/Wizard'
/* */

/* SYSTEM */
import Dashboard from '@/components/system/Dashboard'

import DiskStorage from '@/components/system/DiskStorage'
import DiskUsage from '@/components/system/DiskUsage'

import Certificates from '@/components/system/Certificates'
import DNS from '@/components/system/DNS'
import Services from '@/components/system/Services'
import UsersGroups from '@/components/system/UsersGroups'

import Network from '@/components/system/Network'
import SSH from '@/components/system/SSH'
import TLSPolicy from '@/components/system/TLSPolicy'
import TrustedNetworks from '@/components/system/TrustedNetworks'

import Logs from '@/components/system/Logs'
import About from '@/components/system/About'
/* */

/* APPLICATIONS */
import Applications from '@/components/applications/Applications'
/* */

/* SOFTWARE CENTER */
import SoftwareCenter from '@/components/software-center/SoftwareCenter'
/* */

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },

    {
      path: '/storage',
      name: 'DiskStorage',
      component: DiskStorage
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
      path: '/wizard',
      name: 'Wizard',
      component: Wizard
    },

    {
      path: '/applications',
      name: 'Applications',
      component: Applications
    },

    {
      path: '/software-center',
      name: 'SoftwareCenter',
      component: SoftwareCenter
    },
  ]
})
