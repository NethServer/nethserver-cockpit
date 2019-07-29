<template>
  <div v-if="view.isAuth">
    <h2>{{$t('users_groups.title')}}</h2>
    <doc-info
      :placement="'top'"
      :title="$t('docs.user_groups')"
      :chapter="'accounts'"
      :section="''"
      :inline="false"
    ></doc-info>

    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>

    <div v-if="view.isLoaded && users.provider !== null">
      <h3>{{$t('users_groups.account_provider')}}</h3>
      <div class="panel panel-default" id="provider-markup">
        <div class="panel-heading">
          <button
            id="change-provider-btn"
            data-toggle="modal"
            data-target="#changeProviderModal"
            class="btn btn-primary"
          >{{$t('users_groups.change_provider')}}</button>
          <span class="panel-title">
            {{$t('users_groups.'+(users.providerInfo.IsLocal ? 'local_' : 'remote_'
            )+users.provider)}}
          </span>
          <span
            class="provider-details margin-left-md"
            data-toggle="collapse"
            data-parent="#provider-markup"
            href="#providerDetails"
            @click="toggleDetails()"
          >
            <span :class="['fa', view.opened ? 'fa-angle-down' : 'fa-angle-right']"></span>
            {{$t('users_groups.details')}}
          </span>
        </div>
        <div id="providerDetails" class="panel-collapse collapse">
          <dl class="dl-horizontal details-container">
            <span
              v-if="!(k == 'isAD' || k == 'isLdap')"
              v-for="(v,k) in users.providerInfo"
              v-bind:key="k"
            >
              <dt
                v-if="k != 'oldIp' && k != 'newIp' && k != 'IsLocal' && k != 'NsdcIp'"
              >{{k | capitalize}}</dt>
              <dd
                v-if="k != 'oldIp' && k != 'newIp' && k != 'IsLocal' && k != 'NsdcIp'"
              >{{v | normalize(k)}}</dd>
              <dt
                v-if="k == 'NsdcIp' && users.provider.isAD && users.providerInfo.IsLocal"
              >{{k | capitalize}}</dt>
              <dd v-if="k == 'NsdcIp' && users.provider.isAD && users.providerInfo.IsLocal">
                <a data-toggle="modal" data-target="#nsdcIpChangeModal" href="#">{{v}}</a>
              </dd>
            </span>
          </dl>
        </div>
      </div>
      <div class="divider"></div>
    </div>

    <div v-if="view.isLoaded">
      <h3>{{$t('users_groups.password_policy')}}</h3>
      <div class="panel panel-default" id="provider-markup">
        <div class="panel-heading">
          <button
            id="change-provider-btn"
            @click="openPasswordPolicy()"
            class="btn btn-primary"
          >{{$t('users_groups.change_policy')}}</button>
          <span class="panel-title">
            <span>{{$t('users_groups.strong_password')}}</span>
            <span
              :class="['fa', passwordPolicy.Users == true || passwordPolicy.Users == 'yes' ? 'fa-check green' : 'fa-times red']"
            ></span>
            <span class="margin-left-md">{{$t('users_groups.expiration_password')}}</span>
            <span
              :class="['fa', passwordPolicy.PassExpires == true || passwordPolicy.PassExpires == 'yes' ? 'fa-check green' : 'fa-times red']"
            ></span>
          </span>
        </div>
      </div>
      <div class="divider"></div>
    </div>

    <div
      v-if="view.isLoaded && users.provider !== null && users.providerInfo.IsLocal"
      class="inline-block-div"
    >
      <h3>{{$t('actions')}}</h3>
      <div class="btn-group">
        <button
          v-if="currentSearchFilter == 'user'"
          @click="openCreateUser()"
          class="btn btn-primary btn-lg shutdown-privileged"
          data-action="restart"
          data-container="body"
        >{{$t('users_groups.create_user')}}</button>
        <button
          v-if="currentSearchFilter == 'group'"
          @click="openCreateGroup()"
          class="btn btn-primary btn-lg shutdown-privileged"
          data-action="restart"
          data-container="body"
        >{{$t('users_groups.create_group')}}</button>
        <button
          data-toggle="dropdown"
          class="btn btn-primary btn-lg dropdown-toggle shutdown-privileged"
        >
          <span class="caret"></span>
        </button>
        <ul role="menu" class="dropdown-menu pull-left">
          <li class="presentation">
            <a
              @click="openCreateUser()"
              role="menuitem"
              data-action="restart"
            >{{$t('users_groups.create_user')}}</a>
          </li>
          <li class="presentation">
            <a
              @click="openCreateGroup()"
              role="menuitem"
              data-action="restart"
            >{{$t('users_groups.create_group')}}</a>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="view.isLoaded && users.provider !== null">
      <h3>{{$t('list')}}</h3>
      <form role="form" class="search-pf has-button search">
        <div class="form-group has-clear toolbar-pf-filter">
          <label class="sr-only" for="filter">{{availableSearchFilter[currentSearchFilter]}}</label>
          <div class="input-group full-width">
            <div class="input-group-btn">
              <button
                type="button"
                class="btn btn-default btn-lg dropdown-toggle adjust-filter-search"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {{availableSearchFilter[currentSearchFilter]}}
                <span class="caret"></span>
              </button>
              <ul class="dropdown-menu">
                <li
                  v-for="(f, kf) in availableSearchFilter"
                  v-bind:key="kf"
                  :class="[currentSearchFilter == kf ? 'selected' : '']"
                >
                  <a @click="switchFilterSearch(kf)">{{f}}</a>
                </li>
              </ul>
            </div>
            <input
              v-focus
              v-model="searchString"
              type="text"
              class="form-control input-lg"
              id="filter"
              :placeholder="$t('users_groups.filter_by') +' '+ availableSearchFilter[currentSearchFilter] +'...'"
            >
          </div>
        </div>
      </form>

      <div class="list-group list-view-pf">
        <div
          v-if="currentSearchFilter == 'user'"
          v-for="(u, ku) in filteredUserList"
          v-bind:key="ku"
          class="list-group-item"
        >
          <div v-if="users.providerInfo.IsLocal" class="list-view-pf-actions">
            <button @click="openEditUser(ku, u)" class="btn btn-default">
              <span class="pficon pficon-edit span-right-margin"></span>
              {{$t('edit')}}
            </button>
            <div class="dropup pull-right dropdown-kebab-pf">
              <button
                class="btn btn-link dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
              >
                <span class="fa fa-ellipsis-v"></span>
              </button>
              <ul class="dropdown-menu dropdown-menu-right">
                <li>
                  <a @click="openChangePassword(ku, u)">
                    <span class="fa fa-key span-right-margin"></span>
                    {{$t('users_groups.change_password')}}
                  </a>
                </li>
                <li>
                  <a @click="toggleLock(ku, u)">
                    <span
                      :class="['pficon', !u.locked ? 'pficon-locked' : 'pficon-unlocked', 'span-right-margin']"
                    ></span>
                    {{!u.locked ? $t('users_groups.lock') : $t('users_groups.unlock')}}
                  </a>
                </li>
                <li role="separator" class="divider"></li>
                <li>
                  <a @click="openDeleteUser(ku, u)">
                    <span class="fa fa-times span-right-margin"></span>
                    {{$t('delete')}}
                  </a>
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
                <div class="list-group-item-heading">
                  <a
                    @click="users.providerInfo.IsLocal ? openEditUser(ku, u) : null"
                    :class="[u.locked == 1 ? 'disabled' : !users.providerInfo.IsLocal ? 'not-local-user' : '']"
                  >{{ku}}</a>
                </div>
                <div class="list-group-item-text">
                  <span
                    :class="[u.locked == 1 ? 'disabled' : !users.providerInfo.IsLocal ? 'not-local-user' : '']"
                  >{{u.gecos}}</span>
                </div>
                <div class="list-group-item-text">
                  <span :class="[u.expired ? 'fa fa-clock-o red' : 'fa fa-clock-o']"></span>
                  <span :class="[u.expired ? 'red' : '']">
                    {{u.expired ? $t('users_groups.expired') :
                    $t('users_groups.not_expired')}}
                  </span>
                </div>
              </div>
              <div class="list-view-pf-additional-info"></div>
            </div>
          </div>
        </div>

        <div
          v-if="currentSearchFilter == 'group'"
          v-for="(g, kg) in filteredGroupList"
          v-bind:key="kg"
          class="list-group-item"
        >
          <div v-if="users.providerInfo.IsLocal" class="list-view-pf-actions">
            <button @click="openEditGroup(kg, g)" class="btn btn-default">
              <span class="pficon pficon-edit span-right-margin"></span>
              {{$t('edit')}}
            </button>
            <div class="dropup pull-right dropdown-kebab-pf">
              <button
                class="btn btn-link dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="true"
              >
                <span class="fa fa-ellipsis-v"></span>
              </button>
              <ul class="dropdown-menu dropdown-menu-right">
                <li>
                  <a @click="openDeleteGroup(kg, g)">
                    <span class="fa fa-times span-right-margin"></span>
                    {{$t('delete')}}
                  </a>
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
                <div class="list-group-item-heading">
                  <a
                    @click="users.providerInfo.IsLocal ? openEditGroup(kg, g) : null"
                    :class="[!users.providerInfo.IsLocal ? 'not-local-user' : '']"
                  >{{kg}}</a>
                </div>
                <div class="list-group-item-text"></div>
              </div>
              <div class="list-view-pf-additional-info"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" id="createUserModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 v-if="!newUser.isPassEdit" class="modal-title">
              {{newUser.isEdit ? $t('edit') :
              $t('users_groups.create_user')}}
              <span>{{newUser.name}}</span>
            </h4>
            <h4 v-if="newUser.isPassEdit" class="modal-title">
              {{newUser.isPassEdit ?
              $t('users_groups.change_password_to') : $t('users_groups.create_user')}}
              <span>{{newUser.name}}</span>
            </h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="newUser.isEdit ? newUser.isPassEdit ? changePassword(newUser) : editUser(newUser) : createUser(newUser)"
          >
            <div class="modal-body">
              <div
                v-if="!newUser.isPassEdit"
                :class="['form-group', newUser.errorProps['name'] ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('users_groups.username')}}</label>
                <div class="col-sm-9">
                  <input
                    :disabled="newUser.isEdit"
                    required
                    type="text"
                    v-model="newUser.name"
                    class="form-control"
                  >
                  <span
                    v-if="newUser.errorProps['name']"
                    class="help-block"
                  >{{newUser.errorProps['name']}}</span>
                </div>
              </div>
              <div
                v-if="!newUser.isPassEdit"
                :class="['form-group', newUser.errorProps['gecos'] ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('users_groups.name')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="newUser.gecos" class="form-control">
                  <span
                    v-if="newUser.errorProps['gecos']"
                    class="help-block"
                  >{{newUser.errorProps['gecos']}}</span>
                </div>
              </div>
              <div
                v-if="!newUser.isPassEdit"
                :class="['form-group', newUser.errorProps['groups'] ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('users_groups.groups')}}</label>
                <div class="col-sm-9">
                  <select
                    @change="addGroupToUser(newUser.selectedGroup)"
                    v-model="newUser.selectedGroup"
                    class="combobox form-control"
                  >
                    <option>-</option>
                    <option :value="kg" v-for="(g, kg) in groups.list" v-bind:key="kg">{{kg}}</option>
                  </select>
                  <span
                    v-if="newUser.errorProps['groups']"
                    class="help-block"
                  >{{newUser.errorProps['groups']}}</span>
                </div>
              </div>
              <div v-if="newUser.loadGroups" class="form-group">
                <div class="col-sm-12">
                  <div class="spinner"></div>
                </div>
              </div>
              <div v-if="!newUser.isPassEdit" class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup"></label>
                <div class="col-sm-9">
                  <ul class="list-inline compact">
                    <li v-for="(g,i) in newUser.groups" v-bind:key="i">
                      <span class="label label-info">
                        {{g}}
                        <a @click="removeGroupFromUser(i)" class="remove-item-inline">
                          <span class="fa fa-times"></span>
                        </a>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div
                v-if="!(newUser.isEdit && !newUser.isPassEdit)"
                :class="['form-group', newUser.errorProps['newPassword'] ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('users_groups.password')}}</label>
                <div class="col-sm-7">
                  <input
                    tabindex="0"
                    required
                    :type="newUser.togglePass ? 'text' : 'password'"
                    v-model="newUser.newPassword"
                    class="form-control"
                  >
                  <span
                    v-if="newUser.errorProps['newPassword']"
                    class="help-block"
                  >{{newUser.errorProps['newPassword']}}</span>
                </div>
                <div class="col-sm-2 adjust-index">
                  <button tabindex="-1" @click="togglePass()" type="button" class="btn btn-primary">
                    <span :class="[!newUser.togglePass ? 'fa fa-eye' : 'fa fa-eye-slash']"></span>
                  </button>
                </div>
              </div>
              <div
                v-if="!(newUser.isEdit && !newUser.isPassEdit)"
                :class="['form-group mg-top-20', newUser.errorProps['confirmNewPassword'] ? 'has-error' : '']"
              >
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('users_groups.confirm_password')}}</label>
                <div class="col-sm-7">
                  <password-meter></password-meter>
                </div>
              </div>

              <legend
                v-if="!newUser.isPassEdit"
                class="fields-section-header-pf"
                aria-expanded="true"
              >
                <span
                  :class="['fa fa-angle-right field-section-toggle-pf', newUser.advanced ? 'fa-angle-down' : '']"
                ></span>
                <a
                  class="field-section-toggle-pf"
                  @click="toggleAdvancedMode()"
                >{{$t('advanced_mode')}}</a>
              </legend>

              <div v-if="!newUser.isPassEdit && newUser.advanced" class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="expires"
                >{{$t('users_groups.password_expiration')}}</label>
                <div class="col-sm-9">
                  <input
                    type="checkbox"
                    id="expires"
                    class="form-control"
                    v-model="newUser.expires"
                    :disabled="passwordPolicy.PassExpires == 'no'"
                  >
                </div>
              </div>
              <div v-if="!newUser.isPassEdit && newUser.advanced" class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="shell"
                >{{$t('users_groups.remote_shell')}}</label>
                <div class="col-sm-9">
                  <input type="checkbox" id="shell" class="form-control" v-model="newUser.shell">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div v-if="newUser.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button
                :disabled="!newUser.isEdit && !newUser.passwordStrength"
                class="btn btn-primary"
                type="submit"
              >
                {{newUser.isEdit
                ? newUser.isPassEdit ? $t('change') : $t('edit')
                : $t('create')}}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="createGroupModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{newGroup.isEdit ? $t('edit') : $t('users_groups.create_group')}}
              <span
                v-if="newGroup.isEdit"
              >{{newGroup.name}}</span>
            </h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="newGroup.isEdit ? editGroup(newGroup) : createGroup(newGroup)"
          >
            <div class="modal-body">
              <div :class="['form-group', newGroup.errorProps['name'] ? 'has-error' : '']">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('users_groups.name')}}</label>
                <div class="col-sm-9">
                  <input
                    :disabled="newGroup.isEdit"
                    required
                    type="text"
                    v-model="newGroup.name"
                    class="form-control"
                  >
                  <span
                    v-if="newGroup.errorProps['name']"
                    class="help-block"
                  >{{newGroup.errorProps['name']}}</span>
                </div>
              </div>
              <div :class="['form-group', newGroup.errorProps['members'] ? 'has-error' : '']">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('users_groups.users')}}</label>
                <div class="col-sm-9">
                  <select
                    @change="addUserToGroup(newGroup.selectedUser)"
                    v-model="newGroup.selectedUser"
                    class="combobox form-control"
                  >
                    <option>-</option>
                    <option
                      :value="ku"
                      v-for="(u, ku) in users.list"
                      v-bind:key="ku"
                    >{{ku}} - {{u.gecos}}</option>
                  </select>
                  <span
                    v-if="newGroup.errorProps['members']"
                    class="help-block"
                  >{{newGroup.errorProps['members']}}</span>
                </div>
              </div>
              <div v-if="newGroup.loadMembers" class="form-group">
                <div class="col-sm-12">
                  <div class="spinner"></div>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup"></label>
                <div class="col-sm-9">
                  <ul class="list-inline compact">
                    <li v-for="(u,i) in newGroup.members" v-bind:key="i">
                      <span class="label label-info">
                        {{u}}
                        <a @click="removeUserFromGroup(i)" class="remove-item-inline">
                          <span class="fa fa-times"></span>
                        </a>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-if="view.isRoot" class="advanced">
                <span>{{$t('users_groups.role_delegation')}}</span>
                <div class="divider divider-advanced"></div>
              </div>
              <div v-if="view.isRoot">
                <div class="alert alert-info alert-dismissable">
                  <span class="pficon pficon-info"></span>
                  <strong>{{$t('users_groups.define_authorization')}}.</strong>
                  {{$t('users_groups.define_authorization_description')}}.
                </div>
                <div :class="['form-group', newGroup.errorProps['members'] ? 'has-error' : '']">
                  <label
                    class="col-sm-3 control-label"
                    for="textInput-modal-markup"
                  >{{$t('users_groups.system_roles')}}</label>
                  <div class="col-sm-9">
                    <select
                      @change="addSystemToGroup(newGroup.selectedSystem)"
                      v-model="newGroup.selectedSystem"
                      class="combobox form-control"
                    >
                      <option>-</option>
                      <option
                        :value="value"
                        v-for="(value, vk) in roles.list.system"
                        v-bind:key="vk"
                      >{{$t('menu.'+value)}}</option>
                    </select>
                    <span
                      v-if="newGroup.errorProps['system']"
                      class="help-block"
                    >{{newGroup.errorProps['system']}}</span>
                  </div>
                </div>
                <div v-if="newGroup.loadMembers" class="form-group">
                  <div class="col-sm-12">
                    <div class="spinner"></div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label" for="textInput-modal-markup"></label>
                  <div class="col-sm-9">
                    <ul class="list-inline compact">
                      <li v-for="(u,i) in newGroup.system" v-bind:key="i">
                        <span class="label label-info">
                          {{$t('menu.'+u)}}
                          <a
                            @click="removeSystemFromGroup(i)"
                            class="remove-item-inline"
                          >
                            <span v-bind:class="[ roles.editable ? 'fa fa-times' : '']"></span>
                          </a>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div :class="['form-group', newGroup.errorProps['members'] ? 'has-error' : '']">
                  <label
                    class="col-sm-3 control-label"
                    for="textInput-modal-markup"
                  >{{$t('users_groups.applications_roles')}}</label>
                  <div class="col-sm-9">
                    <select
                      @change="addApplicationsToGroup(newGroup.selectedApp)"
                      v-model="newGroup.selectedApp"
                      class="combobox form-control"
                    >
                      <option>-</option>
                      <option v-for="(value,k) in roles.list.applications" :key="k">{{value}}</option>
                    </select>
                    <span
                      v-if="newGroup.errorProps['applications']"
                      class="help-block"
                    >{{newGroup.errorProps['applications']}}</span>
                  </div>
                </div>
                <div v-if="newGroup.loadMembers" class="form-group">
                  <div class="col-sm-12">
                    <div class="spinner"></div>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label" for="textInput-modal-markup"></label>
                  <div class="col-sm-9">
                    <ul class="list-inline compact">
                      <li v-for="(u,i) in newGroup.applications" v-bind:key="i">
                        <span class="label label-info">
                          {{u}}
                          <a
                            @click="removeApplicationsFromGroup(i)"
                            class="remove-item-inline"
                          >
                            <span v-bind:class="[ roles.editable ? 'fa fa-times' : '']"></span>
                          </a>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <div v-if="newGroup.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button
                class="btn btn-primary"
                type="submit"
              >{{newGroup.isEdit ? $t('edit') : $t('create')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="deleteModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{toDelete.isGroup ? $t('users_groups.delete_group') :
              $t('users_groups.delete_user')}} {{toDelete.name}}
            </h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="toDelete.isGroup ? deleteGroup(toDelete) : deleteUser(toDelete)"
          >
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('are_you_sure')}}?</label>
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
                <strong>{{$t('users_groups.caution')}}</strong>
                : {{$t('users_groups.warning_provider')}}.
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('are_you_sure')}}?</label>
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

    <div class="modal" id="nsdcIpChangeModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('users_groups.change_nsdc_ip')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="changeNsdcIp()">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('users_groups.old_ip')}}</label>
                <div class="col-sm-9">
                  <input
                    disabled
                    type="text"
                    v-model="users.providerInfo.oldIp"
                    class="form-control"
                  >
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('users_groups.new_ip')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="users.providerInfo.newIp"
                    class="form-control"
                  >
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('change')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal" id="passwordPolicyModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('users_groups.change_password_policy')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="changePasswordPolicy()">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-6 control-label"
                  for="Users"
                >{{$t('users_groups.strong_password')}}</label>
                <div class="col-sm-6">
                  <input
                    type="checkbox"
                    id="Users"
                    v-model="passwordPolicy.Users"
                    class="form-control"
                  >
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-6 control-label"
                  for="PassExpires"
                >{{$t('users_groups.expiration_password')}}</label>
                <div class="col-sm-6">
                  <input
                    type="checkbox"
                    id="PassExpires"
                    v-model="passwordPolicy.PassExpires"
                    class="form-control"
                  >
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-6 control-label"
                  for="textInput-modal-markup"
                >{{$t('users_groups.min_pass_age')}}</label>
                <div class="col-sm-6">
                  <input
                    required
                    type="number"
                    min="0"
                    v-model="passwordPolicy.MinPassAge"
                    class="form-control"
                  >
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-6 control-label"
                  for="textInput-modal-markup"
                >{{$t('users_groups.max_pass_age')}}</label>
                <div class="col-sm-6">
                  <input
                    required
                    type="number"
                    min="0"
                    v-model="passwordPolicy.MaxPassAge"
                    class="form-control"
                  >
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('change')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div
      class="modal"
      id="accountProviderWizard"
      tabindex="-1"
      role="dialog"
      data-backdrop="static"
    >
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
                    <span class="wizard-pf-step-number no-cursor">1</span>
                    <span class="wizard-pf-step-title">{{$t('users_groups.account_provider')}}</span>
                  </a>
                </li>

                <li :class="['wizard-pf-step', currentStep == 2 ? 'active' : '']" data-tabgroup="2">
                  <a>
                    <span class="wizard-pf-step-number no-cursor">2</span>
                    <span class="wizard-pf-step-title">{{$t('users_groups.local_or_remote_bind')}}</span>
                  </a>
                </li>

                <li :class="['wizard-pf-step', currentStep == 3 ? 'active' : '']" data-tabgroup="3">
                  <a>
                    <span class="wizard-pf-step-number no-cursor">3</span>
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
                  <div class="blank-slate-pf" id>
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-users"></span>
                    </div>
                    <h1>{{$t('users_groups.no_account_provider_configured')}}</h1>
                    <p>{{$t('users_groups.description_provider')}}</p>

                    <div v-show="!users.hostname.valid">
                      <strong
                        class="display-inline-block review-li-wizard"
                      >{{$t('users_groups.set_valid_hostname')}}:</strong>
                      <form class="form-horizontal" v-on:submit.prevent="saveHostname()">
                        <div
                          :class="['form-group', users.hostname.errors.hasError ? 'has-error' : '']"
                        >
                          <div class="col-sm-3"></div>
                          <div class="col-sm-6">
                            <input
                              v-model="users.hostname.value"
                              required
                              class="form-control"
                              type="text"
                            >
                            <span v-if="users.hostname.errors.hasError" class="help-block">
                              {{$t('validation.validation_failed')}}:
                              {{$t('validation.'+users.hostname.errors.message)}}
                            </span>
                          </div>
                          <div class="col-sm-3 adjust-top-min">
                            <button class="btn btn-primary" type="submit">{{$t('modify')}}</button>
                          </div>
                        </div>
                      </form>
                    </div>

                    <strong>{{$t('users_groups.choose_account_provider')}}:</strong>
                    <div class="blank-slate-pf-main-action">
                      <div
                        @click="selectProvider('ldap')"
                        :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseProvider == 'ldap' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id>
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-database"></span>
                          </div>
                          <h1>LDAP</h1>
                          <p>{{$t('users_groups.description_provider_2')}}</p>
                        </div>
                      </div>
                      <div
                        @click="selectProvider('ad')"
                        :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseProvider == 'ad' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id>
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-folder-open"></span>
                          </div>
                          <h1>Active Directory</h1>
                          <p>{{$t('users_groups.description_provider_3')}}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div :class="['wizard-pf-contents', currentStep == 2 ? '' : 'hidden']">
                  <div
                    v-if="users.provider == null && users.chooseProvider == 'ldap'"
                    class="blank-slate-pf"
                    id
                  >
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-database"></span>
                    </div>
                    <h1>
                      {{$t('users_groups.you_choose')}}:
                      <strong>LDAP</strong>
                    </h1>
                    <p>{{$t('users_groups.ldap_description')}}</p>
                    <strong>{{$t('users_groups.choose_bind_method')}}:</strong>
                    <div class="blank-slate-pf-main-action">
                      <div
                        @click="selectBind('remote')"
                        :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseBind == 'remote' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id>
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-cloud"></span>
                          </div>
                          <h1>{{$t('users_groups.bind_remote_ldap')}}</h1>
                        </div>
                      </div>
                      <div
                        @click="selectBind('local')"
                        :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseBind == 'local' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id>
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-download"></span>
                          </div>
                          <h1>{{$t('users_groups.install_local_ldap')}}</h1>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="users.provider == null && users.chooseProvider == 'ad'"
                    class="blank-slate-pf"
                    id
                  >
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-folder-open"></span>
                    </div>
                    <h1>
                      {{$t('users_groups.you_choose')}}:
                      <strong>Active Directory</strong>
                    </h1>
                    <p>{{$t('users_groups.dc_description')}}:</p>
                    <strong>{{$t('users_groups.choose_bind_method')}}:</strong>
                    <div class="blank-slate-pf-main-action">
                      <div
                        @click="selectBind('remote')"
                        :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseBind == 'remote' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id>
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-graduation-cap"></span>
                          </div>
                          <h1>{{$t('users_groups.join_existing_dc')}}</h1>
                        </div>
                      </div>
                      <div
                        @click="selectBind('local')"
                        :class="['col-xs-12 col-sm-6 col-md-6 col-lg-6 card-pf', users.chooseBind == 'local' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-md white-background" id>
                          <div class="blank-slate-pf-icon">
                            <span class="fa fa-magic"></span>
                          </div>
                          <h1>{{$t('users_groups.create_new_domain_became_dc')}}</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div :class="['wizard-pf-contents', currentStep == 3 ? '' : 'hidden']">
                  <!-- Local LDAP-->
                  <div
                    v-if="users.provider == null && users.chooseProvider == 'ldap' && users.chooseBind == 'local'"
                  >
                    <h3 class="wizard-pf-contents-title">{{$t('users_groups.install_local_ldap')}}</h3>
                    <form
                      id="local-ldap"
                      class="form-horizontal"
                      v-on:submit.prevent="installLDAP()"
                    >
                      <div class="modal-body">
                        <p>{{$t('users_groups.description_provider_4')}}</p>
                      </div>
                    </form>
                  </div>
                  <!-- Remote LDAP-->
                  <div
                    v-if="users.provider == null && users.chooseProvider == 'ldap' && users.chooseBind == 'remote'"
                  >
                    <h3 class="wizard-pf-contents-title">{{$t('users_groups.bind_remote_ldap')}}</h3>
                    <form
                      id="remote-ldap"
                      class="form-horizontal"
                      v-on:submit.prevent="newProvider.isChecked ? bindToRemoteLdap('validate', newProvider) : checkLdapConfig(newProvider)"
                    >
                      <div class="modal-body">
                        <div
                          v-if="!newProvider.isChecking && newProvider.probeError"
                          class="alert alert-danger alert-dismissable"
                        >
                          <span class="pficon pficon-error-circle-o"></span>
                          <strong>{{$t('error')}}.</strong>
                          {{$t('users_groups.configuration_invalid')}}.
                        </div>
                        <div v-if="!newProvider.isChecked" class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('users_groups.hostname_or_ip')}}</label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="newProvider.hostname"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div v-if="!newProvider.isChecked" class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('users_groups.port')}}</label>
                          <div class="col-sm-9">
                            <input
                              type="text"
                              placeholder="389"
                              v-model="newProvider.tcpport"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <!-- <div v-if="!newProvider.isChecked" class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.configuration')}}</label>
                          <div class="col-sm-2">
                            <button :disabled="newProvider.isChecking" type="submit"
                              class="btn btn-primary">{{$t('users_groups.check')}}</button>
                          </div>
                          <div v-if="newProvider.isChecking" class="col-sm-1">
                            <div class="spinner"></div>
                          </div>
                        </div>-->
                        <div
                          v-if="newProvider.isChecked && k!='action' && k != 'NsdcIp' && k!='DiscoverDcType' && k!='port' && k!='IsLocal' && k!='isAD' && k!='isLdap' && k!='host' && k!='Provider' && !((newProvider.info.BindType == 'anonymous' && k=='BindPassword') || (newProvider.info.BindType == 'anonymous' && k=='BindDN'))"
                          v-for="(v,k) in newProvider.info"
                          v-bind:key="k"
                          class="form-group"
                        >
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{k | camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input
                              v-if="!(k == 'StartTls' || k == 'BindType')"
                              required
                              type="text"
                              v-model="newProvider.info[k]"
                              @change="updateValues(k,newProvider.info[k])"
                              class="form-control"
                            >

                            <input
                              v-if="k == 'StartTls'"
                              type="checkbox"
                              class="form-control"
                              :value="v == 'enabled'"
                              @click="changeStartTLS(v)"
                            >

                            <input
                              v-if="k == 'BindType'"
                              type="radio"
                              id="BindType-1"
                              v-model="newProvider.info.BindType"
                              value="authenticated"
                              @click="changeBindType('authenticated')"
                            >
                            <span
                              for="BindType-1"
                              class="span-right-margin-lg"
                              v-if="k == 'BindType'"
                            >{{$t('users_groups.authenticated')}}</span>

                            <input
                              v-if="k == 'BindType'"
                              type="radio"
                              id="BindType-2"
                              v-model="newProvider.info.BindType"
                              value="anonymous"
                              @click="changeBindType('anonymous')"
                            >
                            <span
                              for="BindType-2"
                              v-if="k == 'BindType'"
                            >{{$t('users_groups.anonymous')}}</span>
                          </div>
                        </div>
                        <div class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('users_groups.configuration')}}</label>
                          <div class="col-sm-2">
                            <button
                              :disabled="newProvider.isChecking"
                              type="submit"
                              class="btn btn-primary"
                            >{{$t('users_groups.check')}}</button>
                          </div>
                          <div v-if="newProvider.isChecking" class="col-sm-1">
                            <div class="spinner"></div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>

                  <!-- Local AD-->
                  <div
                    v-if="users.provider == null && users.chooseProvider == 'ad' && users.chooseBind == 'local'"
                  >
                    <h3 class="wizard-pf-contents-title">{{$t('users_groups.became_dc')}}</h3>
                    <form id="local-ad" class="form-horizontal">
                      <div class="modal-body">
                        <div
                          :class="['form-group', newProvider.errors.Realm.hasError ? 'has-error' : '']"
                        >
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('users_groups.domain_name')}}</label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="newProvider.Realm"
                              class="form-control"
                            >
                            <span v-if="newProvider.errors.Realm.hasError" class="help-block">
                              {{$t('validation.validation_failed')}}:
                              {{$t('validation.'+newProvider.errors.Realm.message)}}
                            </span>
                          </div>
                        </div>
                        <div
                          :class="['form-group', newProvider.errors.Workgroup.hasError ? 'has-error' : '']"
                        >
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('users_groups.netbios_domain_name')}}</label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="newProvider.Workgroup"
                              class="form-control"
                            >
                            <span v-if="newProvider.errors.Workgroup.hasError" class="help-block">
                              {{$t('validation.validation_failed')}}:
                              {{$t('validation.'+newProvider.errors.Workgroup.message)}}
                            </span>
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
                        <div
                          :class="['form-group', newProvider.errors.IpAddress.hasError ? 'has-error' : '']"
                        >
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('users_groups.dc_ip_address')}}</label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="newProvider.IpAddress"
                              class="form-control"
                            >
                            <span v-if="newProvider.errors.IpAddress.hasError" class="help-block">
                              {{$t('validation.validation_failed')}}:
                              {{$t('validation.'+newProvider.errors.IpAddress.message)}}
                            </span>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <!-- Remote AD-->
                  <div
                    v-if="users.provider == null && users.chooseProvider == 'ad' && users.chooseBind == 'remote'"
                  >
                    <h3
                      class="wizard-pf-contents-title"
                    >{{$t('users_groups.join_active_directory')}}</h3>
                    <form
                      id="remote-ad"
                      class="form-horizontal"
                      v-on:submit.prevent="newProvider.isChecked ? joinADomain('validate', newProvider) : checkAdConfig(newProvider)"
                    >
                      <div class="modal-body">
                        <div
                          v-if="!newProvider.isChecking && newProvider.probeError"
                          class="alert alert-danger alert-dismissable"
                        >
                          <span class="pficon pficon-error-circle-o"></span>
                          <strong>{{$t('error')}}.</strong>
                          {{$t('users_groups.no_realm_found')}}
                        </div>
                        <div
                          v-if="!newProvider.isChecking && newProvider.joinError"
                          class="alert alert-danger alert-dismissable"
                        >
                          <span class="pficon pficon-error-circle-o"></span>
                          <strong>{{$t('error')}}.</strong>
                          {{$t('users_groups.join_error')}}
                        </div>
                        <div v-if="!newProvider.isChecked" class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('users_groups.domain_name')}}</label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="newProvider.Realm"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div
                          v-if="!newProvider.isChecked && newProvider.probeError"
                          class="form-group"
                        >
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('users_groups.ad_dns_server')}}</label>
                          <div class="col-sm-9">
                            <input type="text" v-model="newProvider.AdDns" class="form-control">
                          </div>
                        </div>
                        <!-- <div v-if="!newProvider.isChecked" class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('users_groups.configuration')}}</label>
                          <div class="col-sm-2">
                            <button :disabled="newProvider.isChecking" type="submit" class="btn btn-primary">{{$t('users_groups.check')}}</button>
                          </div>
                          <div v-if="newProvider.isChecking" class="col-sm-1">
                            <div class="spinner"></div>
                          </div>
                        </div>-->
                        <p
                          v-if="newProvider.info && newProvider.isChecked"
                        >{{$t('users_groups.credentials_to_join_domain')}}</p>
                        <div v-if="newProvider.info && newProvider.isChecked" class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('users_groups.username')}}</label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="newProvider.info.BindDN"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div v-if="newProvider.info && newProvider.isChecked" class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('users_groups.password')}}</label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="password"
                              v-model="newProvider.info.BindPassword"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('users_groups.configuration')}}</label>
                          <div class="col-sm-2">
                            <button
                              :disabled="newProvider.isChecking"
                              type="submit"
                              class="btn btn-primary"
                            >{{$t('users_groups.check')}}</button>
                          </div>
                          <div v-if="newProvider.isChecking" class="col-sm-1">
                            <div class="spinner"></div>
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
            <div v-if="newProvider.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
            <button
              @click="cancelWizard()"
              type="button"
              class="btn btn-default btn-cancel wizard-pf-cancel wizard-pf-dismiss"
            >{{$t('cancel')}}</button>
            <button
              :disabled="currentStep == 1"
              @click="prevStep()"
              type="button"
              class="btn btn-default wizard-pf-back"
            >
              <span class="i fa fa-angle-left"></span>
              {{$t('back')}}
            </button>
            <button
              :disabled="checkIfDisabled()"
              @click="nextStep()"
              type="button"
              class="btn btn-primary wizard-pf-next"
            >
              {{$t('next')}}
              <span class="i fa fa-angle-right"></span>
            </button>
            <button type="button" class="btn btn-primary hidden wizard-pf-finish">
              {{$t('users_groups.install')}}
              <span class="i fa fa-angle-right"></span>
            </button>
            <button
              type="button"
              class="btn btn-primary hidden wizard-pf-close wizard-pf-dismiss"
            >{{$t('close')}}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PasswordMeter from "../../directives/PasswordMeter.vue";

