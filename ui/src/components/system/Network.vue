<template>
  <div v-show="view.isAuth">
    <h2>{{$t('network.title')}}</h2>

    <div class="row">
      <div class="col-sm-3">
        <h3>{{$t('network.proxy')}}</h3>
        <div>
          <h4 class="dhcp-int">{{$t('network.proxy_enabled')}}</h4>
          <toggle-button class="min-toggle" :width="40" :height="20" :color="{checked: '#0088ce', unchecked: '#bbbbbb'}"
            :value="currentProxy.status" :sync="true" @change="toggleProxy()" />
          <button v-if="currentProxy.status" @click="toggleProxy(false, true)" class="btn btn-primary dhcp-mod-btn">{{$t('modify')}}</button>
        </div>

        <h3>{{$t('actions')}}</h3>
        <button @click="openNewLogicInterface()" class="btn btn-primary btn-lg shutdown-privileged" data-action="restart"
          data-container="body">
          {{$t('network.add_logic_interface')}}
        </button>
      </div>
      <div class="col-sm-9 adjust-top-col">
        <div v-show="view.isLoaded" class="col-sm-6">
          <div>
            <span class="plot-unit" id="networking-tx-unit"></span><span class="plot-title" translatable="yes">Sending</span>
          </div>
          <div id="networking-tx-graph"></div>
        </div>
        <div v-show="view.isLoaded" class="col-sm-6">
          <div>
            <span class="plot-unit" id="networking-rx-unit"></span><span class="plot-title" translatable="yes">Receiving</span>
          </div>
          <div id="networking-rx-graph"></div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-sm-12">
        <h3>{{$t('network.interface_list')}}</h3>
        <div v-if="!view.isLoaded" class="spinner spinner-lg view-spinner"></div>

        <div v-for="(role,roleKey) in interfaces" v-bind:key="roleKey">
          <h4 :class="[roleKey]" v-if="role.length > 0">{{$t('network.'+roleKey)}}</h4>
          <div id="pf-list-simple-expansion" class="list-group list-view-pf list-view-pf-view wizard-pf-contents-title">
            <div v-for="(i, iKey) in role" v-bind:key="iKey" :class="['list-group-item', roleKey+'-list', i.isOpened ? 'list-view-pf-expand-active' : '', 'no-shadow']">
              <div class="list-group-item-header">
                <div class="list-view-pf-actions">
                  <button @click="openConfigureInterface(i)" class="btn btn-default">
                    <span class="fa fa-cog span-right-margin"></span>
                    {{$t('network.configure')}}
                  </button>
                  <div class="dropdown pull-right dropdown-kebab-pf">
                    <button class="btn btn-link dropdown-toggle" type="button" :id="i.name+'-list-container'"
                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                      <span class="fa fa-ellipsis-v"></span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right" :aria-labelledby="i.name+'-list-container'">
                      <li>
                        <a @click="openCreateAlias(i)">
                          <span class="fa fa-clone span-right-margin"></span>
                          {{$t('network.create_alias')}}
                        </a>
                      </li>
                      <li role="separator" class="divider"></li>
                      <li v-if="i.virtual == 0">
                        <a @click="openReleaseRole(i)">
                          <span class="pficon pficon-unlocked	 span-right-margin"></span>
                          {{$t('network.release_role')}}
                        </a>
                      </li>
                      <li v-if="i.virtual == 1">
                        <a @click="openDeleteInterface(i)">
                          <span class="fa fa-times span-right-margin"></span>
                          {{$t('delete')}}
                        </a>
                      </li>
                    </ul>
                  </div>

                </div>
                <div class="list-view-pf-main-info">
                  <div class="list-view-pf-left">
                    <span :class="[mapIcon(roleKey), 'list-view-pf-icon-sm', 'border-'+roleKey]"></span>
                  </div>
                  <div class="list-view-pf-body">
                    <div class="list-view-pf-description">
                      <div :class="['list-group-item-heading', roleKey]">
                        {{i.name}}
                      </div>
                      <div class="list-group-item-text details-ip">
                        <span class="pficon pficon-screen"></span>
                        <strong>{{i.ipaddr || '-'}}</strong>
                      </div>
                    </div>
                    <div class="list-view-pf-additional-info">
                      <div v-if="roleKey == 'other'" class="list-view-pf-additional-info-item">
                        <span class="fa fa-cube"></span>
                        <strong>{{i.role | capitalize}}</strong>
                      </div>
                      <div v-if="i.aliases.length > 0" class="list-view-pf-additional-info-item">
                        <span class="fa fa-clone"></span>
                        <strong>{{i.aliases.length}}</strong> {{$t('network.aliases')}}
                      </div>
                      <div v-if="i.devices.length > 0" class="list-view-pf-additional-info-item">
                        <span class="pficon pficon-container-node"></span>
                        <strong>{{i.devices.length}}</strong> {{i.type == 'bond' ? $t('network.slaves') :
                        $t('network.devices')}}
                      </div>
                      <div v-if="i.aliases.length > 0 || i.devices.length > 0" class="list-view-pf-additional-info-item">
                        <a @click="toggleOpen(i)">{{$t('details')}}</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div :class="['list-group-item-container container-fluid', i.isOpened ? 'active' : 'hidden']">
                <div class="row">
                  <div class="col-md-6">
                    <h4>{{$t('network.aliases')}}</h4>
                    <dl v-for="a in i.aliases" v-bind:key="a" class="dl-horizontal int-details">
                      <dt>{{a.name}}</dt>
                      <dd>{{a.ipaddr}}</dd>
                      <dt></dt>
                      <dd>{{a.netmask}}</dd>
                      <dt></dt>
                      <dd>
                        <button @click="openDeleteAlias(a)" class="btn btn-danger btn-xs">{{$t('delete')}}</button>
                      </dd>
                    </dl>
                    <dl v-if="i.aliases.length == 0" class="dl-horizontal int-details">
                      <dt>-</dt>
                      <dd></dd>
                    </dl>
                  </div>
                  <div class="col-md-6">
                    <h4>{{i.type == 'bond' ? $t('network.slaves') : $t('network.devices')}}</h4>
                    <dl v-for="a in i.devices" v-bind:key="a" class="dl-horizontal int-details">
                      <dt>{{a.name}}</dt>
                      <dd>{{a.mac}}</dd>
                      <dt></dt>
                      <dd v-if="i.devices.length > 1">
                        <button @click="openDeleteDevice(a)" class="btn btn-danger btn-xs">{{$t('network.release')}}</button>
                      </dd>
                    </dl>
                    <dl v-if="i.devices.length == 0" class="dl-horizontal int-details">
                      <dt>-</dt>
                      <dd></dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal" id="createInterfaceAliasModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('network.create_alias_for')}} {{currentInterface.name}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveAlias(newInterface)">
            <div class="modal-body">
              <div :class="['form-group', newInterface.errors.ipaddr.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.ip_address')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="newInterface.ipaddr" class="form-control">
                  <span v-if="newInterface.errors.ipaddr.hasError" class="help-block">{{$t('validation.validation_failed')}}:
                    {{$t('validation.'+newInterface.errors.ipaddr.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', newInterface.errors.netmask.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.netmask')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="newInterface.netmask" class="form-control">
                  <span v-if="newInterface.errors.netmask.hasError" class="help-block">{{$t('validation.validation_failed')}}:
                    {{$t('validation.'+newInterface.errors.netmask.message)}}</span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div v-if="newInterface.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="deleteAliasModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('network.delete_alias')}}
              {{currentInterface.name}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="deleteAlias(currentInterface)">
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

    <div class="modal" id="releaseRoleModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('network.release_role_for')}}
              {{currentInterface.name}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="releaseRole(currentInterface)">
            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-danger" type="submit">{{$t('network.release')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="deleteDeviceModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('network.delete_device')}}
              {{currentInterface.name}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="deleteDevice(currentInterface)">
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

    <div class="modal" id="deleteInterfaceModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('network.delete_interface')}}
              {{currentInterface.name}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="deleteInterface(currentInterface)">
            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('are_you_sure')}}?</label>
              </div>
              <div class="alert alert-warning alert-dismissable">
                <span class="pficon pficon-warning-triangle-o"></span>
                <strong>{{$t('warning')}}.</strong> {{$t('network.successor_hints')}}.
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.select_successor')}}</label>
                <div class="col-sm-9">
                  <div v-if="!currentInterface.successorListLoaded" class="spinner spinner-sm"></div>
                  <select v-show="currentInterface.successorListLoaded" required v-model="currentInterface.successor"
                    class="combobox form-control">
                    <option v-for="s in currentInterface.successorList" v-bind:key="s">
                      {{s}}
                    </option>
                  </select>
                </div>
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

    <div class="modal" id="proxyModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('network.configure_proxy')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="saveProxy()">

            <div class="modal-body">
              <div :class="['form-group', currentProxy.errors.host.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.hostname')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="currentProxy.configuration.props.host" class="form-control">
                  <span v-if="currentProxy.errors.host.hasError" class="help-block">{{$t('validation.validation_failed')}}:
                    {{$t('validation.'+currentProxy.errors.host.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', currentProxy.errors.port.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.port')}}</label>
                <div class="col-sm-9">
                  <input type="number" min="0" v-model="currentProxy.configuration.props.port" class="form-control">
                  <span v-if="currentProxy.errors.port.hasError" class="help-block">{{$t('validation.validation_failed')}}:
                    {{$t('validation.'+currentProxy.errors.port.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', currentProxy.errors.user.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.username')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="currentProxy.configuration.props.user" class="form-control">
                  <span v-if="currentProxy.errors.user.hasError" class="help-block">{{$t('validation.validation_failed')}}:
                    {{$t('validation.'+currentProxy.errors.user.message)}}</span>
                </div>
              </div>
              <div :class="['form-group', currentProxy.errors.password.hasError ? 'has-error' : '']">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.password')}}</label>
                <div class="col-sm-9">
                  <input required type="password" v-model="currentProxy.configuration.props.password" class="form-control">
                  <span v-if="currentProxy.errors.password.hasError" class="help-block">{{$t('validation.validation_failed')}}:
                    {{$t('validation.'+currentProxy.errors.password.message)}}</span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <div v-if="currentProxy.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
              <button class="btn btn-default" @click="toggleProxy(true)" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{currentProxy.isEdit ? $t('modify') :
                $t('save')}}</button>
            </div>

          </form>
        </div>
      </div>
    </div>

    <div class="modal" id="configureLogicInterface" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog modal-lg wizard-pf">
        <div class="modal-content">
          <div class="modal-header">
            <dt class="modal-title">{{wizard.isEdit ? $t('network.edit_logic_interface')+' '+currentInterface.name :
              $t('network.add_logic_interface')}}</dt>
          </div>

          <div class="modal-body wizard-pf-body clearfix">
            <div class="wizard-pf-steps">
              <ul class="wizard-pf-steps-indicator">

                <li :class="['wizard-pf-step', wizard.currentStep == 1 ? 'active' : '']" data-tabgroup="1">
                  <a>
                    <span class="wizard-pf-step-number">1</span>
                    <span class="wizard-pf-step-title">{{$t('network.role')}}</span>
                  </a>
                </li>

                <li :class="['wizard-pf-step', wizard.currentStep == 2 ? 'active' : '']" data-tabgroup="2">
                  <a>
                    <span class="wizard-pf-step-number">2</span>
                    <span class="wizard-pf-step-title">{{$t('network.type')}}</span>
                  </a>
                </li>

                <li :class="['wizard-pf-step', wizard.currentStep == 3 ? 'active' : '']" data-tabgroup="3">
                  <a>
                    <span class="wizard-pf-step-number">3</span>
                    <span class="wizard-pf-step-title">{{$t('network.configure')}}</span>
                  </a>
                </li>

              </ul>
            </div>

            <div class="wizard-pf-row">
              <div class="wizard-pf-main">
                <div :class="['wizard-pf-contents', wizard.currentStep == 1 ? '' : 'hidden']">
                  <div class="blank-slate-pf " id="">
                    <div class="blank-slate-pf-icon">
                      <span class="pficon pficon-network"></span>
                    </div>
                    <h1>
                      {{$t('network.wizard_choose_role_title')}}
                    </h1>
                    <div class="blank-slate-pf-main-action row wizard-where-choices">
                      <div @click="selectRole('green')" :class="['col-xs-12', 'col-sm-3', 'col-md-3', 'col-lg-3', 'card-pf network-role-choose', wizard.role.choice == 'green' ? 'active-choose-green' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-map-marker"></span>
                          </div>
                          <h3>
                            {{$t('network.green')}}
                          </h3>
                          <p>
                            <doc-info :placement="'top'" :title="$t('network.green')" :chapter="'network'" :section="'green'"></doc-info>
                          </p>
                        </div>
                      </div>
                      <div @click="selectRole('red')" :class="['col-xs-12', 'col-sm-3', 'col-md-3', 'col-lg-3', 'card-pf network-role-choose', wizard.role.choice == 'red' ? 'active-choose-red' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-globe"></span>
                          </div>
                          <h3>
                            {{$t('network.red')}}
                          </h3>
                          <p>
                            <doc-info :placement="'top'" :title="$t('network.red')" :chapter="'network'" :section="'red'"></doc-info>
                          </p>
                        </div>
                      </div>
                      <div @click="selectRole('blue')" :class="['col-xs-12', 'col-sm-3', 'col-md-3', 'col-lg-3', 'card-pf network-role-choose', wizard.role.choice == 'blue' ? 'active-choose-blue' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-users"></span>
                          </div>
                          <h3>
                            {{$t('network.blue')}}
                          </h3>
                          <p>
                            <doc-info :placement="'top'" :title="$t('network.blue')" :chapter="'network'" :section="'blue'"></doc-info>
                          </p>
                        </div>
                      </div>
                      <div @click="selectRole('orange')" :class="['col-xs-12', 'col-sm-3', 'col-md-3', 'col-lg-3', 'card-pf network-role-choose', wizard.role.choice == 'orange' ? 'active-choose-orange' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="pficon pficon-security"></span>
                          </div>
                          <h3>
                            {{$t('network.orange')}}
                          </h3>
                          <p>
                            <doc-info :placement="'top'" :title="$t('network.orange')" :chapter="'network'" :section="'orange'"></doc-info>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="blank-slate-pf-main-action row wizard-where-choices">
                      <div class="col-sm-3">

                      </div>
                      <div @click="selectRole('')" :class="['card-pf network-role-choose', wizard.role.choice == '' ? 'active-choose-other' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-square"></span>
                          </div>
                          <h3>
                            {{$t('network.empty')}}
                          </h3>
                          <p>
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                <div :class="['wizard-pf-contents', wizard.currentStep == 2 ? '' : 'hidden']">
                  <div class="blank-slate-pf " id="">
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-asterisk"></span>
                    </div>
                    <h1>
                      {{$t('network.wizard_choose_type_title')}}
                    </h1>
                    <div class="blank-slate-pf-main-action row wizard-where-choices">
                      <div @click="selectType('bond')" :class="['col-xs-12', 'col-sm-4', 'col-md-4', 'col-lg-4', 'card-pf', wizard.type.choice == 'bond' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="pficon pficon-infrastructure"></span>
                          </div>
                          <h3>
                            Bond
                          </h3>
                          <p>
                            <doc-info :placement="'top'" :title="'Bond'" :chapter="'logical-interfaces'" :section="'bond'"></doc-info>
                          </p>
                        </div>
                      </div>
                      <div @click="selectType('bridge')" :class="['col-xs-12', 'col-sm-4', 'col-md-4', 'col-lg-4', 'card-pf', wizard.type.choice == 'bridge' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="pficon pficon-plugged"></span>
                          </div>
                          <h3>
                            Bridge
                          </h3>
                          <p>
                            <doc-info :placement="'top'" :title="'Bridge'" :chapter="'logical-interfaces'" :section="'bridge'"></doc-info>
                          </p>
                        </div>
                      </div>
                      <div @click="selectType('vlan')" :class="['col-xs-12', 'col-sm-4', 'col-md-4', 'col-lg-4', 'card-pf', wizard.type.choice == 'vlan' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="pficon pficon-service"></span>
                          </div>
                          <h3>
                            VLAN
                          </h3>
                          <p>
                            <doc-info :placement="'top'" :title="'VLAN'" :chapter="'logical-interfaces'" :section="'vlan'"></doc-info>
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                  <form class="form-horizontal" v-on:submit.prevent="nextStep()">
                    <div class="modal-body">
                      <!-- BOND -->
                      <div v-if="wizard.type.choice == 'bond'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.interfaces')}}</label>
                          <div class="col-sm-9">
                            <select @change="addDeviceToInt(wizard.type.bond.device, 'bond')" class="combobox form-control"
                              v-model="wizard.type.bond.device">
                              <option v-for="d in wizard.type.bond.devicesList" v-bind:key="d">{{d}}</option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup"></label>
                          <div class="col-sm-9">
                            <ul class="list-inline compact">
                              <li v-for="(d,i) in wizard.type.bond.devices" v-bind:key="i">
                                <span class="label label-info">
                                  {{d}}
                                  <a @click="removeDeviceToInt(i, 'bond')" class="remove-item-inline">
                                    <span class="fa fa-times"></span>
                                  </a>
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.mode')}}</label>
                          <div class="col-sm-9">
                            <select v-model="wizard.type.bond.mode" class="form-control combobox">
                              <option v-for="m in wizard.type.bond.modes" :value="m" v-bind:key="m">{{m.name |
                                capitalize}}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- BRIDGE -->
                      <div v-if="wizard.type.choice == 'bridge'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.interfaces')}}</label>
                          <div class="col-sm-9">
                            <select @change="addDeviceToInt(wizard.type.bridge.device, 'bridge')" class="combobox form-control"
                              v-model="wizard.type.bridge.device">
                              <option v-for="d in wizard.type.bridge.devicesList" v-bind:key="d">{{d}}</option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup"></label>
                          <div class="col-sm-9">
                            <ul class="list-inline compact">
                              <li v-for="(d,i) in wizard.type.bridge.devices" v-bind:key="i">
                                <span class="label label-info">
                                  {{d}}
                                  <a @click="removeDeviceToInt(i, 'bridge')" class="remove-item-inline">
                                    <span class="fa fa-times"></span>
                                  </a>
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- VLAN -->
                      <div v-if="wizard.type.choice == 'vlan'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.tag')}}</label>
                          <div class="col-sm-9">
                            <input :disabled="wizard.isEdit" required v-model="wizard.type.vlan.tag" class="form-control" type="number" min="1">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.interface')}}</label>
                          <div class="col-sm-9">
                            <select v-model="wizard.type.vlan.device" class="form-control combobox">
                              <option v-for="m in wizard.type.vlan.devicesList" :value="m" v-bind:key="m">{{m}}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <!-- -->
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', wizard.currentStep == 3 ? '' : 'hidden']">
                  <div class="blank-slate-pf " id="">
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-cog"></span>
                    </div>
                    <h1>
                      {{$t('network.wizard_choose_config')}}
                    </h1>
                  </div>
                  <form class="form-horizontal" v-on:submit.prevent="saveLogicInterface()">
                    <div class="modal-body">
                      <div v-if="wizard.role.choice == 'red'" class="form-group">
                        <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.bootproto')}}</label>
                        <input class="col-sm-1" type="radio" v-model="wizard.review.bootproto" value="dhcp">
                        <label class="col-sm-2 control-label text-align-left">{{$t('network.boot_dhcp')}}</label>
                        <input class="col-sm-1" type="radio" v-model="wizard.review.bootproto" value="none">
                        <label class="col-sm-2 control-label text-align-left">{{$t('network.boot_static')}}</label>
                      </div>
                      <div v-if="wizard.review.bootproto == 'none'" :class="['form-group', wizard.review.errors.ipaddr.hasError ? 'has-error' : '']">
                        <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.ip_address')}}</label>
                        <div class="col-sm-6">
                          <input required v-model="wizard.review.ipaddr" class="form-control" type="text">
                          <span v-if="wizard.review.errors.ipaddr.hasError" class="help-block">{{$t('validation.validation_failed')}}:
                            {{$t('validation.'+wizard.review.errors.ipaddr.message)}}</span>
                        </div>
                      </div>
                      <div v-if="wizard.review.bootproto == 'none'" :class="['form-group', wizard.review.errors.netmask.hasError ? 'has-error' : '']">
                        <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.netmask')}}</label>
                        <div class="col-sm-6">
                          <input required v-model="wizard.review.netmask" class="form-control" type="text">
                          <span v-if="wizard.review.errors.netmask.hasError" class="help-block">{{$t('validation.validation_failed')}}:
                            {{$t('validation.'+wizard.review.errors.netmask.message)}}</span>
                        </div>
                      </div>
                      <div v-if="wizard.review.bootproto == 'none'" :class="['form-group', wizard.review.errors.gateway.hasError ? 'has-error' : '']">
                        <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('network.gateway')}}</label>
                        <div class="col-sm-6">
                          <input required v-model="wizard.review.gateway" class="form-control" type="text">
                          <span v-if="wizard.review.errors.gateway.hasError" class="help-block">{{$t('validation.validation_failed')}}:
                            {{$t('validation.'+wizard.review.errors.gateway.message)}}</span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer wizard-pf-footer">
            <div v-if="wizard.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
            <button @click="cancelWizard()" type="button" class="btn btn-default btn-cancel wizard-pf-cancel wizard-pf-dismiss">{{$t('cancel')}}</button>
            <button :disabled="wizard.currentStep == 1" @click="prevStep()" type="button" class="btn btn-default wizard-pf-back">
              <span class="i fa fa-angle-left"></span>
              {{$t('back')}}
            </button>
            <button :disabled="checkIfDisabled()" @click="nextStep()" type="button" class="btn btn-primary wizard-pf-next">
              {{wizard.currentStep == 3 ? (wizard.isEdit ? $t('edit') : $t('create')) : $t('next')}}
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
var plot = require("./../../lib/plotter.js");
require("jquery.flot");
require("jquery.flot/jquery.flot.selection");
require("jquery.flot/jquery.flot.time");

