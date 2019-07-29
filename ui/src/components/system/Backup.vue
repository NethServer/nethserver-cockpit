<template>
  <div v-if="view.isAuth">
    <h2>{{$t('backup.title')}}</h2>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>

    <div v-if="view.isLoaded && hints.count > 0" class="alert alert-warning alert-dismissable">
      <span class="pficon pficon-warning-triangle-o"></span>
      <strong>{{$t('hints_suggested')}}:</strong>
      <li v-for="(m,t) in hints.details" v-bind:key="t">
        <strong>{{$t('hints.'+t)}}</strong>
        : {{$t('hints.'+m)}}
      </li>
      <span
        v-if="hints.message && hints.message.length > 0"
      >{{hints.message && $t('hints.'+hints.message)}}</span>
    </div>

    <div v-if="view.isLoaded">
      <div
        v-show="status['restore-data'] > 0 || status['backup-data'] > 0"
        class="alert alert-warning"
      >
        <button type="button" class="close">
          <div class="spinner"></div>
        </button>
        <span class="pficon pficon-warning-triangle-o"></span>
        <strong>{{$t('backup.task_in_progress')}}:</strong>
        {{status['restore-data'] > 0 ?
        $t('backup.restore_data_progress') : status['backup-data'] > 0 ? $t('backup.backup_data_progress') : ''}}.
      </div>
      <h3>{{$t('backup.config')}}</h3>
      <div class="panel panel-default" id="provider-markup">
        <div class="panel-heading">
          <button
            @click="openConfigureConfig()"
            class="btn btn-default right"
          >{{$t('backup.configure')}}</button>
          <button
            :disabled="backupConfigurations.length == 0"
            @click="openRestoreConfig(b)"
            class="btn btn-default right panel-icon"
          >{{$t('backup.restore')}}</button>
          <button
            @click="openExecuteConfig(b)"
            class="btn btn-primary right span-right-margin"
          >{{$t('backup.execute_now')}}</button>
          <span
            class="panel-title"
          >{{$t('backup.configured_backup')}}: {{backupConfigurations.length}}</span>
          <span
            class="provider-details margin-left-md"
            data-toggle="collapse"
            data-parent="#provider-markup"
            href="#providerDetails"
            @click="toggleDetails()"
          >
            <span :class="['fa', view.opened ? 'fa-angle-down' : 'fa-angle-right']"></span>
            {{$t('backup.details')}}
          </span>
        </div>
        <div id="providerDetails" class="panel-collapse collapse list-group list-view-pf">
          <div
            v-if="backupConfigurations.length == 0"
            class="alert alert-info alert-dismissable compact"
          >
            <span class="pficon pficon-info"></span>
            <strong>{{$t('backup.no_config_backup_found_title')}}.</strong>
            {{$t('backup.no_config_backup_found_desc')}}.
          </div>
          <div class="list-group-item" v-for="(b, bk) in backupConfigurations" v-bind:key="bk">
            <div class="list-view-pf-actions">
              <button @click="downloadConfigBackup(b)" class="btn btn-default">
                <span class="fa fa-download span-right-margin"></span>
                {{$t('backup.download')}}
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
                    <a @click="openDeleteConfig(b)">
                      <span class="fa fa-times span-right-margin"></span>
                      {{$t('delete')}}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="list-view-pf-main-info">
              <div class="list-view-pf-left">
                <span
                  :class="['fa', b.type == 'cron' ? 'fa-cog' : 'fa-camera', 'list-view-pf-icon-sm']"
                ></span>
              </div>
              <div class="list-view-pf-body">
                <div class="list-view-pf-description">
                  <div @click="downloadConfigBackup(b)" class="list-group-item-heading">
                    <a>{{b.type | capitalize}}</a>
                  </div>
                  <div class="list-group-item-text">
                    <span>{{b.description}}</span>
                  </div>
                </div>
                <div class="list-view-pf-additional-info">
                  <div class="list-view-pf-additional-info-item">
                    <span class="fa fa-clock-o panel-icon"></span>
                    {{b.push_ts | dateFormat}}
                  </div>
                  <div class="list-view-pf-additional-info-item">
                    <span class="fa fa-archive panel-icon"></span>
                    {{b.size | byteFormat}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <h3>{{$t('backup.data')}}</h3>
      <div class="panel panel-default">
        <div class="panel-heading">
          <button
            @click="openConfigureData()"
            class="btn btn-default right"
          >{{$t('backup.configure')}}</button>
          <button
            :disabled="backupData.length == 0"
            @click="openRestoreData()"
            class="btn btn-default right panel-icon"
          >{{$t('backup.restore')}}</button>
          <button
            @click="openCreateData(b)"
            class="btn btn-primary right span-right-margin"
          >{{$t('backup.schedule')}}</button>
          <span class="panel-title">
            <span>{{$t('backup.configured_backup')}}:</span>
            {{backupData.length}}
          </span>
        </div>
      </div>

      <h3 v-if="backupData.length > 0">{{$t('list')}}</h3>

      <div v-if="backupData.length == 0" class="blank-slate-pf blank-state-backup" id>
        <div class="blank-slate-pf-icon">
          <span class="fa fa-database"></span>
        </div>
        <h1>{{$t('backup.no_data_backup_found_title')}}</h1>
        <p>{{$t('backup.no_data_backup_found_desc')}}</p>
        <div class="blank-slate-pf-main-action">
          <button @click="openCreateData()" class="btn btn-primary btn-lg">{{$t('backup.schedule')}}</button>
        </div>
      </div>

      <form v-if="backupData.length > 0" role="form" class="search-pf has-button search">
        <div class="form-group has-clear">
          <div class="search-pf-input-group">
            <label class="sr-only">Search</label>
            <input
              v-focus
              type="search"
              v-model="searchString"
              class="form-control input-lg"
              :placeholder="$t('search')+'...'"
            >
          </div>
        </div>
      </form>

      <div class="list-group list-view-pf">
        <div
          v-if="backupData.length > 0"
          :class="['list-group-item', b.props.status == 'disabled' ? 'gray' : '']"
          v-for="(b, bk) in filteredBackupList"
          v-bind:key="bk"
        >
          <div class="list-view-pf-actions">
            <button
              :disabled="b.props.status == 'disabled'"
              @click="b.ready == 1 ? openExecuteData(b) : openEditBackupData(b)"
              class="btn btn-default"
            >
              <span :class="['fa', b.ready == 1 ? 'fa-play' : 'fa-edit', 'span-right-margin']"></span>
              {{b.ready == 1 ? $t('backup.execute_now') : $t('edit')}}
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
                  <a @click="openEditBackupData(b)">
                    <span class="fa fa-edit span-right-margin"></span>
                    {{$t('backup.edit_backup')}}
                  </a>
                </li>
                <li>
                  <a @click="toggleStatus(b)">
                    <span
                      :class="['span-right-margin', b.props.status == 'disabled' ? 'fa fa-check' : 'fa fa-lock']"
                    ></span>
                    {{b.props.status == 'disabled' ? $t('backup.enable') : $t('backup.disable')}}
                  </a>
                </li>
                <li :class="b.status.result == 'unknown' ? 'disabled' : ''">
                  <a @click="b.status.result == 'unknown' ? undefined : openLastLogData(b)">
                    <span class="fa fa-list span-right-margin"></span>
                    {{$t('backup.view_last_log')}}
                  </a>
                </li>
                <li role="presentation" class="divider"></li>
                <li>
                  <a @click="openDeleteData(b)">
                    <span class="fa fa-times span-right-margin"></span>
                    {{$t('delete')}}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="list-view-pf-main-info">
            <div class="list-view-pf-left">
              <span
                :class="['fa fa-database list-view-pf-icon-sm', b.status.result == 'success' ? 'border-green' : b.status.result == 'unknown' ? 'border-gray' : 'border-red']"
              ></span>
            </div>
            <div class="list-view-pf-body">
              <div class="list-view-pf-description">
                <div
                  @click="b.props.status == 'enabled' ? b.ready == 1 ? openExecuteData(b) : openEditBackupData(b) : undefined"
                  class="list-group-item-heading"
                >
                  <a v-if="b.props.status == 'enabled'">{{b.name}}</a>
                  <span v-if="b.props.status == 'disabled'">{{b.name}}</span>
                </div>
                <div class="list-group-item-text">
                  <span>{{b.props.BackupTime | cronToHuman}}</span>
                </div>
              </div>
              <div class="list-view-pf-additional-info">
                <div class="list-view-pf-additional-info-item">
                  <span
                    :title="$t('backup.last_backup_status') + ': ' + b.status.result"
                    :class="['fa', b.status.result == 'success' ? 'fa-check green' : b.status.result == 'unknown' ? 'fa-question gray' : 'fa-times red', 'panel-icon']"
                  ></span>
                  {{b.status['last-run']
                  | dateFormat}} UTC
                </div>
                <div class="list-view-pf-additional-info-item">
                  <span class="fa fa-space-shuttle panel-icon"></span>
                  <a
                    v-if="b.props.VFSType == 'usb' || b.props.VFSType == 'cifs' || b.props.VFSType == 'nfs'"
                    tabindex="0"
                    class="provider-details"
                    data-placement="top"
                    data-toggle="popover"
                    data-trigger="focus"
                    data-html="true"
                    :title="$t('backup.storage_usage')"
                    :data-content="b.storageInfo"
                  >
                    <b>{{b.props.VFSType | uppercase}}</b>
                  </a>
                  <b
                    v-if="b.props.VFSType != 'usb' && b.props.VFSType != 'cifs' && b.props.VFSType != 'nfs'"
                  >
                    {{b.props.VFSType
                    | uppercase}}
                  </b>
                  |
                  <b>{{b.props.type | capitalize}}</b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BACKUP CONFIGURATION -->
    <div class="modal" id="executeConfigModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('backup.execute_configuration_backup_now')}}</h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="executeConfigBackup(currentConfigBackup)"
          >
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('backup.description')}}</label>
                <div class="col-sm-9">
                  <input
                    required
                    type="text"
                    v-model="currentConfigBackup.Description"
                    class="form-control"
                  >
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div
                v-if="currentConfigBackup.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('backup.execute')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal" id="restoreConfigModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('backup.restore_configuration_backup')}}</h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="restoreConfigBackup(currentConfigBackup)"
          >
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('backup.choose_from')}}</label>
              </div>
              <div class="form-group">
                <input
                  required
                  class="col-xs-2 col-sm-4 control-label"
                  type="radio"
                  id="restoreURL-1"
                  value="url"
                  v-model="currentConfigBackup.restoreMode"
                >
                <label
                  :class="['col-sm-2 control-label', currentConfigBackup.restoreMode != 'url' ? 'gray' : '']"
                  for="restoreURL-1"
                >{{$t('backup.from_url')}}</label>
                <div class="col-sm-6">
                  <input
                    :required="currentConfigBackup.restoreMode == 'url'"
                    :disabled="currentConfigBackup.restoreMode != 'url'"
                    type="url"
                    v-model="currentConfigBackup.restoreURL"
                    class="form-control"
                    placeholder="https://mysite.com/archive/backup-last.tar.xz"
                  >
                </div>
              </div>
              <div class="advanced">
                <span class="display-inline-block"></span>
                <div class="divider divider-advanced"></div>
              </div>
              <div class="form-group">
                <input
                  required
                  class="col-xs-2 col-sm-4 control-label"
                  type="radio"
                  id="restoreFile-1"
                  value="file"
                  v-model="currentConfigBackup.restoreMode"
                >
                <label
                  :class="['col-sm-2 control-label', currentConfigBackup.restoreMode != 'file' ? 'gray' : '']"
                  for="restoreFile-1"
                >{{$t('backup.from_file')}}</label>
                <div class="col-sm-6">
                  <label
                    for="file-upload-cert"
                    :class="['custom-file-upload', currentConfigBackup.restoreMode != 'file' ? 'gray' : '']"
                  >
                    <i class="fa fa-cloud-upload span-right-margin"></i>
                    {{$t('backup.choose_file')}}
                  </label>
                  <input
                    :required="currentConfigBackup.restoreMode == 'file'"
                    :disabled="currentConfigBackup.restoreMode != 'file'"
                    class="inputfile"
                    @change="onChangeInput($event)"
                    id="backup-file"
                    name="file-upload-backup"
                    type="file"
                    accept=".tar.xz"
                  >
                </div>
              </div>
              <div class="advanced">
                <span class="display-inline-block"></span>
                <div class="divider divider-advanced"></div>
              </div>
              <div class="form-group">
                <input
                  required
                  class="col-xs-2 col-sm-4 control-label"
                  type="radio"
                  id="restoreBackup-1"
                  value="backup"
                  v-model="currentConfigBackup.restoreMode"
                >
                <label
                  :class="['col-sm-2 control-label', currentConfigBackup.restoreMode != 'backup' ? 'gray' : '']"
                  for="restoreBackup-1"
                >{{$t('backup.from_backup')}}</label>
                <div class="col-sm-6">
                  <select
                    :required="currentConfigBackup.restoreMode == 'backup'"
                    :disabled="currentConfigBackup.restoreMode != 'backup'"
                    v-model="currentConfigBackup.restoreBackup"
                    class="combobox form-control"
                  >
                    <option v-for="(t, tk) in backupConfigurations" v-bind:key="tk" :value="t.id">
                      {{t.type | capitalize}} -
                      {{t.description}}
                    </option>
                  </select>
                </div>
              </div>
              <p class="divider"></p>
              <div class="form-group">
                <label
                  class="col-sm-4 control-label"
                  for="restoreInstallPackages"
                >{{$t('backup.reinstall_packages')}}</label>
                <div class="col-sm-8">
                  <input
                    id="restoreInstallPackages"
                    type="checkbox"
                    v-model="currentConfigBackup.restoreInstallPackages"
                    class="form-control"
                  >
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-4 control-label"
                  for="textInput-modal-markup"
                >{{$t('backup.config')}}</label>
                <div class="col-sm-4">
                  <button
                    :disabled="(currentConfigBackup.restoreURL.length == 0 && currentConfigBackup.restoreFile.length == 0 && currentConfigBackup.restoreBackup.length == 0) || currentConfigBackup.isChecking"
                    @click="checkConfiguration()"
                    type="button"
                    class="btn btn-primary"
                  >{{$t('backup.check')}}</button>
                </div>
                <div v-if="currentConfigBackup.isChecking" class="col-sm-1">
                  <div class="spinner"></div>
                </div>
              </div>
              <div v-if="currentConfigBackup.remap" class="advanced">
                <span>{{$t('backup.remap_interface_config')}}</span>
                <div class="divider divider-advanced"></div>
              </div>
              <div
                v-if="currentConfigBackup.remap"
                v-for="(o, ok) in currentConfigBackup.remapInterfaces.old"
                v-bind:key="ok"
                class="form-group"
              >
                <div class="col-sm-4">
                  <label class="control-label display-block">
                    <span :class="o.role">
                      {{o.name}}
                      <span v-if="o.nslabel">({{o.nslabel}})</span>
                    </span>
                    <br>
                    {{o.ipaddr}}
                    <br>
                    {{o.role == 'pppoe' ? 'PPPoE' : o.role | capitalize}}
                  </label>
                </div>
                <div class="col-sm-1">
                  <span
                    :class="['fa', view.windowResize ? 'fa-arrow-down' : 'fa-arrow-right', 'margin-left-md']"
                  ></span>
                </div>
                <div class="col-sm-6">
                  <select
                    @change="setRemapping(o)"
                    v-model="o.newInt"
                    class="combobox form-control"
                  >
                    <option
                      v-for="(n, nk) in currentConfigBackup.remapInterfaces.new"
                      v-bind:key="nk"
                      :value="n.name"
                    >{{n.name}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div
                v-if="currentConfigBackup.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button
                :disabled="currentConfigBackup.isChecking || !currentConfigBackup.remapCalled"
                class="btn btn-primary"
                type="submit"
              >{{$t('backup.restore')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal" id="configureConfigModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('backup.configure_configuration_backup')}}</h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="configureConfigBackup(currentConfigBackup)"
          >
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-6 control-label"
                  for="textInput-modal-markup"
                >{{$t('backup.automatic_backups_keep')}}</label>
                <div class="col-sm-6">
                  <input
                    type="number"
                    min="0"
                    v-model="currentConfigBackup.HistoryLength"
                    class="form-control"
                  >
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div
                v-if="currentConfigBackup.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('save')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal" id="deleteConfigModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{$t('backup.delete_config_backup')}}
              {{currentConfigBackup.type | capitalize}} - {{currentConfigBackup.description}}
            </h4>
          </div>
          <form
            class="form-horizontal"
            v-on:submit.prevent="deleteConfigBackup(currentConfigBackup)"
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
              <div
                v-if="currentConfigBackup.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-danger" type="submit">{{$t('delete')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- END BACKUP CONFIGURATION -->
    <!-- BACKUP DATA -->
    <div class="modal" id="executeDataModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4
              class="modal-title"
            >{{$t('backup.execute_data_backup_now')}} {{currentDataBackup.name}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="executeDataBackup(currentDataBackup)">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <div
                v-if="currentDataBackup.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('backup.execute')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal" id="restoreDataModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('backup.restore_data_backup')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="restoreDataBackup(currentDataBackup)">
            <div class="modal-body">
              <div class="alert alert-warning alert-dismissable">
                <span class="pficon pficon-warning-triangle-o"></span>
                <strong>{{$t('warning')}}</strong>
                : {{$t('backup.overwrite_all_data')}}.
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('backup.from_backup')}}</label>
                <div class="col-sm-9">
                  <select v-model="currentDataBackup.restoreBackup" class="combobox form-control">
                    <option v-for="(t, tk) in backupData" v-bind:key="tk" :value="t.name">
                      {{t.name}} - {{t.props.VFSType |
                      uppercase}}
                      {{$t('with')}} {{t.props.type | capitalize}}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div
                v-if="currentDataBackup.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('backup.restore')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal" id="lastLogDataModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('backup.last_log_for')}} {{currentDataBackup.name}}</h4>
          </div>
          <form class="form-horizontal">
            <div class="modal-body">
              <div class="form-group">
                <div class="col-sm-12">
                  <div v-if="!currentDataBackup.lastLog" class="spinner spinner-sm"></div>
                  <pre v-if="currentDataBackup.lastLog" class="prettyprint">{{currentDataBackup.lastLog}}</pre>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                @click="cleanLastLog()"
                class="btn btn-default"
                type="button"
                data-dismiss="modal"
              >{{$t('cancel')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal" id="configureDataModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('backup.configure_data_backup')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="configureDataBackup()">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('backup.data_excludes')}}</label>
                <div class="col-sm-9">
                  <pre class="prettyprint">{{globalDataBackup.excludes}}</pre>
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('backup.data_includes')}}</label>
                <div class="col-sm-9">
                  <pre class="prettyprint">{{globalDataBackup.includes}}</pre>
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('backup.data_custom_excludes')}}</label>
                <div class="col-sm-9">
                  <textarea v-model="globalDataBackup['custom-excludes']" class="form-control"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('backup.data_custom_includes')}}</label>
                <div class="col-sm-9">
                  <textarea v-model="globalDataBackup['custom-includes']" class="form-control"></textarea>
                </div>
              </div>
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="IncludeLogs"
                >{{$t('backup.include_logs')}}</label>
                <div class="col-sm-9">
                  <input
                    id="IncludeLogs"
                    type="checkbox"
                    v-model="globalDataBackup.IncludeLogs"
                    class="form-control"
                  >
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('backup.configure')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal" id="createDataModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog modal-lg wizard-pf">
        <div class="modal-content">
          <div class="modal-header">
            <dt
              class="modal-title"
            >{{wizard.isEdit ? $t('backup.edit_data_backup') : $t('backup.create_data_backup')}}</dt>
          </div>

          <div class="modal-body wizard-pf-body clearfix">
            <div class="wizard-pf-steps">
              <ul class="wizard-pf-steps-indicator">
                <li
                  :class="['wizard-pf-step', wizard.currentStep == 1 ? 'active' : '']"
                  data-tabgroup="1"
                >
                  <a>
                    <span class="wizard-pf-step-number no-cursor">1</span>
                    <span class="wizard-pf-step-title">{{$t('backup.when')}}</span>
                  </a>
                </li>

                <li
                  :class="['wizard-pf-step', wizard.currentStep == 2 ? 'active' : '']"
                  data-tabgroup="2"
                >
                  <a>
                    <span class="wizard-pf-step-number no-cursor">2</span>
                    <span class="wizard-pf-step-title">{{$t('backup.where')}}</span>
                  </a>
                </li>

                <li
                  :class="['wizard-pf-step', wizard.currentStep == 3 ? 'active' : '']"
                  data-tabgroup="3"
                >
                  <a>
                    <span class="wizard-pf-step-number no-cursor">3</span>
                    <span class="wizard-pf-step-title">{{$t('backup.how')}}</span>
                  </a>
                </li>

                <li
                  :class="['wizard-pf-step', wizard.currentStep == 4 ? 'active' : '']"
                  data-tabgroup="3"
                >
                  <a>
                    <span class="wizard-pf-step-number no-cursor">4</span>
                    <span class="wizard-pf-step-title">{{$t('backup.final')}}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div class="wizard-pf-row">
              <div class="wizard-pf-main">
                <div :class="['wizard-pf-contents', wizard.currentStep == 1 ? '' : 'hidden']">
                  <div class="blank-slate-pf" id>
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-clock-o"></span>
                    </div>
                    <h1>{{$t('backup.wizard_choose_when_title')}}</h1>
                  </div>
                  <form id="local-ldap" class="form-horizontal" v-on:submit.prevent="nextStep()">
                    <div class="modal-body">
                      <div v-show="!wizard.isEditCron" class="form-group">
                        <label
                          class="col-sm-2 control-label"
                          for="textInput-modal-markup"
                        >{{$t('backup.every')}}</label>
                        <div class="col-sm-2">
                          <select
                            @change="resetCronTab()"
                            v-model="wizard.when.every"
                            class="combobox form-control"
                          >
                            <option value="hour">{{$t('backup.hour')}}</option>
                            <option value="day">{{$t('backup.day')}}</option>
                            <option value="week">{{$t('backup.week')}}</option>
                            <option value="month">{{$t('backup.month')}}</option>
                          </select>
                        </div>
                        <!-- HOUR -->
                        <label
                          v-if="wizard.when.every == 'hour'"
                          class="col-sm-2 control-label adjust-label-wizard"
                          for="textInput-modal-markup"
                        >{{$t('backup.at_minute')}}</label>
                        <div v-if="wizard.when.every == 'hour'" class="col-sm-6">
                          <input
                            v-model="wizard.when.minute"
                            type="number"
                            min="0"
                            max="59"
                            class="form-control"
                          >
                        </div>
                        <!-- -->
                        <!-- DAY -->
                        <label
                          v-if="wizard.when.every == 'day'"
                          class="col-sm-2 control-label adjust-label-wizard"
                          for="textInput-modal-markup"
                        >{{$t('backup.at_hour')}}</label>
                        <div v-if="wizard.when.every == 'day'" class="col-sm-2">
                          <input
                            v-model="wizard.when.hour"
                            type="number"
                            min="0"
                            max="23"
                            class="form-control"
                          >
                        </div>
                        <label
                          v-if="wizard.when.every == 'day'"
                          class="col-sm-2 control-label adjust-label-wizard"
                          for="textInput-modal-markup"
                        >{{$t('backup.at_minute')}}</label>
                        <div v-if="wizard.when.every == 'day'" class="col-sm-2">
                          <input
                            v-model="wizard.when.minute"
                            type="number"
                            min="0"
                            max="59"
                            class="form-control"
                          >
                        </div>
                        <!-- -->
                        <!-- WEEK -->
                        <label
                          v-if="wizard.when.every == 'week'"
                          class="col-sm-2 control-label adjust-label-wizard"
                          for="textInput-modal-markup"
                        >{{$t('backup.on_day')}}</label>
                        <div v-if="wizard.when.every == 'week'" class="col-sm-2">
                          <select v-model="wizard.when.week_day" class="combobox form-control">
                            <option
                              v-for="(w,i) in weekdays()"
                              v-bind:key="i"
                              :value="i"
                            >{{w | capitalize}}</option>
                          </select>
                        </div>
                        <label
                          v-if="wizard.when.every == 'week'"
                          class="col-sm-1 control-label adjust-label-wizard"
                          for="textInput-modal-markup"
                        >{{$t('backup.at')}}</label>
                        <div v-if="wizard.when.every == 'week'" class="col-sm-3">
                          <input
                            v-model="wizard.when.hour_minute"
                            type="text"
                            class="col-sm-1 form-control reset-width"
                          >
                        </div>
                        <!-- -->
                        <!-- MONTH -->
                        <label
                          v-if="wizard.when.every == 'month'"
                          class="col-sm-2 control-label adjust-label-wizard"
                          for="textInput-modal-markup"
                        >{{$t('backup.on_day')}}</label>
                        <div v-if="wizard.when.every == 'month'" class="col-sm-2">
                          <input
                            v-model="wizard.when.day"
                            type="number"
                            min="1"
                            max="31"
                            class="form-control"
                          >
                        </div>
                        <label
                          v-if="wizard.when.every == 'month'"
                          class="col-sm-1 control-label adjust-label-wizard"
                          for="textInput-modal-markup"
                        >{{$t('backup.at')}}</label>
                        <div v-if="wizard.when.every == 'month'" class="col-sm-3">
                          <input
                            v-model="wizard.when.hour_minute"
                            type="text"
                            class="col-sm-1 form-control reset-width"
                          >
                        </div>
                        <!-- -->
                      </div>
                      <p class="cron-human-text">{{crontabComputed | cronToHuman}}</p>
                      <div class="form-group">
                        <div :class="[wizard.isEditCron ? 'col-sm-10' : 'col-sm-12']">
                          <input
                            disabled
                            type="text"
                            class="form-control input-lg password-hints"
                            v-model="wizard.when.crontab"
                          >
                        </div>
                        <div class="col-sm-2">
                          <button
                            v-if="wizard.isEditCron"
                            type="button"
                            @click="editCronTab()"
                            class="btn btn-primary btn-lg"
                          >{{$t('edit')}}</button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', wizard.currentStep == 2 ? '' : 'hidden']">
                  <div class="blank-slate-pf" id>
                    <div class="blank-slate-pf-icon">
                      <span class="pficon pficon-volume"></span>
                    </div>
                    <h1>{{$t('backup.wizard_choose_where_title')}}</h1>
                    <doc-info
                      :placement="'top'"
                      :title="$t('docs.storage_backends')"
                      :chapter="'backup'"
                      :section="'storage-backends'"
                      :inline="false"
                    ></doc-info>
                    <div class="blank-slate-pf-main-action row wizard-where-choices">
                      <div
                        @click="selectWhere('nfs')"
                        :class="['col-xs-12 col-sm-3 col-md-3 col-lg-3 card-pf', wizard.where.choice == 'nfs' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id>
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-hdd-o"></span>
                          </div>
                          <h3>NFS</h3>
                        </div>
                      </div>
                      <div
                        @click="selectWhere('cifs')"
                        :class="['col-xs-12 col-sm-3 col-md-3 col-lg-3 card-pf', wizard.where.choice == 'cifs' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id>
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-folder-open"></span>
                          </div>
                          <h3>CIFS</h3>
                        </div>
                      </div>
                      <div
                        @click="selectWhere('usb')"
                        :class="['col-xs-12 col-sm-3 col-md-3 col-lg-3 card-pf', wizard.where.choice == 'usb' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id>
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-usb"></span>
                          </div>
                          <h3>{{$t('backup.disk')}}</h3>
                        </div>
                      </div>
                      <div
                        @click="selectWhere('webdav')"
                        :class="['col-xs-12 col-sm-3 col-md-3 col-lg-3 card-pf', wizard.where.choice == 'webdav' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id>
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-cloud"></span>
                          </div>
                          <h3>{{$t('backup.webdav')}}</h3>
                        </div>
                      </div>
                    </div>
                    <div class="blank-slate-pf-main-action row wizard-where-choices adjust-top-col">
                      <div
                        @click="selectWhere('sftp')"
                        :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.where.choice == 'sftp' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id>
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-terminal"></span>
                          </div>
                          <h3>SFTP</h3>
                        </div>
                      </div>
                      <div
                        @click="selectWhere('b2')"
                        :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.where.choice == 'b2' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id>
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-fire"></span>
                          </div>
                          <h3>Backblaze B2</h3>
                        </div>
                      </div>
                      <div
                        @click="selectWhere('s3')"
                        :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.where.choice == 's3' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id>
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-amazon"></span>
                          </div>
                          <h3>Amazon S3</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form class="form-horizontal" v-on:submit.prevent="checkWhereConfiguration()">
                    <div
                      v-if="wizard.where.configError && !wizard.where.isChecking"
                      class="alert alert-danger alert-dismissable compact"
                    >
                      <span class="pficon pficon-error-circle-o"></span>
                      <strong>{{$t('backup.where_config_error')}}.</strong>
                      {{$t('backup.where_config_error_description')}}.
                    </div>
                    <div class="modal-body">
                      <!-- NFS -->
                      <div v-if="wizard.where.choice == 'nfs'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'NFSShare' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.nfs.NFSShare"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'NFSHost' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.nfs.NFSHost"
                              class="form-control"
                            >
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- CIFS -->
                      <div v-if="wizard.where.choice == 'cifs'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'SMBShare' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.cifs.SMBShare"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'SMBHost' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.cifs.SMBHost"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'SMBLogin' |
                            camelToSentence}}
                            <doc-info
                              :placement="'top'"
                              :title="'SMBLogin' | camelToSentence"
                              :chapter="'smb_login'"
                              :inline="true"
                            ></doc-info>
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.cifs.SMBLogin"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'SMBPassword' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-7">
                            <input
                              required
                              :type="wizard.where.cifs.togglePass ? 'text' : 'password'"
                              v-model="wizard.where.cifs.SMBPassword"
                              class="form-control"
                            >
                          </div>
                          <div class="col-sm-1">
                            <button
                              tabindex="-1"
                              @click="togglePass('cifs')"
                              type="button"
                              class="btn btn-primary adjust-top-min"
                            >
                              <span
                                :class="[!wizard.where.cifs.togglePass ? 'fa fa-eye' : 'fa fa-eye-slash']"
                              ></span>
                            </button>
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- USB -->
                      <div v-if="wizard.where.choice == 'usb'">
                        <div v-show="!wizard.isEditUSB" class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('backup.usb_list')}}</label>
                          <div class="col-sm-6">
                            <div v-if="wizard.where.usb.isRefreshingUSB" class="spinner spinner-sm"></div>
                            <select
                              v-show="!wizard.where.usb.isRefreshingUSB"
                              title="-"
                              required
                              v-model="wizard.where.usb.USBDevice"
                              @change="getUSBDevicePartitions()"
                              class="combobox form-control"
                            >
                              <option
                                v-for="(d, dk) in wizard.where.usb.devices"
                                v-bind:key="dk"
                                :value="d"
                              >
                                {{d.name}} -
                                {{d.model}} | {{d.size | byteFormat}}
                              </option>
                            </select>
                          </div>
                          <div class="col-sm-3">
                            <button
                              type="button"
                              @click="getUSBDevices()"
                              class="btn btn-default"
                            >{{$t('backup.refresh')}}</button>
                          </div>
                        </div>
                        <div
                          v-show="!wizard.isEditUSB && !wizard.where.usb.isRefreshingUSB"
                          v-if="wizard.where.usb.partitions.length > 0"
                          v-for="(p,i) in wizard.where.usb.partitions"
                          v-bind:key="i"
                          class="form-group"
                        >
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            <span v-if="i == 0">{{$t('backup.usb_partitions')}}</span>
                          </label>
                          <div class="col-sm-9">
                            <span class="provider-details" @click="selectUSBDevicePartition(p)">
                              {{p.label}}: {{p.fstype
                              | uppercase}} | {{p.size | byteFormat}}
                            </span>
                          </div>
                        </div>
                        <div
                          v-if="!wizard.isEditUSB && wizard.where.usb.USBDevice && wizard.where.usb.USBDevice.formatted && !wizard.where.usb.isRefreshingUSB"
                          class="form-group"
                        >
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('backup.usb_label')}}</label>
                          <div class="col-sm-9">
                            <input
                              required
                              disabled
                              type="text"
                              v-model="wizard.where.usb.USBLabel"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div
                          v-if="wizard.isEditUSB && !wizard.where.usb.isRefreshingUSB"
                          class="form-group"
                        >
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('backup.usb_label')}}</label>
                          <div class="col-sm-6">
                            <input
                              required
                              disabled
                              type="text"
                              v-model="wizard.where.usb.USBLabel"
                              class="form-control"
                            >
                          </div>
                          <div class="col-sm-3">
                            <button @click="editUSBDevice()" class="btn btn-primary">{{$t('edit')}}</button>
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- WEBDAV -->
                      <div v-if="wizard.where.choice == 'webdav'">
                        <div class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{'WebDAV User'}}</label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.webdav.WebDAVLogin"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'WebDAV Password'
                            }}
                          </label>
                          <div class="col-sm-7">
                            <input
                              required
                              :type="wizard.where.webdav.togglePass ? 'text' : 'password'"
                              v-model="wizard.where.webdav.WebDAVPassword"
                              class="form-control"
                            >
                          </div>
                          <div class="col-sm-1">
                            <button
                              tabindex="-1"
                              @click="togglePass('webdav')"
                              type="button"
                              class="btn btn-primary adjust-top-min"
                            >
                              <span
                                :class="[!wizard.where.webdav.togglePass ? 'fa fa-eye' : 'fa fa-eye-slash']"
                              ></span>
                            </button>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'WebDAV URL'
                            }}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.webdav.WebDAVUrl"
                              class="form-control"
                            >
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- SFTP -->
                      <div v-if="wizard.where.choice == 'sftp'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'SFTPHost' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.sftp.SftpHost"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'SFTPPort' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.sftp.SftpPort"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'SFTPUser' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.sftp.SftpUser"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'SFTPPassword' |
                            camelToSentence}}
                            <doc-info
                              :placement="'top'"
                              :title="'SFTPPassword' | camelToSentence"
                              :chapter="'sftp_password'"
                              :inline="true"
                            ></doc-info>
                          </label>
                          <div class="col-sm-7">
                            <input
                              :disabled="wizard.isEdit && !wizard.where.sftp.toggleEdit"
                              required
                              :type="wizard.where.sftp.togglePass ? 'text' : 'password'"
                              v-model="wizard.where.sftp.SftpPassword"
                              class="form-control"
                              :placeholder="$t('backup.password_is_the_key')"
                            >
                          </div>
                          <div class="col-sm-1">
                            <button
                              :disabled="!wizard.isEdit"
                              tabindex="-1"
                              @click="toggleEdit()"
                              type="button"
                              class="btn btn-primary adjust-top-min"
                            >
                              <span
                                :class="[!wizard.where.sftp.toggleEdit ? 'fa fa-edit' : 'fa fa-ban']"
                              ></span>
                            </button>
                          </div>
                          <div class="col-sm-1">
                            <button
                              :disabled="!wizard.where.sftp.toggleEdit"
                              tabindex="-1"
                              @click="togglePass('sftp')"
                              type="button"
                              class="btn btn-primary adjust-top-min"
                            >
                              <span
                                :class="[!wizard.where.sftp.togglePass ? 'fa fa-eye' : 'fa fa-eye-slash']"
                              ></span>
                            </button>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'SFTPDirectory' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.sftp.SftpDirectory"
                              class="form-control"
                            >
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- B2 -->
                      <div v-if="wizard.where.choice == 'b2'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'B2Bucket' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.b2.B2Bucket"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'B2AccountId' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.b2.B2AccountId"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'B2AccountKey' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.b2.B2AccountKey"
                              class="form-control"
                            >
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- S3 -->
                      <div v-if="wizard.where.choice == 's3'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'S3Bucket' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.s3.S3Bucket"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'S3Host' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.s3.S3Host"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'S3AccessKey' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.s3.S3AccessKey"
                              class="form-control"
                            >
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{'S3SecretKey' |
                            camelToSentence}}
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="text"
                              v-model="wizard.where.s3.S3SecretKey"
                              class="form-control"
                            >
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <div
                        v-if="wizard.where.choice != 'usb' || (wizard.where.choice == 'usb' && wizard.where.usb.USBDevice)"
                        class="form-group"
                      >
                        <label class="col-sm-3 control-label" for="textInput-modal-markup"></label>
                        <div class="col-sm-2">
                          <button
                            v-if="!wizard.where.usb.isRefreshingUSB"
                            :disabled="wizard.where.isChecking || (wizard.where.choice == 'usb' && (wizard.where.usb.USBDevice && wizard.where.usb.USBDevice.formatted == 1) && wizard.where.usb.USBLabel.length == 0)"
                            type="submit"
                            class="btn btn-primary"
                          >
                            {{wizard.where.choice == 'usb' && wizard.where.usb.USBDevice &&
                            !wizard.where.usb.USBDevice.formatted ? $t('backup.format') : $t('backup.check')}}
                          </button>
                          <span v-if="wizard.where.isValid" class="fa fa-check green copy-ok"></span>
                        </div>
                        <div v-if="wizard.where.isChecking" class="col-sm-1">
                          <div class="spinner"></div>
                        </div>
                      </div>
                      <!-- OUTPUT -->
                      <div
                        v-show="wizard.where.usb.isFormatting && wizard.where.choice == 'usb' && wizard.where.usb.USBDevice && !wizard.where.usb.USBDevice.formatted"
                        class="form-group"
                      >
                        <label
                          class="col-sm-3 control-label"
                          for="textInput-modal-markup"
                        >{{$t('output')}}</label>
                        <div class="col-sm-9">
                          <textarea
                            id="format-output"
                            class="form-control command-output"
                            v-model="wizard.where.usb.formatOutput"
                          ></textarea>
                        </div>
                      </div>
                      <!-- -->
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', wizard.currentStep == 3 ? '' : 'hidden']">
                  <div class="blank-slate-pf" id>
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-space-shuttle"></span>
                    </div>
                    <h1>{{$t('backup.wizard_choose_how_title')}}</h1>
                    <doc-info
                      :placement="'top'"
                      :title="$t('docs.engines')"
                      :chapter="'backup'"
                      :section="'engines'"
                      :inline="false"
                    ></doc-info>
                    <div class="blank-slate-pf-main-action row wizard-where-choices">
                      <div
                        v-show="handleHow().duplicity"
                        @click="selectHow('duplicity')"
                        :class="['col-xs-12', 'col-sm-'+(12/handleHow().num), 'col-md-'+(12/handleHow().num), 'col-lg-'+(12/handleHow().num), 'card-pf', wizard.how.choice == 'duplicity' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id>
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-clone"></span>
                          </div>
                          <h3>Duplicity</h3>
                        </div>
                      </div>
                      <div
                        v-show="handleHow().restic"
                        @click="selectHow('restic')"
                        :class="['col-xs-12', 'col-sm-'+(12/handleHow().num), 'col-md-'+(12/handleHow().num), 'col-lg-'+(12/handleHow().num), 'card-pf', wizard.how.choice == 'restic' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id>
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-rocket"></span>
                          </div>
                          <h3>Restic</h3>
                        </div>
                      </div>
                      <div
                        v-show="handleHow().rsync"
                        @click="selectHow('rsync')"
                        :class="['col-xs-12', 'col-sm-'+(12/handleHow().num), 'col-md-'+(12/handleHow().num), 'col-lg-'+(12/handleHow().num), 'card-pf', wizard.how.choice == 'rsync' ? 'active-choose' : '']"
                      >
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id>
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-refresh"></span>
                          </div>
                          <h3>Rsync</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                  <form class="form-horizontal" v-on:submit.prevent="nextStep()">
                    <div class="modal-body">
                      <!-- DUPLICITY -->
                      <div v-if="wizard.how.choice == 'duplicity'">
                        <div class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('backup.type')}}</label>
                          <div class="col-sm-9">
                            <select
                              required
                              v-model="wizard.how.duplicity.Type"
                              class="combobox form-control"
                            >
                              <option
                                v-for="(d, dk) in wizard.how.duplicity.types"
                                v-bind:key="dk"
                                :value="d"
                              >
                                {{d |
                                capitalize}}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div v-if="wizard.how.duplicity.Type == 'incremental'" class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('backup.full_day')}}</label>
                          <div class="col-sm-9">
                            <select
                              required
                              v-model="wizard.how.duplicity.FullDay"
                              class="combobox form-control"
                            >
                              <option
                                v-for="(d,i) in wizard.how.duplicity.days"
                                v-bind:key="i"
                                :value="i"
                              >
                                {{d |
                                capitalize}}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('backup.cleanup_older_than')}}</label>
                          <div class="col-sm-9">
                            <select
                              required
                              v-model="wizard.how.duplicity.CleanupOlderThan"
                              class="combobox form-control"
                            >
                              <option
                                v-for="(d, dk) in wizard.how.duplicity.cleanups"
                                v-bind:key="dk"
                                :value="d"
                              >{{$t('backup.'+d)}}</option>
                            </select>
                          </div>
                        </div>

                        <legend class="fields-section-header-pf" aria-expanded="true">
                          <span
                            :class="['fa fa-angle-right field-section-toggle-pf', wizard.how.duplicity.advanced ? 'fa-angle-down' : '']"
                          ></span>
                          <a
                            class="field-section-toggle-pf"
                            @click="toggleAdvancedMode()"
                          >{{$t('advanced_mode')}}</a>
                        </legend>

                        <div v-show="wizard.how.duplicity.advanced" class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">
                            {{$t('backup.vol_size')}}
                            <doc-info
                              :placement="'top'"
                              :title="$t('docs.vol_size')"
                              :chapter="'backup_volsize'"
                              :inline="true"
                            ></doc-info>
                          </label>
                          <div class="col-sm-9">
                            <input
                              required
                              type="number"
                              min="2"
                              v-model="wizard.how.duplicity.VolSize"
                              class="form-control"
                            >
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- RESTIC -->
                      <div v-if="wizard.how.choice == 'restic'">
                        <div class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('backup.prune')}}</label>
                          <div class="col-sm-9">
                            <select
                              title="-"
                              required
                              v-model="wizard.how.restic.Prune"
                              class="combobox form-control"
                            >
                              <option
                                v-for="(d,i) in wizard.how.restic.prunes"
                                v-bind:key="i"
                                :value="i"
                              >
                                {{d |
                                capitalize}}
                              </option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label
                            class="col-sm-3 control-label"
                            for="textInput-modal-markup"
                          >{{$t('backup.cleanup_older_than')}}</label>
                          <div class="col-sm-9">
                            <select
                              required
                              v-model="wizard.how.restic.CleanupOlderThan"
                              class="combobox form-control"
                            >
                              <option
                                v-for="(d, dk) in wizard.how.restic.cleanups"
                                v-bind:key="dk"
                                :value="d"
                              >{{$t('backup.'+d)}}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- RSYNC -->
                      <div v-if="wizard.how.choice == 'rsync'">
                        <div class="alert alert-info alert-dismissable col-sm-12">
                          <span class="pficon pficon-info"></span>
                            <strong>{{$t('info')}}: </strong>
                            {{$t('backup.nfs_rsync_info')}}.
                        </div>
                      </div>
                      <!-- -->
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', wizard.currentStep == 4 ? '' : 'hidden']">
                  <div class="blank-slate-pf" id>
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-database"></span>
                    </div>
                    <h1>{{$t('backup.wizard_choose_config')}}</h1>
                  </div>
                  <form
                    id="local-data"
                    class="form-horizontal"
                    v-on:submit.prevent="createDataBackup()"
                  >
                    <div class="modal-body">
                      <div
                        :class="['form-group', wizard.review.errors.name.hasError ? 'has-error' : '']"
                      >
                        <label
                          class="col-sm-3 control-label"
                          for="textInput-modal-markup"
                        >{{$t('backup.name')}}</label>
                        <div class="col-sm-6">
                          <input
                            :disabled="wizard.isEdit"
                            required
                            type="text"
                            v-model="wizard.review.Name"
                            class="form-control"
                          >
                          <span v-if="wizard.review.errors.name.hasError" class="help-block">
                            {{$t('validation.validation_failed')}}:
                            {{$t('validation.'+wizard.review.errors.name.message)}}
                          </span>
                        </div>
                      </div>
                      <div class="form-group">
                        <label
                          class="col-sm-3 control-label"
                          for="textInput-modal-markup"
                        >{{$t('backup.notify_on')}}</label>
                        <div class="col-sm-6">
                          <select
                            required
                            v-model="wizard.review.Notify"
                            class="combobox form-control"
                          >
                            <option
                              v-for="(d, dk) in wizard.review.notifyTypes"
                              v-bind:key="dk"
                              :value="d"
                            >{{$t('backup.'+d)}}</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="col-sm-3 control-label">{{$t('backup.notify_to')}}</label>
                        <div class="col-sm-9">
                          <input
                            id="notifyToChoice-1"
                            class="col-sm-2 col-xs-2"
                            type="radio"
                            v-model="wizard.review.notifyToChoice"
                            value="root"
                          >
                          <label
                            class="col-sm-10 col-xs-10 control-label text-align-left"
                            for="notifyToChoice-1"
                          >{{$t('backup.root')}}</label>
                          <input
                            id="notifyToChoice-2"
                            class="col-sm-2 col-xs-2"
                            type="radio"
                            v-model="wizard.review.notifyToChoice"
                            value="custom"
                          >
                          <label
                            class="col-sm-10 col-xs-10 control-label text-align-left"
                            for="notifyToChoice-2"
                          >{{$t('backup.custom_email')}}</label>
                        </div>
                      </div>
                      <div
                        v-if="wizard.review.notifyToChoice == 'custom'"
                        :class="['form-group', wizard.review.errors.NotifyTo.hasError ? 'has-error' : '']"
                      >
                        <label
                          class="col-sm-3 control-label"
                          for="textInput-modal-markup"
                        >{{$t('backup.email_address')}}</label>
                        <div class="col-sm-6">
                          <textarea
                            :required="wizard.review.notifyToChoice == 'custom'"
                            class="form-control"
                            v-model="wizard.review.NotifyTo"
                          ></textarea>
                          <span v-if="wizard.review.errors.NotifyTo.hasError" class="help-block">
                            {{$t('validation.validation_failed')}}:
                            {{$t('validation.'+wizard.review.errors.NotifyTo.message)}}
                          </span>
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
            <button
              @click="cancelWizard()"
              type="button"
              class="btn btn-default btn-cancel wizard-pf-cancel wizard-pf-dismiss"
            >{{$t('cancel')}}</button>
            <button
              :disabled="wizard.currentStep == 1"
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
              type="submit"
              class="btn btn-primary wizard-pf-next"
            >
              {{wizard.currentStep == 4 ? (wizard.isEdit ? $t('edit') : $t('backup.schedule')) : $t('next')}}
              <span
                class="i fa fa-angle-right"
              ></span>
            </button>
            <button
              type="button"
              class="btn btn-primary hidden wizard-pf-close wizard-pf-dismiss"
            >{{$t('close')}}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" id="deleteDataModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">
              {{$t('backup.delete_data_backup')}}
              {{currentDataBackup.name}}
            </h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="deleteDataBackup(currentDataBackup)">
            <div class="modal-body">
              <div class="form-group">
                <label
                  class="col-sm-3 control-label"
                  for="textInput-modal-markup"
                >{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <div
                v-if="currentDataBackup.isLoading"
                class="spinner spinner-sm form-spinner-loader"
              ></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-danger" type="submit">{{$t('delete')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- END BACKUP DATA -->
  </div>
</template>

<script>
/*global cockpit*/
export default {
  name: "Backup",
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
        },
        function(error) {
          console.error(error);
        },
        false
      );
    });
  },
  beforeRouteLeave(to, from, next) {
    $(".modal").modal("hide");
    clearInterval(this.pollingIntervalId);
    next();
  },
  mounted() {
    this.initGraphics();
    this.getBackupInfo();
    this.getBackupStatus();
    this.pollingStatus();
    this.getUSBDevices();
    this.getHints();
  },
  watch: {
    backupData: function() {
      var context = this;
      this.getHints(function() {
        context.$parent.hints.backup.count = context.hints.count;
      });
    }
  },
  computed: {
    filteredBackupList() {
      var returnObj = [];
      for (var a in this.backupData) {
        if (
          this.backupData[a].name
            .toLowerCase()
            .includes(this.searchString.toLowerCase())
        ) {
          returnObj.push(this.backupData[a]);
        }
      }

      return returnObj;
    },
    crontabComputed() {
      var cronString = "";

      if (this.wizard.isEditCron) {
        cronString = this.wizard.when.crontab;
      } else {
        switch (this.wizard.when.every) {
          case "hour":
            cronString = this.wizard.when.minute + " * * * *";
            break;
          case "day":
            cronString =
              this.wizard.when.minute + " " + this.wizard.when.hour + " * * *";
            break;

          case "week":
            var minute = this.wizard.when.hour_minute.split(":")[1];
            var hour = this.wizard.when.hour_minute.split(":")[0];

            if (
              minute &&
              !isNaN(parseInt(minute)) &&
              (hour && !isNaN(parseInt(hour)))
            ) {
              cronString =
                minute + " " + hour + " * * " + this.wizard.when.week_day;
            } else {
              cronString = "";
            }

            break;

          case "month":
            var minute = this.wizard.when.hour_minute.split(":")[1];
            var hour = this.wizard.when.hour_minute.split(":")[0];

            if (
              minute &&
              !isNaN(parseInt(minute)) &&
              (hour && !isNaN(parseInt(hour)))
            ) {
              cronString =
                minute + " " + hour + " " + this.wizard.when.day + " * *";
            } else {
              cronString = "";
            }
            break;
        }

        this.wizard.when.crontab = cronString;
      }

      return cronString;
    }
  },
  data() {
    return {
      view: {
        isLoaded: false,
        isAuth: false,
        windowResize: window.innerWidth <= 768,
        opened: false
      },
      wizard: this.initWizard(),
      searchString: "",
      backupConfigurations: [],
      backupData: [],
      globalConfigBackup: {},
      globalDataBackup: {},
      currentConfigBackup: this.initBackupConfiguration(),
      currentDataBackup: this.initBackupData(),
      status: {
        "restore-config": 0,
        "restore-data": 0,
        "backup-data": 0
      },
      statusFlag: false,
      hints: {},
      pollingIntervalId: null
    };
  },
  methods: {
    toggleDetails() {
      this.view.opened = !this.view.opened;
    },
    initGraphics() {
      $("#app").css("background", "");
      $("#app").css("color", "");
    },
    refresh() {
      cockpit
        .dbus(null, {
          bus: "internal"
        })
        .call("/packages", "cockpit.Packages", "Reload", []);
    },
    getHints(callback) {
      var context = this;
      context.execHints(
        "system-backup",
        function(success) {
          context.hints = success;
          callback ? callback() : null;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    editCronTab() {
      this.wizard.when = {
        every: "day",
        minute: 5,
        hour: 1,
        hour_minute: "1:05",
        week_day: 0,
        day: 0,
        crontab: ""
      };
      this.wizard.isEditCron = false;
    },
    editUSBDevice() {
      this.wizard.where.usb = {
        USBLabel: null,
        USBDevice: null,
        devices: [],
        partitions: [],
        formatOutput: "",
        isFormatting: false
      };
      this.wizard.isEditUSB = false;
      this.wizard.where.isValid = false;
      this.getUSBDevices();
    },
    initWizard(b) {
      return {
        isEdit: b ? true : false,
        isEditCron: b ? true : false,
        isEditUSB: b && b.props.USBLabel ? true : false,
        isLoading: false,
        currentStep: 1,
        when: {
          every: "day",
          minute: 5,
          hour: 1,
          hour_minute: "1:05",
          week_day: 0,
          day: 0,
          crontab: b && b.props.BackupTime ? b.props.BackupTime : ""
        },
        where: {
          choice: b && b.props.VFSType ? b.props.VFSType : "nfs",
          isChecking: false,
          configError: false,
          isValid: b && b.props.USBLabel ? true : false,
          nfs: {
            NFSShare: b && b.props.NFSShare ? b.props.NFSShare : null,
            NFSHost: b && b.props.NFSHost ? b.props.NFSHost : null
          },
          cifs: {
            SMBShare: b && b.props.SMBShare ? b.props.SMBShare : null,
            SMBHost: b && b.props.SMBHost ? b.props.SMBHost : null,
            SMBLogin: b && b.props.SMBLogin ? b.props.SMBLogin : null,
            SMBPassword: b && b.props.SMBPassword ? b.props.SMBPassword : null,
            togglePass: false
          },
          usb: {
            USBLabel: b && b.props.USBLabel ? b.props.USBLabel : null,
            USBDevice: null,
            devices: [],
            partitions: [],
            formatOutput: "",
            isFormatting: false,
            isRefreshingUSB: false
          },
          webdav: {
            WebDAVLogin: b && b.props.WebDAVLogin ? b.props.WebDAVLogin : null,
            WebDAVPassword:
              b && b.props.WebDAVPassword ? b.props.WebDAVPassword : null,
            WebDAVUrl: b && b.props.WebDAVUrl ? b.props.WebDAVUrl : null,
            togglePass: false
          },
          sftp: {
            SftpDirectory:
              b && b.props.SftpDirectory ? b.props.SftpDirectory : null,
            SftpUser: b && b.props.SftpUser ? b.props.SftpUser : null,
            SftpPassword:
              b && b.props.SftpPassword ? b.props.SftpPassword : null,
            SftpHost: b && b.props.SftpHost ? b.props.SftpHost : null,
            SftpPort: b && b.props.SftpPort ? b.props.SftpPort : "22",
            togglePass: false,
            toggleEdit: b ? false : true
          },
          b2: {
            B2AccountId: b && b.props.B2AccountId ? b.props.B2AccountId : null,
            B2AccountKey:
              b && b.props.B2AccountKey ? b.props.B2AccountKey : null,
            B2Bucket: b && b.props.B2Bucket ? b.props.B2Bucket : null
          },
          s3: {
            S3Host: b && b.props.S3Host ? b.props.S3Host : "s3.amazonaws.com",
            S3AccessKey: b && b.props.S3AccessKey ? b.props.S3AccessKey : null,
            S3Bucket: b && b.props.S3Bucket ? b.props.S3Bucket : null,
            S3SecretKey: b && b.props.S3SecretKey ? b.props.S3SecretKey : null
          }
        },
        how: {
          choice: b && b.props.type ? b.props.type : "duplicity",
          duplicity: {
            Type: b && b.props.Type ? b.props.Type : "full",
            types: ["full", "incremental"],
            FullDay: b && b.props.FullDay ? parseInt(b.props.FullDay) : 0,
            days: this.weekdays(),
            VolSize: b && b.props.VolSize ? b.props.VolSize : 2,
            CleanupOlderThan:
              b && b.props.CleanupOlderThan
                ? b.props.CleanupOlderThan
                : "never",
            cleanups: [
              "never",
              "1D",
              "7D",
              "14D",
              "28D",
              "56D",
              "168D",
              "364D"
            ],
            advanced: false
          },
          restic: {
            Prune: b && b.props.Prune ? parseInt(b.props.Prune) + 1 : 1,
            prunes: ["always"].concat(this.weekdays()),
            CleanupOlderThan:
              b && b.props.CleanupOlderThan
                ? b.props.CleanupOlderThan
                : "never",
            cleanups: ["never", "1D", "7D", "14D", "28D", "56D", "168D", "364D"]
          },
          rsync: {
            CleanupOlderThan: ""
          }
        },
        review: {
          Name: b && b.name ? b.name : "",
          Notify: b && b.props.Notify ? b.props.Notify : "error",
          NotifyTo:
            b && b.props.NotifyTo
              ? b.props.NotifyTo == "root"
                ? ""
                : b.props.NotifyTo.split(",").join("\n")
              : "",
          notifyToChoice:
            b && b.props.NotifyTo
              ? b.props.NotifyTo == "root"
                ? "root"
                : "custom"
              : "root",
          notifyTypes: ["error", "always", "never"],
          errors: {
            name: {
              hasError: false,
              message: ""
            },
            NotifyTo: {
              hasError: false,
              message: ""
            }
          }
        }
      };
    },
    toggleAdvancedMode() {
      this.wizard.how.duplicity.advanced = !this.wizard.how.duplicity.advanced;
      this.$forceUpdate();
    },
    togglePass(type) {
      this.wizard.where[type].togglePass = !this.wizard.where[type].togglePass;
    },
    toggleEdit() {
      this.wizard.where.sftp.toggleEdit = !this.wizard.where.sftp.toggleEdit;
      this.wizard.where.isValid = false;
      this.wizard.where.configError = false;
    },
    weekdays() {
      var moment = require("moment");
      return moment.localeData(this.$options.currentLocale).weekdays();
    },
    resetCronTab() {
      this.wizard.when.minute = 0;
      this.wizard.when.hour = 0;
      this.wizard.when.week_day = 0;
      this.wizard.when.day = 0;
    },
    nextStep() {
      if (this.wizard.currentStep == 4) {
        this.createDataBackup();
      } else {
        if (this.wizard.currentStep == 1) {
          this.getUSBDevices();
        }
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
          disabled = this.crontabComputed.length == 0;
          break;
        case 2:
          disabled = !this.wizard.where.isValid;
          break;
      }

      return disabled;
    },
    cancelWizard() {
      this.wizard = this.initWizard();
      $("#createDataModal").modal("hide");
    },
    selectWhere(where) {
      this.wizard.where.choice = where;
      switch (where) {
        case "sftp":
          this.wizard.how.choice = "rsync";
          break;
        case "usb":
          this.wizard.how.choice = "rsync";
          break;
      }
      this.getUSBDevices();
    },
    getUSBDevices(callback) {
      var context = this;

      context.wizard.where.usb.isRefreshingUSB = true;
      context.exec(
        ["system-backup/read"],
        {
          action: "list-disks"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }

          var usbName =
            context.wizard.where.usb.USBDevice &&
            context.wizard.where.usb.USBDevice.name
              ? context.wizard.where.usb.USBDevice.name
              : null;

          context.wizard.where.usb.isRefreshingUSB = false;
          context.wizard.where.usb.isFormatting = false;
          context.wizard.where.usb.USBLabel = "";
          context.wizard.where.usb.USBDevice = null;
          context.wizard.where.usb.partitions = [];
          context.wizard.where.usb.devices = success;

          if (usbName) {
            context.wizard.where.usb.USBDevice = context.wizard.where.usb.devices.filter(
              function(i) {
                return i.name == usbName;
              }
            )[0];
            context.getUSBDevicePartitions();
          } else {
            context.wizard.where.usb.USBDevice =
              context.wizard.where.usb.devices[0];
            context.getUSBDevicePartitions();
          }

          callback ? callback() : null;
        },
        function(error) {
          console.error(error);
        }
      );
    },
    getUSBDevicePartitions() {
      this.wizard.where.isValid = false;
      this.wizard.where.configError = false;

      var name =
        this.wizard.where.usb.USBDevice && this.wizard.where.usb.USBDevice.name;
      var device = this.wizard.where.usb.devices.filter(function(i) {
        return i.name == name;
      })[0];

      this.wizard.where.usb.partitions = device && device.partitions;
      this.wizard.where.usb.USBLabel =
        device && device.partitions.length == 1
          ? device && device.partitions[0].label
          : "";
    },
    selectUSBDevicePartition(partition) {
      this.wizard.where.usb.USBLabel = partition.label;
    },
    checkWhereConfiguration() {
      var context = this;
      var method = "exec";
      var api = "system-backup/validate";

      var configObj = context.wizard.where[context.wizard.where.choice];
      configObj.action = context.wizard.where.choice + "-credentials";

      if (context.wizard.where.choice == "usb") {
        configObj.action =
          configObj.USBDevice.formatted == 1 ? "disk-access" : "format-disk";

        configObj.name =
          configObj.USBDevice.formatted == 1 ? null : configObj.USBDevice.name;

        api =
          configObj.USBDevice.formatted == 1
            ? "system-backup/validate"
            : "system-backup/execute";

        method = configObj.USBDevice.formatted == 1 ? "exec" : "execRaw";
      }

      context.wizard.where.isChecking = true;
      context[method](
        [api],
        configObj,
        method == "execRaw"
          ? function(stream) {
              context.wizard.where.usb.isFormatting =
                stream.length > 0 ? true : false;
              context.wizard.where.usb.formatOutput +=
                stream.length > 0 ? stream : "";
              document.getElementById(
                "format-output"
              ).scrollTop = document.getElementById(
                "format-output"
              ).scrollHeight;
            }
          : null,
        function(success) {
          if (
            context.wizard.where.choice == "usb" &&
            !configObj.USBDevice.formatted
          ) {
            setTimeout(function() {
              context.getUSBDevices(function() {
                context.wizard.where.isChecking = false;
                context.wizard.where.configError = false;
              });
            }, 3000);
          } else {
            context.wizard.where.isChecking = false;
            context.wizard.where.isValid = true;
            context.wizard.where.configError = false;
          }
        },
        function(error) {
          console.error(error);
          context.wizard.where.isChecking = false;
          context.wizard.where.isValid = false;
          context.wizard.where.configError = true;
        }
      );
    },
    handleHow() {
      var num = 0;
      var duplicity =
        this.wizard.where.choice == "nfs" ||
        this.wizard.where.choice == "cifs" ||
        this.wizard.where.choice == "usb";

      var restic =
        this.wizard.where.choice == "nfs" ||
        this.wizard.where.choice == "cifs" ||
        this.wizard.where.choice == "usb" ||
        this.wizard.where.choice == "sftp" ||
        this.wizard.where.choice == "b2" ||
        this.wizard.where.choice == "s3";

      var rsync =
        this.wizard.where.choice == "sftp" ||
        this.wizard.where.choice == "usb" ||
        this.wizard.where.choice == "nfs";

      num += duplicity ? 1 : 0;
      num += restic ? 1 : 0;
      num += rsync ? 1 : 0;

      return {
        num: num,
        duplicity: duplicity,
        restic: restic,
        rsync: rsync
      };
    },
    selectHow(how) {
      this.wizard.how.choice = how;
    },
    initBackupConfiguration() {
      return {
        restoreURL: "",
        restoreFile: "",
        restoreBackup: "",
        HistoryLength: 0,
        Description: "",
        isLoading: false,
        isChecking: false,
        restoreMode: "url",
        restoreInstallPackages: false,
        remapCalled: false,
        remap: false,
        remapInterfaces: {
          old: [],
          new: []
        },
        remapNew: {}
      };
    },
    initBackupData() {
      return {
        restoreBackup: "",
        isLoading: false,
        name: "",
        lastLog: null
      };
    },
    onChangeInput(event) {
      var context = this;
      this.getBase64(event.target.files[0], function(resp) {
        context.currentConfigBackup.restoreFile = resp.split(",")[1];
      });
    },
    getBackupStatus() {
      var context = this;
      context.exec(
        ["system-backup/read"],
        {
          action: "running-info"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.status = success;

          if (
            context.status["backup-data"] > 0 ||
            context.status["restore-data"] > 0
          ) {
            context.statusFlag = true;
          }

          if (
            context.statusFlag &&
            (context.status["backup-data"] == 0 &&
              context.status["restore-data"] == 0)
          ) {
            context.getBackupInfo();
            context.statusFlag = false;
          }
        },
        function(error) {
          console.error(error);
        }
      );
    },
    pollingStatus() {
      var context = this;
      context.pollingIntervalId = setInterval(function() {
        context.getBackupStatus();
      }, 2500);
    },
    getBackupInfo() {
      var context = this;
      context.exec(
        ["system-backup/read"],
        {
          action: "backup-info"
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.view.isLoaded = true;

          context.backupConfigurations = success.status["backup-config"];
          context.backupData = success.configuration["backup-data"].backups;

          for (var b in context.backupData) {
            var id = context.backupData[b].name;
            var status = success.status["backup-data"].filter(function(i) {
              return i.id == id;
            })[0];
            context.backupData[b].status = status;

            context.backupData[b].storageInfo = [
              '<div class="progress-description compact">',
              '<strong class="small-font">' +
                context.$i18n.t("backup.destination_usage") +
                ":</strong>" +
                context.$options.filters.byteFormat(
                  (context.backupData[b].status.destination &&
                    context.backupData[b].status.destination.used) ||
                    0
                ),
              "</div>",
              '<div class="progress progress-label-top-right progress-xs">',
              '<div class="progress-bar" role="progressbar" aria-valuenow="' +
                ((context.backupData[b].status.destination &&
                  context.backupData[b].status.destination.percentage) ||
                  0) +
                '" aria-valuemin="0" aria-valuemax="100" style="width: ' +
                ((context.backupData[b].status.destination &&
                  context.backupData[b].status.destination.percentage) ||
                  0) +
                '%;">',
              "<span>" +
                ((context.backupData[b].status.destination &&
                  context.backupData[b].status.destination.percentage) ||
                  0) +
                "% (" +
                context.$i18n.t("of") +
                " " +
                context.$options.filters.byteFormat(
                  (context.backupData[b].status.destination &&
                    context.backupData[b].status.destination.total) ||
                    0
                ) +
                ")</span>",
              "</div>",
              "</div>"
            ].join("");
          }

          context.globalConfigBackup = success.configuration["backup-config"];

          context.globalDataBackup.excludes = success.configuration[
            "backup-data"
          ].defaults.excludes.join("\n");
          context.globalDataBackup.includes = success.configuration[
            "backup-data"
          ].defaults.includes.join("\n");
          context.globalDataBackup["custom-excludes"] = success.configuration[
            "backup-data"
          ].defaults["custom-excludes"].join("\n");
          context.globalDataBackup["custom-includes"] = success.configuration[
            "backup-data"
          ].defaults["custom-includes"].join("\n");
          context.globalDataBackup.IncludeLogs =
            success.configuration["backup-data"].defaults.IncludeLogs ==
            "enabled"
              ? true
              : false;

          // visualize storage info

          setTimeout(function() {
            $("[data-toggle=popover]")
              .popovers()
              .popovers()
              .on("hidden.bs.popover", function(e) {
                $(e.target).data("bs.popover").inState.click = false;
              });
          }, 250);
        },
        function(error) {
          console.error(error);
          context.view.isLoaded = true;
        }
      );
    },
    openExecuteConfig(b) {
      this.currentConfigBackup = this.initBackupConfiguration();
      $("#executeConfigModal").modal("show");
    },
    openRestoreConfig(b) {
      this.currentConfigBackup = this.initBackupConfiguration();
      $("#restoreConfigModal").modal("show");
    },
    openConfigureConfig() {
      this.currentConfigBackup = this.initBackupConfiguration();
      this.currentConfigBackup.HistoryLength = this.globalConfigBackup.HistoryLength;
      $("#configureConfigModal").modal("show");
    },
    openDeleteConfig(b) {
      this.currentConfigBackup = this.initBackupConfiguration();
      this.currentConfigBackup.id = b.id;
      this.currentConfigBackup.type = b.type;
      this.currentConfigBackup.description = b.description;
      $("#deleteConfigModal").modal("show");
    },
    executeConfigBackup() {
      var context = this;

      $("#executeConfigModal").modal("hide");
      context.exec(
        ["system-backup/execute"],
        {
          action: "run-backup-config",
          name: context.currentConfigBackup.Description
        },
        function(stream) {
          console.info("backup-config", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "backup.execute_config_backup_ok"
          );

          // get backup info
          context.getBackupInfo();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "backup.execute_config_backup_error"
          );
        }
      );
    },
    checkConfiguration() {
      var context = this;

      var data = "";
      switch (context.currentConfigBackup.restoreMode) {
        case "url":
          data = context.currentConfigBackup.restoreURL;
          break;

        case "file":
          data = context.currentConfigBackup.restoreFile;
          break;

        case "backup":
          data = context.currentConfigBackup.restoreBackup;
          break;
      }

      context.currentConfigBackup.isChecking = true;
      context.exec(
        ["system-backup/read"],
        {
          action: "remapping-backup-config",
          mode: context.currentConfigBackup.restoreMode,
          data: data
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.currentConfigBackup.isChecking = false;
          context.currentConfigBackup.remapCalled = true;
          context.currentConfigBackup.remap = success.remap;
          context.currentConfigBackup.remapInterfaces.old =
            success.current || [];
          context.currentConfigBackup.remapInterfaces.new =
            success.restore || [];
        },
        function(error) {
          console.error(error);
          context.currentConfigBackup.isChecking = false;
          context.currentConfigBackup.remapCalled = true;
          context.currentConfigBackup.remap = false;
        }
      );
    },
    restoreConfigBackup() {
      var context = this;

      var data = "";
      switch (context.currentConfigBackup.restoreMode) {
        case "url":
          data = context.currentConfigBackup.restoreURL;
          break;

        case "file":
          data = context.currentConfigBackup.restoreFile;
          break;

        case "backup":
          data = context.currentConfigBackup.restoreBackup;
          break;
      }

      $("#restoreConfigModal").modal("hide");
      context.exec(
        ["system-backup/execute"],
        {
          action: "restore-backup-config",
          mode: context.currentConfigBackup.restoreMode,
          data: data,
          InstallPackages: context.currentConfigBackup.restoreInstallPackages
            ? "enabled"
            : "disabled",
          remap: context.currentConfigBackup.remapNew
        },
        function(stream) {
          console.info("backup-config-restore", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "backup.restore_config_backup_ok"
          );

          // refresh interface
          context.refresh();

          // get backup info
          context.getBackupInfo();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "backup.restore_config_backup_error"
          );
        }
      );
    },
    setRemapping(oldInt) {
      this.currentConfigBackup.remapNew[oldInt.name] = oldInt.newInt;
    },
    configureConfigBackup() {
      var context = this;

      var configObj = {
        action: "update-backup-config",
        HistoryLength: context.currentConfigBackup.HistoryLength
      };

      context.currentConfigBackup.isLoading = true;
      context.exec(
        ["system-backup/validate"],
        configObj,
        null,
        function(success) {
          context.currentConfigBackup.isLoading = false;
          $("#configureConfigModal").modal("hide");

          // update values
          context.exec(
            ["system-backup/update"],
            configObj,
            function(stream) {
              console.info("backup-config", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "backup.backup_create_ok"
              );

              // get backup info
              context.getBackupInfo();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "backup.backup_create_error"
              );
            }
          );
        },
        function(error, data) {
          context.currentConfigBackup.isLoading = false;
        }
      );
    },
    downloadConfigBackup(b) {
      var context = this;
      context.exec(
        ["system-backup/execute"],
        {
          action: "download-backup-config",
          name: b.id
        },
        null,
        function(success) {
          require("downloadjs")(
            "data:application/x-gtar;base64," + success,
            b.id + ".tar.xz",
            "application/x-gtar"
          );
        },
        function(error) {
          console.error(error);
        }
      );
    },
    deleteConfigBackup() {
      var context = this;

      $("#deleteConfigModal").modal("hide");
      context.exec(
        ["system-backup/delete"],
        {
          action: "backup-config",
          name: context.currentConfigBackup.id
        },
        function(stream) {
          console.info("backup-config-delete", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "backup.delete_config_backup_ok"
          );

          // get backup info
          context.getBackupInfo();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "backup.delete_config_backup_error"
          );
        }
      );
    },

    openExecuteData(b) {
      this.currentDataBackup = this.initBackupData();
      this.currentDataBackup.name = b.name;
      $("#executeDataModal").modal("show");
    },
    openRestoreData() {
      this.currentDataBackup = this.initBackupData();
      $("#restoreDataModal").modal("show");
    },
    openConfigureData(b) {
      this.currentDataBackup = this.initBackupData();
      $("#configureDataModal").modal("show");
    },
    openCreateData() {
      this.currentDataBackup = this.initBackupData();
      $("#createDataModal").modal("show");
    },
    openEditBackupData(b) {
      this.currentDataBackup = this.initBackupData();
      this.wizard = this.initWizard(b);
      $("#createDataModal").modal("show");
    },
    openLastLogData(b) {
      var context = this;

      context.currentDataBackup = context.initBackupData();
      context.currentDataBackup.name = b.name;
      context.currentDataBackup.lastLog = null;

      $("#lastLogDataModal").modal("show");
      context.exec(
        ["system-backup/read"],
        {
          action: "last-log",
          name: b.name
        },
        null,
        function(success) {
          try {
            success = JSON.parse(success);
          } catch (e) {
            console.error(e);
          }
          context.currentDataBackup.lastLog = success.data;
        },
        function(error) {
          console.error(error);
          context.currentDataBackup.lastLog = "-";
        }
      );
    },
    cleanLastLog() {
      this.currentDataBackup.lastLog = null;
    },
    openDeleteData(b) {
      this.currentDataBackup = this.initBackupData();
      this.currentDataBackup.name = b.name;
      $("#deleteDataModal").modal("show");
    },
    executeDataBackup(b) {
      var context = this;

      $("#executeDataModal").modal("hide");
      context.exec(
        ["system-backup/execute"],
        {
          action: "run-backup-data",
          name: b.name
        },
        function(stream) {
          console.info("backup-data", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "backup.execute_data_backup_ok"
          );

          // get backup info
          context.getBackupInfo();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "backup.execute_data_backup_error"
          );
        }
      );
    },
    restoreDataBackup() {
      var context = this;

      $("#restoreDataModal").modal("hide");
      context.exec(
        ["system-backup/execute"],
        {
          action: "restore-backup-data",
          name: context.currentDataBackup.restoreBackup
        },
        function(stream) {
          console.info("backup-data-restore", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "backup.restore_data_backup_ok"
          );

          // get backup info
          context.getBackupInfo();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "backup.restore_data_backup_error"
          );
        }
      );
    },
    configureDataBackup() {
      var context = this;

      $("#configureDataModal").modal("hide");
      context.exec(
        ["system-backup/update"],
        {
          action: "backup-data-contents",
          "custom-includes": context.globalDataBackup["custom-includes"].split(
            "\n"
          ),
          "custom-excludes": context.globalDataBackup["custom-excludes"].split(
            "\n"
          ),
          IncludeLogs: context.globalDataBackup.IncludeLogs
            ? "enabled"
            : "disabled"
        },
        function(stream) {
          console.info("backup-data-contents", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "backup.backup_configure_ok"
          );

          // get backup info
          context.getBackupInfo();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "backup.backup_configure_error"
          );
        }
      );
    },
    toggleStatus(b) {
      var context = this;

      var backupObj = b.props;
      backupObj.name = b.name;
      backupObj.status = backupObj.status == "enabled" ? "disabled" : "enabled";
      backupObj.action = "update-backup-data";

      context.exec(
        ["system-backup/update"],
        backupObj,
        function(stream) {
          console.info("backup-data", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "backup.backup_update_ok"
          );

          // get hosts
          context.getBackupInfo();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "backup.backup_update_error"
          );
        }
      );
    },
    createDataBackup() {
      var context = this;

      var endpoint = context.wizard.isEdit ? "update" : "create";
      var backupObj = {
        action: context.wizard.isEdit
          ? "update-backup-data"
          : "create-backup-data",
        name: context.wizard.review.Name,
        engine: context.wizard.how.choice,
        status: "enabled",
        Notify: context.wizard.review.Notify,
        NotifyTo:
          context.wizard.review.notifyToChoice == "root"
            ? ""
            : context.wizard.review.NotifyTo.length > 0
            ? context.wizard.review.NotifyTo.split("\n").join(",")
            : "",
        BackupTime: context.wizard.when.crontab,
        VFSType: context.wizard.where.choice,
        SMBShare: context.wizard.where.cifs.SMBShare,
        SMBHost: context.wizard.where.cifs.SMBHost,
        SMBLogin: context.wizard.where.cifs.SMBLogin,
        SMBPassword: context.wizard.where.cifs.SMBPassword,
        WebDAVLogin: context.wizard.where.webdav.WebDAVLogin,
        WebDAVPassword: context.wizard.where.webdav.WebDAVPassword,
        WebDAVUrl: context.wizard.where.webdav.WebDAVUrl,
        SftpHost: context.wizard.where.sftp.SftpHost,
        SftpPort: context.wizard.where.sftp.SftpPort,
        SftpUser: context.wizard.where.sftp.SftpUser,
        SftpDirectory: context.wizard.where.sftp.SftpDirectory,
        B2AccountId: context.wizard.where.b2.B2AccountId,
        B2AccountKey: context.wizard.where.b2.B2AccountKey,
        B2Bucket: context.wizard.where.b2.B2Bucket,
        S3AccessKey: context.wizard.where.s3.S3AccessKey,
        S3Bucket: context.wizard.where.s3.S3Bucket,
        S3SecretKey: context.wizard.where.s3.S3SecretKey,
        S3Host: context.wizard.where.s3.S3Host,
        NFSHost: context.wizard.where.nfs.NFSHost,
        NFSShare: context.wizard.where.nfs.NFSShare,
        USBLabel: context.wizard.where.usb.USBLabel,
        Type: context.wizard.how.duplicity.Type,
        FullDay: context.wizard.how.duplicity.FullDay,
        VolSize: context.wizard.how.duplicity.VolSize,
        Prune:
          context.wizard.how.restic.Prune == "always"
            ? "always"
            : context.wizard.how.restic.Prune - 1
      };

      if (!context.wizard.isEdit || context.wizard.where.sftp.toggleEdit) {
        backupObj["SftpPassword"] = context.wizard.where.sftp.SftpPassword;
      }

      if (context.wizard.how.choice != "rsync") {
        backupObj["CleanupOlderThan"] =
          context.wizard.how[context.wizard.how.choice].CleanupOlderThan;
      }

      context.wizard.isLoading = true;
      context.wizard.review.errors.name.hasError = false;
      context.wizard.review.errors.NotifyTo.hasError = false;

      if (
        context.wizard.review.notifyToChoice == "custom" &&
        context.wizard.review.NotifyTo.length == 0
      ) {
        context.wizard.review.errors.NotifyTo.hasError = true;
        context.wizard.review.errors.NotifyTo.message = "not_empty";
        context.wizard.isLoading = false;
        return;
      }

      context.exec(
        ["system-backup/validate"],
        backupObj,
        null,
        function(success) {
          context.wizard.isLoading = false;
          $("#createDataModal").modal("hide");

          context.exec(
            ["system-backup/" + endpoint],
            backupObj,
            function(stream) {
              console.info("backup-data", stream);
            },
            function(success) {
              // notification
              context.$parent.notifications.success.message = context.$i18n.t(
                "backup.backup_" + endpoint + "_ok"
              );

              context.wizard = context.initWizard();

              // get hosts
              context.getBackupInfo();
            },
            function(error, data) {
              // notification
              context.$parent.notifications.error.message = context.$i18n.t(
                "backup.backup_" + endpoint + "_error"
              );
            }
          );
        },
        function(error, data) {
          var errorData = {};
          context.wizard.isLoading = false;
          context.wizard.review.errors.name.hasError = false;

          try {
            errorData = JSON.parse(data);
            for (var e in errorData.attributes) {
              var attr = errorData.attributes[e];
              context.wizard.review.errors[attr.parameter].hasError = true;
              context.wizard.review.errors[attr.parameter].message = attr.error;
            }
          } catch (e) {
            console.error(e);
          }
        }
      );
    },
    deleteDataBackup() {
      var context = this;

      $("#deleteDataModal").modal("hide");
      context.exec(
        ["system-backup/delete"],
        {
          action: "backup-data",
          name: context.currentDataBackup.name
        },
        function(stream) {
          console.info("backup-data-delete", stream);
        },
        function(success) {
          // notification
          context.$parent.notifications.success.message = context.$i18n.t(
            "backup.delete_data_backup_ok"
          );

          // get backup info
          context.getBackupInfo();
        },
        function(error, data) {
          // notification
          context.$parent.notifications.error.message = context.$i18n.t(
            "backup.delete_data_backup_error"
          );
        }
      );
    }
  }
};
</script>

<style scoped>
.list-view-pf-description {
  flex: 1 0 65% !important;
}
</style>
