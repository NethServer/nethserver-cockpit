<template>
  <div>
    <h2>{{$t('users_groups.title')}}</h2>
    <div v-if="users.provider !== null">
      <h3>{{$t('users_groups.summary')}}</h3>
      <div class="panel panel-default" id="provider-markup">
        <div class="panel-heading">
          <button id="change-provider-btn" data-toggle="modal" data-target="#changeProviderModal" class="btn btn-primary">{{$t('users_groups.change_provider')}}</button>
          <span class="panel-title">
            {{$t('users_groups.account_provider')}}: {{users.provider}}
          </span>
          <span class="provider-details" data-toggle="collapse" data-parent="#provider-markup" href="#providerDetails">{{$t('users_groups.details')}}</span>
        </div>
        <div id="providerDetails" class="panel-collapse collapse">
          <dl class="dl-horizontal details-container">
            <span v-if="!(k == 'isAD' || k == 'isLdap')" v-for="(v,k) in users.providerInfo" v-bind:key="k">
              <dt>{{k | capitalize}}</dt>
              <dd>{{v}}</dd>
            </span>
          </dl>
        </div>
      </div>
    </div>

    <div v-if="users.provider !== null" class="inline-block-div">
      <h3>{{$t('actions')}}</h3>
      <div class="btn-group">
        <button v-if="currentSearchFilter == 'user'" @click="openCreateUser()" class="btn btn-primary btn-lg shutdown-privileged"
          data-action="restart" data-container="body">{{$t('users_groups.create_user')}}</button>
        <button v-if="currentSearchFilter == 'group'" @click="openCreateGroup()" class="btn btn-primary btn-lg shutdown-privileged"
          data-action="restart" data-container="body">{{$t('users_groups.create_group')}}</button>
        <button data-toggle="dropdown" class="btn btn-primary btn-lg dropdown-toggle shutdown-privileged">
          <span class="caret"></span>
        </button>
        <ul role="menu" class="dropdown-menu pull-right">
          <li class="presentation">
            <a @click="openCreateUser()" role="menuitem" data-action="restart">{{$t('users_groups.create_user')}}</a>
          </li>
          <li class="presentation">
            <a @click="openCreateGroup()" role="menuitem" data-action="restart">{{$t('users_groups.create_group')}}</a>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="users.provider !== null">
      <h3>{{$t('list')}}</h3>
      <form role="form" class="search-pf has-button search">
        <div class="form-group has-clear toolbar-pf-filter">
          <label class="sr-only" for="filter">{{availableSearchFilter[currentSearchFilter]}}</label>
          <div class="input-group full-width">
            <div class="input-group-btn">
              <button type="button" class="btn btn-default btn-lg dropdown-toggle adjust-filter-search" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="false">
                {{availableSearchFilter[currentSearchFilter]}}
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu">
                <li v-for="(f, kf) in availableSearchFilter" v-bind:key="kf" :class="[currentSearchFilter == kf ? 'selected' : '']">
                  <a @click="switchFilterSearch(kf)">{{f}}</a>
                </li>
              </ul>
            </div>
            <input v-model="searchString" type="text" class="form-control input-lg" id="filter" :placeholder="'Filter by '+ availableSearchFilter[currentSearchFilter] +'...'">
          </div>
        </div>
        <div class="form-group">
          <button class="btn btn-default btn-lg" type="submit">
            <span class="fa fa-search"></span>
          </button>
        </div>
      </form>

      <div class="list-group list-view-pf">
        <div v-if="currentSearchFilter == 'user'" v-for="(u, ku) in users.list" v-bind:key="ku" class="list-group-item">
          <div class="list-view-pf-actions">
            <button @click="openEditUser(ku, u)" class="btn btn-default">
              <span class="pficon pficon-edit span-right-margin"></span>
              {{$t('edit')}}
            </button>
            <div class="dropdown pull-right dropdown-kebab-pf">
              <button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span class="fa fa-ellipsis-v"></span>
              </button>
              <ul class="dropdown-menu dropdown-menu-right">
                <li>
                  <a @click="openChangePassword(ku, u)">
                    <span class="fa fa-key span-right-margin"></span>
                    {{$t('users_groups.change_password')}}</a>
                </li>
                <li role="separator" class="divider"></li>
                <li>
                  <a @click="openDeleteUser(ku, u)">
                    <span class="fa fa-times span-right-margin"></span>
                    {{$t('delete')}}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="list-view-pf-main-info">
            <div :class="['list-view-pf-left', u.locked == 1 ? 'disabled' : '']">
              <span :class="['fa', u.locked == 1 ? 'fa-lock' : 'fa-user', 'list-view-pf-icon-sm']"></span>
            </div>
            <div class="list-view-pf-body">
              <div class="list-view-pf-description">
                <div @click="openEditUser(ku, u)" class="list-group-item-heading">
                  <a :class="[u.locked == 1 ? 'disabled' : '']">{{ku}}</a>
                </div>
                <div class="list-group-item-text">
                  <span :class="[u.locked == 1 ? 'disabled' : '']">{{u.gecos}}</span>
                </div>
              </div>
              <div class="list-view-pf-additional-info">
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentSearchFilter == 'group'" v-for="(g, kg) in groups.list" v-bind:key="kg" class="list-group-item">
          <div class="list-view-pf-actions">
            <button @click="openEditGroup(kg, g)" class="btn btn-default">
              <span class="pficon pficon-edit span-right-margin"></span>
              {{$t('edit')}}
            </button>
            <div class="dropdown pull-right dropdown-kebab-pf">
              <button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                <span class="fa fa-ellipsis-v"></span>
              </button>
              <ul class="dropdown-menu dropdown-menu-right">
                <li>
                  <a @click="openDeleteGroup(kg, g)">
                    <span class="fa fa-times span-right-margin"></span>
                    {{$t('delete')}}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="list-view-pf-main-info">
            <div class="list-view-pf-left">
              <span class="fa fa-users list-view-pf-icon-sm"></span>
            </div>
            <div class="list-view-pf-body">
              <div class="list-view-pf-description">
                <div @click="openEditGroup(kg, g)" class="list-group-item-heading">
                  <a>{{kg}}</a>
                </div>
                <div class="list-group-item-text">

                </div>
              </div>
              <div class="list-view-pf-additional-info">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" id="createUserModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 v-if="!newUser.isPassEdit" class="modal-title">{{newUser.isEdit ? $t('edit') : $t('users_groups.create_user')}}
              <span>{{newUser.key}}</span>
            </h4>
            <h4 v-if="newUser.isPassEdit" class="modal-title">{{newUser.isPassEdit ? $t('users_groups.change_password_to') : $t('users_groups.create_user')}}
              <span>{{newUser.key}}</span>
            </h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="newUser.isEdit ? newUser.isPassEdit ? changePassword(newUser) : editUser(newUser) : createUser(newUser)">

            <div class="modal-body">
              <div v-if="!newUser.isPassEdit" :class="['form-group', newUser.errorProps['key'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.username')}}</label>
                <div class="col-sm-5">
                  <input :disabled="newUser.isEdit" required type="text" v-model="newUser.key" class="form-control">
                  <span v-if="newUser.errorProps['key']" class="help-block">{{newUser.errorProps['key']}}</span>
                </div>
                <div class="col-sm-4">
                  <input :disabled="true" type="text" v-model="users.domain" class="form-control">
                </div>
              </div>
              <div v-if="!newUser.isPassEdit" :class="['form-group', newUser.errorProps['gecos'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.name')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="newUser.gecos" class="form-control">
                  <span v-if="newUser.errorProps['gecos']" class="help-block">{{newUser.errorProps['gecos']}}</span>
                </div>
              </div>
              <div v-if="!newUser.isPassEdit" :class="['form-group', newUser.errorProps['groups'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.groups')}}</label>
                <div class="col-sm-9">
                  <select @change="addGroupToUser(newUser.selectedGroup)" v-model="newUser.selectedGroup" class="combobox form-control">
                    <option></option>
                    <option :value="kg" v-for="(g, kg) in groups.list" v-bind:key="kg">{{kg}}</option>
                  </select>
                  <span v-if="newUser.errorProps['groups']" class="help-block">{{newUser.errorProps['groups']}}</span>
                </div>
              </div>
              <div v-if="newUser.loadGroups" class="form-group">
                <div class="col-sm-12">
                  <div class="spinner"></div>
                </div>
              </div>
              <div v-if="!newUser.isPassEdit" v-for="(g,i) in newUser.groups" v-bind:key="i" class="form-group">
                <label class="col-xs-12 col-sm-3 control-label" for="textInput-modal-markup"></label>
                <div class="col-xs-7 col-sm-6">
                  <input type="text" :value="g" class="form-control">
                </div>
                <div class="col-xs-5 col-sm-2">
                  <button @click="removeGroupFromUser(i)" class="btn btn-default" type="button">
                    <span class="fa fa-minus card-icon-def"></span>
                  </button>
                </div>
              </div>
              <div v-if="!(newUser.isEdit && !newUser.isPassEdit)" class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.password')}}</label>
                <div class="col-sm-7">
                  <input required :type="newUser.isPassGenerated ? 'text' : 'password'" v-model="newUser.password" class="form-control">
                </div>
                <div class="col-sm-2">
                  <button @click="generatePassword()" type="button" class="btn btn-primary">{{$t('users_groups.generate')}}</button>
                </div>
              </div>
              <div v-if="!(newUser.isEdit && !newUser.isPassEdit)" class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.confirm_password')}}</label>
                <div class="col-sm-7">
                  <input required :type="newUser.isPassGenerated ? 'text' : 'password'" v-model="newUser.confirmPassword" class="form-control">
                </div>
              </div>
              <div v-if="!(newUser.isEdit && !newUser.isPassEdit)" class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.strength')}}</label>
                <div class="col-sm-7">
                  meter password
                </div>
              </div>
              <p v-if="!newUser.isPassEdit">{{$t('users_groups.advanced_options')}}</p>
              <div v-if="!newUser.isPassEdit" class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.password_expiration')}}</label>
                <div class="col-sm-9">
                  <input type="checkbox" v-model="newUser.expires">
                </div>
              </div>
              <div v-if="!newUser.isPassEdit" class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.remote_shell')}}</label>
                <div class="col-sm-9">
                  <input type="checkbox" v-model="newUser.shell">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button :disabled="newUser.passwordStrength <= 75 || newUser.password !== newUser.confirmPassword" class="btn btn-primary"
                type="submit">{{newUser.isEdit ? newUser.isPassEdit ? $t('change') : $t('edit') : $t('create')}}</button>
            </div>

          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="createGroupModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{newGroup.isEdit ? $t('edit') : $t('users_groups.create_group')}}
              <span v-if="newGroup.isEdit">{{newGroup.key}}</span>
            </h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="newGroup.isEdit ? editGroup(newGroup) : addGroup(newGroup)">

            <div class="modal-body">
              <div :class="['form-group', newGroup.errorProps['key'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.name')}}</label>
                <div class="col-sm-5">
                  <input :disabled="newGroup.isEdit" required type="text" v-model="newGroup.key" class="form-control">
                  <span v-if="newGroup.errorProps['key']" class="help-block">{{newGroup.errorProps['key']}}</span>
                </div>
                <div class="col-sm-4">
                  <input :disabled="true" type="text" v-model="groups.domain" class="form-control">
                </div>
              </div>
              <div :class="['form-group', newGroup.errorProps['members'] ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.users')}}</label>
                <div class="col-sm-9">
                  <select @change="addUserToGroup(newGroup.selectedUser)" v-model="newGroup.selectedUser" class="combobox form-control">
                    <option></option>
                    <option :value="ku" v-for="(u, ku) in users.list" v-bind:key="ku">{{ku}} - {{u.gecos}}</option>
                  </select>
                  <span v-if="newGroup.errorProps['members']" class="help-block">{{newGroup.errorProps['members']}}</span>
                </div>
              </div>
              <div v-if="newGroup.loadMembers" class="form-group">
                <div class="col-sm-12">
                  <div class="spinner"></div>
                </div>
              </div>
              <div v-for="(u,i) in newGroup.members" v-bind:key="i" class="form-group">
                <label class="col-xs-12 col-sm-3 control-label" for="textInput-modal-markup"></label>
                <div class="col-xs-7 col-sm-6">
                  <input type="text" :value="u" class="form-control">
                </div>
                <div class="col-xs-5 col-sm-2">
                  <button @click="removeUserFromGroup()" class="btn btn-default" type="button">
                    <span class="fa fa-minus card-icon-def"></span>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{newGroup.isEdit ? $t('edit') : $t('create')}}</button>
            </div>

          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="deleteModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{toDelete.isGroup ? $t('users_groups.delete_group') : $t('users_groups.delete_user')}} {{toDelete.key}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="toDelete.isGroup ? deleteGroup(toDelete) : deleteUser(toDelete)">

            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-danger" type="submit">{{$t('delete')}}</button>
            </div>

          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="changeProviderModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('users_groups.change_provider')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="uninstallProvider()">

            <div class="modal-body">
              <div class="alert alert-warning alert-dismissable">
                <span class="pficon pficon-warning-triangle-o"></span>
                <strong>{{$t('users_groups.caution')}}</strong>. {{$t('users_groups.warning_provider')}}.
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-danger" type="submit">{{$t('remove')}}</button>
            </div>

          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="accountProviderWizard" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog modal-lg wizard-pf">
        <div class="modal-content">
          <div class="modal-header">
            <dt class="modal-title">{{$t('users_groups.configure_account_provider')}}</dt>
          </div>
          <div class="modal-body wizard-pf-body clearfix">
            <div class="wizard-pf-steps">
              <ul class="wizard-pf-steps-indicator">

                <li :class="['wizard-pf-step', currentStep == 1 ? 'active' : '']" data-tabgroup="1">
                  <a>
                    <span class="wizard-pf-step-number">1</span>
                    <span class="wizard-pf-step-title">{{$t('users_groups.account_provider')}}</span>
                  </a>
                </li>

                <li :class="['wizard-pf-step', currentStep == 2 ? 'active' : '']" data-tabgroup="2">
                  <a>
                    <span class="wizard-pf-step-number">2</span>
                    <span class="wizard-pf-step-title">{{$t('users_groups.local_or_remote_bind')}}</span>
                  </a>
                </li>

                <li :class="['wizard-pf-step', currentStep == 3 ? 'active' : '']" data-tabgroup="3">
                  <a>
                    <span class="wizard-pf-step-number">3</span>
                    <span class="wizard-pf-step-title">{{$t('users_groups.install')}}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div class="wizard-pf-row">
              <div class="wizard-pf-sidebar">
                <ul :class="['list-group', currentStep == 1 ? '' : 'hidden']">
                  <li class="list-group-item active">
                    <a>
                      <span class="wizard-pf-substep-number">1</span>
                      <span class="wizard-pf-substep-title">{{$t('users_groups.provider')}}</span>
                    </a>
                  </li>
                </ul>
                <ul :class="['list-group', currentStep == 2 ? '' : 'hidden']">
                  <li class="list-group-item active">
                    <a>
                      <span class="wizard-pf-substep-number">2</span>
                      <span class="wizard-pf-substep-title">{{$t('users_groups.bind')}}</span>
                    </a>
                  </li>
                </ul>
                <ul :class="['list-group', currentStep == 3 ? '' : 'hidden']">
                  <li class="list-group-item active">
                    <a>
                      <span class="wizard-pf-substep-number">3</span>
                      <span class="wizard-pf-substep-title">{{$t('users_groups.install')}}</span>
                    </a>
                  </li>
                </ul>
              </div>
              <!-- /.wizard-pf-sidebar -->
              <div class="wizard-pf-main">
                <div :class="['wizard-pf-contents', currentStep == 1 ? '' : 'hidden']">
                  <div class="blank-slate-pf " id="">
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-users"></span>
                    </div>
                    <h1>
                      {{$t('users_groups.no_account_provider_configured')}}
                    </h1>
                    <p>
                      {{$t('users_groups.description_provider')}}
                    </p>
                    <strong>{{$t('users_groups.choose_account_provider')}}:</strong>
                    <div class="blank-slate-pf-main-action">
                      <div @click="selectProvider('ldap')" :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseProvider == 'ldap' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id="">
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-database"></span>
                          </div>
                          <h1>
                            LDAP
                          </h1>
                          <p>
                            {{$t('users_groups.description_provider_2')}}
                          </p>
                        </div>
                      </div>
                      <div @click="selectProvider('ad')" :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseProvider == 'ad' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id="">
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-folder-open"></span>
                          </div>
                          <h1>
                            Active Directory
                          </h1>
                          <p>
                            {{$t('users_groups.description_provider_3')}}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div :class="['wizard-pf-contents', currentStep == 2 ? '' : 'hidden']">
                  <div v-if="users.provider == null && users.chooseProvider == 'ldap'" class="blank-slate-pf " id="">
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-database"></span>
                    </div>
                    <h1>
                      {{$t('users_groups.you_choose')}}:
                      <strong>LDAP</strong>
                    </h1>
                    <p>
                      {{$t('users_groups.ldap_description')}}
                    </p>
                    <strong>{{$t('users_groups.choose_bind_method')}}:</strong>
                    <div class="blank-slate-pf-main-action">
                      <div @click="selectBind('remote')" :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseBind == 'remote' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id="">
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-cloud"></span>
                          </div>
                          <h1>
                            {{$t('users_groups.bind_remote_ldap')}}
                          </h1>
                        </div>
                      </div>
                      <div @click="selectBind('local')" :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseBind == 'local' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id="">
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-download"></span>
                          </div>
                          <h1>
                            {{$t('users_groups.install_local_ldap')}}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div v-if="users.provider == null && users.chooseProvider == 'ad'" class="blank-slate-pf " id="">
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-folder-open"></span>
                    </div>
                    <h1>
                      {{$t('users_groups.you_choose')}}:
                      <strong>Active Directory</strong>
                    </h1>
                    <p>
                      {{$t('users_groups.dc_description')}}:
                    </p>
                    <strong>{{$t('users_groups.choose_bind_method')}}:</strong>
                    <div class="blank-slate-pf-main-action">
                      <div @click="selectBind('remote')" :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseBind == 'remote' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id="">
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-graduation-cap"></span>
                          </div>
                          <h1>
                            {{$t('users_groups.join_existing_dc')}}
                          </h1>
                        </div>
                      </div>
                      <div @click="selectBind('local')" :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseBind == 'local' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id="">
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-magic"></span>
                          </div>
                          <h1>
                            {{$t('users_groups.create_new_domain_became_dc')}}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div :class="['wizard-pf-contents', currentStep == 3 ? '' : 'hidden']">
                  <!-- Local LDAP-->
                  <div v-if="users.provider == null && users.chooseProvider == 'ldap' && users.chooseBind == 'local'">
                    <h3 class="wizard-pf-contents-title">{{$t('users_groups.install_local_ldap')}}</h3>
                    <form class="form-horizontal" v-on:submit.prevent="installLDAP()">
                      <div class="modal-body">
                        <p>{{$t('users_groups.description_provider_4')}}</p>
                      </div>
                    </form>
                  </div>
                  <!-- Remote LDAP-->
                  <div v-if="users.provider == null && users.chooseProvider == 'ldap' && users.chooseBind == 'remote'">
                    <h3 class="wizard-pf-contents-title">{{$t('users_groups.bind_remote_ldap')}}</h3>
                    <form class="form-horizontal" v-on:submit.prevent="checkLdapConfig(newProvider)">
                      <div class="modal-body">
                        <div v-if="newProvider.probeError" class="alert alert-danger alert-dismissable">
                          <span class="pficon pficon-error-circle-o"></span>
                          <strong>{{$t('error')}}.</strong> {{$t('users_groups.configuration_invalid')}}.
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.hostname_or_ip')}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="newProvider.hostname" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.port')}}</label>
                          <div class="col-sm-9">
                            <input type="text" placeholder="389" v-model="newProvider.tcpport" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.configuration')}}</label>
                          <div class="col-sm-2">
                            <button type="submit" class="btn btn-primary">{{$t('users_groups.check')}}</button>
                          </div>
                          <div v-if="newProvider.isChecking" class="col-sm-1">
                            <div class="spinner"></div>
                          </div>
                        </div>

                        <div v-if="!((newProvider.info.BindType == 'anonymous' && k=='BindPassword') || (newProvider.info.BindType == 'anonymous' && k=='BindDN'))"
                          v-for="(v,k) in newProvider.info" v-bind:key="k" class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{k}}</label>
                          <div class="col-sm-9">
                            <input v-if="!(k == 'StartTls' || k == 'BindType')" type="text" :value="v" @change="updateValues(k,v)" class="form-control">

                            <input v-if="k == 'StartTls'" type="checkbox" :value="v" ng-checked="v == 'enabled'" @click="changeStartTLS(v)">

                            <span v-if="k == 'BindType'">{{$t('users_groups.authenticated')}}</span>
                            <input v-if="k == 'BindType'" type="radio" v-model="newProvider.info.BindType" value="authenticated" class="span-right-margin-lg">

                            <span v-if="k == 'BindType'">{{$t('users_groups.anonymous')}}</span>
                            <input v-if="k == 'BindType'" type="radio" v-model="newProvider.info.BindType" value="anonymous">
                          </div>
                        </div>

                      </div>
                    </form>
                  </div>

                  <!-- Local AD-->
                  <div v-if="users.provider == null && users.chooseProvider == 'ad' && users.chooseBind == 'local'">
                    <h3 class="wizard-pf-contents-title">{{$t('users_groups.became_dc')}}</h3>
                    <form class="form-horizontal">
                      <div class="modal-body">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.domain_name')}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="newProvider.Realm" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.netbios_domain_name')}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="newProvider.Workgroup" class="form-control">
                          </div>
                        </div>
                        <div class="alert alert-warning alert-dismissable">
                          <span class="pficon pficon-warning-triangle-o"></span>
                          <strong>{{$t('users_groups.ip_warning_message_1')}}</strong>
                          <ul>
                            <li>{{$t('users_groups.ip_warning_message_2')}}</li>
                            <li>{{$t('users_groups.ip_warning_message_3')}}</li>
                          </ul>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.dc_ip_address')}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="newProvider.IpAddress" class="form-control">
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <!-- Remote AD-->
                  <div v-if="users.provider == null && users.chooseProvider == 'ad' && users.chooseBind == 'remote'">
                    <h3 class="wizard-pf-contents-title">{{$t('users_groups.join_active_directory')}}</h3>
                    <form class="form-horizontal">
                      <div class="modal-body">
                        <div v-if="newProvider.probeError || newProvider.joinError" class="alert alert-danger alert-dismissable">
                          <span class="pficon pficon-error-circle-o"></span>
                          <strong>{{$t('error')}}.</strong> {{newProvider.probeErrorMessage || newProvider.joinErrorMessage}}. {{newProvider.probeErrorOMessage
                          || newProvider.joinErrorOMessage}}
                        </div>
                        <div v-if="!newProvider.isChecked" class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.domain_name')}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="newProvider.Realm" class="form-control">
                          </div>
                        </div>
                        <div v-if="newProvider.probeError" class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.ad_dns_server')}}</label>
                          <div class="col-sm-9">
                            <input type="text" v-model="newProvider.AdDns" class="form-control">
                          </div>
                        </div>
                        <div v-if="!newProvider.isChecked" class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.configuration')}}</label>
                          <div class="col-sm-2">
                            <button :disabled="newProvider.isChecking" type="button" @click="checkAdConfig(newProvider)" class="btn btn-primary">{{$t('users_groups.check')}}</button>
                          </div>
                          <div v-if="newProvider.isChecking" class="col-sm-1">
                            <div class="spinner"></div>
                          </div>
                        </div>
                        <p v-if="newProvider.info && newProvider.isChecked">{{$t('users_groups.credentials_to_join_domain')}}</p>
                        <div v-if="newProvider.info && newProvider.isChecked" class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.username')}}</label>
                          <div class="col-sm-9">
                            <input type="text" v-model="newProvider.info.BindDN" class="form-control">
                          </div>
                        </div>
                        <div v-if="newProvider.info && newProvider.isChecked" class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.password')}}</label>
                          <div class="col-sm-9">
                            <input type="password" v-model="newProvider.info.BindPassword" class="form-control">
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer wizard-pf-footer">
            <button @click="cancelWizard()" type="button" class="btn btn-default btn-cancel wizard-pf-cancel wizard-pf-dismiss">{{$t('cancel')}}</button>
            <button :disabled="currentStep == 1" @click="prevStep()" type="button" class="btn btn-default wizard-pf-back">
              <span class="i fa fa-angle-left"></span>
              {{$t('back')}}
            </button>
            <button :disabled="checkIfDisabled()" @click="nextStep()" type="button" class="btn btn-primary wizard-pf-next">
              {{$t('next')}}
              <span class="i fa fa-angle-right"></span>
            </button>
            <button type="button" class="btn btn-primary hidden wizard-pf-finish">
              {{$t('users_groups.install')}}
              <span class="i fa fa-angle-right"></span>
            </button>
            <button type="button" class="btn btn-primary hidden wizard-pf-close wizard-pf-dismiss">{{$t('close')}}</button>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "UsersGroups",
    beforeRouteLeave (to, from, next) {
      $("#accountProviderWizard").modal("hide");
      next();
    },
    mounted() {
      this.getInfo();
    },
    data() {
      return {
        searchString: "",
        currentSearchFilter: "user",
        availableSearchFilter: {
          user: "Users",
          group: "Groups"
        },
        users: {
          list: {},
          domain: "@",
          provider: null,
          chooseProvider: null,
          chooseBind: null,
          providerInfo: {
            a: "a",
            b: "b",
            c: "c"
          }
        },
        groups: {
          domain: "@",
          list: {}
        },
        newUser: this.initUser(),
        newGroup: this.initGroup(),
        toDelete: {},
        newProvider: {},
        currentStep: 1
      };
    },
    methods: {
      selectProvider(provider) {
        this.users.chooseProvider = provider;
        this.users.chooseBind = null;
        this.newProvider = {};
      },

      selectBind(bind) {
        this.users.chooseBind = bind;
        this.newProvider = {};
        this.getAdDefault();
      },

      checkIfDisabled() {
        if (this.currentStep == 1) {
          if (this.users.chooseProvider == null) {
            return true;
          } else {
            return false;
          }
        }

        if (this.currentStep == 2) {
          if (this.users.chooseBind == null) {
            return true;
          } else {
            return false;
          }
        }

        if (this.currentStep == 3) {
          if (
            this.users.chooseProvider == "ldap" &&
            this.users.chooseBind == "local"
          ) {
            return false;
          }
          if (
            this.users.chooseProvider == "ldap" &&
            this.users.chooseBind == "remote"
          ) {
            if (this.newProvider.info && !this.newProvider.probeError) {
              return false;
            } else {
              return true;
            }
          }
          if (
            this.users.chooseProvider == "ad" &&
            this.users.chooseBind == "local"
          ) {
            if (
              this.newProvider.Realm.length > 0 &&
              this.newProvider.Workgroup.length > 0 &&
              this.newProvider.IpAddress.length > 0
            ) {
              return false;
            } else {
              return true;
            }
          }
          if (
            this.users.chooseProvider == "ad" &&
            this.users.chooseBind == "remote"
          ) {
            if (
              this.newProvider.info &&
              !this.newProvider.probeError &&
              this.newProvider.info.BindPassword &&
              this.newProvider.info.BindPassword.length > 0
            ) {
              return false;
            } else {
              return true;
            }
          }
        }
      },

      nextStep() {
        if (this.currentStep == 3) {
          if (
            this.users.chooseProvider == "ldap" &&
            this.users.chooseBind == "local"
          ) {
            this.installLDAP();
          }
          if (
            this.users.chooseProvider == "ldap" &&
            this.users.chooseBind == "remote"
          ) {
            this.bindToRemoteLdap(this.newProvider);
          }
          if (
            this.users.chooseProvider == "ad" &&
            this.users.chooseBind == "local"
          ) {
            this.createDC(this.newProvider);
          }
          if (
            this.users.chooseProvider == "ad" &&
            this.users.chooseBind == "remote"
          ) {
            this.joinADomain(this.newProvider);
          }
        } else {
          this.currentStep++;
        }
      },

      prevStep() {
        this.currentStep--;
      },

      switchFilterSearch(filter) {
        this.currentSearchFilter = filter;
      },

      groupAlreadyAdded(group) {
        return this.newUser.groups.indexOf(group) > -1;
      },

      userAlreadyAdded(user) {
        return this.newGroup.members.indexOf(user) > -1;
      },

      cancelWizard() {
        $("#accountProviderWizard").modal("hide");
        this.$router.push("/");
      },

      cleanUserErrors() {
        delete this.newUser.errorMessage;
        delete this.newUser.errorProps;
        delete this.newUser.onTaskRunning;
      },

      cleanGroupErrors() {
        delete this.newGroup.errorMessage;
        delete this.newGroup.errorProps;
        delete this.newGroup.onTaskRunning;
      },

      initUser() {
        return {
          selectedGroup: null,
          groups: [],
          password: "",
          isPassGenerated: false,
          confirmPassword: false,
          passwordStrength: 0,
          errorProps: {},
          isEdit: false,
          key: "",
          expires: false,
          shell: false
        };
      },
      initGroup() {
        return {
          selectedUser: null,
          members: [],
          loadMembers: false,
          users: [],
          isEdit: false,
          key: "",
          errorProps: {}
        };
      },

      getInfo() {
        $("#accountProviderWizard").modal("show");
        /* nethserver.system.provider.getInfo().then(function (provider) {
            this.users.provider = provider.isAD ? 'ad' : provider.isLdap ? 'ldap' : null;
            this.users.providerInfo = provider;

            if (this.users.provider) {
              $scope.getUsers();
              $scope.getGroups();
            } else {
              $('#accountProviderWizard').modal('show');
            }
            $scope.$apply();
          }, function (err) {
            console.error(err);
          }); */
      },

      getAdDefault() {
        /*  nethserver.system.provider.getAdDefault().then(function (defaults) {
             this.newProvider.Realm = defaults.Realm;
             this.newProvider.Workgroup = defaults.Workgroup;
             this.newProvider.IpAddress = "";
             $scope.$apply();
           }, function (err) {
             console.error(err);
           }); */
      },

      getUsers() {
        /* nethserver.system.users.getUsers().then(function (users) {
            this.users.list = users;
            $scope.view.isLoaded = true;
            $scope.$apply();
          }, function (err) {
            console.error(err);
          }); */
      },

      getGroups() {
        /* nethserver.system.users.getGroups().then(function (groups) {
            this.groups.list = groups;
            $scope.$apply();
          }, function (err) {
            console.error(err);
          }); */
      },

      addGroupToUser(group) {
        if (group.length > 0) {
          if (!this.groupAlreadyAdded(group)) {
            this.newUser.groups.push(group);
          }
        }
      },

      removeGroupFromUser(index) {
        this.newUser.groups.splice(index, 1);
      },

      addUserToGroup(user) {
        if (user.length > 0) {
          if (!this.userAlreadyAdded(user)) {
            this.newGroup.members.push(user);
          }
        }
      },

      removeUserFromGroup(index) {
        this.newGroup.members.splice(index, 1);
      },

      generatePassword() {
        this.newUser.isPassGenerated = true;
        /* nethserver.system.users.mkpasswd().then(function (password) {
            this.newUser.password = password.trim();
            this.newUser.confirmPassword = password.trim();
            $scope.$apply();
          }, function (err) {
            console.error(err);
          }); */
      },

      openCreateUser() {
        this.newUser = this.initUser();
        $("#createUserModal").modal("show");
      },

      createUser(user) {
        user.expires = user.expires ? "yes" : "no";
        user.shell = user.shell ?
          "/bin/bash" :
          "/usr/libexec/openssh/sftp-server";
        this.cleanUserErrors();
        /* nethserver.system.users.addUser(user).then(function () {
            $('#createUserModal').modal('hide');
          }, function (err) {
            console.error(err);
            this.newUser.errorMessage = err.message;
            this.newUser.errorProps = err.attributes;
            $scope.$apply();
          }); */
      },

      openEditUser(ku, user) {
        this.newUser = user;
        this.newUser.key = ku;
        this.newUser.isEdit = true;
        this.newUser.isPassEdit = false;
        this.newUser.loadGroups = true;
        this.newUser.expires =
          this.newUser.expires == true || this.newUser.expires == "yes" ?
          true :
          false;
        this.newUser.shell =
          this.newUser.shell == true || this.newUser.shell == "/bin/bash" ?
          true :
          false;
        /* nethserver.system.users.getUserMembership(ku).then(function (groups) {
            this.newUser.groups = groups;
            this.newUser.loadGroups = false;
            $scope.$apply();
          }, function (err) {
            console.error(err);
            this.newUser.loadGroups = false;
          }); */
        $("#createUserModal").modal("show");
      },

      editUser(user) {
        user.expires = user.expires ? "yes" : "no";
        user.shell = user.shell ?
          "/bin/bash" :
          "/usr/libexec/openssh/sftp-server";
        this.cleanUserErrors();
        /* nethserver.system.users.editUser(user).then(function () {
            $('#createUserModal').modal('hide');
            $scope.$apply();
          }, function (err) {
            console.error(err);
            this.newUser.errorMessage = err.message;
            this.newUser.errorProps = err.attributes;
            $scope.$apply();
          }); */
      },

      openChangePassword(ku, user) {
        this.newUser = user;
        this.newUser.key = ku;
        this.newUser.isEdit = true;
        this.newUser.isPassEdit = true;
        $("#createUserModal").modal("show");
      },

      changePassword(user) {
        this.cleanUserErrors();
        /* nethserver.system.users.setPassword(user.key, user.password).then(function () {
            $('#createUserModal').modal('hide');
            $scope.$apply();
          }, function (err) {
            console.error(err);
            this.newUser.errorMessage = err.message;
            this.newUser.errorProps = err.attributes;
            $scope.$apply();
          }); */
      },

      openDeleteUser(ku, toDelete) {
        this.toDelete = toDelete;
        this.toDelete.isGroup = false;
        this.toDelete.key = ku;
        $("#deleteModal").modal("show");
      },

      deleteUser(user) {
        this.cleanUserErrors();
        /* nethserver.system.users.deleteUser(user.key).then(function () {
            $('#deleteModal').modal('hide');
          }, function (err) {
            console.error(err);
          }); */
      },

      openCreateGroup() {
        this.newGroup = this.initGroup();
        $("#createGroupModal").modal("show");
      },

      addGroup(group) {
        this.cleanGroupErrors();
        /* nethserver.system.users.addGroup(group).then(function () {
            $('#createGroupModal').modal('hide');
          }, function (err) {
            console.error(err);
            this.newGroup.errorMessage = err.message;
            this.newGroup.errorProps = err.attributes;
            $scope.$apply();
          }); */
      },

      openEditGroup(kg, group) {
        this.newGroup = group;
        this.newGroup.key = kg;
        this.newGroup.isEdit = true;
        this.newGroup.loadMembers = true;
        /* nethserver.system.users.getGroupMembers(kg).then(function (members) {
            this.newGroup.members = members;
            this.newGroup.loadMembers = false;
            $scope.$apply();
          }, function (err) {
            console.error(err);
            this.newGroup.loadMembers = false;
          }); */
        $("#createGroupModal").modal("show");
      },

      editGroup(group) {
        this.cleanGroupErrors();
        /* nethserver.system.users.editGroup(group).then(function () {
            $('#createGroupModal').modal('hide');
          }, function (err) {
            console.error(err);
            this.newGroup.errorMessage = err.message;
            this.newGroup.errorProps = err.attributes;
            $scope.$apply();
          }); */
      },

      openDeleteGroup(kg, toDelete) {
        this.toDelete = toDelete;
        this.toDelete.isGroup = true;
        this.toDelete.key = kg;
        $("#deleteModal").modal("show");
      },

      deleteGroup(group) {
        this.cleanGroupErrors();
        /* nethserver.system.users.deleteGroup(group.key).then(function () {
            $('#deleteModal').modal('hide');
          }, function (err) {
            console.error(err);
          }); */
      },

      updateValues(k, v) {
        this.newProvider.info[k] = v;
      },

      uninstallProvider() {
        /* nethserver.system.provider.uninstall().then(function () {
            $('#changeProviderModal').modal('hide');
            this.users.provider = null;
            this.users.chooseProvider = null;
            this.users.chooseBind = null;
            this.users.providerInfo = {};
            this.currentStep = 1;
            $scope.$apply();
          }, function (err) {
            console.error(err);
          }); */
      },

      bindToRemoteLdap(newProvider) {
        /* nethserver.system.provider.bindToRemoteLdap(newProvider.info).then(function () {
            $('#accountProviderWizard').modal('hide');
          }, function (err) {
            console.error(err);
          }); */
      },

      changeBindType(v) {
        this.newProvider.info.BindType = v ? "authenticated" : "anonymous";
      },

      changeStartTLS(v) {
        this.newProvider.info.StartTls = v ? "enabled" : "disabled";
      },

      checkLdapConfig(newProvider) {
        this.newProvider.isChecking = true;
        this.newProvider.info = {};
        /* nethserver.system.provider.probeLdap(newProvider.hostname, newProvider.tcpport).then(function (info) {
            this.newProvider.info = info;
            this.newProvider.probeError = false;
            this.newProvider.isChecking = false;
            $scope.$apply();
          }, function (err) {
            console.error(err);
            this.newProvider.probeError = true;
            this.newProvider.isChecking = false;
            $scope.$apply();
          }); */
      },

      installLDAP() {
        /* nethserver.system.provider.installLocalLdap().then(function () {
            $('#accountProviderWizard').modal('hide');
            $scope.$apply();
          }, function (err) {
            console.error(err);
          }); */
      },

      checkAdConfig(newProvider) {
        this.newProvider.isChecking = true;
        this.newProvider.info = {};
        /* nethserver.system.provider.probeAd(newProvider.Realm, newProvider.AdDns).then(function (info) {
            this.newProvider.info = info;
            this.newProvider.probeError = false;
            this.newProvider.isChecking = false;
            this.newProvider.isChecked = true;
            $scope.$apply();
          }, function (err) {
            console.error(err);
            this.newProvider.probeError = true;
            this.newProvider.probeErrorMessage = err.message;
            this.newProvider.isChecking = false;
            this.newProvider.isChecked = false;
            $scope.$apply();
          }); */
      },

      joinADomain(newProvider) {
        newProvider.info.AdDns = newProvider.AdDns;
        /* nethserver.system.provider.joinDomain(newProvider.info).then(function () {
            $('#accountProviderWizard').modal('hide');
          }, function (err) {
            console.error(err);
            this.newProvider.probeError = false;
            this.newProvider.joinError = true;
            this.newProvider.joinErrorMessage = err.message;
            this.newProvider.joinErrorOMessage = err.originalMessage;
            $scope.$apply();
          }); */
      },

      createDC(newProvider) {
        /* nethserver.system.provider.installLocalAd(newProvider).then(function () {
            $('#accountProviderWizard').modal('hide');
          }, function (err) {
            console.error(err);
          }); */
      }
    }
  };

</script>

<style>

</style>