import DocInfo from "../../directives/DocInfo.vue";

export default {
  name: "Network",
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.exec(
        ["system-authorization/read"],
        null,
        null,
        function(success) {
          success = JSON.parse(success);

          if (success.system.indexOf(to.path.substring(1)) == -1) {
            window.location.hash = "#/";
            vm.$router.push("/");
          }

          vm.view.isAuth = true;
        },
        function(error) {
          console.error(error);
        },
        false
      );
    });
  },
  components: {
    DocInfo
  },
  beforeRouteLeave(to, from, next) {
    $(".modal").modal("hide");
    next();
  },
  mounted() {
    var context = this;
    this.getInterfaces(function(names) {
      context.initGraphs(names);
    });
    this.getProxy();
  },
  data() {
    return {
      view: {
        isLoaded: false,
        isAuth: false
      },
      tableLangsTexts: this.tableLangs(),
      interfaces: [],
      currentInterface: {},
      currentProxy: this.initProxy(),
      newInterface: this.initInterface(),
      wizard: this.initWizard()
    };
  },
  methods: {
    deviceAlreadyAdded(device, type) {
      return this.wizard.type[type].devices.indexOf(device) > -1;
    },
    addDeviceToInt(device, type) {
      if (device.length > 0 && device != "-") {
        if (!this.deviceAlreadyAdded(device, type)) {
          this.wizard.type[type].devices.push(device);
        }
      }
    },
    removeDeviceToInt(index, type) {
      this.wizard.type[type].devices.splice(index, 1);
    },
    initWizard(b) {
      return {
        isEdit: b ? true : false,
        isLoading: false,
        currentStep: 1,
        role: {
          choice: b && b.role ? b.role : "green"
        },
        type: {
          choice: b && b.type ? b.type : "bond",
          bond: {
            mode: b && b.BondOptMode ? b.BondOptMode : "",
            modes: [],
            devices:
              b && b.devices && b.type == "bond"
                ? b.devices.map(function(i) {
                    return i.name;
                  }).sort()
                : [],
            device: "",
            devicesList:
              b && b.devices
                ? b.devices.map(function(i) {
                    return i.name;
                  }).sort()
                : []
          },
          bridge: {
            devices:
              b && b.devices && b.type == "bridge"
                ? b.devices.map(function(i) {
                    return i.name;
                  }).sort()
                : [],
            device: "",
            devicesList:
              b && b.devices
                ? b.devices.map(function(i) {
                    return i.name;
                  }).sort()
                : []
          },
          vlan: {
            tag: b && b.tag ? b.tag : 0,
            device: b && b.parent ? b.parent : "",
            devicesList: []
          }
        },
        review: {
          ipaddr: b && b.ipaddr ? b.ipaddr : "",
          netmask: b && b.netmask ? b.netmask : "255.255.255.0",
          gateway: b && b.gateway ? b.gateway : "",
          bootproto: b && b.bootproto ? b.bootproto : "none",
          errors: {
            ipaddr: {
              hasError: false,
              message: ""
            },
            netmask: {
              hasError: false,
              message: ""
            },
            gateway: {
              hasError: false,
              message: ""
            }
          }
        }
      };
    },
    nextStep() {
      if (this.wizard.currentStep == 3) {
        this.saveLogicInterface();
      } else {
        this.wizard.currentStep++;
      }
    },
    prevStep() {
      if (this.wizard.currentStep > 1) {
        this.wizard.currentStep--;
      }
    },
    checkIfDisabled() {
      var disabled = false;
      switch (this.wizard.currentStep) {
        case 1:
          disabled = false;
          break;
        case 2:
          if (
            this.wizard.type.choice == "bond" &&
            this.wizard.type.bond.devices.length == 0
          ) {
            disabled = true;
          }

          if (
            this.wizard.type.choice == "bridge" &&
            this.wizard.type.bridge.devices.length == 0
          ) {
            disabled = true;
          }

          if (
            this.wizard.type.choice == "vlan" &&
            this.wizard.type.vlan.tag == 0
          ) {
            disabled = true;
          }
          break;

        case 3:
          if (this.wizard.review.bootproto == "none") {
            disabled =
              this.wizard.review.ipaddr.length == 0 ||
              this.wizard.review.netmask.length == 0 ||
              this.wizard.review.gateway.length == 0;
          }
          break;
      }

      return disabled;
    },
    cancelWizard() {
      this.wizard = this.initWizard();
      this.getFreeDevices();
      this.getFreeDevicesVLAN();
      this.getBondModes();
      $("#configureLogicInterface").modal("hide");
    },
    selectRole(role) {
      this.wizard.role.choice = role;
      if (role != "red") {
        this.wizard.review.bootproto = "none";
      }
    },
    selectType(type) {
      this.wizard.type.choice = type;
    },
    initGraphs(names) {
      var usage_metrics_channel;
      var usage_samples;
      var usage_grid;

      function ensure_usage_monitor() {
        if (usage_metrics_channel) return;

        usage_samples = {};
        usage_metrics_channel = cockpit.metrics(1000, [
          {
            source: "direct",
            metrics: [
              {
                name: "network.interface.in.bytes",
                units: "bytes",
                derive: "rate"
              },
              {
                name: "network.interface.out.bytes",
                units: "bytes",
                derive: "rate"
              }
            ],
            metrics_path_names: ["rx", "tx"]
          },
          {
            source: "internal",
            metrics: [
              {
                name: "network.interface.rx",
                units: "bytes",
                derive: "rate"
              },
              {
                name: "network.interface.tx",
                units: "bytes",
                derive: "rate"
              }
            ],
            metrics_path_names: ["rx", "tx"]
          }
        ]);
        usage_grid = cockpit.grid(1000, -1, -0);
        usage_metrics_channel.follow();
        usage_grid.walk();
      }

      function add_usage_monitor(iface) {
        usage_samples[iface] = [
          usage_grid.add(usage_metrics_channel, ["rx", iface]),
          usage_grid.add(usage_metrics_channel, ["tx", iface])
        ];
      }

      function network_plot_setup_hook(pl) {
        var axes = pl.getAxes();
        if (axes.yaxis.datamax < 100000) axes.yaxis.options.max = 100000;
        else axes.yaxis.options.max = null;
        axes.yaxis.options.min = 0;
      }

      function make_network_plot_post_hook(unit) {
        return function(pl) {
          var axes = pl.getAxes();
          $(unit).text(plot.bits_per_sec_tick_unit(axes.yaxis));
        };
      }

      function highlight_netdev_row(event, id) {
        $("#network-interface-slaves tr").removeClass("highlight-ct");
        if (id) {
          $(
            '#network-interface-slaves tr[data-interface="' +
              encodeURIComponent(id) +
              '"]'
          ).addClass("highlight-ct");
        }
      }

      function handle_usage_samples() {
        for (var iface in usage_samples) {
          var samples = usage_samples[iface];
          var rx = samples[0][0];
          var tx = samples[1][0];
          var row = $(
            '#networking-interfaces tr[data-sample-id="' +
              encodeURIComponent(iface) +
              '"]'
          );
          if (rx !== undefined && tx !== undefined && row.length > 0) {
            row
              .find("td:nth-child(3)")
              .text(cockpit.format_bits_per_sec(tx * 8));
            row
              .find("td:nth-child(4)")
              .text(cockpit.format_bits_per_sec(rx * 8));
          }
        }
      }

      var rx_plot_data = {
        direct: "network.interface.in.bytes",
        internal: "network.interface.rx",
        units: "bytes",
        derive: "rate",
        threshold: 200
      };

      var rx_plot_options = plot.plot_simple_template();
      $.extend(rx_plot_options.yaxis, {
        tickFormatter: plot.format_bits_per_sec_tick_no_unit
      });
      $.extend(rx_plot_options.grid, {
        hoverable: true,
        autoHighlight: false
      });
      rx_plot_options.setup_hook = network_plot_setup_hook;
      rx_plot_options.post_hook = make_network_plot_post_hook(
        "#networking-rx-unit"
      );
      this.rx_plot = new plot.Plot($("#networking-rx-graph"), 300);
      this.rx_plot.set_options(rx_plot_options);
      this.rx_series = this.rx_plot.add_metrics_stacked_instances_series(
        rx_plot_data,
        {}
      );
      this.rx_plot.start_walking();
      $(this.rx_series).on("hover", highlight_netdev_row);

      var tx_plot_data = {
        direct: "network.interface.out.bytes",
        internal: "network.interface.tx",
        units: "bytes",
        derive: "rate",
        threshold: 200
      };

      var tx_plot_options = plot.plot_simple_template();
      $.extend(tx_plot_options.yaxis, {
        tickFormatter: plot.format_bits_per_sec_tick_no_unit
      });
      $.extend(tx_plot_options.grid, {
        hoverable: true,
        autoHighlight: false
      });
      tx_plot_options.setup_hook = network_plot_setup_hook;
      tx_plot_options.post_hook = make_network_plot_post_hook(
        "#networking-tx-unit"
      );
      this.tx_plot = new plot.Plot($("#networking-tx-graph"), 300);
      this.tx_plot.set_options(tx_plot_options);
      this.tx_series = this.tx_plot.add_metrics_stacked_instances_series(
        tx_plot_data,
        {}
      );
      this.tx_plot.start_walking();
      $(this.tx_series).on("hover", highlight_netdev_row);

      $(window).on(
        "resize.server",
        {
          t: this.tx_plot,
          r: this.rx_plot
        },
        function(response) {
          response.data.t.resize();
          response.data.r.resize();
        }
      );

      ensure_usage_monitor();
      $(usage_grid).on("notify", function(event, index, count) {
        handle_usage_samples();
      });

      for (var n in names) {
        var name = names[n];
        this.rx_series.add_instance(name);
        this.tx_series.add_instance(name);
        add_usage_monitor(name);
      }
    },
    mapIcon(role) {
      switch (role) {
        case "green":
          return "fa fa-map-marker";
          break;

        case "red":
          return "fa fa-globe";
          break;

        case "blue":
          return "fa fa-users";
          break;

        case "orange":
          return "pficon pficon-security";
          break;

        case "free":
          return "pficon pficon-unlocked";
          break;

        case "other":
          return "fa fa-question";
          break;
      }
    },
    toggleOpen(i) {
      i.isOpened = !i.isOpened;
      this.$forceUpdate();
    },
    initProxy() {
      return {
        status: false,
        configuration: {
          props: {
            password: "",
            user: "",
            port: "",
            host: ""
          }
        },
        errors: {
          host: {
            hasError: false,
            message: ""
          },
          port: {
            hasError: false,
            message: ""
          },
          user: {
            hasError: false,
            message: ""
          },
          password: {
            hasError: false,
            message: ""
          }
        },
        isLoading: false
      };
    },
    getProxy() {
      var context = this;
      context.exec(
        ["system-proxy/read"],
        null,
        null,
        function(success) {
          success = JSON.parse(success);
          context.currentProxy.status =
            success.configuration.props.host.length > 0;
          context.currentProxy.configuration = success.configuration;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    getFreeDevicesVLAN() {
      var context = this;
      context.exec(
        ["system-network/read"],
        {
          action: "vlan-available"
        },
        null,
        function(success) {
          success = JSON.parse(success);
          context.wizard.type.vlan.devicesList = success;
          context.wizard.type.vlan.device = context.wizard.type.vlan.device
            ? context.wizard.type.vlan.device
            : success[0];
        },
        function(error) {
          console.error(error);
        }
      );
    },
    getFreeDevices() {
      var context = this;
      context.exec(
        ["system-network/read"],
        {
          action: "available"
        },
        null,
        function(success) {
          success = JSON.parse(success);
          context.wizard.type.bond.devicesList = context.wizard.type.bond.devicesList.concat(
            success
          ).sort();
          context.wizard.type.bridge.devicesList = context.wizard.type.bridge.devicesList.concat(
            success
          ).sort();
        },
        function(error) {
          console.error(error);
        }
      );
    },
    getBondModes() {
      var context = this;
      context.exec(
        ["system-network/read"],
        {
          action: "bond-types"
        },
        null,
        function(success) {
          success = JSON.parse(success);
          context.wizard.type.bond.modes = success;
          context.wizard.type.bond.mode = success[0];
        },
        function(error) {
          console.error(error);
        }
      );
    },
    initInterface() {
      return {
        ipaddr: "",
        netmask: "255.255.255.0",
        errors: {
          ipaddr: {
            hasError: false,
            message: ""
          },
          netmask: {
            hasError: false,
            message: ""
          }
        },
        isLoading: false
      };
    },
    getInterfaces(callback) {
      var context = this;
      context.view.isLoaded = false;
      context.exec(
        ["system-network/read"],
        {
          action: "list"
        },
        null,
        function(success) {
          success = JSON.parse(success);
          context.view.isLoaded = true;
          var interfaceNames = [];
          context.interfaces = success.configuration;
          for (var role in context.interfaces) {
            for (var i in context.interfaces[role]) {
              var int = context.interfaces[role][i];
              int.isOpened = false;
              interfaceNames.push(int.name);
            }
          }
          context.interfaces = {
            green: success.configuration.green,
            red: success.configuration.red,
            blue: success.configuration.blue,
            orange: success.configuration.orange,
            other: success.configuration.other,
            free: success.configuration.free
          };

          context.getFreeDevices();
          context.getFreeDevicesVLAN();
          context.getBondModes();
          callback ? callback(interfaceNames) : null;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    openConfigureInterface(i) {
      if (i.virtual == 1) {
        this.wizard = this.initWizard(i);
        this.getFreeDevices();
        this.getFreeDevicesVLAN();
        this.getBondModes();
        this.currentInterface = i;
        this.openNewLogicInterface();
      } else {
        this.newInterface = this.initInterface();
        $("#configureInterface").modal("show");
      }
    },
    openNewLogicInterface() {
      this.newInterface = this.initInterface();
      $("#configureLogicInterface").modal("show");
    },
    openCreateAlias(int) {
      this.currentInterface = int;
      this.newInterface = this.initInterface();
      $("#createInterfaceAliasModal").modal("show");
    },
    openDeleteAlias(int) {
      this.currentInterface = Object.assign({}, int);
      $("#deleteAliasModal").modal("show");
    },
    openDeleteDevice(int) {
      this.currentInterface = Object.assign({}, int);
      $("#deleteDeviceModal").modal("show");
    },
    openReleaseRole(int) {
      this.currentInterface = Object.assign({}, int);
      $("#releaseRoleModal").modal("show");
    },
    openDeleteInterface(int) {
      this.currentInterface = Object.assign({}, int);
      this.currentInterface.successor = "";
      this.currentInterface.successorList = [];
      this.currentInterface.successorListLoaded = false;

      $("#deleteInterfaceModal").modal("show");

      // retrieve successors
      var context = this;
      context.exec(
        ["system-network/read"],
        {
          action: "heirs",
          parent: int.name
        },
        null,
        function(success) {
          success = JSON.parse(success);
          context.currentInterface.successorList = success;
          context.currentInterface.successor =
            context.currentInterface.successorList[0];

          context.currentInterface.successorListLoaded = true;
          context.$forceUpdate();
        },
        function(error) {
          console.error(error);
          context.view.isLoaded = true;
        }
      );
    },
    saveInterface() {},
    saveLogicInterface() {
      var context = this;

      var logicObj = {
        action: context.wizard.isEdit
          ? "change-properties"
          : "create-" + context.wizard.type.choice,
        interface: context.currentInterface.name
          ? context.currentInterface.name
          : null,
        role: context.wizard.role.choice,
        bootproto: context.wizard.review.bootproto,
        ipaddr: context.wizard.review.ipaddr,
        netmask: context.wizard.review.netmask,
        gateway: context.wizard.review.gateway,
        devices: context.wizard.type[context.wizard.type.choice].devices,
        BondOptMode:
          context.wizard.type.choice == "bond"
            ? context.wizard.type.bond.mode.value
            : null,
        tag:
          context.wizard.type.choice == "vlan"
            ? context.wizard.type.vlan.tag
            : null,
        parent:
          context.wizard.type.choice == "vlan"
            ? context.wizard.type.vlan.device
            : null
      };

      context.wizard.isLoading = true;
      context.exec(
        ["system-network/validate"],
        logicObj,
        null,
        function(success) {
          context.wizard.isLoading = false;
          $("#configureLogicInterface").modal("hide");

          // update values
          context.exec(
            ["system-network/" + (context.wizard.isEdit ? "update" : "create")],
            logicObj,
            function(stream) {
              console.info("network-update", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "network.interface_created_ok"
              );

              // get interfaces
              context.wizard = context.initWizard();
              context.getInterfaces();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "network.interface_created_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = JSON.parse(data);
          context.wizard.isLoading = false;
          context.wizard.review.errors = context.initWizard().review.errors;

          for (var e in errorData.attributes) {
            var attr = errorData.attributes[e];
            context.wizard.review.errors[attr.parameter].hasError = true;
            context.wizard.review.errors[attr.parameter].message = attr.error;
          }
        }
      );
    },
    saveAlias() {
      var context = this;

      var aliasObj = {
        action: "create-alias",
        ipaddr: this.newInterface.ipaddr,
        netmask: this.newInterface.netmask,
        parent: this.currentInterface.name
      };

      context.newInterface.errors = this.initInterface().errors;
      context.newInterface.isLoading = true;
      context.exec(
        ["system-network/validate"],
        aliasObj,
        null,
        function(success) {
          context.newInterface.isLoading = false;
          $("#createInterfaceAliasModal").modal("hide");

          // update values
          context.exec(
            ["system-network/create"],
            aliasObj,
            function(stream) {
              console.info("alias-update", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "network.alias_created_ok"
              );

              // get interfaces
              context.getInterfaces();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "network.alias_created_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = JSON.parse(data);
          context.newInterface.isLoading = false;
          context.newInterface.errors = this.initInterface().errors;

          for (var e in errorData.attributes) {
            var attr = errorData.attributes[e];
            context.currentProxy.errors[attr.parameter].hasError = true;
            context.currentProxy.errors[attr.parameter].message = attr.error;
          }
        }
      );
    },
    deleteAlias(int) {
      var context = this;

      $("#deleteAliasModal").modal("hide");
      context.exec(
        ["system-network/delete"],
        {
          interface: int.name
        },
        function(stream) {
          console.info("alias-delete", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "network.alias_delete_ok"
          );

          // get interfaces
          context.getInterfaces();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "network.alias_delete_error"
          );
        }
      );
    },
    deleteDevice(int) {
      var context = this;

      $("#deleteDeviceModal").modal("hide");
      context.exec(
        ["system-network/update"],
        {
          action: "release-device",
          interface: int.name
        },
        function(stream) {
          console.info("device-release", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "network.device_release_ok"
          );

          // get interfaces
          context.getInterfaces();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "network.device_release_error"
          );
        }
      );
    },
    releaseRole(int) {
      var context = this;

      $("#releaseRoleModal").modal("hide");
      context.exec(
        ["system-network/update"],
        {
          action: "release-role",
          interface: int.name
        },
        function(stream) {
          console.info("interface-release", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "network.interface_release_ok"
          );

          // get interfaces
          context.getInterfaces();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "network.interface_release_error"
          );
        }
      );
    },
    deleteInterface(int) {
      var context = this;

      $("#deleteInterfaceModal").modal("hide");
      context.exec(
        ["system-network/delete"],
        {
          interface: int.name,
          heir: int.successor
        },
        function(stream) {
          console.info("interface-delete", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "network.interface_delete_ok"
          );

          // get interfaces
          context.getInterfaces();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "network.interface_delete_error"
          );
        }
      );
    },
    toggleProxy(reset, isEdit) {
      if (reset) {
        this.currentProxy.status = false;
        this.getProxy();
      } else {
        if (!this.currentProxy.status || (this.currentProxy.status && isEdit)) {
          this.currentProxy.isEdit = isEdit;
          this.currentProxy.status = true;
          $("#proxyModal").modal("show");
        } else {
          var context = this;

          var proxyObj = {
            props: {
              password: "",
              user: "",
              port: "",
              host: ""
            },
            name: "proxy",
            type: "configuration"
          };

          // update values
          context.exec(
            ["system-proxy/update"],
            proxyObj,
            function(stream) {
              console.info("proxy-update", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "network.proxy_update_ok"
              );

              // get proxy
              context.getProxy();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "network.proxy_update_error"
              );
            }
          );
        }
      }
    },
    saveProxy() {
      var context = this;

      var proxyObj = {
        props: {
          password: this.currentProxy.configuration.props.password,
          user: this.currentProxy.configuration.props.user,
          port: this.currentProxy.configuration.props.port,
          host: this.currentProxy.configuration.props.host
        },
        name: "proxy",
        type: "configuration"
      };

      context.currentProxy.isLoading = true;
      context.exec(
        ["system-proxy/validate"],
        proxyObj,
        null,
        function(success) {
          context.currentProxy.isLoading = false;
          $("#proxyModal").modal("hide");

          // update values
          context.exec(
            ["system-proxy/update"],
            proxyObj,
            function(stream) {
              console.info("proxy-update", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "network.proxy_update_ok"
              );

              // get proxy
              context.getProxy();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "network.proxy_update_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = JSON.parse(data);
          context.currentProxy.isLoading = false;
          context.currentProxy.errors = this.initProxy().errors;

          for (var e in errorData.attributes) {
            var attr = errorData.attributes[e];
            context.currentProxy.errors[attr.parameter].hasError = true;
            context.currentProxy.errors[attr.parameter].message = attr.error;
          }
        }
      );
    }
  }
};
</script>

<style>
#networking-rx-graph,
#networking-tx-graph,
#network-interface-tx-graph,
#network-interface-rx-graph {
  height: 120px;
}

.plot-unit {
  display: inline-block;
  width: 28px;
  font-size: smaller;
  text-align: right;
  color: #545454;
  margin-right: 7px;
}
</style>