export default {
  name: "UsersGroups",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.exec(
        ["system-authorization/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }

          if (success.system.indexOf(to.path.substring(1)) == -1) {
            window.location.hash = "#/";
            vm.$router.push("/");
          }

          vm.view.isAuth = true;
          vm.view.isRoot = success.status.isRoot == 1;
        },
        function(error) {
          console.error(error);
        },
        false
      );
    });
  },
  components: {
    PasswordMeter
  },
  beforeRouteLeave(to, from, next) {
    $(".modal").modal("hide");
    next();
  },
  mounted() {
    this.initGraphics();
    this.getInfo();
    this.getPasswordPolicy();
    this.getRoles();
  },
  computed: {
    filteredUserList() {
      var returnObj = {};
      for (var a in this.users.list) {
        if (a.toLowerCase().includes(this.searchString.toLowerCase())) {
          returnObj[a] = this.users.list[a];
        }
      }

      return returnObj;
    },
    filteredGroupList() {
      var returnObj = {};
      for (var a in this.groups.list) {
        if (a.toLowerCase().includes(this.searchString.toLowerCase())) {
          returnObj[a] = this.groups.list[a];
        }
      }

      return returnObj;
    }
  },
  data() {
    return {
      view: {
        isLoaded: false,
        isAuth: false,
        isRoot: false,
        opened: false
      },
      searchString: "",
      currentSearchFilter: "user",
      availableSearchFilter: {
        user: "Users",
        group: "Groups"
      },
      roles: {
        list: {},
        editable: true
      },
      users: {
        list: {},
        provider: null,
        chooseProvider: null,
        chooseBind: null,
        providerInfo: {
          oldIp: "",
          newIp: ""
        },
        hostname: {
          valid: false,
          errors: {
            hasError: false,
            message: ""
          },
          value: "",
          isLoading: true
        }
      },
      groups: {
        list: {}
      },
      passwordPolicy: {},
      newUser: this.initUser(),
      newGroup: this.initGroup(),
      toDelete: {},
      newProvider: {
        errors: this.initProvidersErrors()
      },
      currentStep: 1
    };
  },
  methods: {
    initProvidersErrors() {
      return {
        IpAddress: {
          hasError: false,
          message: ""
        },
        Workgroup: {
          hasError: false,
          message: ""
        },
        Realm: {
          hasError: false,
          message: ""
        }
      };
    },
    toggleDetails() {
      this.view.opened = !this.view.opened;
    },
    toggleAdvancedMode() {
      this.newUser.advanced = !this.newUser.advanced;
      this.$forceUpdate();
    },
    initGraphics() {
      $("#app").css("background", "");
      $("#app").css("color", "");
    },
    selectProvider(provider) {
      this.users.chooseProvider = provider;
      this.users.chooseBind = null;
      this.newProvider = {
        errors: this.initProvidersErrors()
      };
    },

    selectBind(bind) {
      this.users.chooseBind = bind;
      this.newProvider = {
        errors: this.initProvidersErrors()
      };
      this.getAdDefault();
    },

    checkIfDisabled() {
      if (this.currentStep == 1) {
        if (this.users.chooseProvider == null || !this.users.hostname.valid) {
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
          if (this.newProvider.isValid) {
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
            this.newProvider.Realm &&
            this.newProvider.Realm.length > 0 &&
            this.newProvider.Workgroup &&
            this.newProvider.Workgroup.length > 0 &&
            this.newProvider.IpAddress &&
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
          if (this.newProvider.isValid) {
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
          this.bindToRemoteLdap("update", this.newProvider);
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
          this.joinADomain("update", this.newProvider);
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

    systemAlreadyAdded(index) {
      return this.newGroup.system.indexOf(index) > -1;
    },

    applicationsAlreadyAdded(index) {
      return this.newGroup.applications.indexOf(index) > -1;
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
        newPassword: "",
        confirmNewPassword: "",
        passwordStrength: false,
        togglePass: false,
        errorProps: {
          name: "",
          gecos: "",
          newPassword: "",
          confirmNewPassword: ""
        },
        isEdit: false,
        name: "",
        expires: false,
        shell: false,
        isLoading: false,
        canChangePassword: true,
        advanced: false
      };
    },

    initGroup() {
      return {
        selectedApp: null,
        selectedSystem: null,
        system: [],
        applications: [],
        selectedUser: null,
        members: [],
        loadMembers: false,
        isEdit: false,
        name: "",
        errorProps: {
          system: "",
          applications: "",
          name: "",
          members: ""
        },
        isLoading: false
      };
    },

    saveHostname() {
      var context = this;

      var hostnameObj = {
        hostname: context.users.hostname.value
      };

      context.users.hostname.errors.hasError = false;
      context.exec(
        ["system-hostname/validate"],
        hostnameObj,
        null,
        function(success) {
          // update values
          context.exec(
            ["system-hostname/update"],
            hostnameObj,
            function(stream) {
              console.info("hostname", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "users_groups.hostname_save_ok"
              );

              context.users.hostname.valid = true;
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "users_groups.hostname_save_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.users.hostname.errors.hasError = true;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.users.hostname.errors.hasError = true;
              context.users.hostname.errors.message = attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },

    getInfo() {
      var context = this;
      context.exec(
        ["system-accounts-provider/read"],
        {
          action: "dump"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }

          context.users.provider = success.isAD
            ? "ad"
            : success.isLdap
            ? "ldap"
            : null;
          context.users.providerInfo = success;
          context.users.providerInfo.oldIp = success["NsdcIp"];

          context.users.hostname.valid = success["ValidHostname"] == 1;

          if (context.users.provider == "ldap") {
            delete context.users.providerInfo.NsdcIp;
          }

          if (context.users.provider) {
            context.getUsers();
            context.getGroups();
          } else {
            $("#accountProviderWizard").modal("show");
          }
        },
        function(error) {
          console.error(error);
        }
      );
    },

    togglePass() {
      this.newUser.togglePass = !this.newUser.togglePass;
    },

    getPasswordPolicy() {
      var context = this;
      context.exec(
        ["system-password-policy/read"],
        null,
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.passwordPolicy = success.configuration.props;
        },
        function(error) {
          console.error(error);
        }
      );
    },

    openPasswordPolicy() {
      this.passwordPolicy.Users =
        this.passwordPolicy.Users == true || this.passwordPolicy.Users == "yes"
          ? true
          : false;
      this.passwordPolicy.PassExpires =
        this.passwordPolicy.PassExpires == true ||
        this.passwordPolicy.PassExpires == "yes"
          ? true
          : false;
      $("#passwordPolicyModal").modal("show");
    },

    changePasswordPolicy() {
      this.passwordPolicy.Users =
        this.passwordPolicy.Users == true ? "yes" : "no";
      this.passwordPolicy.PassExpires =
        this.passwordPolicy.PassExpires == true ? "yes" : "no";
      this.passwordPolicy.MinPassAge = parseInt(this.passwordPolicy.MinPassAge);
      this.passwordPolicy.MaxPassAge = parseInt(this.passwordPolicy.MaxPassAge);

      $("#passwordPolicyModal").modal("hide");

      var context = this;
      context.exec(
        ["system-password-policy/update"],
        {
          props: {
            PassExpires: context.passwordPolicy.PassExpires,
            MinPassAge: context.passwordPolicy.MinPassAge,
            MaxPassAge: context.passwordPolicy.MaxPassAge,
            Users: context.passwordPolicy.Users
          },
          name: "passwordstrength",
          type: "configuration"
        },
        function(stream) {
          console.info("password-policy", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "users_groups.password_policy_ok"
          );

          // get policy
          context.getPasswordPolicy();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "users_groups.password_policy_error"
          );
        }
      );
    },

    getAdDefault() {
      var context = this;
      context.exec(
        ["system-accounts-provider/read"],
        {
          action: "default-ad"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.newProvider.Realm = success.Realm;
          context.newProvider.Workgroup = success.Workgroup;
        },
        function(error) {
          console.error(error);
        }
      );
    },

    getRoles() {
      var context = this;
      context.view.isLoaded = false;
      context.exec(
        ["system-roles/read"],
        {
          action: "applications"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }

          context.roles.list.applications = success.applications;
          context.roles.list.system = success.system;
        },
        function(error) {
          console.error(error);
        }
      );
    },

    getUsers() {
      var context = this;
      context.view.isLoaded = false;
      context.exec(
        ["system-users/read"],
        {
          action: "list-users"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }

          context.view.isLoaded = true;
          context.users.list = success;
        },
        function(error) {
          console.error(error);
        }
      );
    },

    getGroups() {
      var context = this;
      context.view.isLoaded = false;
      context.exec(
        ["system-users/read"],
        {
          action: "list-groups"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }

          context.view.isLoaded = true;
          context.groups.list = success;
        },
        function(error) {
          console.error(error);
        }
      );
    },

    addGroupToUser(group) {
      if (group.length > 0 && group != "-") {
        if (!this.groupAlreadyAdded(group)) {
          this.newUser.groups.push(group);
        }
      }
    },

    removeGroupFromUser(index) {
      this.newUser.groups.splice(index, 1);
    },

    addUserToGroup(user) {
      if (user.length > 0 && user != "-") {
        if (!this.userAlreadyAdded(user)) {
          this.newGroup.members.push(user);
        }
      }
    },

    removeUserFromGroup(index) {
      this.newGroup.members.splice(index, 1);
    },

    addSystemToGroup(index) {
      if (index.length > 0 && index != "-") {
        if (!this.systemAlreadyAdded(index)) {
          this.newGroup.system.push(index);
        }
      }
    },

    removeSystemFromGroup(index) {
      this.newGroup.system.splice(index, 1);
    },

    addApplicationsToGroup(index) {
      if (index.length > 0 && index != "-") {
        if (!this.applicationsAlreadyAdded(index)) {
          this.newGroup.applications.push(index);
        }
      }
    },

    removeApplicationsFromGroup(index) {
      this.newGroup.applications.splice(index, 1);
    },

    openCreateUser() {
      this.newUser = this.initUser();
      $("#createUserModal").modal("show");
    },

    createUser(user) {
      var context = this;

      var userObj = {
        action: "user-create",
        name: user.name,
        groups: user.groups,
        gecos: user.gecos,
        expires: user.expires ? "yes" : "no",
        shell: user.shell ? "/bin/bash" : "/usr/libexec/openssh/sftp-server",
        newPassword: user.newPassword,
        confirmNewPassword: user.confirmNewPassword
      };

      // validate object
      context.newUser.isLoading = true;
      context.exec(
        ["system-users/validate"],
        userObj,
        null,
        function(success) {
          context.newUser.isLoading = false;
          $("#createUserModal").modal("hide");

          context.exec(
            ["system-users/create"],
            userObj,
            function(stream) {
              console.info("user-create", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "users_groups.user_created_ok"
              );

              context.newUser = context.initUser();
              $("#pass-meter-input").val("");

              // get users
              context.getUsers();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "users_groups.user_created_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.newUser.isLoading = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.newUser.errorProps[attr.parameter] = attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },

    openEditUser(ku, user) {
      this.newUser = this.initUser();

      this.newUser.name = ku;
      this.newUser.gecos = user.gecos;

      this.newUser.isEdit = true;
      this.newUser.isPassEdit = false;
      this.newUser.loadGroups = true;
      this.newUser.expires =
        this.newUser.expires == true || user.expires == "yes" ? true : false;
      this.newUser.shell =
        this.newUser.shell == true || user.shell == "/bin/bash" ? true : false;

      var context = this;
      context.exec(
        ["system-users/read"],
        {
          action: "user-membership",
          user: ku
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.newUser.groups = success;
          context.newUser.loadGroups = false;
        },
        function(error) {
          console.error(error);
          context.newUser.loadGroups = false;
        }
      );

      $("#createUserModal").modal("show");
    },

    editUser(user) {
      var context = this;

      var userObj = {
        action: "user-update",
        name: user.name,
        groups: user.groups,
        gecos: user.gecos,
        expires: user.expires ? "yes" : "no",
        shell: user.shell ? "/bin/bash" : "/usr/libexec/openssh/sftp-server"
      };

      // validate object
      context.newUser.isLoading = true;
      context.exec(
        ["system-users/validate"],
        userObj,
        null,
        function(success) {
          context.newUser.isLoading = false;
          $("#createUserModal").modal("hide");

          context.exec(
            ["system-users/update"],
            userObj,
            function(stream) {
              console.info("user-update", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "users_groups.user_updated_ok"
              );

              context.newUser = context.initUser();

              // get users
              context.getUsers();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "users_groups.user_updated_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.newUser.isLoading = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.newUser.errorProps[attr.parameter] = attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },

    openChangePassword(ku, user) {
      this.newUser = this.initUser();
      this.newUser.name = ku;
      this.newUser.isEdit = true;
      this.newUser.isPassEdit = true;
      $("#createUserModal").modal("show");
    },

    changePassword(user) {
      var context = this;

      $("#createUserModal").modal("hide");

      context.exec(
        ["system-users/update"],
        {
          action: "change-password",
          name: user.name,
          newPassword: user.newPassword,
          confirmNewPassword: user.confirmNewPassword
        },
        function(stream) {
          console.info("user-change-password", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "users_groups.user_pass_change_ok"
          );

          // get users
          context.getUsers();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "users_groups.user_pass_change_error"
          );
        }
      );
    },

    toggleLock(ku, user) {
      var context = this;

      context.exec(
        ["system-users/update"],
        {
          action: "toggle-lock",
          name: ku
        },
        function(stream) {
          console.info("user-toggle-lock", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = user.locked
            ? context.$i18n.t("users_groups.user_unlocked_ok")
            : context.$i18n.t("users_groups.user_locked_ok");

          // get users
          context.getUsers();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.success.message = user.locked
            ? context.$i18n.t("users_groups.user_unlocked_error")
            : context.$i18n.t("users_groups.user_locked_error");
        }
      );
    },

    openDeleteUser(ku, toDelete) {
      this.toDelete = this.initUser();
      this.toDelete.name = ku;
      this.toDelete.isGroup = false;
      $("#deleteModal").modal("show");
    },

    deleteUser(user) {
      var context = this;

      $("#deleteModal").modal("hide");
      context.exec(
        ["system-users/delete"],
        {
          action: "user-delete",
          name: user.name
        },
        function(stream) {
          console.info("user-delete", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "users_groups.user_deleted_ok"
          );

          // get users
          context.getUsers();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "users_groups.user_deleted_error"
          );
        }
      );
    },

    openCreateGroup() {
      this.newGroup = this.initGroup();
      $("#createGroupModal").modal("show");
    },

    createGroup(group) {
      var context = this;

      var groupObj = {
        action: "group-create",
        name: group.name,
        members: group.members
      };

      var roleObj = {
        role: group.name,
        system: group.system,
        applications: group.applications
      };

      // validate object
      context.newGroup.isLoading = true;
      context.exec(
        ["system-users/validate"],
        groupObj,
        null,
        function(success) {
          context.newGroup.isLoading = false;
          $("#createGroupModal").modal("hide");

          // update role
          context.exec(
            ["system-roles/update"],
            roleObj,
            null,
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "users_groups.role_updated_ok"
              );
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "users_groups.role_updated_error"
              );
            }
          );

          context.exec(
            ["system-users/create"],
            groupObj,
            function(stream) {
              console.info("group-create", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "users_groups.group_created_ok"
              );

              context.newGroup = context.initGroup();

              // get groups
              context.getGroups();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "users_groups.group_created_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.newGroup.isLoading = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.newGroup.errorProps[attr.parameter] = attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },

    openEditGroup(kg, group) {
      this.newGroup = this.initGroup();
      this.newGroup.name = kg;
      this.newGroup.isEdit = true;
      this.newGroup.loadMembers = true;

      var context = this;
      context.exec(
        ["system-users/read"],
        {
          action: "group-members",
          group: kg
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.newGroup.members = success;
          context.newGroup.loadMembers = false;
        },
        function(error) {
          console.error(error);
          context.newGroup.loadMembers = false;
        }
      );

      context.exec(
        ["system-roles/read"],
        {
          role: kg,
          action: "role"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.newGroup.system = success.system;
          context.newGroup.applications = success.applications;
          context.newGroup.loadMembers = false;
          context.roles.editable = success.status.editable == 1;
        },
        function(error) {
          console.error(error);
          context.newGroup.loadMembers = false;
        }
      );

      $("#createGroupModal").modal("show");
    },

    editGroup(group) {
      var context = this;

      var groupObj = {
        action: "group-update",
        name: group.name,
        members: group.members
      };

      var roleObj = {
        role: group.name,
        system: group.system,
        applications: group.applications
      };

      // validate object
      context.newGroup.isLoading = true;
      context.exec(
        ["system-users/validate"],
        groupObj,
        null,
        function(success) {
          context.newGroup.isLoading = false;
          $("#createGroupModal").modal("hide");

          // update role
          context.exec(
            ["system-roles/update"],
            roleObj,
            null,
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "users_groups.role_updated_ok"
              );
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "users_groups.role_updated_error"
              );
            }
          );

          context.exec(
            ["system-users/update"],
            groupObj,
            function(stream) {
              console.info("group-update", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "users_groups.group_updated_ok"
              );

              context.newGroup = context.initGroup();

              // get groups
              context.getGroups();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "users_groups.group_updated_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.newGroup.isLoading = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.newGroup.errorProps[attr.parameter] = attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },

    openDeleteGroup(kg, toDelete) {
      this.toDelete = this.initGroup();
      this.toDelete.name = kg;
      this.toDelete.isGroup = true;
      $("#deleteModal").modal("show");
    },

    deleteGroup(group) {
      var context = this;

      $("#deleteModal").modal("hide");
      context.exec(
        ["system-roles/delete"],
        {
          role: group.name
        },
        null,
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "users_groups.role_deleted_ok"
          );
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "users_groups.role_deleted_error"
          );
        }
      );

      context.exec(
        ["system-users/delete"],
        {
          action: "group-delete",
          name: group.name
        },
        function(stream) {
          console.info("group-delete", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "users_groups.group_deleted_ok"
          );

          // get groups
          context.getGroups();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "users_groups.group_deleted_error"
          );
        }
      );
    },

    updateValues(k, v) {
      this.newProvider.info[k] = v;
    },

    uninstallProvider() {
      var context = this;

      var providerObj = {
        action: "remove-provider"
      };
      context.$forceUpdate();

      $("#changeProviderModal").modal("hide");

      // update values
      context.exec(
        ["system-accounts-provider/update"],
        providerObj,
        function(stream) {
          console.info("accounts-provider", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "users_groups.provider_uninstalled_ok"
          );

          context.newProvider = { errors: context.initProvidersErrors() };
          context.currentStep = 1;
          context.newUser = context.initUser();
          context.newGroup = context.initGroup();

          // get provider info
          context.getInfo();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "users_groups.provider_uninstalled_error"
          );
        }
      );
    },

    changeBindType(v) {
      this.newProvider.info.BindType = v;
      this.$forceUpdate();
    },

    changeStartTLS(v) {
      this.newProvider.info.StartTls = !v ? "enabled" : "disabled";
    },

    checkLdapConfig(newProvider) {
      var context = this;

      context.newProvider.isChecking = true;
      context.$forceUpdate();

      context.exec(
        ["system-accounts-provider/read"],
        {
          action: "probe-ldap",
          port: newProvider.tcpport,
          server: newProvider.hostname
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.newProvider.info = success;
          context.newProvider.info.LdapUriDn = unescape(
            context.newProvider.info.LdapUriDn
          );
          context.newProvider.info.BindType = "anonymous";
          context.newProvider.probeError = false;
          context.newProvider.isChecking = false;
          context.newProvider.isChecked = true;
          context.$forceUpdate();
        },
        function(error) {
          context.newProvider.info = null;
          context.newProvider.probeError = true;
          context.newProvider.isChecking = false;
          context.newProvider.isChecked = true;
          context.$forceUpdate();
          console.error(error);
        }
      );
    },

    installLDAP() {
      var context = this;

      var ldapObj = {
        action: "local-ldap"
      };
      context.$forceUpdate();

      $("#accountProviderWizard").modal("hide");

      // update values
      context.exec(
        ["system-accounts-provider/update"],
        ldapObj,
        function(stream) {
          console.info("accounts-provider", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "users_groups.local_ldap_installed_ok"
          );

          context.$parent.checkSystemTasks();

          // get provider info
          context.getInfo();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "users_groups.local_ldap_installed_error"
          );
        }
      );
    },

    bindToRemoteLdap(action, newProvider) {
      var context = this;

      var ldapObj = newProvider.info;
      ldapObj.action = "remote-ldap";

      if (action == "validate") {
        context.newProvider.isChecking = true;
        context.$forceUpdate();

        // validate
        context.exec(
          ["system-accounts-provider/validate"],
          ldapObj,
          null,
          function(success) {
            context.newProvider.isChecking = false;
            context.newProvider.isValid = true;
            context.$forceUpdate();
          },
          function(error, data) {
            var errorData = {};
            context.newProvider.isChecking = false;
            context.newProvider.isValid = false;
            context.newProvider.probeError = true;

            try {
              errorData = JSON.parse(data);
            } catch (e) {
              console.error(e);
            }
            context.$forceUpdate();
          }
        );
      } else {
        // update values
        $("#accountProviderWizard").modal("hide");

        context.exec(
          ["system-accounts-provider/update"],
          ldapObj,
          function(stream) {
            console.info("accounts-provider", stream);
          },
          function(success) {
            // notification
            context.$parent.notifications.success.message = context.$i18n.t(
              "users_groups.remote_ldap_installed_ok"
            );

            // get provider info
            context.getInfo();
          },
          function(error, data) {
            // notification
            context.$parent.notifications.error.message = context.$i18n.t(
              "users_groups.remote_ldap_installed_error"
            );
          }
        );
      }
    },

    checkAdConfig(newProvider) {
      var context = this;

      context.newProvider.isChecking = true;
      context.newProvider.info = {};
      context.$forceUpdate();

      context.exec(
        ["system-accounts-provider/read"],
        {
          action: "probe-ad",
          realm: newProvider.Realm,
          server: newProvider.AdDns
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.newProvider.info = success;
          context.newProvider.info.BindPassword = "";
          context.newProvider.probeError = false;
          context.newProvider.isChecking = false;
          context.newProvider.isChecked = true;
          context.$forceUpdate();
        },
        function(error) {
          context.newProvider.info = null;
          context.newProvider.probeError = true;
          context.newProvider.isChecking = false;
          context.newProvider.isChecked = false;
          context.$forceUpdate();
          console.error(error);
        }
      );
    },

    joinADomain(action, newProvider) {
      var context = this;

      var adObj = {
        action: "remote-ad",
        AdRealm: newProvider.Realm,
        AdDns: newProvider.AdDns,
        AdUsername: newProvider.info.BindDN,
        AdPassword: newProvider.info.BindPassword
      };

      if (action == "validate") {
        context.newProvider.isChecking = true;
        context.$forceUpdate();

        // validate
        context.exec(
          ["system-accounts-provider/validate"],
          adObj,
          null,
          function(success) {
            context.newProvider.isChecking = false;
            context.newProvider.isValid = true;
            context.$forceUpdate();
          },
          function(error, data) {
            var errorData = {};
            context.newProvider.isChecking = false;
            context.newProvider.isValid = false;
            context.newProvider.joinError = true;

            try {
              errorData = JSON.parse(data);
            } catch (e) {
              console.error(e);
            }
            context.$forceUpdate();
          }
        );
      } else {
        // update values
        $("#accountProviderWizard").modal("hide");

        context.exec(
          ["system-accounts-provider/update"],
          adObj,
          function(stream) {
            console.info("accounts-provider", stream);
          },
          function(success) {
            // notification
            context.$parent.notifications.success.message = context.$i18n.t(
              "users_groups.remote_ad_installed_ok"
            );

            context.$parent.checkSystemTasks();

            // get provider info
            context.getInfo();
          },
          function(error, data) {
            // notification
            context.$parent.notifications.error.message = context.$i18n.t(
              "users_groups.remote_ad_installed_error"
            );
          }
        );
      }
    },

    createDC(newProvider) {
      var context = this;

      var adObj = newProvider;
      adObj.action = "local-ad";

      // validate
      context.newProvider.isChecking = true;
      context.newProvider.errors.Workgroup.hasError = false;
      context.newProvider.errors.Realm.hasError = false;
      context.newProvider.errors.IpAddress.hasError = false;
      context.$forceUpdate();

      context.exec(
        ["system-accounts-provider/validate"],
        adObj,
        null,
        function(success) {
          $("#accountProviderWizard").modal("hide");
          context.newProvider.isLoading = true;
          context.newProvider.isChecking = false;
          context.$forceUpdate();

          // update values
          context.exec(
            ["system-accounts-provider/update"],
            adObj,
            function(stream) {
              console.info("accounts-provider", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "users_groups.local_ad_installed_ok"
              );

              context.$parent.checkSystemTasks();

              // get provider info
              context.getInfo();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "users_groups.local_ad_installed_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.newProvider.isChecking = false;
          context.newProvider.errors.Workgroup.hasError = false;
          context.newProvider.errors.Realm.hasError = false;
          context.newProvider.errors.IpAddress.hasError = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.newProvider.errors[attr.parameter].hasError = true;
              context.newProvider.errors[attr.parameter].message = attr.error;
            }
          } catch (e) {
            console.error(e);
          }
          context.$forceUpdate();
        }
      );
    },
    changeNsdcIp() {
      var context = this;

      var nsdcIpObj = {
        action: "change-ad-ip",
        IpAddress: context.users.providerInfo.newIp
      };
      context.$forceUpdate();

      $("#nsdcIpChangeModal").modal("hide");

      // update values
      context.exec(
        ["system-accounts-provider/update"],
        nsdcIpObj,
        function(stream) {
          console.info("nsdc-ip-change", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "users_groups.nsdc_ip_address_change_ok"
          );

          context.users.providerInfo.oldIp = "";
          context.users.providerInfo.newIp = "";

          // get provider info
          context.getInfo();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "users_groups.nsdc_ip_address_change_error"
          );
        }
      );
    }
  }
};
</script>

<style>
.mg-top-20 {
  margin-top: 20px;
}
.adjust-index {
  z-index: 1;
}
</style>
