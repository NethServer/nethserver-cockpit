<template>
  <div v-if="view.isAuth">
    <h2>{{$t('backup.title')}}</h2>
    <div v-if="!view.isLoaded" class="spinner spinner-lg"></div>
    <div v-if="view.isLoaded">
      <h3 class="sub-title-menu">{{$t('backup.config')}}</h3>
      <div class="panel panel-default" id="provider-markup">
        <div class="panel-heading">
          <button @click="openConfigureConfig()" class="btn btn-default right">{{$t('backup.configure')}}</button>
          <button @click="openRestoreConfig(b)" class="btn btn-primary right panel-icon">{{$t('backup.restore')}}</button>
          <button @click="openExecuteConfig(b)" class="btn btn-primary right span-right-margin">{{$t('backup.execute_now')}}</button>
          <span class="panel-title">{{$t('backup.backup_configured')}}</span>
          <span class="provider-details" data-toggle="collapse" data-parent="#provider-markup" href="#providerDetails">{{$t('backup.details')}}</span>
        </div>
        <div id="providerDetails" class="panel-collapse collapse list-group list-view-pf">
          <div class="list-group-item" v-for="b in backupConfigurations" v-bind:key="b">
            <div class="list-view-pf-actions">
              <button @click="downloadConfigBackup(b)" class="btn btn-default">
                <span class="fa fa-download span-right-margin"></span>
                {{$t('backup.download')}}
              </button>
              <div class="dropdown pull-right dropdown-kebab-pf">
                <button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true"
                  aria-expanded="true">
                  <span class="fa fa-ellipsis-v"></span>
                </button>
                <ul class="dropdown-menu dropdown-menu-right">
                  <li>
                    <a @click="openDeleteConfig(b)">
                      <span class="fa fa-times span-right-margin"></span>
                      {{$t('delete')}}</a>
                  </li>
                </ul>
              </div>
            </div>
            <div class="list-view-pf-main-info">
              <div class="list-view-pf-left">
                <span :class="['fa', b.type == 'cron' ? 'fa-cog' : 'fa-camera', 'list-view-pf-icon-sm']"></span>
              </div>
              <div class="list-view-pf-body">
                <div class="list-view-pf-description">
                  <div @click="downloadConfigBackup(b)" class="list-group-item-heading">
                    <a>{{b.type | capitalize}}</a>
                  </div>
                  <div class="list-group-item-text">
                    <span>{{b.description}}</span>
                  </div>
                  <div class="list-group-item-text">
                    <span class="fa fa-clock-o panel-icon"></span>{{b.push_ts | dateFormat}}
                  </div>
                </div>
                <div class="list-view-pf-additional-info">
                  <span class="fa fa-archive panel-icon"></span>{{b.size | byteFormat}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <h3 class="sub-title-menu">{{$t('backup.data')}}</h3>
      <div class="panel panel-default" id="provider-markup">
        <div class="panel-heading">
          <button @click="openConfigureData(b)" class="btn btn-default right">{{$t('backup.configure')}}</button>
          <button @click="openRestoreData(b)" class="btn btn-primary right panel-icon">{{$t('backup.restore')}}</button>
          <span class="panel-title">
            <span class="margin-left-md">{{$t('backup.last_backup_status')}}:</span> Success <span :class="['fa', true ? 'fa-check green' : 'fa-times red']"></span>
          </span>
        </div>
      </div>

      <h3>{{$t('list')}}</h3>
      <form role="form" class="search-pf has-button search">
        <div class="form-group has-clear">
          <div class="search-pf-input-group">
            <label class="sr-only">Search</label>
            <input type="search" v-model="searchString" class="form-control input-lg" :placeholder="$t('search')+'...'">
          </div>
        </div>
        <div class="form-group">
          <button class="btn btn-default btn-lg" type="button"><span class="fa fa-search"></span></button>
        </div>
      </form>

      <div class="list-group list-view-pf">
        <div class="list-group-item" v-for="b in filteredBackupList" v-bind:key="b">
          <div class="list-view-pf-actions">
            <button @click="openExecuteData(b)" class="btn btn-default">
              <span class="fa fa-play span-right-margin"></span>
              {{$t('backup.execute_now')}}
            </button>
            <div class="dropdown pull-right dropdown-kebab-pf">
              <button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true"
                aria-expanded="true">
                <span class="fa fa-ellipsis-v"></span>
              </button>
              <ul class="dropdown-menu dropdown-menu-right">
                <li>
                  <a @click="openDeleteData(b)">
                    <span class="fa fa-times span-right-margin"></span>
                    {{$t('delete')}}</a>
                </li>
              </ul>
            </div>
          </div>
          <div class="list-view-pf-main-info">
            <div class="list-view-pf-left">
              <span class="fa fa-database list-view-pf-icon-sm"></span>
            </div>
            <div class="list-view-pf-body">
              <div class="list-view-pf-description">
                <div @click="openExecuteData(b)" class="list-group-item-heading">
                  <a>{{b.name}}</a>
                </div>
                <div class="list-group-item-text">
                  <span>{{b.props.BackupTime | cronToHuman}}</span>
                </div>
                <div class="list-group-item-text">
                  <span class="pficon pficon-volume panel-icon"></span>{{b.props.VFSType | uppercase}}
                </div>
                <div class="list-group-item-text">
                  <span class="fa fa-space-shuttle panel-icon"></span>{{b.props.type | capitalize}}
                </div>
              </div>
              <div class="list-view-pf-additional-info">
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
          <form class="form-horizontal" v-on:submit.prevent="executeConfigBackup(currentConfigBackup)">

            <div class="modal-body">
              <!-- <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('are_you_sure')}}?</label>
              </div> -->
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.description')}}</label>
                <div class="col-sm-9">
                  <input required type="text" v-model="currentConfigBackup.Description" class="form-control">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div v-if="currentConfigBackup.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
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
          <form class="form-horizontal" v-on:submit.prevent="restoreConfigBackup(currentConfigBackup)">
            <div class="modal-body">
              <div class="form-group">
                <input required class="col-sm-1 control-label" type="radio" id="restoreURL" value="url" v-model="currentConfigBackup.restoreMode">
                <label class="col-sm-2 control-label" for="restoreURL">{{$t('backup.from_url')}}</label>
                <div class="col-sm-9">
                  <input type="url" v-model="currentConfigBackup.restoreURL" class="form-control" placeholder="https://mysite.com/archive/backup-last.tar.gz">
                </div>
              </div>
              <div class="advanced">
                <span class="display-inline-block"></span>
                <div class="divider divider-advanced"></div>
              </div>
              <div class="form-group">
                <input required class="col-sm-1 control-label" type="radio" id="restoreFile" value="file" v-model="currentConfigBackup.restoreMode">
                <label class="col-sm-2 control-label" for="restoreFile">{{$t('backup.from_file')}}</label>
                <div class="col-sm-9">
                  <label for="file-upload-cert" class="custom-file-upload">
                    <i class="fa fa-cloud-upload span-right-margin"></i>{{$t('backup.choose_file')}}
                  </label>
                  <input class="inputfile" @change="onChangeInput($event)" id="backup-file" name="file-upload-backup"
                    type="file" accept=".tar.gz" />
                </div>
              </div>
              <div class="advanced">
                <span class="display-inline-block"></span>
                <div class="divider divider-advanced"></div>
              </div>
              <div class="form-group">
                <input required class="col-sm-1 control-label" type="radio" id="restoreBackup" value="backup" v-model="currentConfigBackup.restoreMode">
                <label class="col-sm-2 control-label" for="restoreBackup">{{$t('backup.from_backup')}}</label>
                <div class="col-sm-9">
                  <select v-model="currentConfigBackup.restoreBackup" class="combobox form-control">
                    <option v-for="t in backupConfigurations" v-bind:key="t">
                      {{t.type | capitalize}} - {{t.description}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div v-if="currentConfigBackup.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('backup.restore')}}</button>
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
          <form class="form-horizontal" v-on:submit.prevent="configureConfigBackup(currentConfigBackup)">

            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-6 control-label" for="textInput-modal-markup">{{$t('backup.automatic_backups_keep')}}</label>
                <div class="col-sm-6">
                  <input type="number" min="0" v-model="currentConfigBackup.HistoryLength" class="form-control">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div v-if="currentConfigBackup.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
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
            <h4 class="modal-title">{{$t('backup.delete_config_backup')}}
              {{currentConfigBackup.type | capitalize}} - {{currentConfigBackup.description}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="deleteConfigBackup(currentConfigBackup)">
            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <div v-if="currentConfigBackup.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
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
            <h4 class="modal-title">{{$t('backup.execute_data_backup_now')}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="executeDataBackup(currentDataBackup)">

            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <div v-if="currentDataBackup.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
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
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.from_backup')}}</label>
                <div class="col-sm-9">
                  <select v-model="currentDataBackup.restoreBackup" class="combobox form-control">
                    <option v-for="t in backupData" v-bind:key="t">{{t.name}} - {{t.props.VFSType | uppercase}}
                      {{$t('with')}} {{t.props.type | capitalize}}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div v-if="currentDataBackup.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
              <button class="btn btn-default" type="button" data-dismiss="modal">{{$t('cancel')}}</button>
              <button class="btn btn-primary" type="submit">{{$t('backup.restore')}}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="modal" id="configureDataModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog modal-lg wizard-pf">
        <div class="modal-content">
          <div class="modal-header">
            <dt class="modal-title">{{$t('backup.configure_data_backup')}}</dt>
          </div>

          <div class="modal-body wizard-pf-body clearfix">
            <div class="wizard-pf-steps">
              <ul class="wizard-pf-steps-indicator">

                <li :class="['wizard-pf-step', wizard.currentStep == 1 ? 'active' : '']" data-tabgroup="1">
                  <a>
                    <span class="wizard-pf-step-number">1</span>
                    <span class="wizard-pf-step-title">{{$t('backup.when')}}</span>
                  </a>
                </li>

                <li :class="['wizard-pf-step', wizard.currentStep == 2 ? 'active' : '']" data-tabgroup="2">
                  <a>
                    <span class="wizard-pf-step-number">2</span>
                    <span class="wizard-pf-step-title">{{$t('backup.where')}}</span>
                  </a>
                </li>

                <li :class="['wizard-pf-step', wizard.currentStep == 3 ? 'active' : '']" data-tabgroup="3">
                  <a>
                    <span class="wizard-pf-step-number">3</span>
                    <span class="wizard-pf-step-title">{{$t('backup.how')}}</span>
                  </a>
                </li>

                <li :class="['wizard-pf-step', wizard.currentStep == 4 ? 'active' : '']" data-tabgroup="3">
                  <a>
                    <span class="wizard-pf-step-number">4</span>
                    <span class="wizard-pf-step-title">{{$t('backup.review')}}</span>
                  </a>
                </li>
              </ul>
            </div>

            <div class="wizard-pf-row">
              <div class="wizard-pf-main">
                <div :class="['wizard-pf-contents', wizard.currentStep == 1 ? '' : 'hidden']">
                  <div class="blank-slate-pf " id="">
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-clock-o"></span>
                    </div>
                    <h1>
                      {{$t('backup.wizard_choose_when_title')}}
                    </h1>
                    <p>
                      {{$t('backup.wizard_choose_when_description')}}
                    </p>
                  </div>

                  <form id="local-ldap" class="form-horizontal" v-on:submit.prevent="null">
                    <div class="modal-body">
                      <div class="form-group">
                        <label class="col-sm-2 control-label" for="textInput-modal-markup">{{$t('backup.every')}}</label>
                        <div class="col-sm-2">
                          <select @change="resetCronTab()" v-model="wizard.when.every" class="combobox form-control">
                            <option value="hour">{{$t('backup.hour')}}</option>
                            <option value="day">{{$t('backup.day')}}</option>
                            <option value="week">{{$t('backup.week')}}</option>
                            <option value="month">{{$t('backup.month')}}</option>
                          </select>
                        </div>
                        <!-- HOUR -->
                        <label v-if="wizard.when.every == 'hour'" class="col-sm-2 control-label adjust-label-wizard"
                          for="textInput-modal-markup">{{$t('backup.at_minute')}}</label>
                        <div v-if="wizard.when.every == 'hour'" class="col-sm-6">
                          <input v-model="wizard.when.minute" type="number" min="0" max="59" class="form-control">
                        </div>
                        <!-- -->
                        <!-- DAY -->
                        <label v-if="wizard.when.every == 'day'" class="col-sm-2 control-label adjust-label-wizard" for="textInput-modal-markup">{{$t('backup.at_hour')}}</label>
                        <div v-if="wizard.when.every == 'day'" class="col-sm-2">
                          <input v-model="wizard.when.hour" type="number" min="0" max="23" class="form-control">
                        </div>
                        <label v-if="wizard.when.every == 'day'" class="col-sm-2 control-label adjust-label-wizard" for="textInput-modal-markup">{{$t('backup.at_minute')}}</label>
                        <div v-if="wizard.when.every == 'day'" class="col-sm-2">
                          <input v-model="wizard.when.minute" type="number" min="0" max="59" class="form-control">
                        </div>
                        <!-- -->
                        <!-- WEEK -->
                        <label v-if="wizard.when.every == 'week'" class="col-sm-2 control-label adjust-label-wizard"
                          for="textInput-modal-markup">{{$t('backup.on_day')}}</label>
                        <div v-if="wizard.when.every == 'week'" class="col-sm-2">
                          <select v-model="wizard.when.week_day" class="combobox form-control">
                            <option v-for="(w,i) in weekdays()" v-bind:key="w" :value="i">{{w | capitalize}}</option>
                          </select>
                        </div>
                        <label v-if="wizard.when.every == 'week'" class="col-sm-1 control-label adjust-label-wizard"
                          for="textInput-modal-markup">{{$t('backup.at')}}</label>
                        <div v-if="wizard.when.every == 'week'" class="col-sm-3">
                          <input v-model="wizard.when.hour_minute" type="text" class="col-sm-1 form-control reset-width">
                        </div>
                        <!-- -->
                        <!-- MONTH -->
                        <label v-if="wizard.when.every == 'month'" class="col-sm-2 control-label adjust-label-wizard"
                          for="textInput-modal-markup">{{$t('backup.on_day')}}</label>
                        <div v-if="wizard.when.every == 'month'" class="col-sm-2">
                          <input v-model="wizard.when.day" type="number" min="1" max="31" class="form-control">
                        </div>
                        <label v-if="wizard.when.every == 'month'" class="col-sm-1 control-label adjust-label-wizard"
                          for="textInput-modal-markup">{{$t('backup.at')}}</label>
                        <div v-if="wizard.when.every == 'month'" class="col-sm-3">
                          <input v-model="wizard.when.hour_minute" type="text" class="col-sm-1 form-control reset-width">
                        </div>
                        <!-- -->
                      </div>
                      <p class="cron-human-text">{{crontabComputed | cronToHuman}}</p>
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', wizard.currentStep == 2 ? '' : 'hidden']">
                  <div class="blank-slate-pf " id="">
                    <div class="blank-slate-pf-icon">
                      <span class="pficon pficon-volume"></span>
                    </div>
                    <h1>
                      {{$t('backup.wizard_choose_where_title')}}
                    </h1>
                    <p>
                      {{$t('backup.wizard_choose_where_description')}}
                    </p>

                    <div class="blank-slate-pf-main-action row wizard-where-choices">
                      <div @click="selectWhere('nfs')" :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.where.choice == 'nfs' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-hdd-o"></span>
                          </div>
                          <h3>
                            NFS
                          </h3>
                          <p>
                            <a>{{$t('backup.doc_link')}}</a>
                          </p>
                        </div>
                      </div>
                      <div @click="selectWhere('cifs')" :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.where.choice == 'cifs' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-folder-open"></span>
                          </div>
                          <h3>
                            CIFS
                          </h3>
                          <p>
                            <a>{{$t('backup.doc_link')}}</a>
                          </p>
                        </div>
                      </div>
                      <div @click="selectWhere('usb')" :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.where.choice == 'usb' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-usb"></span>
                          </div>
                          <h3>
                            USB
                          </h3>
                          <p>
                            <a>{{$t('backup.doc_link')}}</a>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div class="blank-slate-pf-main-action row wizard-where-choices adjust-top-col">
                      <div @click="selectWhere('sftp')" :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.where.choice == 'sftp' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-terminal"></span>
                          </div>
                          <h3>
                            SFTP
                          </h3>
                          <p>
                            <a>{{$t('backup.doc_link')}}</a>
                          </p>
                        </div>
                      </div>
                      <div @click="selectWhere('b2')" :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.where.choice == 'b2' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-fire"></span>
                          </div>
                          <h3>
                            Blackblaze B2
                          </h3>
                          <p>
                            <a>{{$t('backup.doc_link')}}</a>
                          </p>
                        </div>
                      </div>
                      <div @click="selectWhere('s3')" :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.where.choice == 's3' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-amazon"></span>
                          </div>
                          <h3>
                            Amazon S3
                          </h3>
                          <p>
                            <a>{{$t('backup.doc_link')}}</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="divider"></div>
                  </div>
                  <form class="form-horizontal" v-on:submit.prevent="checkWhereConfiguration()">
                    <div class="modal-body">
                      <!-- NFS -->
                      <div v-if="wizard.where.choice == 'nfs'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'NFSShare' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.nfs.NFSShare" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'NFSHost' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.nfs.NFSHost" class="form-control">
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- CIFS -->
                      <div v-if="wizard.where.choice == 'cifs'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'SMBShare' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.cifs.SMBShare" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'SMBHost' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.cifs.SMBHost" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'SMBLogin' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.cifs.SMBLogin" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'SMBPassword' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.cifs.SMBPassword" class="form-control">
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- USB -->
                      <div v-if="wizard.where.choice == 'usb'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.usb_list')}}</label>
                          <div class="col-sm-9">
                            <select required v-model="wizard.where.usb.USBDevice" class="combobox form-control">
                              <option v-for="d in wizard.where.usb.devices" v-bind:key="d" :value="d">{{d}}</option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'USBLabel' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.usb.USBLabel" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.format')}}</label>
                          <div class="col-sm-9">
                            <input required type="checkbox" v-model="wizard.where.usb.format" class="form-control">
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- SFTP -->
                      <div v-if="wizard.where.choice == 'sftp'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'SFTPDirectory' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.sftp.SftpDirectory" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'SFTPHost' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.sftp.SftpHost" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'SFTPPort' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.sftp.SftpPort" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'SFTPUser' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.sftp.SftpUser" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'SFTPPassword' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.sftp.SftpPassword" class="form-control">
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- B2 -->
                      <div v-if="wizard.where.choice == 'b2'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'B2Bucket' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.b2.B2Bucket" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'B2AccountId' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.b2.B2AccountId" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'B2AccountKey' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.b2.B2AccountKey" class="form-control">
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- S3 -->
                      <div v-if="wizard.where.choice == 's3'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'S3Bucket' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.s3.S3Bucket" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'S3Host' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.s3.S3Host" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'S3AccessKey' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.s3.S3AccessKey" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{'S3SecretKey' |
                            camelToSentence}}</label>
                          <div class="col-sm-9">
                            <input required type="text" v-model="wizard.where.s3.S3SecretKey" class="form-control">
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <div class="form-group">
                        <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.config')}}</label>
                        <div class="col-sm-2">
                          <button :disabled="wizard.where.isChecking" type="submit" class="btn btn-primary">{{$t('backup.check')}}</button>
                        </div>
                        <div v-if="wizard.where.isChecking" class="col-sm-1">
                          <div class="spinner"></div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', wizard.currentStep == 3 ? '' : 'hidden']">
                  <div class="blank-slate-pf " id="">
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-space-shuttle"></span>
                    </div>
                    <h1>
                      {{$t('backup.wizard_choose_how_title')}}
                    </h1>
                    <p>
                      {{$t('backup.wizard_choose_how_description')}}
                    </p>

                    <div class="blank-slate-pf-main-action row wizard-where-choices">
                      <div @click="selectHow('duplicity')" :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.how.choice == 'duplicity' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-clone"></span>
                          </div>
                          <h3>
                            Duplicity
                          </h3>
                          <p>
                            <a>{{$t('backup.doc_link')}}</a>
                          </p>
                        </div>
                      </div>
                      <div @click="selectHow('restic')" :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.how.choice == 'restic' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-rocket"></span>
                          </div>
                          <h3>
                            Restic
                          </h3>
                          <p>
                            <a>{{$t('backup.doc_link')}}</a>
                          </p>
                        </div>
                      </div>
                      <div @click="selectHow('rsync')" :class="['col-xs-12 col-sm-4 col-md-4 col-lg-4 card-pf', wizard.how.choice == 'rsync' ? 'active-choose' : '']">
                        <div class="blank-slate-pf no-padding margin-top-sm white-background" id="">
                          <div class="blank-slate-pf-icon small-size-wizard">
                            <span class="fa fa-refresh"></span>
                          </div>
                          <h3>
                            rSync
                          </h3>
                          <p>
                            <a>{{$t('backup.doc_link')}}</a>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="divider"></div>
                  </div>
                  <form class="form-horizontal" v-on:submit.prevent="checkWhereConfiguration()">
                    <div class="modal-body">
                      <!-- DUPLICITY -->
                      <div v-if="wizard.how.choice == 'duplicity'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.type')}}</label>
                          <div class="col-sm-9">
                            <select required v-model="wizard.how.duplicity.Type" class="combobox form-control">
                              <option v-for="d in wizard.how.duplicity.types" v-bind:key="d" :value="d">{{d |
                                capitalize}}</option>
                            </select>
                          </div>
                        </div>
                        <div v-if="wizard.how.duplicity.Type == 'incremental'" class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.full_day')}}</label>
                          <div class="col-sm-9">
                            <select required v-model="wizard.how.duplicity.FullDay" class="combobox form-control">
                              <option v-for="d in wizard.how.duplicity.days" v-bind:key="d" :value="d">{{d |
                                capitalize}}</option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.vol_size')}}</label>
                          <div class="col-sm-9">
                            <input required type="number" min="1" v-model="wizard.how.duplicity.VolSize" class="form-control">
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.cleanup_older_than')}}</label>
                          <div class="col-sm-9">
                            <select required v-model="wizard.how.duplicity.CleanupOlderThan" class="combobox form-control">
                              <option v-for="d in wizard.how.duplicity.cleanups" v-bind:key="d" :value="d">{{$t('backup.'+d)}}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- RESTIC -->
                      <div v-if="wizard.how.choice == 'restic'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.prune')}}</label>
                          <div class="col-sm-9">
                            <select required v-model="wizard.how.restic.Prune" class="combobox form-control">
                              <option v-for="d in wizard.how.restic.prunes" v-bind:key="d" :value="d">{{d |
                                capitalize}}</option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.cleanup_older_than')}}</label>
                          <div class="col-sm-9">
                            <select required v-model="wizard.how.restic.CleanupOlderThan" class="combobox form-control">
                              <option v-for="d in wizard.how.restic.cleanups" v-bind:key="d" :value="d">{{$t('backup.'+d)}}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <!-- -->
                      <!-- RSYNC -->
                      <div v-if="wizard.how.choice == 'rsync'">
                        <div class="form-group">
                          <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.cleanup_older_than')}}</label>
                          <div class="col-sm-9">
                            <select required v-model="wizard.how.rsync.CleanupOlderThan" class="combobox form-control">
                              <option v-for="d in wizard.how.rsync.cleanups" v-bind:key="d" :value="d">{{$t('backup.'+d)}}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <!-- -->
                    </div>
                  </form>
                </div>

                <div :class="['wizard-pf-contents', wizard.currentStep == 4 ? '' : 'hidden']">
                  <div class="blank-slate-pf " id="">
                    <div class="blank-slate-pf-icon">
                      <span class="fa fa-database"></span>
                    </div>
                    <h1>
                      {{$t('backup.wizard_review_title')}}
                    </h1>
                    <p>
                      {{$t('backup.wizard_review_description')}}
                    </p>
                  </div>

                  <form id="local-ldap" class="form-horizontal" v-on:submit.prevent="null">
                    <div class="modal-body">
                      <div class="form-group">
                        <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.name')}}</label>
                        <div class="col-sm-9">
                          <input required type="text" v-model="wizard.review.Name" class="form-control">
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.notify')}}</label>
                        <div class="col-sm-9">
                          <select required v-model="wizard.review.Notify" class="combobox form-control">
                            <option v-for="d in wizard.review.notifyTypes" v-bind:key="d" :value="d">{{$t('backup.'+d)}}</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('backup.include_logs')}}</label>
                        <div class="col-sm-9">
                          <input required type="checkbox" v-model="wizard.review.IncludeLogs" class="form-control">
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
              {{wizard.currentStep == 4 ? $t('backup.configure') : $t('next')}}
              <span class="i fa fa-angle-right"></span>
            </button>
            <button type="button" class="btn btn-primary hidden wizard-pf-finish">
              {{$t('backup.configure')}}
              <span class="i fa fa-angle-right"></span>
            </button>
            <button type="button" class="btn btn-primary hidden wizard-pf-close wizard-pf-dismiss">{{$t('close')}}</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" id="deleteDataModal" tabindex="-1" role="dialog" data-backdrop="static">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">{{$t('backup.delete_data_backup')}}
              {{currentDataBackup.name}}</h4>
          </div>
          <form class="form-horizontal" v-on:submit.prevent="deleteDataBackup(currentDataBackup)">
            <div class="modal-body">
              <div class="form-group">
                <label class="col-sm-3 control-label" for="textInput-modal-markup">{{$t('are_you_sure')}}?</label>
              </div>
            </div>
            <div class="modal-footer">
              <div v-if="currentDataBackup.isLoading" class="spinner spinner-sm form-spinner-loader"></div>
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
export default {
  name: "Backup",
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
  beforeRouteLeave(to, from, next) {
    $(".modal").modal("hide");
    next();
  },
  mounted() {
    this.getBackupInfo();
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
    crontabComputed: function() {
      var cronString = "";

      switch (this.wizard.when.every) {
        case "hour":
          cronString = this.wizard.when.minute + " * * * *";
          break;
        case "day":
          cronString =
            this.wizard.when.minute + " " + this.wizard.when.hour + " */1 * *";
          break;

        case "week":
          var minute = this.wizard.when.hour_minute.split(":")[1];
          var hour = this.wizard.when.hour_minute.split(":")[0];

          if (minute && hour) {
            cronString =
              minute + " " + hour + " */1 * " + this.wizard.when.week_day;
          } else {
            cronString = "";
          }

          break;

        case "month":
          var minute = this.wizard.when.hour_minute.split(":")[1];
          var hour = this.wizard.when.hour_minute.split(":")[0];

          if (minute && hour) {
            cronString =
              minute + " " + hour + " " + this.wizard.when.day + " */1 *";
          } else {
            cronString = "";
          }
          break;
      }

      this.wizard.when.crontab = cronString;

      return cronString;
    }
  },
  data() {
    return {
      view: {
        isLoaded: false,
        isAuth: false
      },
      wizard: this.initWizard(),
      searchString: "",
      backupConfigurations: [],
      backupData: [],
      globalConfigBackup: {},
      globalDataBackup: {},
      currentConfigBackup: this.initBackupConfiguration(),
      currentDataBackup: this.initBackupData()
    };
  },
  methods: {
    initWizard() {
      return {
        isLoading: false,
        currentStep: 1,
        when: {
          every: "hour",
          minute: 0,
          hour: 0,
          hour_minute: "1:00",
          week_day: 0,
          day: 0,
          crontab: ""
        },
        where: {
          choice: "nfs",
          isChecking: false,
          isValid: false,
          nfs: {
            NFSShare: null,
            NFSHost: null
          },
          cifs: {
            SMBShare: null,
            SMBHost: null,
            SMBLogin: null,
            SMBPassword: null
          },
          usb: {
            USBLabel: null,
            format: false,
            USBDevice: null,
            devices: []
          },
          sftp: {
            SftpDirectory: null,
            SftpUser: null,
            SftpPassword: null,
            SftpHost: null,
            SftpPort: null
          },
          b2: {
            B2AccountId: null,
            B2AccountKey: null,
            B2Bucket: null
          },
          s3: {
            S3Host: "s3.amazonaws.com",
            S3AccessKey: null,
            S3Bucket: null,
            S3SecretKey: null
          }
        },
        how: {
          choice: "duplicity",
          duplicity: {
            Type: "full",
            types: ["full", "incremental"],
            FullDay: 0,
            days: this.weekdays(),
            VolSize: 1,
            CleanupOlderThan: "never",
            cleanups: ["never", "7D", "14D", "28D", "56D", "168D", "364D"]
          },
          restic: {
            Prune: "always",
            prunes: ["always"].concat(this.weekdays()),
            CleanupOlderThan: "never",
            cleanups: ["never", "7D", "14D", "28D", "56D", "168D", "364D"]
          },
          rsync: {
            CleanupOlderThan: "never",
            cleanups: ["never", "7D", "14D", "28D", "56D", "168D", "364D"]
          }
        },
        review: {
          name: "",
          Notify: "",
          notifyTypes: ["error", "always", "never"],
          IncludeLogs: false
        }
      };
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
        var context = this;

        var backupObj = {
          action: "create-backup",
          name: context.wizard.review.name,
          engine: context.wizard.how.choice,
          status: "enabled",
          Notify: context.wizard.review.Notify,
          IncludeLogs: context.wizard.review.IncludeLogs
            ? "enabled"
            : "disabled",
          BackupTime: context.wizard.when.crontab,
          VFSType: context.wizard.where.choice,
          SMBShare: context.wizard.where.cifs.SMBShare,
          SMBHost: context.wizard.where.cifs.SMBHost,
          SMBUser: context.wizard.where.cifs.SMBUser,
          SMBPassord: context.wizard.where.cifs.SMBPassord,
          Type: context.wizard.how.duplicity.Type,
          FullDay: context.wizard.how.duplicity.FullDay,
          VolSize: context.wizard.how.duplicity.VolSize,
          CleanupOlderThan: context.wizard.how.duplicity.CleanupOlderThan
        };

        context.wizard.isLoading = true;
        context.exec(
          ["system-backup/validate"],
          backupObj,
          null,
          function(success) {
            context.wizard.isLoading = false;
            $("#configureDataModal").modal("hide");

            context.exec(
              ["system-backup/create"],
              backupObj,
              function(stream) {
                console.info("backup", stream);
              },
              function(success) {
                // notification
                context.$parent.notifications.success.message = context.$i18n.t(
                  "dns.backup_create_ok"
                );

                this.wizard = this.initWizard();

                // get hosts
                context.getBackupInfo();
              },
              function(error, data) {
                // notification
                context.$parent.notifications.error.message = context.$i18n.t(
                  "dns.backup_create_error"
                );
              }
            );
          },
          function(error, data) {
            var errorData = JSON.parse(data);
            context.wizard.isLoading = false;
          }
        );
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
      $("#configureDataModal").modal("hide");
    },
    selectWhere(where) {
      this.wizard.where.choice = where;
    },
    checkWhereConfiguration() {
      var context = this;

      var configObj = context.wizard.where[context.wizard.where.choice];
      configObj.action = context.wizard.where.choice + "-credentials";

      context.wizard.where.isChecking = true;
      context.exec(
        ["system-backup/validate"],
        configObj,
        null,
        function(success) {
          success = JSON.parse(success);
          context.wizard.where.isChecking = false;
          context.wizard.where.isValid = true;
        },
        function(error) {
          console.error(error);
          context.wizard.where.isChecking = false;
          context.wizard.where.isValid = false;
        }
      );
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
        restoreMode: "url"
      };
    },
    initBackupData() {
      return {
        isLoading: false
      };
    },
    onChangeInput(event) {
      var context = this;
      this.getBase64(event.target.files[0], function(resp) {
        context.currentConfigBackup.restoreFile = resp.split(",")[1];
      });
    },
    getBackupInfo() {
      var context = this;
      context.exec(
        ["system-backup/read"],
        null,
        null,
        function(success) {
          success = JSON.parse(success);
          context.view.isLoaded = true;

          context.backupConfigurations = success.status["backup-config"];
          context.backupData = success.configuration["backup-data"].backups;

          context.globalConfigBackup = success.configuration["backup-config"];
          console.log(success);
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
      this.currentConfigBackup.type = b.type;
      this.currentConfigBackup.description = b.description;
      $("#deleteConfigModal").modal("show");
    },
    executeConfigBackup() {
      this.currentConfigBackup.isLoading = true;

      //$("#executeConfigModal").modal("show");
    },
    restoreConfigBackup() {
      this.currentConfigBackup.isLoading = true;

      //$("#restoreConfigModal").modal("show");
    },
    configureConfigBackup() {
      this.currentConfigBackup.isLoading = true;

      //$("#configureConfigModal").modal("show");
    },
    downloadConfigBackup(b) {},
    deleteConfigBackup() {
      this.currentConfigBackup.isLoading = true;

      //$("#deleteConfigModal").modal("show");
    },

    openExecuteData(b) {
      this.currentDataBackup = this.initBackupData();
      $("#executeDataModal").modal("show");
    },
    openRestoreData(b) {
      this.currentDataBackup = this.initBackupData();
      $("#restoreDataModal").modal("show");
    },
    openConfigureData(b) {
      this.currentDataBackup = this.initBackupData();
      $("#configureDataModal").modal("show");
    },
    openDeleteData(b) {
      this.currentDataBackup = this.initBackupData();
      this.currentDataBackup.name = b.name;
      $("#deleteDataModal").modal("show");
    },
    executeDataBackup() {
      this.currentDataBackup.isLoading = true;
    },
    restoreDataBackup() {
      this.currentDataBackup.isLoading = true;
    },
    configureDataBackup() {
      this.currentDataBackup.isLoading = true;
    },
    deleteDataBackup() {
      this.currentDataBackup.isLoading = true;

      //$("#deleteDataModal").modal("show");
    }
  }
};
</script>

<style>
</style>