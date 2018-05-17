import Vue from 'vue'
import Router from 'vue-router'

import Wizard from '@/components/Wizard'

import Dashboard from '@/components/Dashboard'

import DiskStorage from '@/components/DiskStorage'
import DiskUsage from '@/components/DiskUsage'

import Certificates from '@/components/Certificates'
import DNS from '@/components/DNS'
import Services from '@/components/Services'
import UsersGroups from '@/components/UsersGroups'

import Network from '@/components/Network'
import SSH from '@/components/SSH'
import TLSPolicy from '@/components/TLSPolicy'
import TrustedNetworks from '@/components/TrustedNetworks'

import Logs from '@/components/Logs'
import About from '@/components/About'

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
  ]
})
